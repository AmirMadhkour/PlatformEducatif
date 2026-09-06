package com.education.plateforme.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

    
    String store(MultipartFile file, String sousDossier);

    Resource load(String cheminRelatif);

    void delete(String cheminRelatif);
}
