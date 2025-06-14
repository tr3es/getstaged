package com.getstaged.repository;

import com.getstaged.domain.FicheSuivie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FicheSuivieRepository  extends JpaRepository<FicheSuivie, Long> {
    FicheSuivie getByStudentId(Long id);
}
