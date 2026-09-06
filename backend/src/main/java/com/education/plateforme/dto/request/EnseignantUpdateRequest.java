package com.education.plateforme.dto.request;

import jakarta.validation.constraints.NotBlank;
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
public class EnseignantUpdateRequest {

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

    private LocalDate dateEmbauche;

    private String biographie;

    private List<Long> matieresIds;

    private List<com.education.plateforme.entity.Niveau> niveaux;
}
