package com.education.plateforme.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StatMatiereResponse {
    private Long matiereId;
    private String matiereNom;
    private long nombreEleves;
}
