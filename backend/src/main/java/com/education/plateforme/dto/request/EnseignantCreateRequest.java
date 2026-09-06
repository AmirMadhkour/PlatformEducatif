package com.education.plateforme.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EnseignantCreateRequest {

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "Le prenom est obligatoire")
    private String prenom;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format d'email invalide")
    private String email;

    @NotBlank(message = "Un mot de passe temporaire est obligatoire")
    @Pattern(
            regexp = "^(?=.*[A-Z])(?=.*\\d).{8,}$",
            message = "Le mot de passe doit contenir au moins 8 caracteres, une majuscule et un chiffre"
    )
    private String motDePasseTemporaire;

    private String telephone;

    private String specialite;

    private String diplome;

    
    private com.education.plateforme.entity.TypeBac origineDiplome;

    private String paysDiplome;

    private Integer experience;

    private LocalDate dateEmbauche;

    private String biographie;

    @NotEmpty(message = "Selectionnez au moins une matiere enseignee")
    private List<Long> matieresIds;

    @NotEmpty(message = "Selectionnez au moins un niveau enseigne")
    private List<com.education.plateforme.entity.Niveau> niveaux;
}
