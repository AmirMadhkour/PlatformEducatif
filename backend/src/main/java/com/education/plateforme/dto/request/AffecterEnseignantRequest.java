package com.education.plateforme.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AffecterEnseignantRequest {

    @NotNull(message = "L'identifiant de l'enseignant est obligatoire")
    private Long enseignantId;
}
