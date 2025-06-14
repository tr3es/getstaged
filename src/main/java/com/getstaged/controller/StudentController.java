package com.getstaged.controller;

import com.getstaged.domain.*;
import com.getstaged.domain.ApplicationOffer;
import com.getstaged.domain.EntenteStage;
import com.getstaged.domain.Entreprise;
import com.getstaged.domain.Offer;
import com.getstaged.domain.Student;
import com.getstaged.payload.PagedResponse;
import com.getstaged.payload.StageResponse;
import com.getstaged.payload.StatusApplyResponse;
import com.getstaged.payload.StudentResponse;
import com.getstaged.repository.*;
import com.getstaged.security.CurrentUser;
import com.getstaged.service.DBFileStorageService;
import com.getstaged.service.StudentService;
import com.getstaged.security.UserPrincipal;
import com.getstaged.service.UserService;
import com.getstaged.service.mail.EmailService;
import com.getstaged.util.Constants;
import com.getstaged.util.ModelMapper;
import com.google.common.net.HttpHeaders;
import com.sun.org.apache.xpath.internal.operations.Mod;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.core.io.Resource;

import javax.validation.Valid;
import java.io.IOException;
import java.net.URI;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@CrossOrigin
@RestController
@RequestMapping("/api/students")
public class StudentController {

    private static final Logger logger = LoggerFactory.getLogger(StudentController.class);

    @Autowired
    private StudentService studentService;

    @Autowired
    private OfferRepository offerRepository;

    @Autowired
    private ApplicationOfferRepository applicationOfferRep;

    @Autowired
    private EntrepriseRepository entrepriseRepository;

    @Autowired
    private DBFileStorageService dbFileStorageService;

    @Autowired
    private UserService userService;

    @Autowired
    private EntenteStageRepository ententeStageRepository;

    @Autowired
    private StageRepository stageRepository;

    @Autowired
    private RapportStageRepository rapportStageRepository;

    @RequestMapping(value = "/students/{id}", method = RequestMethod.DELETE)
    public void deleteStudent(@PathVariable long id) {
        studentService.deleteStudent(id);
    }

    @RequestMapping(value = "/students/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Object> updateStudent(@RequestBody Student student, @PathVariable long id) {

        Student studentOptional = studentService.findStudent(id);

        if (studentOptional == null)
            return ResponseEntity.notFound().build();

        student.setId(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public PagedResponse<StudentResponse> getStudents(@CurrentUser UserPrincipal currentUser,
                                                      @RequestParam(value = "page", defaultValue = Constants.DEFAULT_PAGE_NUMBER) int page,
                                                      @RequestParam(value = "size", defaultValue = Constants.DEFAULT_PAGE_SIZE) int size) {
        return studentService.getAllStudents(currentUser, page, size);
    }

    @RequestMapping(value = "/assignMonitor", method = RequestMethod.PUT)
    public ResponseEntity<StudentResponse> assignMonitorToStudent(@RequestParam("monitorId") Long monitorId,
                                                                  @RequestParam("studentId") Long studentId) {
        Student student = studentService.assignMonitorToStudent(monitorId, studentId);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath().path("/Home")
                .buildAndExpand().toUri();

        return ResponseEntity.ok()
                .body(ModelMapper.mapStudentToStudentResponse(student));
    }

    @RequestMapping(value = "/applyOffer", method = RequestMethod.PUT)
    public ResponseEntity<?> applyOnOffer(@RequestParam("offerId") Long offerId,
                                          @RequestParam("studentId") Long studentId) {
        Student student = studentService.applyOnOffer(offerId, studentId);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath().path("/Home")
                .buildAndExpand().toUri();

        return ResponseEntity.ok()
                .body(ModelMapper.mapStudentToStudentResponse(student));
    }

    @GetMapping("/mesOffres/{id}")
    public Set<ApplicationOffer> getMesOffres(@CurrentUser @PathVariable long id) {
        Set<ApplicationOffer> offers = new HashSet<>();
        for (ApplicationOffer appOffer : applicationOfferRep.findAll()) {
            if (appOffer.getApplicationId().getStudentId() == id) {
                appOffer.setEntrepriseNom(entrepriseRepository.getEntrepriseById(offerRepository.getById(appOffer.getOffer().getId()).getEntrepriseID()).getName());
                offers.add(appOffer);
            }
        }
        return offers;
    }

    @PostMapping("periodeAvailable/{id}/{studentId}")
    public ResponseEntity setPeriodeAvailable(@PathVariable long id, @PathVariable long studentId){
        logger.info("Mark periode available: periode id: "+id+" user id: "+studentId);
        studentService.markPeriodeAvailable(id,studentId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("periodeUnvailable/{id}/{studentId}")
    public ResponseEntity setPeriodeUnAvailable(@PathVariable long id, @PathVariable long studentId){
        logger.info("Mark periode unavailable: periode id: "+id+" user id: "+studentId);
        studentService.markPeriodeUnavailable(id,studentId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("isStudentPeriodeAvailable/{id}/{studentId}")
    public ResponseEntity<Boolean> isStudentPeriodeAvailable(@PathVariable long id, @PathVariable long studentId){
        return  new ResponseEntity<>(studentService.isStudentPeriodeAvailable(id,studentId),HttpStatus.OK);
    }

    @PutMapping("/mesOffres")
    ResponseEntity<?> updateOffer(@Valid @RequestBody ApplicationOffer offer) {
        offer.setOffer(offerRepository.getById(offer.getApplicationId().getOfferId()));
        applicationOfferRep.save(offer);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/mesOffres/{id}")
    public ResponseEntity<?> deleteCV(@PathVariable Long id) {
        logger.info("Request to delete group: {}", id);
        offerRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/checkStudentCvUpload")
    public ResponseEntity<StatusApplyResponse> checkStudentCvUpload(@RequestParam("studentId") Long studentId) {
        String statusCvUpload = studentService.checkStudentCvStatus(studentId);
        StatusApplyResponse statusApplyResponse = ModelMapper.mapApplyStatusResponse(statusCvUpload);
        return new ResponseEntity<>(statusApplyResponse, HttpStatus.OK);
    }

    @PostMapping("/ententeStage/{email}")
    public ResponseEntity<?> handleEntenteUpload(@RequestParam("file") MultipartFile file, @PathVariable String email) throws IOException {

        Student student = studentService.findStudent(userService.getUserByEmail(email).getId());

        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        String downloadUri = ServletUriComponentsBuilder.fromCurrentContextPath().path("api/students/ententeStage/" + student.getId()).toUriString();

        EntenteStage ententeStage = new EntenteStage(student, fileName, file.getContentType(), file.getBytes(), downloadUri);

        if (ententeStageRepository.findByStudentId(student.getId()).isPresent()) {
            EntenteStage temp = ententeStageRepository.getByStudentId(student.getId());
            temp.setFile_name(ententeStage.getFile_name());
            temp.setFile_type(ententeStage.getFile_type());
            temp.setFile_data(ententeStage.getFile_data());
            temp.setDownload_uri(ententeStage.getDownload_uri());
            ententeStageRepository.save(temp);
        } else {
            ententeStageRepository.save(ententeStage);
        }

        return ResponseEntity.ok().build();
    }

    @PostMapping("/rapportStage/{email}")
    public ResponseEntity<?> handleRapportUpload(@RequestParam("file") MultipartFile file, @PathVariable String email) throws IOException {

        Student student = studentService.findStudent(userService.getUserByEmail(email).getId());
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        String downloadUri = ServletUriComponentsBuilder.fromCurrentContextPath().path("api/students/rapportStage/download/"+ student.getId()).toUriString();
        RapportStage rapportStage = new RapportStage(student,fileName,file.getContentType(),file.getBytes(),downloadUri);

        if(rapportStageRepository.findByStudentId(student.getId()).isPresent()){
          RapportStage temp = rapportStageRepository.getByStudentId(student.getId());
          temp.setFile_name(rapportStage.getFile_name());
          temp.setFile_type(rapportStage.getFile_type());
          temp.setFile_data(rapportStage.getFile_data());
          temp.setDownload_uri(rapportStage.getDownload_uri());
          rapportStageRepository.save(temp);
        }else{
          rapportStageRepository.save(rapportStage);
        }

        return ResponseEntity.ok().build();
    }

    @GetMapping("/ententeStage/{id}")
    public ResponseEntity<Resource> handleEntenteDownload(@PathVariable Long id) {
        EntenteStage ententeStage = dbFileStorageService.getEntente(id);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(ententeStage.getFile_type()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + ententeStage.getFile_name() + "\"")
                .body(new ByteArrayResource(ententeStage.getFile_data()));
    }

    @GetMapping("/rapportStage/download/{id}")
    public ResponseEntity<Resource> handleRapportDownload(@PathVariable Long id){
        RapportStage rapportStage = dbFileStorageService.getRapport(id).orElse(null);
        if(null == rapportStage){
          return ResponseEntity.ok().build();
        }
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(rapportStage.getFile_type()))
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + rapportStage.getFile_name() + "\"")
            .body(new ByteArrayResource(rapportStage.getFile_data()));
    }

    @GetMapping("/rapport/{id}")
    ResponseEntity<?> getCV(@PathVariable Long id) {
      Optional<RapportStage> rapportStage = rapportStageRepository.findByStudentId(id);
      return rapportStage.map(response -> ResponseEntity.ok().body(response)).orElse(new ResponseEntity<>(HttpStatus.CONTINUE));
    }

    @GetMapping("/acceptedEmail")
    public ResponseEntity<?> sendEmailForAcceptanceNotification(
            @RequestParam(value="student")Long studentID, @RequestParam(value="offer") Long offerID){
        logger.info("Envoi de email pour l'etudiant: "+ studentID +" et l'offre: "+offerID);
        Student student = studentService.getStudent(studentID);
        Offer offer = offerRepository.getById(offerID);
        Entreprise entreprise = entrepriseRepository.getEntrepriseById(offer.getEntrepriseID());
        new EmailService().sendNotif(student,offer, entreprise);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/ententeSigneeEmail")
    public ResponseEntity<?> sendEmailWithEntente(@RequestParam(value="student") Long studentID){
        logger.info("Envoi de email pour l'entende de l'etudiant: "+ studentID );
        Stage stage = stageRepository.findByStudentId(studentID).get();
        Student student = stage.getStudent();
        Offer offer = stage.getOffer();
        Entreprise entreprise = entrepriseRepository.getEntrepriseById(offer.getEntrepriseID());
        EntenteStage ententeStage = ententeStageRepository.getByStudentId(studentID);
        ententeStage.setConfirmed_student(true);
        ententeStageRepository.save(ententeStage);
        new EmailService().sendNotifEntente(student,offer,entreprise,ententeStage);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/ententeStage/get/{id}")
    ResponseEntity<?> getEntente(@PathVariable Long id) {
        Optional<EntenteStage> ententeStage = ententeStageRepository.findByStudentId(id);
        return ententeStage.map(response -> ResponseEntity.ok().body(response)).orElse(new ResponseEntity<>(HttpStatus.CONTINUE));
    }

    @PostMapping("/stage")
    public ResponseEntity<Stage> createStage(@RequestParam("studentId") Long studentId, @RequestParam("offerId") Long offerId, @RequestBody Stage stage) {
        logger.info("Sauvegarde d'un nouveau stage --> Student: " + studentId + ", Offer: " + offerId + "," +
                " Start: " + stage.getDateDebut() + ", End: " + stage.getDateFin());
        if(stageRepository.getAllByStudentId(studentId).size() < 2){
            Stage temp = new Stage();
            Student student = studentService.findStudent(studentId);
            temp.setStudent(student);
            temp.setOffer(offerRepository.getById(offerId));
            temp.setDateDebut(stage.getDateDebut());
            temp.setDateFin(stage.getDateFin());
            student.setStage(temp);
            stageRepository.save(temp);
            studentService.saveStudent(student);
            return ResponseEntity.ok(temp);
        }
        return new ResponseEntity<>(HttpStatus.CONTINUE);
    }

    @GetMapping("/stage/get/{id}")
    ResponseEntity<StageResponse> getStage(@PathVariable Long id) {
        try {
          Stage stage = stageRepository.findByStudentId(id).get();
          System.out.println("###"+stage.toString());
          StageResponse stageResponse = ModelMapper.mapStageToStageResponse(stage);
          return  new ResponseEntity<>(stageResponse, HttpStatus.OK);
        }catch (Exception e){
          return  ResponseEntity.ok().build();
        }
    }


}
