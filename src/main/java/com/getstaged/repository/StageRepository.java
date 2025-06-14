package com.getstaged.repository;

import com.getstaged.domain.Stage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;


public interface StageRepository extends JpaRepository<Stage, Long> {
    Set<Stage> getAllByStudentId(Long id);
    Optional<Stage> findByStudentId(Long id);

    @Query(value = "SELECT * FROM stage stage join offers o on stage.offer_id = o.offer_id Where o.entrepriseid = :entrepriseId", nativeQuery = true)
    Page<Stage> findStageByEntrepriseID(@Param("entrepriseId") Long entrepriseId, Pageable pageable);

}
