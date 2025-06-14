package com.getstaged.controller;

import com.getstaged.domain.CV;
import com.getstaged.repository.CVRepository;
import com.getstaged.service.DBFileStorageService;
import com.getstaged.service.UserService;
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

import javax.validation.Valid;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class CVController {

    private static final Logger logger = LoggerFactory.getLogger(CVController.class);

    @Autowired
    private CVRepository cvRep;

    @Autowired
    private DBFileStorageService dbFileStorageService;

    @Autowired
    private UserService userService;

    @GetMapping("/cvs")
    List<CV> cvs() {
        return cvRep.findAll();
    }

    @GetMapping("/cv/{id}")
    ResponseEntity<?> getCV(@PathVariable Long id) {
        Optional<CV> cv = cvRep.findById(id);
        return cv.map(response -> ResponseEntity.ok().body(response)).orElse(new ResponseEntity<>(HttpStatus.CONTINUE));
    }

    @PutMapping("/cv/{id}")
    ResponseEntity<CV> updateCV(@PathVariable Long id, @Valid @RequestBody CV cv) {
        cv.setId(id);
        logger.info("Update CV: ", cv);
        CV result = cvRep.save(cv);
        return ResponseEntity.ok().body(result);
    }

    @DeleteMapping("/cv/{id}")
    public ResponseEntity<?> deleteCV(@PathVariable Long id) {
        logger.info("Delete CV: ", id);
        cvRep.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/users/{email}")
    public ResponseEntity<?> handleCVUpload(@RequestParam("file") MultipartFile file, @PathVariable String email) throws IOException {
        Long user_id = userService.getUserByEmail(email).getId();
        String user_full_name = userService.getUserByEmail(email).getFirstName() + " " + userService.getUserByEmail(email).getLastName();
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        String downloadUri = ServletUriComponentsBuilder.fromCurrentContextPath().path("api/users/download/" + user_id).toUriString();
        CV cv = new CV(user_id, user_full_name, email, fileName, file.getContentType(), file.getBytes(), downloadUri);
        dbFileStorageService.storeCV(cv, fileName);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/users/download/{id}")
    public ResponseEntity<Resource> handleCVDownload(@PathVariable Long id) {
        CV cv = dbFileStorageService.getCV(id);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(cv.getFile_type()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + cv.getFile_name() + "\"")
                .body(new ByteArrayResource(cv.getFile_data()));
    }
}
