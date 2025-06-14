package com.getstaged.service;

import com.getstaged.domain.Supervisor;
import com.getstaged.payload.PagedResponse;
import com.getstaged.payload.SupervisorResponse;
import com.getstaged.repository.SupervisorRepository;
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
public class SupervisorService {

    @Autowired
    private SupervisorRepository supervisorRepository;

    public PagedResponse<SupervisorResponse> getAllSupervisors(UserPrincipal currentUser, int page, int size) {
        ServiceHelpers.validatePageNumberAndSize(page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "createdBy");
        Page<Supervisor> supervisors = supervisorRepository.findAll(pageable);

        if(supervisors.getNumberOfElements() == 0)
            return new PagedResponse<>(Collections.emptyList(), supervisors.getNumber(),
                    supervisors.getSize(), supervisors.getTotalElements(), supervisors.getTotalPages(), supervisors.isLast());


        List<SupervisorResponse> supervisorResponses = supervisors.map(ModelMapper::mapSupervisorToSupervisorResponse).getContent();
        return new PagedResponse<>(supervisorResponses, supervisors.getNumber(), supervisors.getSize(), supervisors.getTotalElements(),
                supervisors.getTotalPages(), supervisors.isLast());
    }
}
