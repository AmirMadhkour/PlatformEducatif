package com.education.plateforme.mapper;

import com.education.plateforme.dto.response.CoursEnLigneResponse;
import com.education.plateforme.entity.CoursEnLigne;
import com.education.plateforme.entity.Eleve;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class CoursEnLigneMapper {

    public CoursEnLigneResponse toResponse(CoursEnLigne c) {
        return CoursEnLigneResponse.builder()
                .id(c.getId())
                .titre(c.getTitre())
                .description(c.getDescription())
                .dateCours(c.getDateCours())
                .heureDebut(c.getHeureDebut())
                .heureFin(c.getHeureFin())
                .matiereId(c.getMatiere().getId())
                .matiereNom(c.getMatiere().getNom())
                .enseignantId(c.getEnseignant().getId())
                .enseignantNomComplet(c.getEnseignant().getUser().getPrenom() + " " + c.getEnseignant().getUser().getNom())
                .statut(calculerStatut(c))
                .zoomLink(c.getZoomLink())
                .cibleType(c.getCibleType())
                .cibleNiveau(c.getCibleNiveau())
                .eleveIdsCibles(c.getElevesCibles().stream().map(Eleve::getId).toList())
                .build();
    }

    
    public String calculerStatut(CoursEnLigne c) {
        LocalDateTime maintenant = LocalDateTime.now();
        LocalDateTime debut = LocalDateTime.of(c.getDateCours(), c.getHeureDebut());
        LocalDateTime fin = LocalDateTime.of(c.getDateCours(), c.getHeureFin());

        if (maintenant.isBefore(debut)) return "PROGRAMME";
        if (maintenant.isAfter(fin)) return "TERMINE";
        return "EN_COURS";
    }
}
