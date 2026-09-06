package com.education.plateforme.service.impl;

import com.education.plateforme.dto.request.CoursRequest;
import com.education.plateforme.dto.response.CoursResponse;
import com.education.plateforme.dto.response.PublicCoursResponse;
import com.education.plateforme.entity.Affectation;
import com.education.plateforme.entity.CibleType;
import com.education.plateforme.entity.Cours;
import com.education.plateforme.entity.CoursPdf;
import com.education.plateforme.entity.Eleve;
import com.education.plateforme.entity.Enseignant;
import com.education.plateforme.entity.Matiere;
import com.education.plateforme.exception.BadRequestException;
import com.education.plateforme.exception.ForbiddenException;
import com.education.plateforme.exception.ResourceNotFoundException;
import com.education.plateforme.mapper.CoursMapper;
import com.education.plateforme.repository.AffectationRepository;
import com.education.plateforme.repository.CoursRepository;
import com.education.plateforme.repository.EleveRepository;
import com.education.plateforme.repository.EnseignantRepository;
import com.education.plateforme.repository.MatiereRepository;
import com.education.plateforme.security.SecurityUtils;
import com.education.plateforme.service.CoursService;
import com.education.plateforme.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CoursServiceImpl implements CoursService {

    private static final String DOSSIER_VIDEOS = "videos";
    private static final String DOSSIER_PDFS = "pdfs";
    private static final String DOSSIER_PPTS = "ppts";

    private final CoursRepository coursRepository;
    private final MatiereRepository matiereRepository;
    private final EnseignantRepository enseignantRepository;
    private final EleveRepository eleveRepository;
    private final AffectationRepository affectationRepository;
    private final FileStorageService fileStorageService;
    private final CoursMapper coursMapper;

    @Override
    @Transactional
    public CoursResponse create(String enseignantEmail, CoursRequest request,
                                 MultipartFile video, List<MultipartFile> pdfs, MultipartFile ppt) {

        Enseignant enseignant = enseignantRepository.findByUserEmail(enseignantEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Enseignant introuvable."));

        if (request.getMatiereId() == null) {
            throw new BadRequestException("La matiere est obligatoire.");
        }
        Matiere matiere = matiereRepository.findById(request.getMatiereId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Matiere introuvable, id=" + request.getMatiereId()));

        boolean habilite = enseignant.getMatieres().stream().anyMatch(m -> m.getId().equals(matiere.getId()));
        if (!habilite) {
            throw new ForbiddenException("Vous n'etes pas habilite a enseigner la matiere \"" + matiere.getNom() + "\".");
        }

        List<Eleve> elevesCibles = validerEtResoudreCiblage(enseignant, matiere.getId(), request);


        String videoPath = (video != null && !video.isEmpty()) ? fileStorageService.store(video, DOSSIER_VIDEOS) : null;
        String pptPath = (ppt != null && !ppt.isEmpty()) ? fileStorageService.store(ppt, DOSSIER_PPTS) : null;

        Cours cours = Cours.builder()
                .titre(request.getTitre())
                .description(request.getDescription())
                .videoPath(videoPath)
                .pptPath(pptPath)
                .datePublication(request.getDatePublication())
                .niveau(request.getCibleType() == CibleType.NIVEAU ? request.getNiveau() : null)
                .typeCours(request.getTypeCours())
                .cibleType(request.getCibleType())
                .elevesCibles(new HashSet<>(elevesCibles))
                .matiere(matiere)
                .enseignant(enseignant)
                .build();

        if (pdfs != null) {
            for (MultipartFile pdf : pdfs) {
                if (pdf != null && !pdf.isEmpty()) {
                    cours.getPdfs().add(CoursPdf.builder()
                            .cours(cours)
                            .nomFichier(pdf.getOriginalFilename())
                            .chemin(fileStorageService.store(pdf, DOSSIER_PDFS))
                            .build());
                }
            }
        }

        return coursMapper.toResponse(coursRepository.save(cours));
    }

    
    private List<Eleve> validerEtResoudreCiblage(Enseignant enseignant, Long matiereId, CoursRequest request) {
        Long enseignantId = enseignant.getId();
        if (request.getCibleType() == null) {
            throw new BadRequestException("Le ciblage du cours (niveau ou eleves) est obligatoire.");
        }

        if (request.getCibleType() == CibleType.NIVEAU) {
            if (request.getNiveau() == null) {
                throw new BadRequestException("Le niveau cible est obligatoire pour un ciblage par niveau.");
            }
            if (!enseignant.getNiveaux().contains(request.getNiveau())) {
                throw new ForbiddenException(
                        "Vous n'etes pas autorise a enseigner le niveau \"" + request.getNiveau().getLibelle() + "\".");
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
                throw new ForbiddenException(
                        "L'eleve id=" + eleveId + " ne vous est pas affecte pour cette matiere.");
            }
        }
        return eleves;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CoursResponse> search(Long matiereId, Long enseignantId, String titre) {
        String email = SecurityUtils.getCurrentUserEmail();

        if (SecurityUtils.hasRole("ADMIN")) {
            return rechercherViaSpecification(matiereId, enseignantId, titre);
        }

        if (SecurityUtils.hasRole("ENSEIGNANT")) {
            Enseignant enseignant = enseignantRepository.findByUserEmail(email)
                    .orElseThrow(() -> new ResourceNotFoundException("Enseignant introuvable."));

            return rechercherViaSpecification(matiereId, enseignant.getId(), titre);
        }

        Eleve eleve = eleveRepository.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Eleve introuvable."));

        if (!Boolean.TRUE.equals(eleve.getValide())) {
            return List.of();
        }

        List<Affectation> mesAffectations = affectationRepository.findByEleveId(eleve.getId()).stream()
                .filter(a -> a.getEnseignant() != null)
                .toList();

        List<Cours> coursAccessibles = new ArrayList<>();
        for (Affectation a : mesAffectations) {
            if (matiereId != null && !a.getMatiere().getId().equals(matiereId)) {
                continue;
            }
            coursAccessibles.addAll(
                    coursRepository.findByMatiereIdAndEnseignantId(a.getMatiere().getId(), a.getEnseignant().getId()));
        }

        return coursAccessibles.stream()
                .filter(c -> coursCibleCetEleve(c, eleve))
                .filter(c -> titre == null || titre.isBlank()
                        || c.getTitre().toLowerCase().contains(titre.toLowerCase()))
                .map(coursMapper::toResponse)
                .toList();
    }

    
    private boolean coursCibleCetEleve(Cours cours, Eleve eleve) {
        if (cours.getCibleType() == CibleType.NIVEAU) {
            return cours.getNiveau() != null && cours.getNiveau().equals(eleve.getNiveau());
        }
        return cours.getElevesCibles().stream().anyMatch(e -> e.getId().equals(eleve.getId()));
    }

    @Override
    @Transactional(readOnly = true)
    public CoursResponse getById(Long id) {
        return coursMapper.toResponse(getCoursAvecControleAcces(id));
    }

    @Override
    @Transactional
    public CoursResponse update(String enseignantEmail, Long id, CoursRequest request) {
        Cours cours = getCoursApartenantA(enseignantEmail, id);

        if (request.getMatiereId() == null) {
            throw new BadRequestException("La matiere est obligatoire.");
        }
        Matiere matiere = matiereRepository.findById(request.getMatiereId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Matiere introuvable, id=" + request.getMatiereId()));

        boolean habilite = cours.getEnseignant().getMatieres().stream()
                .anyMatch(m -> m.getId().equals(matiere.getId()));
        if (!habilite) {
            throw new ForbiddenException("Vous n'etes pas habilite a enseigner la matiere \"" + matiere.getNom() + "\".");
        }

        List<Eleve> elevesCibles = validerEtResoudreCiblage(cours.getEnseignant(), matiere.getId(), request);

        cours.setTitre(request.getTitre());
        cours.setDescription(request.getDescription());
        cours.setMatiere(matiere);
        cours.setNiveau(request.getCibleType() == CibleType.NIVEAU ? request.getNiveau() : null);
        cours.setTypeCours(request.getTypeCours());
        cours.setDatePublication(request.getDatePublication());
        cours.setCibleType(request.getCibleType());
        cours.getElevesCibles().clear();
        cours.getElevesCibles().addAll(elevesCibles);

        return coursMapper.toResponse(coursRepository.save(cours));
    }

    @Override
    @Transactional
    public void delete(String enseignantEmail, Long id) {
        Cours cours = getCoursApartenantA(enseignantEmail, id);

        if (cours.getVideoPath() != null) {
            fileStorageService.delete(cours.getVideoPath());
        }
        cours.getPdfs().forEach(pdf -> fileStorageService.delete(pdf.getChemin()));
        if (cours.getPptPath() != null) {
            fileStorageService.delete(cours.getPptPath());
        }

        coursRepository.delete(cours);
    }

    @Override
    @Transactional
    public void updateVideo(String enseignantEmail, Long id, MultipartFile video) {
        Cours cours = getCoursApartenantA(enseignantEmail, id);
        String ancienChemin = cours.getVideoPath();
        cours.setVideoPath(fileStorageService.store(video, DOSSIER_VIDEOS));
        coursRepository.save(cours);
        if (ancienChemin != null) {
            fileStorageService.delete(ancienChemin);
        }
    }

    @Override
    @Transactional
    public void ajouterPdf(String enseignantEmail, Long id, MultipartFile pdf) {
        Cours cours = getCoursApartenantA(enseignantEmail, id);

        cours.getPdfs().add(CoursPdf.builder()
                .cours(cours)
                .nomFichier(pdf.getOriginalFilename())
                .chemin(fileStorageService.store(pdf, DOSSIER_PDFS))
                .build());
        coursRepository.save(cours);
    }

    @Override
    @Transactional
    public void supprimerPdf(String enseignantEmail, Long id, Long pdfId) {
        Cours cours = getCoursApartenantA(enseignantEmail, id);
        CoursPdf aRetirer = cours.getPdfs().stream()
                .filter(p -> p.getId().equals(pdfId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("PDF introuvable, id=" + pdfId + " pour ce cours."));
        cours.getPdfs().remove(aRetirer); // orphanRemoval=true supprime la ligne en base, les autres PDF restent intacts
        coursRepository.save(cours);
        fileStorageService.delete(aRetirer.getChemin());
    }

    @Override
    @Transactional
    public void updatePpt(String enseignantEmail, Long id, MultipartFile ppt) {
        Cours cours = getCoursApartenantA(enseignantEmail, id);
        String ancienChemin = cours.getPptPath();
        cours.setPptPath(fileStorageService.store(ppt, DOSSIER_PPTS));
        coursRepository.save(cours);
        if (ancienChemin != null) {
            fileStorageService.delete(ancienChemin);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Resource loadVideo(Long id) {
        Cours cours = getCoursAvecControleAcces(id);
        if (cours.getVideoPath() == null) {
            throw new ResourceNotFoundException("Ce cours n'a pas de video.");
        }
        return fileStorageService.load(cours.getVideoPath());
    }

    @Override
    @Transactional(readOnly = true)
    public Resource loadPdf(Long id, Long pdfId) {
        Cours cours = getCoursAvecControleAcces(id);
        CoursPdf pdf = cours.getPdfs().stream()
                .filter(p -> p.getId().equals(pdfId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("PDF introuvable, id=" + pdfId + " pour ce cours."));
        return fileStorageService.load(pdf.getChemin());
    }

    @Override
    @Transactional(readOnly = true)
    public Resource loadPpt(Long id) {
        Cours cours = getCoursAvecControleAcces(id);
        if (cours.getPptPath() == null) {
            throw new ResourceNotFoundException("Ce cours n'a pas de support PPT.");
        }
        return fileStorageService.load(cours.getPptPath());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PublicCoursResponse> searchPublic(String titre) {
        Specification<Cours> spec = Specification.where(null);
        if (titre != null && !titre.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("titre")), "%" + titre.toLowerCase() + "%"));
        }
        return coursRepository.findAll(spec).stream().map(coursMapper::toPublicResponse).toList();
    }




    private List<CoursResponse> rechercherViaSpecification(Long matiereId, Long enseignantId, String titre) {
        Specification<Cours> spec = Specification.where(null);
        if (matiereId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("matiere").get("id"), matiereId));
        }
        if (enseignantId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("enseignant").get("id"), enseignantId));
        }
        if (titre != null && !titre.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("titre")), "%" + titre.toLowerCase() + "%"));
        }
        return coursRepository.findAll(spec).stream().map(coursMapper::toResponse).toList();
    }

    
    private Cours getCoursApartenantA(String enseignantEmail, Long coursId) {
        Cours cours = coursRepository.findById(coursId)
                .orElseThrow(() -> new ResourceNotFoundException("Cours introuvable, id=" + coursId));
        if (!cours.getEnseignant().getUser().getEmail().equals(enseignantEmail)) {
            throw new ForbiddenException("Vous ne pouvez modifier que vos propres cours.");
        }
        return cours;
    }

    
    private Cours getCoursAvecControleAcces(Long id) {
        Cours cours = coursRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cours introuvable, id=" + id));

        if (SecurityUtils.hasRole("ADMIN")) {
            return cours;
        }

        String email = SecurityUtils.getCurrentUserEmail();

        if (SecurityUtils.hasRole("ENSEIGNANT")) {
            if (cours.getEnseignant().getUser().getEmail().equals(email)) {
                return cours;
            }
            throw new ForbiddenException("Vous n'avez pas acces a ce cours.");
        }

        Eleve eleve = eleveRepository.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Eleve introuvable."));

        if (!Boolean.TRUE.equals(eleve.getValide())) {
            throw new ForbiddenException("Votre compte n'est pas encore valide : aucun acces aux cours.");
        }

        boolean autorise = affectationRepository.findByEleveId(eleve.getId()).stream()
                .anyMatch(a -> a.getEnseignant() != null
                        && a.getMatiere().getId().equals(cours.getMatiere().getId())
                        && a.getEnseignant().getId().equals(cours.getEnseignant().getId()));

        if (!autorise || !coursCibleCetEleve(cours, eleve)) {
            throw new ForbiddenException("Vous n'etes pas autorise a acceder a ce cours "
                    + "(pas d'affectation active pour cette matiere avec cet enseignant, ou ce cours ne vous cible pas specifiquement).");
        }

        return cours;
    }
}
