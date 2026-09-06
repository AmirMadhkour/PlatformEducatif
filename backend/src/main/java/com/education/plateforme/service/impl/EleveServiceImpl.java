package com.education.plateforme.service.impl;

import com.education.plateforme.dto.request.EleveUpdateRequest;
import com.education.plateforme.dto.request.UpdateProfileRequest;
import com.education.plateforme.dto.response.EleveResponse;
import com.education.plateforme.entity.Affectation;
import com.education.plateforme.entity.Eleve;
import com.education.plateforme.exception.BadRequestException;
import com.education.plateforme.exception.ForbiddenException;
import com.education.plateforme.exception.ResourceNotFoundException;
import com.education.plateforme.mapper.EleveMapper;
import com.education.plateforme.repository.AffectationRepository;
import com.education.plateforme.repository.EleveRepository;
import com.education.plateforme.security.SecurityUtils;
import com.education.plateforme.service.EleveService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EleveServiceImpl implements EleveService {

    private final EleveRepository eleveRepository;
    private final AffectationRepository affectationRepository;
    private final EleveMapper eleveMapper;

    @Override
    @Transactional(readOnly = true)
    public List<EleveResponse> getAll(Boolean valide) {
        List<Eleve> eleves = (valide == null) ? eleveRepository.findAll() : eleveRepository.findByValide(valide);
        return eleves.stream().map(this::toResponseAvecAffectations).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public EleveResponse getById(Long id) {
        Eleve eleve = findOrThrow(id);

        if (SecurityUtils.hasRole("ENSEIGNANT")) {
            String email = SecurityUtils.getCurrentUserEmail();
            boolean autorise = affectationRepository.findByEleveId(id).stream()
                    .anyMatch(a -> a.getEnseignant() != null && a.getEnseignant().getUser().getEmail().equals(email));
            if (!autorise) {
                throw new ForbiddenException("Vous ne pouvez consulter que les eleves qui vous sont affectes.");
            }
        }

        return toResponseAvecAffectations(eleve);
    }

    @Override
    @Transactional
    public EleveResponse update(Long id, EleveUpdateRequest request) {
        Eleve eleve = findOrThrow(id);
        appliquerMiseAJour(eleve, request.getNom(), request.getPrenom(), request.getTelephone(),
                request.getNiveau(), request.getClasse(), request.getDateNaissance(),
                request.getParentNom(), request.getParentTelephone(), request.getAdresse(),
                request.getTypeBac(), request.getPaysBac());
        return toResponseAvecAffectations(eleveRepository.save(eleve));
    }

    @Override
    @Transactional
    public void toggleActivation(Long id, boolean enabled) {
        Eleve eleve = findOrThrow(id);
        eleve.getUser().setEnabled(enabled);


        eleve.setDateAnnulation(enabled ? null : java.time.LocalDateTime.now());
        eleveRepository.save(eleve);
    }

    @Override
    @Transactional
    public void validerEleve(Long id) {
        Eleve eleve = findOrThrow(id);

        List<Affectation> affectations = affectationRepository.findByEleveId(id);
        if (affectations.isEmpty()) {
            throw new BadRequestException("Cet eleve n'a demande aucune matiere : validation impossible.");
        }

        long enAttente = affectations.stream().filter(a -> a.getEnseignant() == null).count();
        if (enAttente > 0) {
            throw new BadRequestException(
                    "Impossible de valider : " + enAttente + " matiere(s) sur " + affectations.size()
                            + " n'ont pas encore d'enseignant affecte. "
                            + "Affectez un enseignant a chaque matiere avant de valider ce compte.");
        }

        eleve.setValide(true);
        eleve.getUser().setEnabled(true);
        eleveRepository.save(eleve);



    }

    @Override
    @Transactional(readOnly = true)
    public EleveResponse getMyProfile(String email) {
        return toResponseAvecAffectations(findByEmailOrThrow(email));
    }

    @Override
    @Transactional
    public EleveResponse updateMyProfile(String email, UpdateProfileRequest request) {
        Eleve eleve = findByEmailOrThrow(email);
        appliquerMiseAJour(eleve, request.getNom(), request.getPrenom(), request.getTelephone(),
                request.getNiveau(), request.getClasse(), request.getDateNaissance(),
                request.getParentNom(), request.getParentTelephone(), request.getAdresse(),
                request.getTypeBac(), request.getPaysBac());
        return toResponseAvecAffectations(eleveRepository.save(eleve));
    }

    private void appliquerMiseAJour(Eleve eleve, String nom, String prenom, String telephone,
                                     com.education.plateforme.entity.Niveau niveau, String classe, java.time.LocalDate dateNaissance,
                                     String parentNom, String parentTelephone, String adresse,
                                     com.education.plateforme.entity.TypeBac typeBacDemande, String paysBacDemande) {

        com.education.plateforme.entity.TypeBac typeBac = null;
        String paysBac = null;
        if (niveau == com.education.plateforme.entity.Niveau.BACCALAUREAT) {
            if (typeBacDemande == null) {
                throw new BadRequestException("Le type de baccalaureat (tunisien ou etranger) est obligatoire.");
            }
            typeBac = typeBacDemande;
            if (typeBac == com.education.plateforme.entity.TypeBac.ETRANGER) {
                if (paysBacDemande == null || paysBacDemande.isBlank()) {
                    throw new BadRequestException("Le pays est obligatoire pour un baccalaureat etranger.");
                }
                paysBac = paysBacDemande;
            }
        }

        eleve.getUser().setNom(nom);
        eleve.getUser().setPrenom(prenom);
        eleve.getUser().setTelephone(telephone);
        eleve.setNiveau(niveau);
        eleve.setTypeBac(typeBac);
        eleve.setPaysBac(paysBac);
        eleve.setClasse(classe);
        eleve.setDateNaissance(dateNaissance);
        eleve.setParentNom(parentNom);
        eleve.setParentTelephone(parentTelephone);
        eleve.setAdresse(adresse);
    }

    private EleveResponse toResponseAvecAffectations(Eleve eleve) {
        List<Affectation> affectations = affectationRepository.findByEleveId(eleve.getId());
        return eleveMapper.toResponse(eleve, affectations);
    }

    private Eleve findOrThrow(Long id) {
        return eleveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Eleve introuvable, id=" + id));
    }

    private Eleve findByEmailOrThrow(String email) {
        return eleveRepository.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Eleve introuvable pour cet utilisateur."));
    }
}
