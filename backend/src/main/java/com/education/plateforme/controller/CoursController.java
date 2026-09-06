package com.education.plateforme.controller;

import com.education.plateforme.dto.request.CoursRequest;
import com.education.plateforme.dto.response.CoursResponse;
import com.education.plateforme.service.CoursService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@RestController
@RequestMapping("/api/cours")
@RequiredArgsConstructor
@Tag(name = "Cours")
@SecurityRequirement(name = "bearerAuth")
public class CoursController {

    private final CoursService coursService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ENSEIGNANT')")
    @Operation(summary = "Creer un cours (Enseignant)",
            description = "Multipart : partie 'cours' en JSON (CoursRequest). 'video', 'pdfs' (0 a plusieurs) "
                    + "et 'ppt' sont tous optionnels desormais - un cours peut etre cree sans aucun fichier.")
    public ResponseEntity<CoursResponse> create(
            @RequestPart("cours") @Valid CoursRequest request,
            @RequestPart(value = "video", required = false) MultipartFile video,
            @RequestPart(value = "pdfs", required = false) List<MultipartFile> pdfs,
            @RequestPart(value = "ppt", required = false) MultipartFile ppt,
            Authentication authentication) {
        CoursResponse response = coursService.create(authentication.getName(), request, video, pdfs, ppt);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "Rechercher des cours",
            description = "Visibilite dependante du role : Admin voit tout, Enseignant voit ses cours, "
                    + "Eleve voit uniquement les cours de ses matieres affectees (liste vide si non valide).")
    public ResponseEntity<List<CoursResponse>> search(
            @RequestParam(required = false) Long matiereId,
            @RequestParam(required = false) Long enseignantId,
            @RequestParam(required = false) String titre) {
        return ResponseEntity.ok(coursService.search(matiereId, enseignantId, titre));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CoursResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(coursService.getById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ENSEIGNANT')")
    @Operation(summary = "Modifier les metadonnees d'un cours (proprietaire uniquement)",
            description = "Ne modifie pas les fichiers : utiliser /video, /pdfs, /ppt pour cela.")
    public ResponseEntity<CoursResponse> update(@PathVariable Long id,
                                                 @Valid @RequestBody CoursRequest request,
                                                 Authentication authentication) {
        return ResponseEntity.ok(coursService.update(authentication.getName(), id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ENSEIGNANT')")
    @Operation(summary = "Supprimer un cours (proprietaire uniquement)",
            description = "Supprime aussi les fichiers video/PDF/PPT associes sur le disque.")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
        coursService.delete(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "/{id}/video", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ENSEIGNANT')")
    public ResponseEntity<Void> updateVideo(@PathVariable Long id, @RequestPart("video") MultipartFile video,
                                             Authentication authentication) {
        coursService.updateVideo(authentication.getName(), id, video);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "/{id}/pdfs", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ENSEIGNANT')")
    @Operation(summary = "Ajouter un PDF au cours",
            description = "AJOUTE ce PDF a la liste existante - les PDF deja presents ne sont jamais touches.")
    public ResponseEntity<Void> ajouterPdf(@PathVariable Long id, @RequestPart("pdf") MultipartFile pdf,
                                            Authentication authentication) {
        coursService.ajouterPdf(authentication.getName(), id, pdf);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/pdfs/{pdfId}")
    @PreAuthorize("hasRole('ENSEIGNANT')")
    @Operation(summary = "Retirer un seul PDF du cours (proprietaire uniquement)",
            description = "Les autres PDF du cours restent intacts.")
    public ResponseEntity<Void> supprimerPdf(@PathVariable Long id, @PathVariable Long pdfId,
                                              Authentication authentication) {
        coursService.supprimerPdf(authentication.getName(), id, pdfId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "/{id}/ppt", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ENSEIGNANT')")
    public ResponseEntity<Void> updatePpt(@PathVariable Long id, @RequestPart("ppt") MultipartFile ppt,
                                           Authentication authentication) {
        coursService.updatePpt(authentication.getName(), id, ppt);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/video")
    public ResponseEntity<Resource> streamVideo(@PathVariable Long id) {
        Resource resource = coursService.loadVideo(id);
        return ResponseEntity.ok()
                .contentType(MediaType.valueOf("video/mp4"))
                .body(resource);
    }

    @GetMapping("/{id}/pdfs/{pdfId}")
    public ResponseEntity<Resource> downloadPdf(@PathVariable Long id, @PathVariable Long pdfId) {
        Resource resource = coursService.loadPdf(id, pdfId);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @GetMapping("/{id}/ppt")
    public ResponseEntity<Resource> downloadPpt(@PathVariable Long id) {
        Resource resource = coursService.loadPpt(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
