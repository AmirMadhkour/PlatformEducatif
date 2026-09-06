package com.education.plateforme.controller;

import com.education.plateforme.dto.response.StatistiquesResponse;
import com.education.plateforme.service.StatistiqueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/statistiques")
@RequiredArgsConstructor
@Tag(name = "Statistiques")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class StatistiqueController {

    private final StatistiqueService statistiqueService;

    @GetMapping
    @Operation(summary = "Statistiques globales de la plateforme", description = "Valeurs calculees en direct depuis PostgreSQL.")
    public ResponseEntity<StatistiquesResponse> getStatistiques() {
        return ResponseEntity.ok(statistiqueService.getStatistiques());
    }
}
