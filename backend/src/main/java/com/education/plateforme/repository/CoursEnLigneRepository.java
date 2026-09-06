package com.education.plateforme.repository;

import com.education.plateforme.entity.CoursEnLigne;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CoursEnLigneRepository extends JpaRepository<CoursEnLigne, Long> {

    List<CoursEnLigne> findByEnseignantIdOrderByDateCoursAscHeureDebutAsc(Long enseignantId);

    List<CoursEnLigne> findByMatiereIdAndEnseignantIdOrderByDateCoursAscHeureDebutAsc(Long matiereId, Long enseignantId);

    List<CoursEnLigne> findAllByOrderByDateCoursDescHeureDebutDesc();

    
    @Query("SELECT DISTINCT c FROM CoursEnLigne c JOIN FETCH c.enseignant e JOIN FETCH e.user JOIN FETCH c.matiere LEFT JOIN FETCH c.elevesCibles WHERE c.id = :id")
    Optional<CoursEnLigne> findByIdWithDetails(@Param("id") Long id);
}
