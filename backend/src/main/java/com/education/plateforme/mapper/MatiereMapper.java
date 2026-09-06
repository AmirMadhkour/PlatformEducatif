package com.education.plateforme.mapper;

import com.education.plateforme.dto.response.MatiereResponse;
import com.education.plateforme.entity.Matiere;
import org.springframework.stereotype.Component;

@Component
public class MatiereMapper {

    public MatiereResponse toResponse(Matiere matiere) {
        if (matiere == null) {
            return null;
        }
        return MatiereResponse.builder()
                .id(matiere.getId())
                .nom(matiere.getNom())
                .description(matiere.getDescription())
                .build();
    }
}
