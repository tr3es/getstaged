package com.getstaged.repository;

import com.getstaged.domain.RapportStage;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RapportStageRepository extends JpaRepository<RapportStage, Long> {
    RapportStage getByStudentId(Long id);
    Optional<RapportStage> findByStudentId(Long id);
}
