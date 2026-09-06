package com.education.plateforme.repository;

import com.education.plateforme.entity.Eleve;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EleveRepository extends JpaRepository<Eleve, Long> {

    Optional<Eleve> findByUserId(Long userId);

    Optional<Eleve> findByUserEmail(String email);

    
    List<Eleve> findByValide(boolean valide);

    long countByValide(boolean valide);

    
    @org.springframework.data.jpa.repository.Query(
            "SELECT FUNCTION('to_char', e.user.createdAt, 'YYYY-MM'), COUNT(e) " +
            "FROM Eleve e WHERE e.valide = true AND e.user.enabled = true " +
            "GROUP BY FUNCTION('to_char', e.user.createdAt, 'YYYY-MM') " +
            "ORDER BY FUNCTION('to_char', e.user.createdAt, 'YYYY-MM')")
    java.util.List<Object[]> countElevesActifsParMoisInscription();

    
    @org.springframework.data.jpa.repository.Query(
            "SELECT FUNCTION('to_char', e.dateAnnulation, 'YYYY-MM'), COUNT(e) " +
            "FROM Eleve e WHERE e.dateAnnulation IS NOT NULL " +
            "GROUP BY FUNCTION('to_char', e.dateAnnulation, 'YYYY-MM') " +
            "ORDER BY FUNCTION('to_char', e.dateAnnulation, 'YYYY-MM')")
    java.util.List<Object[]> countAnnulationsParMois();
}
