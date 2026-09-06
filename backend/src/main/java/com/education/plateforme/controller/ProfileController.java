package com.education.plateforme.controller;

import com.education.plateforme.dto.request.UpdateProfileRequest;
import com.education.plateforme.service.AuthService;
import com.education.plateforme.service.EleveService;
import com.education.plateforme.service.EnseignantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@Tag(name = "Profil")
@SecurityRequirement(name = "bearerAuth")
public class ProfileController {

    private final EnseignantService enseignantService;
    private final EleveService eleveService;
    private final AuthService authService;

    @GetMapping
    @Operation(summary = "Mon profil",
            description = "Reponse = EnseignantResponse, EleveResponse ou UserSummaryResponse selon le role connecte.")
    public ResponseEntity<?> getMyProfile(Authentication authentication) {
        String email = authentication.getName();

        if (hasRole(authentication, "ROLE_ENSEIGNANT")) {
            return ResponseEntity.ok(enseignantService.getMyProfile(email));
        }
        if (hasRole(authentication, "ROLE_ELEVE")) {
            return ResponseEntity.ok(eleveService.getMyProfile(email));
        }
        return ResponseEntity.ok(authService.getCurrentUserSummary(email));
    }

    @PutMapping
    @Operation(summary = "Modifier mon profil",
            description = "Champs non pertinents pour le role connecte ignores automatiquement. "
                    + "Ne permet jamais de changer les matieres enseignees (reserve a l'Admin).")
    public ResponseEntity<?> updateMyProfile(@Valid @RequestBody UpdateProfileRequest request,
                                              Authentication authentication) {
        String email = authentication.getName();

        if (hasRole(authentication, "ROLE_ENSEIGNANT")) {
            return ResponseEntity.ok(enseignantService.updateMyProfile(email, request));
        }
        if (hasRole(authentication, "ROLE_ELEVE")) {
            return ResponseEntity.ok(eleveService.updateMyProfile(email, request));
        }
        return ResponseEntity.ok(authService.updateBasicProfile(email, request));
    }

    private boolean hasRole(Authentication authentication, String role) {
        for (GrantedAuthority authority : authentication.getAuthorities()) {
            if (authority.getAuthority().equals(role)) {
                return true;
            }
        }
        return false;
    }
}
