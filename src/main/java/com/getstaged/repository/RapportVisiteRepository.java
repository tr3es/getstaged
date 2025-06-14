package com.getstaged.repository;

import com.getstaged.domain.RapportVisite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RapportVisiteRepository extends JpaRepository<RapportVisite, Long> {
    RapportVisite getByStudentId(Long id);
}
