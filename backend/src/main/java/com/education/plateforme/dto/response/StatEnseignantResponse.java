package com.education.plateforme.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StatEnseignantResponse {
    private Long enseignantId;
    private String enseignantNom;
    private long nombreEleves;
}
