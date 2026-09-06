package com.education.plateforme.service.impl;

import com.education.plateforme.dto.request.AffecterEnseignantRequest;
import com.education.plateforme.dto.request.CreerAffectationRequest;
import com.education.plateforme.dto.response.AffectationResponse;
import com.education.plateforme.entity.Affectation;
import com.education.plateforme.entity.Eleve;
import com.education.plateforme.entity.Enseignant;
import com.education.plateforme.entity.Matiere;
import com.education.plateforme.exception.BadRequestException;
import com.education.plateforme.exception.DuplicateResourceException;
import com.education.plateforme.exception.ResourceNotFoundException;
import com.education.plateforme.mapper.AffectationMapper;
import com.education.plateforme.repository.AffectationRepository;
import com.education.plateforme.repository.EleveRepository;
import com.education.plateforme.repository.EnseignantRepository;
import com.education.plateforme.repository.MatiereRepository;
import com.education.plateforme.service.AffectationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AffectationServiceImpl implements AffectationService {

    private final AffectationRepository affectationRepository;
    private final EnseignantRepository enseignantRepository;
    private final EleveRepository eleveRepository;
    private final MatiereRepository matiereRepository;
    private final AffectationMapper affectationMapper;

    @Override
    @Transactional(readOnly = true)
    public List<AffectationResponse> getByEleve(Long eleveId) {
        return affectationRepository.findByEleveId(eleveId).stream()
                .map(affectationMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AffectationResponse> getMesAffectations(String eleveEmail) {
        var eleve = eleveRepository.findByUserEmail(eleveEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Eleve introuvable pour cet utilisateur."));
        return affectationRepository.findByEleveId(eleve.getId()).stream()
                .map(affectationMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public AffectationResponse affecterEnseignant(Long affectationId, AffecterEnseignantRequest request) {
        Affectation affectation = affectationRepository.findById(affectationId)
                .orElseThrow(() -> new ResourceNotFoundException("Affectation introuvable, id=" + affectationId));

        Enseignant enseignant = enseignantRepository.findById(request.getEnseignantId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Enseignant introuvable, id=" + request.getEnseignantId()));

        verifierHabilitation(enseignant, affectation.getMatiere());

        affectation.setEnseignant(enseignant);
        affectation.setDateAffectation(LocalDateTime.now());

        return affectationMapper.toResponse(affectationRepository.save(affectation));
    }

    @Override
    @Transactional
    public AffectationResponse creerAffectation(CreerAffectationRequest request) {
        Eleve eleve = eleveRepository.findById(request.getEleveId())
                .orElseThrow(() -> new ResourceNotFoundException("Eleve introuvable, id=" + request.getEleveId()));

        Matiere matiere = matiereRepository.findById(request.getMatiereId())
                .orElseThrow(() -> new ResourceNotFoundException("Matiere introuvable, id=" + request.getMatiereId()));

        if (affectationRepository.findByEleveIdAndMatiereId(eleve.getId(), matiere.getId()).isPresent()) {
            throw new DuplicateResourceException(
                    "Cet eleve a deja une affectation pour la matiere \"" + matiere.getNom() + "\".");
        }

        Enseignant enseignant = null;
        LocalDateTime dateAffectation = null;
        if (request.getEnseignantId() != null) {
            enseignant = enseignantRepository.findById(request.getEnseignantId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Enseignant introuvable, id=" + request.getEnseignantId()));
            verifierHabilitation(enseignant, matiere);
            dateAffectation = LocalDateTime.now();
        }

        Affectation affectation = Affectation.builder()
                .eleve(eleve)
                .matiere(matiere)
                .enseignant(enseignant)
                .typeCours(request.getTypeCours())
                .dateAffectation(dateAffectation)
                .build();

        return affectationMapper.toResponse(affectationRepository.save(affectation));
    }

    @Override
    @Transactional
    public void supprimerAffectation(Long affectationId) {
        if (!affectationRepository.existsById(affectationId)) {
            throw new ResourceNotFoundException("Affectation introuvable, id=" + affectationId);
        }
        affectationRepository.deleteById(affectationId);
    }

    private void verifierHabilitation(Enseignant enseignant, Matiere matiere) {
        boolean habilite = enseignant.getMatieres().stream()
                .anyMatch(m -> m.getId().equals(matiere.getId()));
        if (!habilite) {
            throw new BadRequestException(
                    "Cet enseignant n'est pas habilite pour la matiere \"" + matiere.getNom() + "\".");
        }
    }
}
