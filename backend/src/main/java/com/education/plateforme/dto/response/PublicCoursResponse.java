package com.education.plateforme.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PublicCoursResponse {

    private Long id;
    private String titre;
    private String description;
    private String matiereNom;
    private com.education.plateforme.entity.Niveau niveau;
    private String enseignantNomComplet;
}
