package com.education.plateforme.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EleveResponse {

    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String photo;
    private Boolean enabled;
    private Boolean valide;
    private com.education.plateforme.entity.Niveau niveau;
    private String classe;
    private LocalDate dateNaissance;
    private String parentNom;
    private String parentTelephone;
    private String adresse;
    private com.education.plateforme.entity.TypeBac typeBac;
    private String paysBac;

    private List<AffectationResponse> affectations;
}
