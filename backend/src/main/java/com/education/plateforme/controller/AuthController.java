package com.education.plateforme.controller;

import com.education.plateforme.dto.request.ChangePasswordRequest;
import com.education.plateforme.dto.request.LoginRequest;
import com.education.plateforme.dto.request.RegisterRequest;
import com.education.plateforme.dto.response.LoginResponse;
import com.education.plateforme.dto.response.MessageResponse;
import com.education.plateforme.dto.response.RegisterResponse;
import com.education.plateforme.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentification", description = "Inscription, connexion et gestion du mot de passe")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Inscription d'un eleve (auto-service)",
            description = "Cree le compte + une Affectation par matiere demandee (enseignant non assigne). "
                    + "Le compte reste en attente de validation par l'Admin.")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    @Operation(summary = "Connexion", description = "Retourne un token JWT valable pour les routes protegees.")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/change-password")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Changement de mot de passe", description = "Necessite d'etre authentifie (token JWT).")
    public ResponseEntity<MessageResponse> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(authService.changePassword(authentication.getName(), request));
    }
}
