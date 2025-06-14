package com.getstaged.controller;

import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

import com.getstaged.domain.EntenteStage;
import com.getstaged.domain.Entreprise;
import com.getstaged.domain.EvaluationStagiaire;
import com.getstaged.domain.OfferPeriode;
import com.getstaged.domain.Stage;
import com.getstaged.domain.Student;
import com.getstaged.payload.EvaluationStagiaireSummary;
import com.getstaged.domain.Offer;
import com.getstaged.payload.OfferRequestSummary;
import com.getstaged.payload.OfferResponse;
import com.getstaged.payload.PagedResponse;
import com.getstaged.payload.StageResponse;
import com.getstaged.pdf.EvalPDFService;
import com.getstaged.repository.EntenteStageRepository;
import com.getstaged.repository.EntrepriseRepository;
import com.getstaged.repository.EvaluationStagiaireRepository;
import com.getstaged.repository.OfferPeriodeRepository;
import com.getstaged.repository.StageRepository;
import com.getstaged.security.CurrentUser;
import com.getstaged.service.EntrepriseService;
import com.getstaged.service.EvaluationStagiaireService;
import com.getstaged.repository.OfferRepository;
import com.getstaged.service.OfferService;
import com.getstaged.security.UserPrincipal;
import com.getstaged.service.StudentService;
import com.getstaged.service.mail.EmailService;
import com.getstaged.util.Constants;
import com.getstaged.util.ModelMapper;
import com.itextpdf.text.DocumentException;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class EntrepriseController {

    @Autowired
    private EntrepriseRepository entrepriseRepository;

    @Autowired
    private OfferRepository offerRepository;

    @Autowired
    private EvaluationStagiaireRepository evaluationStagiaireRepository;

    @Autowired
    private EntrepriseService entrepriseService;

    @Autowired
    private EntenteStageRepository ententeStageRepository;

    @Autowired
    private StudentService studentService;

    @Autowired
    private StageRepository stageRepository;

    @Autowired
    private OfferPeriodeRepository offerPeriodeRepository;

    private static final Logger logger = LoggerFactory.getLogger(EntrepriseController.class);

    @RequestMapping(value = "/profil", method = GET)
    public ResponseEntity getCurrentEntreprise(@RequestParam(value = "id") int id) {
        logger.info("Requete d'acces au profil de l'entreprise: " + id);
        return new ResponseEntity(entrepriseRepository.getEntrepriseById(id), HttpStatus.OK);
    }
    @GetMapping("/entreprise")
    public String getEntreprise(@RequestParam(value = "id") int id) {
        logger.info("Requete d'acces au profil de l'entreprise: " + id);
        try {
            return entrepriseRepository.getEntrepriseById(id).getName();
        }catch(Exception e){
            return null;
        }
    }
    @RequestMapping("/offres")
    public ResponseEntity getOfferList(@RequestParam(value = "id") int id) {
        logger.info("Requete d'acces a la page de liste des offres de l'entreprise possedant le id: " + id);
        return new ResponseEntity(offerRepository.getAllByEntrepriseID(new Long(id)), HttpStatus.OK);
    }

    @RequestMapping(value = "/entreprises/offres/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteOffer(@PathVariable Long id) {
        entrepriseRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping(value = "/entreprises/offers")
    public PagedResponse<OfferResponse> getEntrepriseOffers(@CurrentUser UserPrincipal currentUser,
                                                            @RequestParam(value = "page", defaultValue = Constants.DEFAULT_PAGE_NUMBER) int page,
                                                            @RequestParam(value = "size", defaultValue = Constants.DEFAULT_PAGE_SIZE) int size) {

        return entrepriseService.getAllEntrepriseOffers(currentUser, page, size);
    }

    @GetMapping(value = "/entreprise/stages")
    public PagedResponse<StageResponse> getEntrepriseStages(@CurrentUser UserPrincipal currentUser,
                                                            @RequestParam(value = "page", defaultValue = Constants.DEFAULT_PAGE_NUMBER) int page,
                                                            @RequestParam(value = "size", defaultValue = Constants.DEFAULT_PAGE_SIZE) int size) {
        return entrepriseService.getAllEntrepriseStages(currentUser, page, size);
    }

    /*@GetMapping("/entreprise/ententeStage/get/{id}")
    ResponseEntity<?> getEntente(@PathVariable Long id) {
        Optional<EntenteStage> ententeStage = ententeStageRepository.findByStudentId(id);
        return ententeStage.map(response -> ResponseEntity.ok().body(response)).orElse(new ResponseEntity<>(HttpStatus.CONTINUE));
    }*/

    @PostMapping("/entreprise/ententeStage/{idStudent}")
    public ResponseEntity<?> handleEntenteUpload(@RequestParam("file") MultipartFile file, @PathVariable Long idStudent) throws IOException {
    try{
        Student student = studentService.findStudent(idStudent);
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        String downloadUri = ServletUriComponentsBuilder
            .fromCurrentContextPath().path("api/students/ententeStage/" + student.getId())
            .toUriString();

        EntenteStage ententeStage = new EntenteStage(student, fileName, file.getContentType(),
            file.getBytes(), downloadUri);

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
    }catch(Exception e){}
        return ResponseEntity.ok().build();
    }

    @GetMapping("/entreprise/ententeSigneeEmail")
    public ResponseEntity<?> sendEmailWithEntente(@RequestParam(value = "student") Long studentID) {
        try {
            logger.info("Envoi de email pour l'entende de l'etudiant: " + studentID);
            Stage stage = stageRepository.findByStudentId(studentID).get();
            Student student = stage.getStudent();
            Offer offer = stage.getOffer();
            Entreprise entreprise = entrepriseRepository.getEntrepriseById(offer.getEntrepriseID());
            EntenteStage ententeStage = ententeStageRepository.getByStudentId(studentID);
            ententeStage.setConfirmed_entreprise(true);
            ententeStageRepository.save(ententeStage);
            new EmailService().sendNotifEntente(student, offer, entreprise, ententeStage);
            return ResponseEntity.ok().build();
        }catch (Exception e){
            return null;
        }
    }

    @RequestMapping(value = "/VotreEntreprise/Offre/{offre_id}", method = GET)
    @ResponseBody
    public ResponseEntity getOfferDetail(@PathVariable(name = "offre_id", value = "offre_id") Long id) {
        logger.info("Requete d'acces a la page de detail de l'offre possedant le id: " + id);
        Offer offre = offerRepository.getById(id);
        Entreprise entreprise = entrepriseRepository.getEntrepriseById(offre.getEntrepriseID());
        OfferResponse reponse = ModelMapper.mapOfferToOfferResponse(offre,entreprise );
        return new ResponseEntity(reponse, HttpStatus.OK);
    }

    @PostMapping("/VotreEntreprise")
    public ResponseEntity<Offer> createOffer( @RequestBody OfferRequestSummary offer) {
        try{
        logger.info("Sauvegarde d'une nouvelle offre de stage!: \n" + offer);
        OfferPeriode periode = offerPeriodeRepository.findById(offer.getPeriode()).get();
        Offer offer1 = offerRepository.save(new OfferService().convertOfferRequestToEntrepriseOffer(offer, "current",periode));
        return ResponseEntity.ok(offer1);
        }catch (Exception e){
            return null;
        }
    }

    @PostMapping("/VotreEntreprise/EvaluationStagiaire")
    public ResponseEntity<EvaluationStagiaire> createEvaluationStagiaire(@RequestBody EvaluationStagiaireSummary eval) {
        try{
        logger.info("Sauvegarde d'une nouvelle évaluation de stagiaire!");
        EvaluationStagiaire savedEval = evaluationStagiaireRepository.save(new EvaluationStagiaireService().convertToEvaluationStagiaire(eval));
        return ResponseEntity.ok(savedEval);
        }catch (Exception e){
            return null;
        }
    }

    @RequestMapping(value = "/EvaluationStagiaire/{id}", method = GET)
    @ResponseBody
    public ResponseEntity getEvaluationDetail(@PathVariable("id") int id) {
        logger.info("Requete d'acces a la page de detail de l'evaluation possedant le id: " + id);
        return new ResponseEntity(evaluationStagiaireRepository.getById(id), HttpStatus.OK);
    }

    @RequestMapping(value = "/createEval/{eval_id}", method = POST)
    @ResponseBody
    public ResponseEntity createPDFFromHTML(@PathVariable("eval_id") int eval_id, @RequestBody String html) throws IOException, DocumentException {
        try{
            logger.info("Reponse PDF: HTML");
            System.out.println(html);
            html = html.replace("\"", "");
            new EvalPDFService().genererDocumentFromHTML("./PDF/PDF" + eval_id + ".pdf", html);
            File fichier = new File("./PDF/PDF" + eval_id + ".pdf");
            return ResponseEntity.ok(fichier);
        }catch (Exception e){
            return null;
        }
    }

    @GetMapping("/downloadEval/{eval_id}")
    public ResponseEntity<Resource> handFileDownload(@PathVariable int eval_id) throws IOException {
        logger.info("download pdf: " + eval_id);
        File fichier = new File("./PDF/PDF" + eval_id + ".pdf");
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fichier.getName() + "\"")
                .body(new ByteArrayResource(Files.readAllBytes(fichier.toPath())));
    }
}
