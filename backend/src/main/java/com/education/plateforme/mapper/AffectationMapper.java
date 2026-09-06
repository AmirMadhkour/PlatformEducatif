package com.education.plateforme.mapper;

import com.education.plateforme.dto.response.AffectationResponse;
import com.education.plateforme.entity.Affectation;
import org.springframework.stereotype.Component;

@Component
public class AffectationMapper {

    public AffectationResponse toResponse(Affectation affectation) {
        if (affectation == null) {
            return null;
        }

        boolean affectee = affectation.getEnseignant() != null;

        return AffectationResponse.builder()
                .id(affectation.getId())
                .eleveId(affectation.getEleve().getId())
                .eleveNomComplet(affectation.getEleve().getUser().getPrenom()
                        + " " + affectation.getEleve().getUser().getNom())
                .matiereId(affectation.getMatiere().getId())
                .matiereNom(affectation.getMatiere().getNom())
                .enseignantId(affectee ? affectation.getEnseignant().getId() : null)
                .enseignantNomComplet(affectee
                        ? affectation.getEnseignant().getUser().getPrenom()
                        + " " + affectation.getEnseignant().getUser().getNom()
                        : null)
                .typeCours(affectation.getTypeCours())
                .statut(affectee ? "AFFECTEE" : "EN_ATTENTE")
                .dateDemande(affectation.getDateDemande())
                .dateAffectation(affectation.getDateAffectation())
                .build();
    }
}
