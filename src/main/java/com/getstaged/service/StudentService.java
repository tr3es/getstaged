package com.getstaged.service;

import com.getstaged.domain.*;
import com.getstaged.payload.PagedResponse;
import com.getstaged.payload.StudentResponse;
import com.getstaged.repository.*;
import com.getstaged.security.UserPrincipal;
import com.getstaged.util.ModelMapper;
import com.getstaged.util.ServiceHelpers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Optional;


@Service
public class StudentService {

    @Autowired
    private UserService userService;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CVRepository cvRepository;

    @Autowired
    private MonitorRepository monitorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CredentialRepository credentialRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private EntrepriseRepository entrepriseRepository;

    @Autowired
    private OfferRepository offerRepository;

    @Autowired
    private OfferPeriodeRepository offerPeriodeRepository;

    @Autowired
    private ApplicationOfferRepository applicationOfferRepository;


    public Student findStudent(Long studentId) {
        return studentRepository.getOne(studentId);
    }


    public User saveStudent(Student student) {
        userRepository.save(student);
        return null;
    }

    public void deleteStudent(Long studentId) {
        Student student = studentRepository.getOne(studentId);
        addressRepository.deleteById(student.getAddress().getId());
        credentialRepository.deleteById(student.getCredential().getId());
        studentRepository.deleteById(student.getId());
    }

    public PagedResponse<StudentResponse> getAllStudents(UserPrincipal currentUser, int page, int size) {
        ServiceHelpers.validatePageNumberAndSize(page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "createdDate");
        Page<Student> students = studentRepository.findAll(pageable);

        if (students.getNumberOfElements() == 0)
            return new PagedResponse<>(Collections.emptyList(), students.getNumber(),
                    students.getSize(), students.getTotalElements(), students.getTotalPages(), students.isLast());


        List<StudentResponse> studentResponses = students.map(ModelMapper::mapStudentToStudentResponse).getContent();
        return new PagedResponse<>(studentResponses, students.getNumber(), students.getSize(), students.getTotalElements(),
                students.getTotalPages(), students.isLast());
    }

    public Student assignMonitorToStudent(Long monitorId, Long studentId) {
        Monitor monitor = monitorRepository.getOne(monitorId);
        Student student = studentRepository.getOne(studentId);

        student.setMonitor(monitor);
        student.setLastModifiedDate(Instant.now());

        userService.saveUser(student);
        return student;
    }

    public Student applyOnOffer(Long offerId, Long studentId) {
        Student student = findStudent(studentId);
        Offer offer = offerRepository.getById(offerId);
        Entreprise entreprise = entrepriseRepository.findById(offer.getEntrepriseID()).get();
        ApplicationOffer applicationOffer = new ApplicationOffer(new ApplicationOfferKey(offerId, studentId), offer);
        student.getOffers().add(offer);
        entreprise.addStudents(student);
        offer.getApplicationOffers().add(applicationOffer);
        offerRepository.save(offer);
        //applicationOfferRepository.save(applicationOffer);
        saveStudent(student);
        return student;
    }

    public Student markPeriodeAvailable(Long offerPeriodeId, Long studentId) {
        Student student = findStudent(studentId);
        OfferPeriode periode = offerPeriodeRepository.findById(offerPeriodeId).get();
        student.getPeriodes().add(periode);
        return studentRepository.save(student);
    }

    public Student markPeriodeUnavailable(Long offerPeriodeId, Long studentId) {
        Student student = findStudent(studentId);
        OfferPeriode periode = offerPeriodeRepository.findById(offerPeriodeId).get();
        student.getPeriodes().remove(periode);
        return studentRepository.save(student);
    }

    public boolean isStudentPeriodeAvailable(Long offerPeriodeId, Long studentId){
        Student student = findStudent(studentId);
        OfferPeriode periode = offerPeriodeRepository.findById(offerPeriodeId).get();
        return student.getPeriodes().contains(periode);
    }

    public Student getStudent(Long studentId) {
        return studentRepository.findStudentById(studentId);
    }
    public Boolean checkStudentCvUplaod(Long studentId){
        return cvRepository.findById(studentId).isPresent();
    }

    public String checkStudentCvStatus(Long studentId){
        Optional<CV> cv = cvRepository.findById(studentId);

        if(!cv.isPresent())
            return "none";
        return cv.get().getApproved();
    }
}
