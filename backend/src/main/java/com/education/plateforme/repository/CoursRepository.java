package com.education.plateforme.repository;

import com.education.plateforme.entity.Cours;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;


public interface CoursRepository extends JpaRepository<Cours, Long>, JpaSpecificationExecutor<Cours> {

    List<Cours> findByMatiereIdAndEnseignantId(Long matiereId, Long enseignantId);

    List<Cours> findByEnseignantId(Long enseignantId);

    boolean existsByMatiereId(Long matiereId);

    boolean existsByEnseignantId(Long enseignantId);
}
