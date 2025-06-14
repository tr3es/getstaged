package com.getstaged.repository;


import com.getstaged.domain.EntenteStage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EntenteStageRepository extends JpaRepository<EntenteStage, Long> {
    EntenteStage getByStudentId(Long id);
    Optional<EntenteStage> findByStudentId(Long id);
}
