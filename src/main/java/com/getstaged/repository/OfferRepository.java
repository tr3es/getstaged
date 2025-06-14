package com.getstaged.repository;

import com.getstaged.domain.Offer;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OfferRepository extends JpaRepository<Offer, Long>{

    //List<Offer> findByPositionIgnoreCaseContainingOrderByPosition(String position);

    List<Offer> getAllByEntrepriseID(int entrepriseID);
    List<Offer> getAllByEntrepriseID(Long id);

    Offer getById(Long id);

    Offer save(Offer offer);

    List<Offer> findByTitrePosteIgnoreCaseContainingOrderByTitrePoste(String titrePoste);

    @Query(value = "SELECT * FROM offers offer WHERE offer.entrepriseid = :entrepriseId", nativeQuery = true)
    Page<Offer> findOfferByEntrepriseID(@Param("entrepriseId") Long entrepriseId, Pageable pageable);

}
