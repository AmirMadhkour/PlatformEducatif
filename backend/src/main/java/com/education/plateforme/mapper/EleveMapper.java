package com.education.plateforme.mapper;

import com.education.plateforme.dto.response.EleveResponse;
import com.education.plateforme.entity.Affectation;
import com.education.plateforme.entity.Eleve;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class EleveMapper {

    private final AffectationMapper affectationMapper;

    public EleveMapper(AffectationMapper affectationMapper) {
        this.affectationMapper = affectationMapper;
    }

    
    public EleveResponse toResponse(Eleve eleve, List<Affectation> affectations) {
        if (eleve == null) {
            return null;
        }
        return EleveResponse.builder()
                .id(eleve.getId())
                .nom(eleve.getUser().getNom())
                .prenom(eleve.getUser().getPrenom())
                .email(eleve.getUser().getEmail())
                .telephone(eleve.getUser().getTelephone())
                .photo(eleve.getUser().getPhoto())
                .enabled(eleve.getUser().getEnabled())
                .valide(eleve.getValide())
                .niveau(eleve.getNiveau())
                .typeBac(eleve.getTypeBac())
                .paysBac(eleve.getPaysBac())
                .classe(eleve.getClasse())
                .dateNaissance(eleve.getDateNaissance())
                .parentNom(eleve.getParentNom())
                .parentTelephone(eleve.getParentTelephone())
                .adresse(eleve.getAdresse())
                .affectations(affectations == null ? List.of()
                        : affectations.stream().map(affectationMapper::toResponse).toList())
                .build();
    }
}
