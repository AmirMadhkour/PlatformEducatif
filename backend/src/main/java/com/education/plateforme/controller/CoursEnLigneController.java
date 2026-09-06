package com.education.plateforme.controller;

import com.education.plateforme.dto.request.CoursEnLigneRequest;
import com.education.plateforme.dto.response.CoursEnLigneResponse;
import com.education.plateforme.service.CoursEnLigneService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/cours-en-ligne")
@RequiredArgsConstructor
public class CoursEnLigneController {

    private final CoursEnLigneService coursEnLigneService;

    @PostMapping
    @PreAuthorize("hasRole('ENSEIGNANT')")
    public ResponseEntity<CoursEnLigneResponse> creer(@RequestBody @Valid CoursEnLigneRequest request, Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED).body(coursEnLigneService.creer(authentication.getName(), request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ENSEIGNANT')")
    public ResponseEntity<CoursEnLigneResponse> modifier(@PathVariable Long id, @RequestBody @Valid CoursEnLigneRequest request, Authentication authentication) {
        return ResponseEntity.ok(coursEnLigneService.modifier(authentication.getName(), id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ENSEIGNANT')")
    public ResponseEntity<Void> supprimer(@PathVariable Long id, Authentication authentication) {
        coursEnLigneService.supprimer(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/enseignant/moi")
    @PreAuthorize("hasRole('ENSEIGNANT')")
    public ResponseEntity<List<CoursEnLigneResponse>> mesLivesEnseignant(Authentication authentication) {
        return ResponseEntity.ok(coursEnLigneService.mesLivesEnseignant(authentication.getName()));
    }

    @GetMapping("/eleve/moi")
    @PreAuthorize("hasRole('ELEVE')")
    public ResponseEntity<List<CoursEnLigneResponse>> mesLivesEleve(Authentication authentication) {
        return ResponseEntity.ok(coursEnLigneService.mesLivesEleve(authentication.getName()));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CoursEnLigneResponse>> tousLesLives() {
        return ResponseEntity.ok(coursEnLigneService.tousLesLives());
    }
}
