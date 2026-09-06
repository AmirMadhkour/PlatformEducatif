package com.education.plateforme.service;

import com.education.plateforme.dto.request.CoursRequest;
import com.education.plateforme.dto.response.CoursResponse;
import com.education.plateforme.dto.response.PublicCoursResponse;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CoursService {

    CoursResponse create(String enseignantEmail, CoursRequest request,
                          MultipartFile video, List<MultipartFile> pdfs, MultipartFile ppt);

    
    List<CoursResponse> search(Long matiereId, Long enseignantId, String titre);

    CoursResponse getById(Long id);

    CoursResponse update(String enseignantEmail, Long id, CoursRequest request);

    void delete(String enseignantEmail, Long id);

    void updateVideo(String enseignantEmail, Long id, MultipartFile video);

    
    void ajouterPdf(String enseignantEmail, Long id, MultipartFile pdf);

    
    void supprimerPdf(String enseignantEmail, Long id, Long pdfId);

    void updatePpt(String enseignantEmail, Long id, MultipartFile ppt);

    Resource loadVideo(Long id);

    Resource loadPdf(Long id, Long pdfId);

    Resource loadPpt(Long id);

    List<PublicCoursResponse> searchPublic(String titre);
}
