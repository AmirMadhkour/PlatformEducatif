package com.education.plateforme.controller;

import com.education.plateforme.dto.request.EnseignantCreateRequest;
import com.education.plateforme.dto.request.EnseignantUpdateRequest;
import com.education.plateforme.dto.response.EleveResponse;
import com.education.plateforme.dto.response.EnseignantResponse;
import com.education.plateforme.service.EnseignantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/enseignants")
@RequiredArgsConstructor
@Tag(name = "Enseignants")
@SecurityRequirement(name = "bearerAuth")
public class EnseignantController {

    private final EnseignantService enseignantService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Creer un compte enseignant (Admin)",
            description = "Aucune auto-inscription enseignant : seul l'Admin cree ces comptes.")
    public ResponseEntity<EnseignantResponse> create(@Valid @RequestBody EnseignantCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(enseignantService.create(request));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EnseignantResponse>> getAll(@RequestParam(required = false) Long matiereId) {
        return ResponseEntity.ok(enseignantService.getAll(matiereId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EnseignantResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(enseignantService.getById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EnseignantResponse> update(@PathVariable Long id,
                                                       @Valid @RequestBody EnseignantUpdateRequest request) {
        return ResponseEntity.ok(enseignantService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Supprimer un enseignant",
            description = "Refuse (400) si l'enseignant a des cours ou des eleves affectes -- desactiver a la place.")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        enseignantService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/activation")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> toggleActivation(@PathVariable Long id, @RequestParam boolean enabled) {
        enseignantService.toggleActivation(id, enabled);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/moi/eleves")
    @PreAuthorize("hasRole('ENSEIGNANT')")
    @Operation(summary = "Mes eleves affectes (toutes matieres confondues, dedoublonnes)")
    public ResponseEntity<List<EleveResponse>> getMesEleves(Authentication authentication) {
        return ResponseEntity.ok(enseignantService.getMesEleves(authentication.getName()));
    }
}
