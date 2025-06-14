package com.getstaged.repository;

import com.getstaged.domain.Entreprise;
import com.getstaged.payload.EntrepriseSummary;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public interface EntrepriseRepository extends JpaRepository<Entreprise, Long> {

  Entreprise getEntrepriseById(long id);

  Optional<Entreprise> findById(long id);

  List<Entreprise> findByIdIn(List<Long> ids);
}
