package com.getstaged.repository;

import com.getstaged.domain.ApplicationOffer;
import com.getstaged.domain.ApplicationOfferKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ApplicationOfferRepository extends JpaRepository<ApplicationOffer, ApplicationOfferKey> {

}
