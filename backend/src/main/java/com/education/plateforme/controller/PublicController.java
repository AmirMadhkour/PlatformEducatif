package com.education.plateforme.controller;

import com.education.plateforme.dto.response.NiveauResponse;
import com.education.plateforme.dto.response.PublicCoursResponse;
import com.education.plateforme.entity.Niveau;
import com.education.plateforme.service.CoursService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;


@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
@Tag(name = "Public")
public class PublicController {

    private final CoursService coursService;

    @GetMapping("/cours")
    @Operation(summary = "Apercu public des cours (vitrine, sans authentification)")
    public ResponseEntity<List<PublicCoursResponse>> previewCours(@RequestParam(required = false) String titre) {
        return ResponseEntity.ok(coursService.searchPublic(titre));
    }

    
    @GetMapping("/niveaux")
    @Operation(summary = "Liste centralisee des niveaux scolaires (valeur + libelle francais)")
    public ResponseEntity<List<NiveauResponse>> listerNiveaux() {
        List<NiveauResponse> niveaux = Arrays.stream(Niveau.values())
                .map(n -> new NiveauResponse(n.name(), n.getLibelle()))
                .toList();
        return ResponseEntity.ok(niveaux);
    }
}
