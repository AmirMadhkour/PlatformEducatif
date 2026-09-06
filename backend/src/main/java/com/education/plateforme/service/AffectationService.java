package com.education.plateforme.service;

import com.education.plateforme.dto.request.AffecterEnseignantRequest;
import com.education.plateforme.dto.request.CreerAffectationRequest;
import com.education.plateforme.dto.response.AffectationResponse;

import java.util.List;

public interface AffectationService {

    List<AffectationResponse> getByEleve(Long eleveId);

    List<AffectationResponse> getMesAffectations(String eleveEmail);

    AffectationResponse affecterEnseignant(Long affectationId, AffecterEnseignantRequest request);

    
    AffectationResponse creerAffectation(CreerAffectationRequest request);

    
    void supprimerAffectation(Long affectationId);
}
