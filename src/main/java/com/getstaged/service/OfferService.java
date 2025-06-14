package com.getstaged.service;

import com.getstaged.domain.Entreprise;
import com.getstaged.domain.Offer;
import com.getstaged.domain.OfferPeriode;
import com.getstaged.domain.Student;
import com.getstaged.domain.User;
import com.getstaged.payload.OfferRequestSummary;
import com.getstaged.payload.OfferSummary;
import com.getstaged.payload.OfferResponse;
import com.getstaged.payload.PagedResponse;
import com.getstaged.repository.EntrepriseRepository;
import com.getstaged.repository.OfferPeriodeRepository;
import com.getstaged.repository.OfferRepository;
import com.getstaged.repository.UserRepository;
import com.getstaged.security.UserPrincipal;
import com.getstaged.util.ModelMapper;
import com.getstaged.util.ServiceHelpers;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public class OfferService {

    private final static String PROPRETY_SORT_ENTREPRISE_ID = "entrepriseID";

    @Autowired
    private OfferRepository offerRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EntrepriseRepository entrepriseRepository;

    @Autowired
    private StudentService studentService;

    @Autowired
    private OfferPeriodeService offerPeriodeService;

    @Autowired
    private OfferPeriodeRepository offerPeriodeRepository;

    public Offer saveOffer(Offer offer) {
        return offerRepository.save(offer);
    }

    public List<Offer> findAll() {
        return offerRepository.findAll();
    }

    public List<Offer> findByPositionIgnoreCaseContainingOrderByTitrePoste(String titrePoste) {
        return offerRepository.findByTitrePosteIgnoreCaseContainingOrderByTitrePoste(titrePoste);
    }

    public Offer convertToEntrepriseOffer(OfferSummary offer, String username, OfferPeriode periode) {
      return new Offer(offer, username);
    }

    public Offer convertOfferRequestToEntrepriseOffer(OfferRequestSummary offer, String username, OfferPeriode periode) {
        return new Offer(offer, periode, username);
    }

    public void deleteOffer(Long id) {
        offerRepository.deleteById(id);
    }


    public PagedResponse<OfferResponse> getAllOffers(UserPrincipal currentUser, int page, int size) {
        Page<Offer> offers = ServiceHelpers.getOffersPageable(PROPRETY_SORT_ENTREPRISE_ID, page, size, offerRepository);

        if (offers.getNumberOfElements() == 0)
            return new PagedResponse<>(Collections.emptyList(), offers.getNumber(),
                    offers.getSize(), offers.getTotalElements(), offers.getTotalPages(), offers.isLast());

        Map<Long, Entreprise> creatorMap = getOfferCreatorMap(offers.getContent());

        List<OfferResponse> offerResponses = offers.stream()
                //.filter(offer -> !offer.isValid())
                .map((offer) -> {
                    return ModelMapper.mapOfferToOfferResponse(offer,
                            creatorMap.get(offer.getEntrepriseID()));
                }).collect(Collectors.toList());
        return new PagedResponse<>(offerResponses, offers.getNumber(), offers.getSize(), offers.getTotalElements(), offers.getTotalPages(), offers.isLast());
    }

    public PagedResponse<OfferResponse> getAllValidateOffers(UserPrincipal currentUser, int page, int size) {
        Page<Offer> offers = ServiceHelpers.getOffersPageable(PROPRETY_SORT_ENTREPRISE_ID, page, size, offerRepository);

        if (offers.getNumberOfElements() == 0)
            return new PagedResponse<>(Collections.emptyList(), offers.getNumber(),
                    offers.getSize(), offers.getTotalElements(), offers.getTotalPages(), offers.isLast());

        Map<Long, Entreprise> creatorMap = getOfferCreatorMap(offers.getContent());
        Student student = studentService.findStudent(currentUser.getId());
        Set<Offer> studentApplies = student.getOffers();

        List<OfferResponse> offerResponses = offers.stream()
                .filter(Offer::isValid)
                .filter(offer -> !findStudentApplyOnOffer(offer, studentApplies))
                .map((offer) -> {
                    return ModelMapper.mapOfferToOfferResponse(offer,
                            creatorMap.get(offer.getEntrepriseID()));
                }).collect(Collectors.toList());
        return new PagedResponse<>(offerResponses, offers.getNumber(), offers.getSize(), offers.getTotalElements(),
                offers.getTotalPages(), offers.isLast());
    }

    public PagedResponse<OfferResponse> getAllValidateOffersForStudent(UserPrincipal currentUser, int page, int size) {
        Page<Offer> offers = ServiceHelpers.getOffersPageable(PROPRETY_SORT_ENTREPRISE_ID, page, size, offerRepository);
        if (offers.getNumberOfElements() == 0)
            return new PagedResponse<>(Collections.emptyList(), offers.getNumber(),
                offers.getSize(), offers.getTotalElements(), offers.getTotalPages(), offers.isLast());

        Map<Long, Entreprise> creatorMap = getOfferCreatorMap(offers.getContent());
        Student student = studentService.findStudent(currentUser.getId());
        Set<Offer> studentApplies = student.getOffers();
        Set<OfferPeriode> periodes = offerPeriodeRepository.findAllPeriodesForStudent(student.getId());

        List<OfferResponse> offerResponses = offers.stream()
            .filter(Offer::isValid)
            .filter(offer -> offerAppliesToStudentPeriode(offer,student ))
            .filter(offer -> !findStudentApplyOnOffer(offer, studentApplies))
            .map((offer) -> {
                return ModelMapper.mapOfferToOfferResponse(offer,
                    creatorMap.get(offer.getEntrepriseID()));
            }).collect(Collectors.toList());

        return new PagedResponse<>(offerResponses, offers.getNumber(), offers.getSize(), offers.getTotalElements(),
            offers.getTotalPages(), offers.isLast());
    }

    private Map<Long, Entreprise> getOfferCreatorMap(List<Offer> offers) {

        List<Long> creatorIds = offers.stream()
                .map(Offer::getEntrepriseID)
                .distinct()
                .collect(Collectors.toList());

        List<Entreprise> creators = entrepriseRepository.findByIdIn(creatorIds);
        Map<Long, Entreprise> creatorMap = creators.stream()
                .collect(Collectors.toMap(User::getId, Function.identity()));

        return creatorMap;
    }

    private boolean findStudentApplyOnOffer(Offer offer, Set<Offer> offers) {
        return offers.stream().anyMatch(item -> item.getId().equals(offer.getId()));
    }

    private boolean offerAppliesToStudentPeriode(Offer offer, Student student ){
        Set<OfferPeriode> periodes = offerPeriodeRepository.findAllPeriodesForStudent(student.getId());
        return periodes.stream().anyMatch(p -> offer.getPeriode().equals(p));
    }

    public Offer validateOffer(Long id) {
        Offer offer = offerRepository.getById(id);
        offer.setValid(true);
        offerRepository.save(offer);
        return offer;
    }

    public Offer findOffer(Long offerId){
      return offerRepository.getOne(offerId);
    }
}
