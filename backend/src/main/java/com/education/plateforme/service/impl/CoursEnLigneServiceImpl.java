package com.education.plateforme.service.impl;

import com.education.plateforme.dto.request.CoursEnLigneRequest;
import com.education.plateforme.dto.response.CoursEnLigneResponse;
import com.education.plateforme.entity.Affectation;
import com.education.plateforme.entity.CibleType;
import com.education.plateforme.entity.CoursEnLigne;
import com.education.plateforme.entity.Eleve;
import com.education.plateforme.entity.Enseignant;
import com.education.plateforme.entity.Matiere;
import com.education.plateforme.exception.BadRequestException;
import com.education.plateforme.exception.ForbiddenException;
import com.education.plateforme.exception.ResourceNotFoundException;
import com.education.plateforme.mapper.CoursEnLigneMapper;
import com.education.plateforme.repository.AffectationRepository;
import com.education.plateforme.repository.CoursEnLigneRepository;
import com.education.plateforme.repository.EleveRepository;
import com.education.plateforme.repository.EnseignantRepository;
import com.education.plateforme.repository.MatiereRepository;
import com.education.plateforme.service.CoursEnLigneService;
import com.education.plateforme.service.ZoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;


@Service
@RequiredArgsConstructor
@Slf4j
public class CoursEnLigneServiceImpl implements CoursEnLigneService {

    private final CoursEnLigneRepository coursEnLigneRepository;
    private final EnseignantRepository enseignantRepository;
    private final EleveRepository eleveRepository;
    private final MatiereRepository matiereRepository;
    private final AffectationRepository affectationRepository;
    private final CoursEnLigneMapper coursEnLigneMapper;
    private final ZoomService zoomService;

    private Enseignant enseignantConnecte(String email) {
        return enseignantRepository.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Enseignant introuvable."));
    }

    
    private Enseignant enseignantConnecteAvecMatieres(String email) {
        return enseignantRepository.findByUserEmailWithMatieres(email)
                .orElseThrow(() -> new ResourceNotFoundException("Enseignant introuvable."));
    }

    private void validerDateHeure(CoursEnLigneRequest request) {
        if (!request.getHeureFin().isAfter(request.getHeureDebut())) {
            throw new BadRequestException("L'heure de fin doit etre superieure a l'heure de debut.");
        }
        LocalDateTime debut = LocalDateTime.of(request.getDateCours(), request.getHeureDebut());
        if (!debut.isAfter(LocalDateTime.now())) {
            throw new BadRequestException("La date du cours doit etre dans le futur.");
        }
    }

    private Matiere matiereHabilitee(Enseignant enseignant, Long matiereId) {
        Matiere matiere = matiereRepository.findById(matiereId)
                .orElseThrow(() -> new ResourceNotFoundException("Matiere introuvable, id=" + matiereId));
        boolean habilite = enseignant.getMatieres().stream().anyMatch(m -> m.getId().equals(matiere.getId()));
        if (!habilite) {
            throw new ForbiddenException("Vous n'etes pas habilite a enseigner la matiere \"" + matiere.getNom() + "\".");
        }
        return matiere;
    }

    
    private List<Eleve> validerEtResoudreCiblage(Enseignant enseignant, Long matiereId, CoursEnLigneRequest request) {
        Long enseignantId = enseignant.getId();
        if (request.getCibleType() == null) {
            throw new BadRequestException("Le ciblage du cours (niveau ou eleves) est obligatoire.");
        }

        if (request.getCibleType() == CibleType.NIVEAU) {
            if (request.getCibleNiveau() == null) {
                throw new BadRequestException("Le niveau cible est obligatoire pour un ciblage par niveau.");
            }
            if (!enseignant.getNiveaux().contains(request.getCibleNiveau())) {
                throw new ForbiddenException(
                        "Vous n'etes pas autorise a enseigner le niveau \"" + request.getCibleNiveau().getLibelle() + "\".");
            }
            return List.of();
        }

        if (request.getEleveIds() == null || request.getEleveIds().isEmpty()) {
            throw new BadRequestException("Au moins un eleve doit etre selectionne pour un ciblage par eleves.");
        }
        List<Eleve> eleves = eleveRepository.findAllById(request.getEleveIds());
        if (eleves.size() != request.getEleveIds().size()) {
            throw new ResourceNotFoundException("Un ou plusieurs eleves selectionnes sont introuvables.");
        }
        for (Long eleveId : request.getEleveIds()) {
            boolean reellementAffecte = affectationRepository
                    .existsByEnseignantIdAndMatiereIdAndEleveId(enseignantId, matiereId, eleveId);
            if (!reellementAffecte) {
                throw new ForbiddenException("L'eleve id=" + eleveId + " ne vous est pas affecte pour cette matiere.");
            }
        }
        return eleves;
    }

    @Override
    @Transactional
    public CoursEnLigneResponse creer(String enseignantEmail, CoursEnLigneRequest request) {
        Enseignant enseignant = enseignantConnecteAvecMatieres(enseignantEmail);
        Matiere matiere = matiereHabilitee(enseignant, request.getMatiereId());
        validerDateHeure(request);
        List<Eleve> elevesCibles = validerEtResoudreCiblage(enseignant, matiere.getId(), request);



        ZoomService.ReunionCreee reunion = zoomService.creerReunion(
                request.getTitre(), request.getDateCours(), request.getHeureDebut(), request.getHeureFin());

        CoursEnLigne coursEnLigne = CoursEnLigne.builder()
                .titre(request.getTitre())
                .description(request.getDescription())
                .dateCours(request.getDateCours())
                .heureDebut(request.getHeureDebut())
                .heureFin(request.getHeureFin())
                .cibleType(request.getCibleType())
                .cibleNiveau(request.getCibleType() == CibleType.NIVEAU ? request.getCibleNiveau() : null)
                .elevesCibles(new HashSet<>(elevesCibles))
                .matiere(matiere)
                .enseignant(enseignant)
                .zoomLink(reunion.joinUrl())
                .zoomMeetingId(reunion.meetingId())
                .build();

        CoursEnLigne enregistre = coursEnLigneRepository.save(coursEnLigne);
        log.info("[COURS-EN-LIGNE] Course created: id={}, matiere={}, enseignantId={}, zoomMeetingId={}",
                enregistre.getId(), matiere.getNom(), enseignant.getId(), reunion.meetingId());

        CoursEnLigne pourReponse = coursEnLigneRepository.findByIdWithDetails(enregistre.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cours en ligne introuvable, id=" + enregistre.getId()));
        return coursEnLigneMapper.toResponse(pourReponse);
    }

    @Override
    @Transactional
    public CoursEnLigneResponse modifier(String enseignantEmail, Long id, CoursEnLigneRequest request) {
        Enseignant enseignant = enseignantConnecteAvecMatieres(enseignantEmail);
        CoursEnLigne existant = coursEnLigneRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cours en ligne introuvable, id=" + id));

        if (!existant.getEnseignant().getId().equals(enseignant.getId())) {
            throw new ForbiddenException("Vous ne pouvez modifier que vos propres cours en ligne.");
        }

        Matiere matiere = matiereHabilitee(enseignant, request.getMatiereId());
        validerDateHeure(request);
        List<Eleve> elevesCibles = validerEtResoudreCiblage(enseignant, matiere.getId(), request);

        existant.setTitre(request.getTitre());
        existant.setDescription(request.getDescription());
        existant.setDateCours(request.getDateCours());
        existant.setHeureDebut(request.getHeureDebut());
        existant.setHeureFin(request.getHeureFin());
        existant.setMatiere(matiere);
        existant.setCibleType(request.getCibleType());
        existant.setCibleNiveau(request.getCibleType() == CibleType.NIVEAU ? request.getCibleNiveau() : null);
        existant.getElevesCibles().clear();
        existant.getElevesCibles().addAll(elevesCibles);


        zoomService.mettreAJourReunion(existant.getZoomMeetingId(), request.getTitre(),
                request.getDateCours(), request.getHeureDebut(), request.getHeureFin());

        CoursEnLigne mis_a_jour = coursEnLigneRepository.save(existant);
        log.info("[COURS-EN-LIGNE] Course updated: id={}", mis_a_jour.getId());

        CoursEnLigne pourReponse = coursEnLigneRepository.findByIdWithDetails(mis_a_jour.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cours en ligne introuvable, id=" + mis_a_jour.getId()));
        return coursEnLigneMapper.toResponse(pourReponse);
    }

    @Override
    @Transactional
    public void supprimer(String enseignantEmail, Long id) {
        Enseignant enseignant = enseignantConnecte(enseignantEmail);
        CoursEnLigne existant = coursEnLigneRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cours en ligne introuvable, id=" + id));

        if (!existant.getEnseignant().getId().equals(enseignant.getId())) {
            throw new ForbiddenException("Vous ne pouvez supprimer que vos propres cours en ligne.");
        }

        zoomService.supprimerReunion(existant.getZoomMeetingId());
        coursEnLigneRepository.delete(existant);
        log.info("[COURS-EN-LIGNE] Course deleted: id={}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CoursEnLigneResponse> mesLivesEnseignant(String enseignantEmail) {
        Enseignant enseignant = enseignantConnecte(enseignantEmail);
        return coursEnLigneRepository.findByEnseignantIdOrderByDateCoursAscHeureDebutAsc(enseignant.getId()).stream()
                .map(coursEnLigneMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CoursEnLigneResponse> mesLivesEleve(String eleveEmail) {
        Eleve eleve = eleveRepository.findByUserEmail(eleveEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Eleve introuvable."));

        if (!Boolean.TRUE.equals(eleve.getValide())) {
            return List.of();
        }


        List<Affectation> mesAffectations = affectationRepository.findByEleveId(eleve.getId()).stream()
                .filter(a -> a.getEnseignant() != null)
                .toList();

        List<CoursEnLigne> livesAccessibles = new ArrayList<>();
        for (Affectation a : mesAffectations) {
            livesAccessibles.addAll(
                    coursEnLigneRepository.findByMatiereIdAndEnseignantIdOrderByDateCoursAscHeureDebutAsc(
                            a.getMatiere().getId(), a.getEnseignant().getId()));
        }

        return livesAccessibles.stream()
                .filter(c -> liveCibleCetEleve(c, eleve))
                .map(coursEnLigneMapper::toResponse)
                .toList();
    }

    
    private boolean liveCibleCetEleve(CoursEnLigne live, Eleve eleve) {
        if (live.getCibleType() == CibleType.NIVEAU) {
            return live.getCibleNiveau() != null && live.getCibleNiveau().equals(eleve.getNiveau());
        }
        return live.getElevesCibles().stream().anyMatch(e -> e.getId().equals(eleve.getId()));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CoursEnLigneResponse> tousLesLives() {
        return coursEnLigneRepository.findAllByOrderByDateCoursDescHeureDebutDesc().stream()
                .map(coursEnLigneMapper::toResponse)
                .toList();
    }
}
