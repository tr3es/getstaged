package com.getstaged.service;

import com.getstaged.domain.*;
import com.getstaged.payload.EnterpriseResponse;
import com.getstaged.payload.MonitorResponse;
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

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CoordinatorService {

    @Autowired
    private StudentService studentService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private ApplicationOfferRepository applicationOfferRepository;

    private final static String SORT_COLUMN_USER_ID = "createdDate";

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private EntrepriseRepository entrepriseRepository;

    @Autowired
    private MonitorRepository monitorRepository;

    public StudentResponse approveApplyOnOffer(Long offerId, Long studentId) {
        changeApplicationOfferStatus(offerId, studentId, StatusOffer.APPROVE);
        Student student = studentService.findStudent(studentId);
        return ModelMapper.mapStudentToStudentResponse(student);
    }

    public StudentResponse refuseApplyOnOffer(Long offerId, Long studentId) {
        changeApplicationOfferStatus(offerId, studentId, StatusOffer.REFUSAL);
        Student student = studentService.findStudent(studentId);
        studentService.saveStudent(student);
        return ModelMapper.mapStudentToStudentResponse(student);
    }

    private Offer findOfferInStudentApplies(Student student, Long offerId) {
        return student.getOffers().stream()
                .filter(item -> item.getId().equals(offerId))
                .findAny().orElse(null);
    }

    public void blockUser(Long userId) {
        User user = userRepository.getOne(userId);
        user.setBlocked(true);
        userRepository.save(user);
    }

    private ApplicationOffer changeApplicationOfferStatus(Long offerId,
                                                          Long studentId,
                                                          StatusOffer statusOffer) {
        ApplicationOffer application = applicationOfferRepository.getOne(new ApplicationOfferKey(offerId, studentId));
        application.setStatusOfferName(statusOffer);
        applicationOfferRepository.save(application);
        notificationService.buildNotification(offerId, studentId, statusOffer);
        return application;
    }

    public PagedResponse<StudentResponse> getAllStudents(UserPrincipal currentUser, int page, int size) {
        ServiceHelpers.validatePageNumberAndSize(page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, SORT_COLUMN_USER_ID);
        Page<Student> students = studentRepository.findAll(pageable);

        if (students.getNumberOfElements() == 0)
            return new PagedResponse<>(Collections.emptyList(), students.getNumber(),
                    students.getSize(), students.getTotalElements(), students.getTotalPages(), students.isLast());

        List<StudentResponse> studentResponses = students.stream()
                .map((student ->
                        ModelMapper.mapStudentDetailToStudentResponse(student,
                                studentService.checkStudentCvStatus(student.getId()))
                        )
                )
                .collect(Collectors.toList());
        return new PagedResponse<>(studentResponses, students.getNumber(), students.getSize(), students.getTotalElements(),
                students.getTotalPages(), students.isLast());
    }

    public PagedResponse<MonitorResponse> getAllMonitors(UserPrincipal currentUser, int page, int size) {
        ServiceHelpers.validatePageNumberAndSize(page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, SORT_COLUMN_USER_ID);
        Page<Monitor> monitors = monitorRepository.findAll(pageable);


        if (monitors.getNumberOfElements() == 0)
            return new PagedResponse<>(Collections.emptyList(), monitors.getNumber(),
                    monitors.getSize(), monitors.getTotalElements(), monitors.getTotalPages(), monitors.isLast());

        List<MonitorResponse> monitorResponses = monitors.stream()
                .map(ModelMapper::mapMonitorToMonitorResponse).collect(Collectors.toList());

        return new PagedResponse<>(monitorResponses, monitors.getNumber(), monitors.getSize(), monitors.getTotalElements(),
                monitors.getTotalPages(), monitors.isLast());
    }

    public PagedResponse<EnterpriseResponse> getAllEnterprises(UserPrincipal currentUser, int page, int size) {
        ServiceHelpers.validatePageNumberAndSize(page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, SORT_COLUMN_USER_ID);
        Page<Entreprise> enterprises = entrepriseRepository.findAll(pageable);

        if (enterprises.getNumberOfElements() == 0)
            return new PagedResponse<>(Collections.emptyList(), enterprises.getNumber(),
                    enterprises.getSize(), enterprises.getTotalElements(), enterprises.getTotalPages(), enterprises.isLast());

        List<EnterpriseResponse> enterpriseResponses = enterprises.stream()
                .map(ModelMapper::mapEnterpriseToEnterpriseResponse).collect(Collectors.toList());
        return new PagedResponse<>(enterpriseResponses, enterprises.getNumber(), enterprises.getSize(), enterprises.getTotalElements(),
                enterprises.getTotalPages(), enterprises.isLast());
    }
}
