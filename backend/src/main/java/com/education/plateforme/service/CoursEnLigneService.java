package com.education.plateforme.service;

import com.education.plateforme.dto.request.CoursEnLigneRequest;
import com.education.plateforme.dto.response.CoursEnLigneResponse;

import java.util.List;

public interface CoursEnLigneService {

    CoursEnLigneResponse creer(String enseignantEmail, CoursEnLigneRequest request);

    CoursEnLigneResponse modifier(String enseignantEmail, Long id, CoursEnLigneRequest request);

    void supprimer(String enseignantEmail, Long id);

    List<CoursEnLigneResponse> mesLivesEnseignant(String enseignantEmail);

    
    List<CoursEnLigneResponse> mesLivesEleve(String eleveEmail);

    
    List<CoursEnLigneResponse> tousLesLives();
}
