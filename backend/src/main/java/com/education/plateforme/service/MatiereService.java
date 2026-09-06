package com.education.plateforme.service;

import com.education.plateforme.dto.request.MatiereRequest;
import com.education.plateforme.dto.response.MatiereResponse;

import java.util.List;

public interface MatiereService {

    List<MatiereResponse> getAll();

    MatiereResponse getById(Long id);

    MatiereResponse create(MatiereRequest request);

    MatiereResponse update(Long id, MatiereRequest request);

    void delete(Long id);
}
