package com.getstaged.controller;

import com.getstaged.domain.Offer;
import com.getstaged.domain.OfferPeriode;
import com.getstaged.exception.ResourceNotFoundException;
import com.getstaged.payload.ApiResponse;
import com.getstaged.payload.OfferPeriodeSummary;
import com.getstaged.payload.OfferResponse;
import com.getstaged.payload.PagedResponse;
import com.getstaged.repository.OfferPeriodeRepository;
import com.getstaged.security.CurrentUser;
import com.getstaged.service.OfferPeriodeService;
import com.getstaged.service.OfferService;
import com.getstaged.security.UserPrincipal;
import com.getstaged.util.Constants;
import com.getstaged.util.ModelMapper;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping("/api/offers")
public class OfferController {

    @Autowired
    private OfferService offerService;

    @Autowired
    private OfferPeriodeRepository offerPeriodeRepository;

    @Autowired
    private OfferPeriodeService offerPeriodeService;

    private static final Logger logger = LoggerFactory.getLogger(OfferController.class);

    @GetMapping
    public PagedResponse<OfferResponse> getOffers(@CurrentUser UserPrincipal currentUser,
                                                  @RequestParam(value = "page", defaultValue = Constants.DEFAULT_PAGE_NUMBER) int page,
                                                  @RequestParam(value = "size", defaultValue = Constants.DEFAULT_PAGE_SIZE) int size) {
        return offerService.getAllOffers(currentUser, page, size);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteOffer(@PathVariable Long id) {
        offerService.deleteOffer(id);
        try{
            return new ResponseEntity<>(
                    new ApiResponse(true,"Offer deleted successfully"),
                    HttpStatus.ACCEPTED
            );
        }catch (Exception e){
            return new ResponseEntity<>(new ResourceNotFoundException("Offer", "id", id), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/validOffers")
    public PagedResponse<OfferResponse> getValidOffers(@CurrentUser UserPrincipal currentUser,
                                                       @RequestParam(value = "page", defaultValue = Constants.DEFAULT_PAGE_NUMBER) int page,
                                                       @RequestParam(value = "size", defaultValue = Constants.DEFAULT_PAGE_SIZE) int size) {
        return offerService.getAllValidateOffers(currentUser, page, size);
    }

    @GetMapping("/validOffersForStudent")
    public PagedResponse<OfferResponse> getValidOffersForStudent(@CurrentUser UserPrincipal currentUser,
            @RequestParam(value = "student")long studentId,
            @RequestParam(value = "page", defaultValue = Constants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(value = "size", defaultValue = Constants.DEFAULT_PAGE_SIZE)int size){
        return offerService.getAllValidateOffersForStudent(currentUser, page, size);
    }

    @RequestMapping(value = "/validateOffer", method = RequestMethod.PUT)
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<OfferResponse> validateOffer(@CurrentUser UserPrincipal currentUser,
                                                       @RequestParam("id") Long id) {
        Offer offer = offerService.validateOffer(id);
        return new ResponseEntity<>(ModelMapper.mapOfferToOfferResponseTemp(offer), HttpStatus.OK);
    }

    @RequestMapping(value="/newPeriode", method = RequestMethod.POST)
    public ResponseEntity addPeriode(@RequestBody OfferPeriodeSummary periode){
        logger.info("adding new periode: "+periode);

        List<OfferPeriode> liste = offerPeriodeRepository.findAll();
        boolean absent = true;
        for (OfferPeriode p : liste ) {
            if(p.getAnnee() == Integer.valueOf(periode.getAnnee()) && p.getSaison().equals(periode.getSaison())){
                absent = false;
            }
        }
        if(absent) {
            offerPeriodeRepository.save(ModelMapper.mapOfferPeriodeSummaryToOfferPeriode(periode));
        }
        return ResponseEntity.ok().build();
    }

    @RequestMapping(value="/updatePeriode", method = RequestMethod.POST)
    public ResponseEntity updatePeriode(@RequestBody OfferPeriodeSummary periode){
        logger.info("updating periode: "+periode);
        List<OfferPeriode> liste = offerPeriodeRepository.findAll();

        for (OfferPeriode p : liste ) {
            if(p.getAnnee() == Integer.valueOf(periode.getAnnee()) && p.getSaison().equals(periode.getSaison())){
                p.setEstActive(periode.isEstActive());
                offerPeriodeRepository.save(p);
            }
        }
        return ResponseEntity.ok().build();
    }

    @RequestMapping(value="/Periodes/{id}",method = RequestMethod.GET)
    public ResponseEntity<OfferPeriode> getPeriode(@PathVariable Long id){
        OfferPeriode periode = offerPeriodeRepository.findById(id).get();
        return new ResponseEntity<>(periode,HttpStatus.OK);
    }

    @RequestMapping(value="/allPeriodes", method = RequestMethod.GET)
    public PagedResponse<OfferPeriode> getAllPeriodes(@CurrentUser UserPrincipal currentUser,
                    @RequestParam(value = "page", defaultValue = Constants.DEFAULT_PAGE_NUMBER) int page,
                    @RequestParam(value = "size", defaultValue = Constants.DEFAULT_PAGE_SIZE) int size){
        return offerPeriodeService.getAllOfferResponses(currentUser,page,size);
    }

    @RequestMapping(value="/allPeriodesStudent", method = RequestMethod.GET)
    public PagedResponse<OfferPeriode> getAllPeriodesForStudent(@CurrentUser UserPrincipal currentUser,
          @RequestParam(value = "student" ) long studentId,
          @RequestParam(value = "page", defaultValue = Constants.DEFAULT_PAGE_NUMBER) int page,
          @RequestParam(value = "size", defaultValue = Constants.DEFAULT_PAGE_SIZE) int size){
    return offerPeriodeService.getAllOfferResponsesForStudent(currentUser,studentId,page,size);
  }

    @RequestMapping(value="/allActivePeriodes", method = RequestMethod.GET)
    public PagedResponse<OfferPeriode> getAllActivePeriodes(@CurrentUser UserPrincipal currentUser,
        @RequestParam(value = "page", defaultValue = Constants.DEFAULT_PAGE_NUMBER) int page,
        @RequestParam(value = "size", defaultValue = Constants.DEFAULT_PAGE_SIZE) int size){

        return offerPeriodeService.getAllActiveOfferResponses(currentUser,page,size);
    }
}
