package com.education.plateforme.service;

import com.education.plateforme.dto.request.EnseignantCreateRequest;
import com.education.plateforme.dto.request.EnseignantUpdateRequest;
import com.education.plateforme.dto.request.UpdateProfileRequest;
import com.education.plateforme.dto.response.EleveResponse;
import com.education.plateforme.dto.response.EnseignantResponse;

import java.util.List;

public interface EnseignantService {

    List<EnseignantResponse> getAll(Long matiereId);

    EnseignantResponse getById(Long id);

    EnseignantResponse create(EnseignantCreateRequest request);

    EnseignantResponse update(Long id, EnseignantUpdateRequest request);

    void toggleActivation(Long id, boolean enabled);

    void delete(Long id);

    EnseignantResponse getMyProfile(String email);

    EnseignantResponse updateMyProfile(String email, UpdateProfileRequest request);

    List<EleveResponse> getMesEleves(String enseignantEmail);
}
