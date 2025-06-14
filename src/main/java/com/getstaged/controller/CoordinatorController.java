package com.getstaged.controller;

import com.getstaged.payload.EnterpriseResponse;
import com.getstaged.payload.MonitorResponse;
import com.getstaged.payload.PagedResponse;
import com.getstaged.payload.StudentResponse;
import com.getstaged.security.CurrentUser;
import com.getstaged.service.CoordinatorService;
import com.getstaged.security.UserPrincipal;
import com.getstaged.util.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping("/api/coordinator")
public class CoordinatorController {

    @Autowired
    private CoordinatorService coordinatorService;

    @RequestMapping(value = "/approveApply", method = RequestMethod.PUT)
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<StudentResponse> approveApplyOnOffer(@CurrentUser UserPrincipal currentUser,
                                                               @RequestParam("offerId") Long offerId,
                                                               @RequestParam("studentId") Long studentId) {
        StudentResponse studentResponse = coordinatorService.approveApplyOnOffer(offerId, studentId);
        return ResponseEntity.ok().body(studentResponse);
    }

    @RequestMapping(value = "/refuseApply", method = RequestMethod.PUT)
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<StudentResponse> refuseApplyOnOffer(@CurrentUser UserPrincipal currentUser,
                                                              @RequestParam("offerId") Long offerId,
                                                              @RequestParam("studentId") Long studentId) {
        StudentResponse studentResponse = coordinatorService.refuseApplyOnOffer(offerId, studentId);
        return ResponseEntity.ok().body(studentResponse);
    }

    @RequestMapping(value = "/enterprises", method = RequestMethod.GET)
    @PreAuthorize("hasRole('COORDINATOR')")
    public PagedResponse<EnterpriseResponse> getAllEnterprises(@CurrentUser UserPrincipal currentUser,
                                                            @RequestParam(value = "page", defaultValue = Constants.DEFAULT_PAGE_NUMBER) int page,
                                                            @RequestParam(value = "size", defaultValue = Constants.DEFAULT_PAGE_SIZE) int size) {
        return coordinatorService.getAllEnterprises(currentUser, page, size);
    }

    @RequestMapping(value = "/students", method = RequestMethod.GET)
    @PreAuthorize("hasRole('COORDINATOR')")
    public PagedResponse<StudentResponse> getAllStudents(@CurrentUser UserPrincipal currentUser,
                                                            @RequestParam(value = "page", defaultValue = Constants.DEFAULT_PAGE_NUMBER) int page,
                                                            @RequestParam(value = "size", defaultValue = Constants.DEFAULT_PAGE_SIZE) int size) {
        return coordinatorService.getAllStudents(currentUser, page, size);
    }

    @RequestMapping(value = "/monitors", method = RequestMethod.GET)
    @PreAuthorize("hasRole('COORDINATOR')")
    public PagedResponse<MonitorResponse> getAllMonitors(@CurrentUser UserPrincipal currentUser,
                                                         @RequestParam(value = "page", defaultValue = Constants.DEFAULT_PAGE_NUMBER) int page,
                                                         @RequestParam(value = "size", defaultValue = Constants.DEFAULT_PAGE_SIZE) int size) {
        return coordinatorService.getAllMonitors(currentUser, page, size);
    }

    @RequestMapping(value = "/blockUser", method = RequestMethod.PUT)
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity blockUser(@RequestParam(value = "userId") Long userId){
        coordinatorService.blockUser(userId);
        return ResponseEntity.ok().body(userId);
    }
}
