package com.education.plateforme.mapper;

import com.education.plateforme.dto.response.CoursPdfResponse;
import com.education.plateforme.dto.response.CoursResponse;
import com.education.plateforme.dto.response.PublicCoursResponse;
import com.education.plateforme.entity.Cours;
import com.education.plateforme.entity.Eleve;
import org.springframework.stereotype.Component;

@Component
public class CoursMapper {

    public CoursResponse toResponse(Cours cours) {
        if (cours == null) {
            return null;
        }
        return CoursResponse.builder()
                .id(cours.getId())
                .titre(cours.getTitre())
                .description(cours.getDescription())
                .videoUrl(cours.getVideoPath() != null ? "/api/cours/" + cours.getId() + "/video" : null)
                .pdfs(cours.getPdfs().stream()
                        .map(pdf -> CoursPdfResponse.builder()
                                .id(pdf.getId())
                                .nomFichier(pdf.getNomFichier())
                                .build())
                        .toList())
                .pptUrl(cours.getPptPath() != null ? "/api/cours/" + cours.getId() + "/ppt" : null)
                .datePublication(cours.getDatePublication())
                .niveau(cours.getNiveau())
                .typeCours(cours.getTypeCours())
                .matiereId(cours.getMatiere().getId())
                .matiereNom(cours.getMatiere().getNom())
                .enseignantId(cours.getEnseignant().getId())
                .enseignantNomComplet(cours.getEnseignant().getUser().getPrenom()
                        + " " + cours.getEnseignant().getUser().getNom())
                .cibleType(cours.getCibleType())
                .eleveIdsCibles(cours.getElevesCibles().stream().map(Eleve::getId).toList())
                .build();
    }

    public PublicCoursResponse toPublicResponse(Cours cours) {
        if (cours == null) {
            return null;
        }
        return PublicCoursResponse.builder()
                .id(cours.getId())
                .titre(cours.getTitre())
                .description(cours.getDescription())
                .matiereNom(cours.getMatiere().getNom())
                .niveau(cours.getNiveau())
                .enseignantNomComplet(cours.getEnseignant().getUser().getPrenom()
                        + " " + cours.getEnseignant().getUser().getNom())
                .build();
    }
}
