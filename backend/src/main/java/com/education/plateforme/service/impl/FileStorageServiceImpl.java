package com.education.plateforme.service.impl;

import com.education.plateforme.exception.FileStorageException;
import com.education.plateforme.exception.ResourceNotFoundException;
import com.education.plateforme.service.FileStorageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;


@Service
@Slf4j
public class FileStorageServiceImpl implements FileStorageService {

    private static final Set<String> EXTENSIONS_VIDEO = Set.of(".mp4");
    private static final Set<String> EXTENSIONS_PDF = Set.of(".pdf");
    private static final Set<String> EXTENSIONS_PPT = Set.of(".ppt", ".pptx");

    private final Path racineStockage;

    public FileStorageServiceImpl(@Value("${upload.dir}") String uploadDir) {
        this.racineStockage = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(racineStockage);





            log.info("Repertoire de stockage des fichiers (videos/pdfs/ppts) : {}", racineStockage);
        } catch (IOException e) {
            throw new FileStorageException("Impossible de creer le repertoire de stockage : " + racineStockage, e);
        }
    }

    @Override
    public String store(MultipartFile file, String sousDossier) {
        if (file == null || file.isEmpty()) {
            throw new FileStorageException("Le fichier envoye est vide.");
        }

        String nomOriginal = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        if (nomOriginal.contains("..")) {
            throw new FileStorageException("Nom de fichier invalide : " + nomOriginal);
        }

        String extension = extraireExtension(nomOriginal);
        validerExtension(sousDossier, extension);

        String nomFichier = UUID.randomUUID() + extension;

        try {
            Path dossierCible = racineStockage.resolve(sousDossier);
            Files.createDirectories(dossierCible);
            Path cheminCible = dossierCible.resolve(nomFichier);
            Files.copy(file.getInputStream(), cheminCible, StandardCopyOption.REPLACE_EXISTING);
            return sousDossier + "/" + nomFichier;
        } catch (IOException e) {
            throw new FileStorageException("Echec du stockage du fichier : " + nomOriginal, e);
        }
    }

    @Override
    public Resource load(String cheminRelatif) {
        if (cheminRelatif == null) {
            throw new ResourceNotFoundException("Aucun fichier associe.");
        }
        try {
            Path chemin = racineStockage.resolve(cheminRelatif).normalize();
            Resource resource = new UrlResource(chemin.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                throw new ResourceNotFoundException("Fichier introuvable sur le disque : " + cheminRelatif);
            }
            return resource;
        } catch (MalformedURLException e) {
            throw new FileStorageException("Chemin de fichier invalide : " + cheminRelatif, e);
        }
    }

    @Override
    public void delete(String cheminRelatif) {
        if (cheminRelatif == null) {
            return;
        }
        try {
            Path chemin = racineStockage.resolve(cheminRelatif).normalize();
            Files.deleteIfExists(chemin);
        } catch (IOException e) {
            log.warn("Impossible de supprimer le fichier {} : {}", cheminRelatif, e.getMessage());
        }
    }

    private String extraireExtension(String nomFichier) {
        int i = nomFichier.lastIndexOf('.');
        if (i < 0) {
            throw new FileStorageException("Le fichier n'a pas d'extension : " + nomFichier);
        }
        return nomFichier.substring(i).toLowerCase();
    }

    private void validerExtension(String sousDossier, String extension) {
        boolean valide = switch (sousDossier) {
            case "videos" -> EXTENSIONS_VIDEO.contains(extension);
            case "pdfs" -> EXTENSIONS_PDF.contains(extension);
            case "ppts" -> EXTENSIONS_PPT.contains(extension);
            default -> false;
        };
        if (!valide) {
            throw new FileStorageException(
                    "Format de fichier non autorise pour " + sousDossier + " : \"" + extension + "\".");
        }
    }
}
