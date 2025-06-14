package com.getstaged.controller;

import com.getstaged.payload.PagedResponse;
import com.getstaged.payload.SupervisorResponse;
import com.getstaged.security.CurrentUser;
import com.getstaged.service.SupervisorService;
import com.getstaged.security.UserPrincipal;
import com.getstaged.util.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/supervisors")
public class SupervisorController {

    @Autowired
    private SupervisorService supervisorService;

    @GetMapping
    public PagedResponse<SupervisorResponse> getSupervisors(@CurrentUser UserPrincipal currentUser,
                                                            @RequestParam(value = "page", defaultValue = Constants.DEFAULT_PAGE_NUMBER) int page,
                                                            @RequestParam(value = "size", defaultValue = Constants.DEFAULT_PAGE_SIZE) int size) {
        return supervisorService.getAllSupervisors(currentUser, page, size);
    }
}
