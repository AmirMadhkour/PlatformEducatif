package com.education.plateforme.dto.request;

import com.education.plateforme.entity.TypeCours;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreerAffectationRequest {

    @NotNull(message = "L'eleve est obligatoire")
    private Long eleveId;

    @NotNull(message = "La matiere est obligatoire")
    private Long matiereId;

    private Long enseignantId;

    @NotNull(message = "Le type de cours est obligatoire")
    private TypeCours typeCours;
}
