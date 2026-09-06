package com.education.plateforme.dto.request;

import com.education.plateforme.entity.CibleType;
import com.education.plateforme.entity.TypeCours;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class CoursRequest {

    @NotBlank(message = "Le titre est obligatoire")
    private String titre;

    @NotBlank(message = "La description est obligatoire")
    private String description;

    @NotNull(message = "La matiere est obligatoire")
    private Long matiereId;

    
    private com.education.plateforme.entity.Niveau niveau;

    private TypeCours typeCours;

    @NotNull(message = "La date de publication est obligatoire")
    private LocalDate datePublication;

    @NotNull(message = "Le type de ciblage (NIVEAU ou ELEVES) est obligatoire")
    private CibleType cibleType;

    
    private List<Long> eleveIds;
}
