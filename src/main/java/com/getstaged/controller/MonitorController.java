package com.getstaged.controller;

import com.getstaged.domain.FicheSuivie;
import com.getstaged.domain.RapportVisite;
import com.getstaged.domain.Student;
import com.getstaged.payload.MonitorResponse;
import com.getstaged.payload.PagedResponse;
import com.getstaged.payload.StudentResponse;
import com.getstaged.repository.FicheSuivieRepository;
import com.getstaged.repository.RapportVisiteRepository;
import com.getstaged.repository.StudentRepository;
import com.getstaged.security.CurrentUser;
import com.getstaged.service.DBFileStorageService;
import com.getstaged.service.MonitorService;
import com.getstaged.security.UserPrincipal;
import com.getstaged.service.StudentService;
import com.getstaged.service.UserService;
import com.getstaged.util.Constants;
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

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/monitors")
public class MonitorController {

    @Autowired
    private MonitorService monitorService;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private StudentService studentService;
    @Autowired
    private UserService userService;
    @Autowired
    private RapportVisiteRepository rapportVisiteRepository;
    @Autowired
    private FicheSuivieRepository ficheSuivieRepository;
    @Autowired
    DBFileStorageService dbFileStorageService;

    @GetMapping
    public PagedResponse<MonitorResponse> getSupervisors(@CurrentUser UserPrincipal currentUser,
                                                         @RequestParam(value = "page", defaultValue = Constants.DEFAULT_PAGE_NUMBER) int page,
                                                         @RequestParam(value = "size", defaultValue = Constants.DEFAULT_PAGE_SIZE) int size) {
        return monitorService.getAllMonitors(currentUser, page, size);
    }

    @GetMapping("/students/{id}")
    public List<StudentResponse> getStudentList(@PathVariable Long id) {
        List<Student> list = studentRepository.getAllByMonitorId(id);
        List<StudentResponse> studentList = new ArrayList<>();
        monitorService.getStudentList(list, studentList);
        return studentList;
    }

    @PostMapping("/students/rapportVisite/{email}")
    public ResponseEntity<?> handleEntenteUploadRapportVisite(@RequestParam("file") MultipartFile file, @PathVariable String email) throws IOException {

        Student student = studentService.findStudent(userService.getUserByEmail(email).getId());

        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        String downloadUri = ServletUriComponentsBuilder.fromCurrentContextPath().path("api/monitors/rapportVisite/" + student.getId()).toUriString();

        RapportVisite rapportVisite = new RapportVisite(student, fileName, file.getContentType(), file.getBytes(), downloadUri);

        if (rapportVisiteRepository.getByStudentId(student.getId()) != null) {
            RapportVisite temp = rapportVisiteRepository.getByStudentId(student.getId());
            temp.setFile_name(rapportVisite.getFile_name());
            temp.setFile_type(rapportVisite.getFile_type());
            temp.setFile_data(rapportVisite.getFile_data());
            temp.setDownload_uri(rapportVisite.getDownload_uri());
            rapportVisiteRepository.save(temp);
        } else {
            rapportVisiteRepository.save(rapportVisite);
        }

        return ResponseEntity.ok().build();
    }

    @PostMapping("/students/ficheSuivie/{email}")
    public ResponseEntity<?> handleEntenteUploadFicheSuivie(@RequestParam("file") MultipartFile file, @PathVariable String email) throws IOException {

        Student student = studentService.findStudent(userService.getUserByEmail(email).getId());

        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        String downloadUri = ServletUriComponentsBuilder.fromCurrentContextPath().path("api/monitors/ficheSuivie/" + student.getId()).toUriString();

        FicheSuivie ficheSuivie = new FicheSuivie(student, fileName, file.getContentType(), file.getBytes(), downloadUri);

        if (ficheSuivieRepository.getByStudentId(student.getId()) != null) {
            FicheSuivie temp = ficheSuivieRepository.getByStudentId(student.getId());
            temp.setFile_name(ficheSuivie.getFile_name());
            temp.setFile_type(ficheSuivie.getFile_type());
            temp.setFile_data(ficheSuivie.getFile_data());
            temp.setDownload_uri(ficheSuivie.getDownload_uri());
            ficheSuivieRepository.save(temp);
        } else {
            ficheSuivieRepository.save(ficheSuivie);
        }

        return ResponseEntity.ok().build();
    }

    @GetMapping("/rapportVisite/{id}")
    public ResponseEntity<Resource> handleEntenteDownloadRapportVisite(@PathVariable Long id) {
        RapportVisite rapportVisite = rapportVisiteRepository.getByStudentId(id);
        if (rapportVisite != null) {
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(rapportVisite.getFile_type()))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + rapportVisite.getFile_name() + "\"")
                    .body(new ByteArrayResource(rapportVisite.getFile_data()));
        }
            return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }

    @GetMapping("/ficheSuivie/{id}")
    public ResponseEntity<Resource> handleEntenteDownloadFicheSuivie(@PathVariable Long id) {
        FicheSuivie ficheSuivie = ficheSuivieRepository.getByStudentId(id);
        if (ficheSuivie != null) {
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(ficheSuivie.getFile_type()))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + ficheSuivie.getFile_name() + "\"")
                    .body(new ByteArrayResource(ficheSuivie.getFile_data()));

        }
            return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }

}
