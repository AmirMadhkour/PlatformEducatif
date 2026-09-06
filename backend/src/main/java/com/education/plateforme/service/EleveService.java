package com.education.plateforme.service;

import com.education.plateforme.dto.request.EleveUpdateRequest;
import com.education.plateforme.dto.request.UpdateProfileRequest;
import com.education.plateforme.dto.response.EleveResponse;

import java.util.List;

public interface EleveService {

    List<EleveResponse> getAll(Boolean valide);

    EleveResponse getById(Long id);

    EleveResponse update(Long id, EleveUpdateRequest request);

    void toggleActivation(Long id, boolean enabled);

    
    void validerEleve(Long id);

    EleveResponse getMyProfile(String email);

    EleveResponse updateMyProfile(String email, UpdateProfileRequest request);
}
