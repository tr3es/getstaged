package com.getstaged.repository;

import com.getstaged.domain.Offer;
import com.getstaged.domain.OfferPeriode;
import java.util.Set;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OfferPeriodeRepository extends JpaRepository<OfferPeriode, Long> {
  OfferPeriode save(OfferPeriode offerPeriode);

  @Query(value = "SELECT * FROM offer_periode periode WHERE periode.est_active = true ", nativeQuery = true)
  Page<OfferPeriode> findAllActivePeriodes(Pageable pageable);

  @Query(value = "SELECT * FROM offer_periode periode JOIN students_periodes periode2 on "
      + "periode.offreperiode_id = periode2.offreperiode_id WHERE periode.est_active = true AND periode2.user_id =:studentId", nativeQuery = true)
  Page<OfferPeriode> findAllActivePeriodesForStudent(Pageable pageable, @Param("studentId")long studentId);

  @Query(value = "SELECT * FROM offer_periode periode JOIN students_periodes periode2 on "
      + "periode.offreperiode_id = periode2.offreperiode_id WHERE periode.est_active = true AND periode2.user_id =:studentId", nativeQuery = true)
  Set<OfferPeriode> findAllPeriodesForStudent( @Param("studentId")long studentId);
}
