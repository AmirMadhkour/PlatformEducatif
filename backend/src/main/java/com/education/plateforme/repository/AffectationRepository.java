package com.education.plateforme.repository;

import com.education.plateforme.entity.Affectation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AffectationRepository extends JpaRepository<Affectation, Long> {

    List<Affectation> findByEleveId(Long eleveId);

    Optional<Affectation> findByEleveIdAndMatiereId(Long eleveId, Long matiereId);

    List<Affectation> findByEnseignantId(Long enseignantId);

    
    List<Affectation> findByEleveIdAndEnseignantIsNull(Long eleveId);

    boolean existsByMatiereId(Long matiereId);

    
    long countByEnseignantIsNull();

    
    boolean existsByEnseignantIdAndMatiereIdAndEleveId(Long enseignantId, Long matiereId, Long eleveId);

    
    @org.springframework.data.jpa.repository.Query(
            "SELECT a.enseignant.id, CONCAT(a.enseignant.user.prenom, ' ', a.enseignant.user.nom), COUNT(DISTINCT a.eleve.id) " +
            "FROM Affectation a WHERE a.enseignant IS NOT NULL " +
            "GROUP BY a.enseignant.id, a.enseignant.user.prenom, a.enseignant.user.nom " +
            "ORDER BY COUNT(DISTINCT a.eleve.id) DESC")
    java.util.List<Object[]> countElevesDistinctParEnseignant();

    
    @org.springframework.data.jpa.repository.Query(
            "SELECT a.matiere.id, a.matiere.nom, COUNT(DISTINCT a.eleve.id) " +
            "FROM Affectation a " +
            "GROUP BY a.matiere.id, a.matiere.nom " +
            "ORDER BY COUNT(DISTINCT a.eleve.id) DESC")
    java.util.List<Object[]> countElevesDistinctParMatiere();
}
