package com.education.plateforme.controller;

import com.education.plateforme.dto.request.AffecterEnseignantRequest;
import com.education.plateforme.dto.request.CreerAffectationRequest;
import com.education.plateforme.dto.response.AffectationResponse;
import com.education.plateforme.service.AffectationService;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/affectations")
@RequiredArgsConstructor
@Tag(name = "Affectations")
@SecurityRequirement(name = "bearerAuth")
public class AffectationController {

    private final AffectationService affectationService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Matieres demandees par un eleve, avec statut d'affectation (Admin)")
    public ResponseEntity<List<AffectationResponse>> getByEleve(@RequestParam Long eleveId) {
        return ResponseEntity.ok(affectationService.getByEleve(eleveId));
    }

    @GetMapping("/moi")
    @PreAuthorize("hasRole('ELEVE')")
    @Operation(summary = "Mes matieres demandees, avec l'enseignant affecte le cas echeant")
    public ResponseEntity<List<AffectationResponse>> getMesAffectations(Authentication authentication) {
        return ResponseEntity.ok(affectationService.getMesAffectations(authentication.getName()));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Ajouter une matiere a un eleve deja existant (Admin, depuis sa fiche)")
    public ResponseEntity<AffectationResponse> creer(@Valid @RequestBody CreerAffectationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(affectationService.creerAffectation(request));
    }

    @PatchMapping("/{id}/affecter")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Affecter un enseignant a une matiere demandee (Admin)")
    public ResponseEntity<AffectationResponse> affecter(@PathVariable Long id,
                                                          @Valid @RequestBody AffecterEnseignantRequest request) {
        return ResponseEntity.ok(affectationService.affecterEnseignant(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Retirer une matiere d'un eleve (Admin)")
    public ResponseEntity<Void> supprimer(@PathVariable Long id) {
        affectationService.supprimerAffectation(id);
        return ResponseEntity.noContent().build();
    }
}
