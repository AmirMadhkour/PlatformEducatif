package com.education.plateforme.mapper;

import com.education.plateforme.dto.response.EnseignantResponse;
import com.education.plateforme.entity.Enseignant;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;


@Component
public class EnseignantMapper {

    private final MatiereMapper matiereMapper;

    public EnseignantMapper(MatiereMapper matiereMapper) {
        this.matiereMapper = matiereMapper;
    }

    public EnseignantResponse toResponse(Enseignant enseignant) {
        if (enseignant == null) {
            return null;
        }
        return EnseignantResponse.builder()
                .id(enseignant.getId())
                .nom(enseignant.getUser().getNom())
                .prenom(enseignant.getUser().getPrenom())
                .email(enseignant.getUser().getEmail())
                .telephone(enseignant.getUser().getTelephone())
                .photo(enseignant.getUser().getPhoto())
                .enabled(enseignant.getUser().getEnabled())
                .mustChangePassword(enseignant.getUser().getMustChangePassword())
                .specialite(enseignant.getSpecialite())
                .diplome(enseignant.getDiplome())
                .origineDiplome(enseignant.getOrigineDiplome())
                .paysDiplome(enseignant.getPaysDiplome())
                .experience(enseignant.getExperience())
                .dateEmbauche(enseignant.getDateEmbauche())
                .biographie(enseignant.getBiographie())
                .matieres(enseignant.getMatieres().stream()
                        .map(matiereMapper::toResponse)
                        .collect(Collectors.toSet()))
                .niveaux(new java.util.HashSet<>(enseignant.getNiveaux()))
                .build();
    }

    
    public String toNomComplet(Enseignant enseignant) {
        return enseignant.getUser().getPrenom() + " " + enseignant.getUser().getNom();
    }
}
