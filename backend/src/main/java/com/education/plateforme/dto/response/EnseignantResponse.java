package com.education.plateforme.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnseignantResponse {

    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String photo;
    private Boolean enabled;
    private Boolean mustChangePassword;
    private String specialite;
    private String diplome;
    private com.education.plateforme.entity.TypeBac origineDiplome;
    private String paysDiplome;
    private Integer experience;
    private LocalDate dateEmbauche;
    private String biographie;
    private Set<MatiereResponse> matieres;
    private Set<com.education.plateforme.entity.Niveau> niveaux;
}
