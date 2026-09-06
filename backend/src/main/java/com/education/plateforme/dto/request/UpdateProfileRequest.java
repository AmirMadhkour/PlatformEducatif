package com.education.plateforme.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "Le prenom est obligatoire")
    private String prenom;

    private String telephone;

    private String specialite;
    private String diplome;
    private com.education.plateforme.entity.TypeBac origineDiplome;
    private String paysDiplome;
    private Integer experience;
    private String biographie;

    private com.education.plateforme.entity.Niveau niveau;
    private com.education.plateforme.entity.TypeBac typeBac;
    private String paysBac;
    private String classe;
    @Past(message = "La date de naissance doit etre dans le passe")
    private LocalDate dateNaissance;
    private String parentNom;
    private String parentTelephone;
    private String adresse;
}
