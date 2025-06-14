package com.getstaged.service;

import com.getstaged.domain.Entreprise;
import com.getstaged.domain.Offer;
import com.getstaged.domain.Stage;
import com.getstaged.payload.OfferResponse;
import com.getstaged.payload.PagedResponse;
import com.getstaged.payload.StageResponse;
import com.getstaged.repository.EntrepriseRepository;
import com.getstaged.repository.OfferRepository;
import com.getstaged.repository.StageRepository;
import com.getstaged.security.UserPrincipal;
import com.getstaged.util.ModelMapper;
import com.getstaged.util.ServiceHelpers;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EntrepriseService {

    @Autowired
    private EntrepriseRepository entrepriseRepository;

    @Autowired
    private OfferRepository offerRepository;

    @Autowired
    private StageRepository stageRepository;

    public PagedResponse<OfferResponse> getAllEntrepriseOffers(UserPrincipal currentUser, int page, int size) {
        ServiceHelpers.validatePageNumberAndSize(page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "entrepriseID");
        try {
            Page<Offer> entrepriseOffers = offerRepository
                .findOfferByEntrepriseID(currentUser.getId(), pageable);

            if (entrepriseOffers.getNumberOfElements() == 0)
                return new PagedResponse<>(Collections.emptyList(), entrepriseOffers.getNumber(),
                    entrepriseOffers.getSize(), entrepriseOffers.getTotalElements(),
                    entrepriseOffers.getTotalPages(), entrepriseOffers.isLast());

            List<OfferResponse> offerResponses = entrepriseOffers.stream()
                .map(ModelMapper::mapEntrepriseOfferToOfferResponseEntreprise)
                .collect(Collectors.toList());
            return new PagedResponse<>(offerResponses, entrepriseOffers.getNumber(),
                entrepriseOffers.getSize(),
                entrepriseOffers.getTotalElements(), entrepriseOffers.getTotalPages(),
                entrepriseOffers.isLast());
        }catch (Exception e){
            return null;
        }
    }

    public PagedResponse<StageResponse> getAllEntrepriseStages(UserPrincipal currentUser, int page, int size){
        ServiceHelpers.validatePageNumberAndSize(page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "student_id");
        try {
            Page<Stage> entrepriseStages = stageRepository
                .findStageByEntrepriseID(currentUser.getId(), pageable);

            if (entrepriseStages.getNumberOfElements() == 0)
                return new PagedResponse<>(Collections.emptyList(), entrepriseStages.getNumber(),
                    entrepriseStages.getSize(), entrepriseStages.getTotalElements(),
                    entrepriseStages.getTotalPages(), entrepriseStages.isLast());

            List<StageResponse> stageResponses = entrepriseStages.stream()
                .map(ModelMapper::mapStageToStageResponse).collect(Collectors.toList());
            return new PagedResponse<>(stageResponses, entrepriseStages.getNumber(),
                entrepriseStages.getSize(),
                entrepriseStages.getTotalElements(), entrepriseStages.getTotalPages(),
                entrepriseStages.isLast());
        }catch(Exception e){
            return null;
        }
    }

    public Entreprise findEntreprise(Long entrepriseId){
      Optional ent = entrepriseRepository.findById(entrepriseId);
        return (Entreprise) ent.get();
    }
}
