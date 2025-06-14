package com.getstaged.util;

import com.getstaged.domain.*;
import com.getstaged.payload.*;

import com.getstaged.service.OfferPeriodeService;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class ModelMapper {

    public static OfferResponse mapOfferToOfferResponse(Offer offer, Entreprise creator) {
        OfferResponse offerResponse = constructBaseOfferResponse(offer);
        offerResponse.setNameEnterprise(creator.getName());

        offerResponse.setApplies(offer.getStudents()
                .stream()
                .map((student) -> {
                    return  mapApplyToApplyResponse(student,
                            getStatusApplyOffer(offer.getId(),
                                                student.getId(),
                                                offer.getApplicationOffers()), offer);
                })
                .collect(Collectors.toList()));

        UserSummary creatorSummary = new EnterpriseSummary(creator.getId(),
                creator.getCredential().getEmail(),
                creator.getDiscriminatorValue(),
                creator.getName());
        offerResponse.setCreatedBy(creatorSummary);

        return offerResponse;
    }

    private static String getStatusApplyOffer(Long offerId,
                                              Long studentId,
                                              Set<ApplicationOffer> applicationOffers) {
        return applicationOffers.stream()
                .filter(item -> item.getApplicationId().getOfferId().equals(offerId)
                        && item.getApplicationId().getStudentId().equals(studentId))
                .map(item -> item.getStatusOfferName().toString())
                .findAny().orElse(null);
    }


    public static OfferResponse mapOfferToOfferResponseTemp(Offer offer) {
        OfferResponse offerResponse = constructBaseOfferResponse(offer);
        return offerResponse;
    }

    public static OfferResponse mapEntrepriseOfferToOfferResponseEntreprise(Offer offer) {
        OfferResponse offerResponse = constructBaseOfferResponse(offer);
        offerResponse.setApplies(offer.getStudents()
                .stream()
                .filter(student -> getStatusApplyOffer(offer.getId(),
                        student.getId(),
                        offer.getApplicationOffers()).equals(StatusOffer.APPROVE.toString()))
                .map((student) -> {
                    return mapApplyEntrepriseToApplyResponse(student, offer);
                })
                .collect(Collectors.toList()));

        return offerResponse;
    }

    public static OfferPeriodeSummary mapOfferPeriodeToOfferPeriodeSummary(OfferPeriode offerPeriode){
      return new OfferPeriodeSummary(offerPeriode.getId(),offerPeriode.getSaison(),String.valueOf(offerPeriode.getAnnee()),offerPeriode.isEstActive());
    }

    public static OfferPeriode mapOfferPeriodeSummaryToOfferPeriode(OfferPeriodeSummary periode){
      return new OfferPeriode(periode.getSaison(),Integer.valueOf(periode.getAnnee()),periode.isEstActive());
    }

    public static StageResponse mapStageToStageResponse(Stage stage) {
        StageResponse stageResponse = constructBaseStageResponse(stage);
        return stageResponse;
    }

    private static CV getCvStudent(Student student, List<CV> cvs){
        return cvs.stream()
                    .filter(cv -> cv.getId()
                                    .equals(student.getId()))
                    .findAny()
                    .orElse(null);
    }

    private static OfferResponse constructBaseOfferResponse(Offer offer){
        OfferResponse offerResponse = new OfferResponse();
        offerResponse.setId(offer.getId());
        offerResponse.setDescription(offer.getDescriptionMandat());
        offerResponse.setExigences(offer.getExigences());
        offerResponse.setTitrePoste(offer.getTitrePoste());
        offerResponse.setNombrePoste(offer.getNombrePoste());
        offerResponse.setTauxHoraire(offer.getTauxHoraire());
        offerResponse.setDuree(offer.getDuree());
        offerResponse.setPeriode(ModelMapper.mapOfferPeriodeToOfferPeriodeSummary(offer.getPeriode()));
        offerResponse.setProgramme(offer.getProgramme());
        offerResponse.setValid(offer.isValid());
        offerResponse.setActive(offer.isActive());
        offerResponse.setHoraireTravail(offer.getHoraireTravail());
        return offerResponse;
    }

    private static StageResponse constructBaseStageResponse(Stage stage){
        StageResponse stageResponse = new StageResponse();
        stageResponse.setDateDebut(stage.getDateDebut());
        stageResponse.setDateFin(stage.getDateFin());
        stageResponse.setStageId(stage.getStageId());
        stageResponse.setOfferResponse(constructBaseOfferResponse(stage.getOffer()));
        stageResponse.setStudentResponse(mapStudentToStudentResponse(stage.getStudent()));
        return stageResponse;
    }

    public static StudentResponse mapStudentToStudentResponse(Student student) {
        StudentResponse studentResponse = new StudentResponse();
        studentResponse.setId(student.getId());
        studentResponse.setFirstName(student.getFirstName());
        studentResponse.setLastName(student.getLastName());
        studentResponse.setEmail(student.getCredential().getEmail());
        studentResponse.setBlocked(student.isBlocked());
        boolean isMonitored = isStudentMonitored(student);
        if (isMonitored) {
            studentResponse.setMonitorId(student.getMonitor().getCredential().getId());
            studentResponse.setMonitored(isMonitored);
        }
        return studentResponse;
    }

    private static boolean isStudentMonitored(Student student) {
        return student.getMonitor() != null;
    }

    public static StudentResponse mapStudentDetailToStudentResponse(Student student, String statusCv) {
        StudentResponse studentResponse = mapStudentToStudentResponse(student);
        studentResponse.setStatusCv(statusCv);
        studentResponse.setStaged(isStudentStaged(student));
        return studentResponse;
    }

    private static boolean isStudentStaged(Student student) {
        return student.getStage() != null;
    }

    public static ApplyResponse mapApplyToApplyResponse(Student student, String status, Offer offer) {
        ApplyResponse applyResponse = new ApplyResponse();
        applyResponse.setId(student.getId());
        applyResponse.setFirstName(student.getFirstName());
        applyResponse.setLastName(student.getLastName());
        applyResponse.setEmail(student.getCredential().getEmail());
        applyResponse.setStatus(status);
        applyResponse.setOfferId(offer.getId());
        return applyResponse;
    }

    public static ApplyResponse mapApplyEntrepriseToApplyResponse(Student student, Offer offer) {
        ApplyResponse applyResponse = new ApplyResponse();
        applyResponse.setId(student.getId());
        applyResponse.setFirstName(student.getFirstName());
        applyResponse.setLastName(student.getLastName());
        applyResponse.setEmail(student.getCredential().getEmail());
        applyResponse.setOfferId(offer.getId());
        return applyResponse;
    }

    public static SupervisorResponse mapSupervisorToSupervisorResponse(Supervisor supervisor) {
        SupervisorResponse supervisorResponse = new SupervisorResponse();
        supervisorResponse.setId(supervisor.getId());
        supervisorResponse.setFirstName(supervisor.getFirstName());
        supervisorResponse.setLastName(supervisor.getLastName());
        supervisorResponse.setEmail(supervisor.getCredential().getEmail());
        return supervisorResponse;
    }

    public static MonitorResponse mapMonitorToMonitorResponse(Monitor monitor) {
        MonitorResponse monitorResponse = new MonitorResponse();
        monitorResponse.setId(monitor.getId());
        monitorResponse.setFirstName(monitor.getFirstName());
        monitorResponse.setLastName(monitor.getLastName());
        monitorResponse.setEmail(monitor.getCredential().getEmail());
        monitorResponse.setNumberStagiaires(monitor.getStudents().size());
        monitorResponse.setBlocked(monitor.isBlocked());
        return monitorResponse;
    }

    public static EnterpriseResponse mapEnterpriseToEnterpriseResponse(Entreprise entreprise) {
        EnterpriseResponse enterpriseResponse = new EnterpriseResponse();
        enterpriseResponse.setId(entreprise.getId());
        enterpriseResponse.setFirstName(entreprise.getFirstName());
        enterpriseResponse.setLastName(entreprise.getLastName());
        enterpriseResponse.setEmail(entreprise.getCredential().getEmail());
        enterpriseResponse.setBlocked(entreprise.isBlocked());
        return enterpriseResponse;
    }

    public static NotificationResponse mapNotificationToNotificationResponse(Notification notification) {
        NotificationResponse notificationResponse = new NotificationResponse();
        notificationResponse.setId(notification.getId());
        notificationResponse.setTitle(notification.getTitle());
        notificationResponse.setMessage(notification.getMessage());
        notificationResponse.setStatusNotification(notification.getStatusNotification().toString());
        notificationResponse.setSeen(notification.isChecked());
        notificationResponse.setUserId(notification.getUser().getId());
        return notificationResponse;
    }

    public static StatusApplyResponse mapApplyStatusResponse(String status){
        StatusApplyResponse statusApplyResponse = new StatusApplyResponse();
        statusApplyResponse.setStatus(status);
        return statusApplyResponse;
    }

}
