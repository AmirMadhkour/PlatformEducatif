package com.education.plateforme.repository;

import com.education.plateforme.entity.Matiere;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MatiereRepository extends JpaRepository<Matiere, Long> {

    Optional<Matiere> findByNom(String nom);

    boolean existsByNom(String nom);
}
