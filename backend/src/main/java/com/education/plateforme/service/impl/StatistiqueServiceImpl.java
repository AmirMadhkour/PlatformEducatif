package com.education.plateforme.service.impl;

import com.education.plateforme.dto.response.StatEnseignantResponse;
import com.education.plateforme.dto.response.StatMatiereResponse;
import com.education.plateforme.dto.response.StatMoisResponse;
import com.education.plateforme.dto.response.StatistiquesResponse;
import com.education.plateforme.repository.AffectationRepository;
import com.education.plateforme.repository.CoursRepository;
import com.education.plateforme.repository.EleveRepository;
import com.education.plateforme.repository.EnseignantRepository;
import com.education.plateforme.repository.MatiereRepository;
import com.education.plateforme.service.StatistiqueService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StatistiqueServiceImpl implements StatistiqueService {

    private final EleveRepository eleveRepository;
    private final EnseignantRepository enseignantRepository;
    private final CoursRepository coursRepository;
    private final MatiereRepository matiereRepository;
    private final AffectationRepository affectationRepository;

    @Override
    @Transactional(readOnly = true)
    public StatistiquesResponse getStatistiques() {
        return StatistiquesResponse.builder()
                .totalEleves(eleveRepository.count())
                .elevesValides(eleveRepository.countByValide(true))
                .elevesEnAttente(eleveRepository.countByValide(false))
                .totalEnseignants(enseignantRepository.count())
                .enseignantsActifs(enseignantRepository.countByUser_Enabled(true))
                .totalCours(coursRepository.count())
                .totalMatieres(matiereRepository.count())
                .affectationsEnAttente(affectationRepository.countByEnseignantIsNull())
                .elevesActifsParMois(mapVersStatMois(eleveRepository.countElevesActifsParMoisInscription()))
                .annulationsParMois(mapVersStatMois(eleveRepository.countAnnulationsParMois()))
                .elevesParEnseignant(mapVersStatEnseignant(affectationRepository.countElevesDistinctParEnseignant()))
                .matieresPopulaires(mapVersStatMatiere(affectationRepository.countElevesDistinctParMatiere()))
                .build();
    }

    private List<StatMoisResponse> mapVersStatMois(List<Object[]> lignes) {
        return lignes.stream()
                .map(ligne -> new StatMoisResponse((String) ligne[0], (Long) ligne[1]))
                .toList();
    }

    private List<StatEnseignantResponse> mapVersStatEnseignant(List<Object[]> lignes) {
        return lignes.stream()
                .map(ligne -> new StatEnseignantResponse((Long) ligne[0], (String) ligne[1], (Long) ligne[2]))
                .toList();
    }

    private List<StatMatiereResponse> mapVersStatMatiere(List<Object[]> lignes) {
        return lignes.stream()
                .map(ligne -> new StatMatiereResponse((Long) ligne[0], (String) ligne[1], (Long) ligne[2]))
                .toList();
    }
}
