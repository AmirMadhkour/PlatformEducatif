package com.education.plateforme.service.impl;

import com.education.plateforme.dto.request.MatiereRequest;
import com.education.plateforme.dto.response.MatiereResponse;
import com.education.plateforme.entity.Matiere;
import com.education.plateforme.exception.BadRequestException;
import com.education.plateforme.exception.DuplicateResourceException;
import com.education.plateforme.exception.ResourceNotFoundException;
import com.education.plateforme.mapper.MatiereMapper;
import com.education.plateforme.repository.AffectationRepository;
import com.education.plateforme.repository.CoursRepository;
import com.education.plateforme.repository.MatiereRepository;
import com.education.plateforme.service.MatiereService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MatiereServiceImpl implements MatiereService {

    private final MatiereRepository matiereRepository;
    private final CoursRepository coursRepository;
    private final AffectationRepository affectationRepository;
    private final MatiereMapper matiereMapper;

    @Override
    @Transactional(readOnly = true)
    public List<MatiereResponse> getAll() {
        return matiereRepository.findAll().stream()
                .map(matiereMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public MatiereResponse getById(Long id) {
        return matiereMapper.toResponse(findOrThrow(id));
    }

    @Override
    @Transactional
    public MatiereResponse create(MatiereRequest request) {
        if (matiereRepository.existsByNom(request.getNom())) {
            throw new DuplicateResourceException("Une matiere avec ce nom existe deja : " + request.getNom());
        }
        Matiere matiere = Matiere.builder()
                .nom(request.getNom())
                .description(request.getDescription())
                .build();
        return matiereMapper.toResponse(matiereRepository.save(matiere));
    }

    @Override
    @Transactional
    public MatiereResponse update(Long id, MatiereRequest request) {
        Matiere matiere = findOrThrow(id);

        if (!matiere.getNom().equals(request.getNom()) && matiereRepository.existsByNom(request.getNom())) {
            throw new DuplicateResourceException("Une matiere avec ce nom existe deja : " + request.getNom());
        }

        matiere.setNom(request.getNom());
        matiere.setDescription(request.getDescription());
        return matiereMapper.toResponse(matiereRepository.save(matiere));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Matiere matiere = findOrThrow(id);

        if (coursRepository.existsByMatiereId(id) || affectationRepository.existsByMatiereId(id)) {
            throw new BadRequestException(
                    "Impossible de supprimer cette matiere : elle est encore utilisee par des cours ou des affectations.");
        }

        matiereRepository.delete(matiere);
    }

    private Matiere findOrThrow(Long id) {
        return matiereRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Matiere introuvable, id=" + id));
    }
}
