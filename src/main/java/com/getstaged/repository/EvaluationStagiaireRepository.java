package com.getstaged.repository;

import com.getstaged.domain.EvaluationStagiaire;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EvaluationStagiaireRepository extends JpaRepository<EvaluationStagiaire, Long> {
  EvaluationStagiaire getById(int id);
}
