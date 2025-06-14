package com.getstaged.service;

import com.getstaged.domain.OfferPeriode;
import com.getstaged.payload.PagedResponse;
import com.getstaged.repository.OfferPeriodeRepository;
import com.getstaged.security.UserPrincipal;
import com.getstaged.util.ServiceHelpers;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class OfferPeriodeService {

  @Autowired
  private OfferPeriodeRepository offerPeriodeRepository;

  public OfferPeriode findById(Long id){
    return offerPeriodeRepository.findById(id).get();
  }

  public List<OfferPeriode> findAll(){return offerPeriodeRepository.findAll();}

  public PagedResponse<OfferPeriode> getAllOfferResponses(UserPrincipal userPrincipal, int page, int size) {
    ServiceHelpers.validatePageNumberAndSize(page, size);
    Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "id");
    Page<OfferPeriode> periodes = offerPeriodeRepository.findAll(pageable);

    if (periodes.getNumberOfElements() == 0) {
      return new PagedResponse<>(Collections.emptyList(), periodes.getNumber(),
          periodes.getSize(), periodes.getTotalElements(), periodes.getTotalPages(),
          periodes.isLast());
    }
    List<OfferPeriode> offerPeriodes = periodes.stream()
        .collect(Collectors.toList());
    return new PagedResponse<>(offerPeriodes,periodes.getNumber(),
        periodes.getSize(), periodes.getTotalElements(), periodes.getTotalPages(),periodes.isLast());
  }

  public PagedResponse<OfferPeriode> getAllOfferResponsesForStudent(UserPrincipal userPrincipal,long studentId, int page, int size){
    ServiceHelpers.validatePageNumberAndSize(page, size);
    Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "offreperiode_id");
    Page<OfferPeriode> periodes = offerPeriodeRepository.findAllActivePeriodesForStudent(pageable,studentId);

    if (periodes.getNumberOfElements() == 0) {
      return new PagedResponse<>(Collections.emptyList(), periodes.getNumber(),
          periodes.getSize(), periodes.getTotalElements(), periodes.getTotalPages(),
          periodes.isLast());
    }

    List<OfferPeriode> offerPeriodes = periodes.stream()
        .collect(Collectors.toList());
    return new PagedResponse<>(offerPeriodes,periodes.getNumber(),
        periodes.getSize(), periodes.getTotalElements(), periodes.getTotalPages(),periodes.isLast());
  }

  public PagedResponse<OfferPeriode> getAllActiveOfferResponses(UserPrincipal userPrincipal, int page, int size){
    ServiceHelpers.validatePageNumberAndSize(page, size);
    Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "offreperiode_id");
    Page<OfferPeriode> periodes = offerPeriodeRepository.findAllActivePeriodes(pageable);

    if (periodes.getNumberOfElements() == 0) {
      return new PagedResponse<>(Collections.emptyList(), periodes.getNumber(),
          periodes.getSize(), periodes.getTotalElements(), periodes.getTotalPages(),
          periodes.isLast());
    }

    List<OfferPeriode> offerPeriodes = periodes.stream()
        .collect(Collectors.toList());
    return new PagedResponse<>(offerPeriodes,periodes.getNumber(),
        periodes.getSize(), periodes.getTotalElements(), periodes.getTotalPages(),periodes.isLast());
  }
}
