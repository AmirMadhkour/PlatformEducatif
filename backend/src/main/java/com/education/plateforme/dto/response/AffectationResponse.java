package com.education.plateforme.dto.response;

import com.education.plateforme.entity.TypeCours;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AffectationResponse {

    private Long id;
    private Long eleveId;
    private String eleveNomComplet;
    private Long matiereId;
    private String matiereNom;

    
    private Long enseignantId;
    private String enseignantNomComplet;

    private TypeCours typeCours;

    
    private String statut;

    private LocalDateTime dateDemande;
    private LocalDateTime dateAffectation;
}
