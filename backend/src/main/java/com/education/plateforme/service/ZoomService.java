package com.education.plateforme.service;

import java.time.LocalDate;
import java.time.LocalTime;


public interface ZoomService {

    record ReunionCreee(String joinUrl, String meetingId) {}

    ReunionCreee creerReunion(String titre, LocalDate dateCours, LocalTime heureDebut, LocalTime heureFin);

    void mettreAJourReunion(String meetingId, String titre, LocalDate dateCours, LocalTime heureDebut, LocalTime heureFin);

    
    void supprimerReunion(String meetingId);
}
