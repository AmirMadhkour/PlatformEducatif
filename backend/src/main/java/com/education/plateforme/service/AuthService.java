package com.education.plateforme.service;

import com.education.plateforme.dto.request.ChangePasswordRequest;
import com.education.plateforme.dto.request.LoginRequest;
import com.education.plateforme.dto.request.RegisterRequest;
import com.education.plateforme.dto.request.UpdateProfileRequest;
import com.education.plateforme.dto.response.LoginResponse;
import com.education.plateforme.dto.response.MessageResponse;
import com.education.plateforme.dto.response.RegisterResponse;
import com.education.plateforme.dto.response.UserSummaryResponse;

public interface AuthService {

    RegisterResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

    MessageResponse changePassword(String emailUtilisateurConnecte, ChangePasswordRequest request);

    
    UserSummaryResponse getCurrentUserSummary(String email);

    UserSummaryResponse updateBasicProfile(String email, UpdateProfileRequest request);
}
