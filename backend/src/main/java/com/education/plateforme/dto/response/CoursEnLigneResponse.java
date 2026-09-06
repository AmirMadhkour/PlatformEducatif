package com.education.plateforme.dto.response;

import com.education.plateforme.entity.CibleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CoursEnLigneResponse {

    private Long id;
    private String titre;
    private String description;
    private LocalDate dateCours;
    private LocalTime heureDebut;
    private LocalTime heureFin;
    private Long matiereId;
    private String matiereNom;
    private Long enseignantId;
    private String enseignantNomComplet;

    
    private String statut;

    private String zoomLink;

    private CibleType cibleType;
    private com.education.plateforme.entity.Niveau cibleNiveau;
    
    private List<Long> eleveIdsCibles;
}
