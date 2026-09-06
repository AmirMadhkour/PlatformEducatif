package com.education.plateforme.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Past;
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
public class RegisterRequest {

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "Le prenom est obligatoire")
    private String prenom;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format d'email invalide")
    private String email;

    @NotBlank(message = "Le mot de passe est obligatoire")
    @Pattern(
            regexp = "^(?=.*[A-Z])(?=.*\\d).{8,}$",
            message = "Le mot de passe doit contenir au moins 8 caracteres, une majuscule et un chiffre"
    )
    private String password;

    private String telephone;

    @jakarta.validation.constraints.NotNull(message = "Le niveau scolaire est obligatoire")
    private com.education.plateforme.entity.Niveau niveau;

    private String classe;

    @Past(message = "La date de naissance doit etre dans le passe")
    private LocalDate dateNaissance;

    private String parentNom;

    private String parentTelephone;

    private String adresse;

    
    private com.education.plateforme.entity.TypeBac typeBac;

    
    private String paysBac;

    @NotEmpty(message = "Selectionnez au moins une matiere")
    @Valid
    private List<MatiereSouhaiteeRequest> matieresSouhaitees;
}
