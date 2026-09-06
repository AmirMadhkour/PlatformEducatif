package com.education.plateforme.repository;

import com.education.plateforme.entity.Enseignant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EnseignantRepository extends JpaRepository<Enseignant, Long> {

    Optional<Enseignant> findByUserId(Long userId);

    Optional<Enseignant> findByUserEmail(String email);

    
    @Query("SELECT DISTINCT e FROM Enseignant e LEFT JOIN FETCH e.matieres LEFT JOIN FETCH e.niveaux WHERE e.user.email = :email")
    Optional<Enseignant> findByUserEmailWithMatieres(@Param("email") String email);

    
    List<Enseignant> findByMatieres_Id(Long matiereId);

    long countByUser_Enabled(Boolean enabled);
}
