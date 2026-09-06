package com.education.plateforme.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatistiquesResponse {

    private long totalEleves;
    private long elevesValides;
    private long elevesEnAttente;
    private long totalEnseignants;
    private long enseignantsActifs;
    private long totalCours;
    private long totalMatieres;
    private long affectationsEnAttente;

    
    private List<StatMoisResponse> elevesActifsParMois;

    
    private List<StatMoisResponse> annulationsParMois;

    
    private List<StatEnseignantResponse> elevesParEnseignant;

    
    private List<StatMatiereResponse> matieresPopulaires;
}
