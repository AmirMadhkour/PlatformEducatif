package com.education.plateforme.controller;

import com.education.plateforme.dto.request.EleveUpdateRequest;
import com.education.plateforme.dto.response.EleveResponse;
import com.education.plateforme.service.EleveService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/api/eleves")
@RequiredArgsConstructor
@Tag(name = "Eleves")
@SecurityRequirement(name = "bearerAuth")
public class EleveController {

    private final EleveService eleveService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Liste des eleves, filtrable par statut de validation")
    public ResponseEntity<List<EleveResponse>> getAll(@RequestParam(required = false) Boolean valide) {
        return ResponseEntity.ok(eleveService.getAll(valide));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ENSEIGNANT')")
    @Operation(summary = "Detail d'un eleve",
            description = "Admin : tout eleve. Enseignant : uniquement un eleve qui lui est affecte (verifie cote service).")
    public ResponseEntity<EleveResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(eleveService.getById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EleveResponse> update(@PathVariable Long id, @Valid @RequestBody EleveUpdateRequest request) {
        return ResponseEntity.ok(eleveService.update(id, request));
    }

    @PatchMapping("/{id}/activation")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> toggleActivation(@PathVariable Long id, @RequestParam boolean enabled) {
        eleveService.toggleActivation(id, enabled);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/validation")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Valider un eleve",
            description = "Refuse (400) si au moins une matiere demandee n'a pas encore d'enseignant affecte.")
    public ResponseEntity<Void> valider(@PathVariable Long id) {
        eleveService.validerEleve(id);
        return ResponseEntity.noContent().build();
    }
}
