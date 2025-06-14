package com.getstaged.controller;

import com.getstaged.domain.Entreprise;
import com.getstaged.domain.User;
import com.getstaged.payload.*;
import com.getstaged.security.CurrentUser;
import com.getstaged.security.UserPrincipal;
import com.getstaged.service.UserService;
import com.getstaged.util.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @GetMapping("/user/me")
    @PreAuthorize("hasRole('USER')")
    public UserSummary getCurrentUser(@CurrentUser UserPrincipal currentUser) {

        UserSummary userSummary = currentUser.getTypeUser().equals(Constants.TYPE_FORM_ENTERPRISE) ?
                new EnterpriseSummary(currentUser.getId(),
                        currentUser.getUsername(),
                        currentUser.getTypeUser(),
                        currentUser.getLastName()
                ) :
                new SchoolSummary(currentUser.getId(),
                        currentUser.getUsername(),
                        currentUser.getTypeUser(),
                        currentUser.getFirstName(),
                        currentUser.getLastName()
                );
        return userSummary;
    }

    @GetMapping("/user/checkEmailAvailability")
    public UserIdentityAvailability checkEmailAvailability(@RequestParam(value = "email") String email) {
        Boolean isAvailable = userService.isEmailUserAvailable(email);
        return new UserIdentityAvailability(isAvailable);
    }

    @GetMapping("/users/{username}")
    public UserProfile getUserProfile(@PathVariable("username") String email) {
        User user = userService.getUserByEmail(email);
        UserProfile userProfile = null;

        if (user.getFirstName() != null)
            userProfile = new UserProfile(user.getId(), user.getCredential().getEmail(), user.getFirstName(), user.getCreatedDate());
        else
            userProfile = new UserProfile(user.getId(), user.getCredential().getEmail(), ((Entreprise) user).getName(), user.getCreatedDate());

        return userProfile;
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<NotificationResponse>> getUserNotifications(@CurrentUser CurrentUser currentUser,
                                                                           @RequestParam(value = "userId") Long userId) {
        List<NotificationResponse> notificationResponses = userService.getAllNotifications(userId);
        return ResponseEntity.ok().body(notificationResponses);
    }

}
