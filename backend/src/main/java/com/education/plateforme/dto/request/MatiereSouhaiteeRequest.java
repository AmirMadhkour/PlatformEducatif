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
public class MatiereSouhaiteeRequest {

    @NotNull(message = "L'identifiant de la matiere est obligatoire")
    private Long matiereId;

    @NotNull(message = "Le type de cours (GROUPE ou INDIVIDUEL) est obligatoire")
    private TypeCours typeCours;
}
