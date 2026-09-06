package com.education.plateforme.dto.request;

import com.education.plateforme.entity.CibleType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CoursEnLigneRequest {

    @NotBlank(message = "Le titre est obligatoire")
    private String titre;

    private String description;

    @NotNull(message = "La matiere est obligatoire")
    private Long matiereId;


    @NotNull(message = "La date est obligatoire")
    private LocalDate dateCours;

    @NotNull(message = "L'heure de debut est obligatoire")
    private LocalTime heureDebut;

    @NotNull(message = "L'heure de fin est obligatoire")
    private LocalTime heureFin;

    @NotNull(message = "Le type de ciblage (NIVEAU ou ELEVES) est obligatoire")
    private CibleType cibleType;

    
    private com.education.plateforme.entity.Niveau cibleNiveau;

    
    private List<Long> eleveIds;
}
