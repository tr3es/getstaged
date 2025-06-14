package com.getstaged.service;

import com.getstaged.domain.Monitor;
import com.getstaged.domain.Student;
import com.getstaged.payload.MonitorResponse;
import com.getstaged.payload.PagedResponse;
import com.getstaged.payload.StudentResponse;
import com.getstaged.repository.MonitorRepository;
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

@Service
public class MonitorService {

    @Autowired
    private MonitorRepository monitorRepository;

    public PagedResponse<MonitorResponse> getAllMonitors(UserPrincipal currentUser, int page, int size) {
        ServiceHelpers.validatePageNumberAndSize(page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "createdBy");
        Page<Monitor> monitors = monitorRepository.findAll(pageable);

        if(monitors.getNumberOfElements() == 0)
            return new PagedResponse<>(Collections.emptyList(), monitors.getNumber(),
                    monitors.getSize(), monitors.getTotalElements(), monitors.getTotalPages(), monitors.isLast());


        List<MonitorResponse> monitorResponses = monitors.map(ModelMapper::mapMonitorToMonitorResponse).getContent();
        return new PagedResponse<>(monitorResponses, monitors.getNumber(), monitors.getSize(), monitors.getTotalElements(),
                monitors.getTotalPages(), monitors.isLast());
    }
    
    public void getStudentList(List<Student> list, List<StudentResponse> studentList) {
        for (Student student : list) {
            studentList.add(new StudentResponse(
                    student.getId(),
                    student.getMonitor().getId(),
                    student.getFirstName(),
                    student.getLastName(),
                    student.getCredential().getEmail()
            ));
        }
    }

}
