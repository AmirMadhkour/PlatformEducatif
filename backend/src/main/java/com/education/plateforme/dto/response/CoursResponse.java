package com.education.plateforme.dto.response;

import com.education.plateforme.entity.CibleType;
import com.education.plateforme.entity.TypeCours;
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
public class CoursResponse {

    private Long id;
    private String titre;
    private String description;

    
    private String videoUrl;
    private List<CoursPdfResponse> pdfs;
    private String pptUrl;

    private LocalDate datePublication;
    private com.education.plateforme.entity.Niveau niveau;
    private TypeCours typeCours;
    private Long matiereId;
    private String matiereNom;
    private Long enseignantId;
    private String enseignantNomComplet;

    private CibleType cibleType;
    
    private List<Long> eleveIdsCibles;
}
