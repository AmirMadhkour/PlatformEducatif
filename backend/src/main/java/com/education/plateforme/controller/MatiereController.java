package com.education.plateforme.controller;

import com.education.plateforme.dto.request.MatiereRequest;
import com.education.plateforme.dto.response.MatiereResponse;
import com.education.plateforme.service.MatiereService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
@RequestMapping("/api/matieres")
@RequiredArgsConstructor
@Tag(name = "Matieres")
public class MatiereController {

    private final MatiereService matiereService;

    @GetMapping
    public ResponseEntity<List<MatiereResponse>> getAll() {
        return ResponseEntity.ok(matiereService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MatiereResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(matiereService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Creer une matiere (Admin)")
    public ResponseEntity<MatiereResponse> create(@Valid @RequestBody MatiereRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(matiereService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MatiereResponse> update(@PathVariable Long id, @Valid @RequestBody MatiereRequest request) {
        return ResponseEntity.ok(matiereService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        matiereService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
