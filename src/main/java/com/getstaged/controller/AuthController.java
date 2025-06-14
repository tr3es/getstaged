package com.getstaged.controller;

import com.getstaged.domain.*;
import com.getstaged.exception.AppException;
import com.getstaged.payload.ApiResponse;
import com.getstaged.payload.JwtAuthenticationResponse;
import com.getstaged.payload.LoginRequest;
import com.getstaged.payload.SignUpRequest;
import com.getstaged.repository.RoleRepository;
import com.getstaged.security.JwtTokenProvider;
import com.getstaged.security.RoleName;
import com.getstaged.service.CustomUserDetailsService;
import com.getstaged.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserService userService;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtTokenProvider tokenProvider;

    @Autowired
    CustomUserDetailsService customUserDetailsService;

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        return ResponseEntity.ok(new JwtAuthenticationResponse(jwt));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        if (!userService.isEmailUserAvailable(signUpRequest.getEmail())) {
            return new ResponseEntity(new ApiResponse(false, "Email address already in use!"),
                    HttpStatus.BAD_REQUEST);
        }

        User user = null;
        Role roleEntity = null;

        if (signUpRequest.getTypeForm().equalsIgnoreCase("school")) {
            if (signUpRequest.getTypeRole().equalsIgnoreCase("student")) {
                user = new Student(new Credential(signUpRequest.getEmail(), signUpRequest.getPassword()),
                        new Address("", "", "", "", ""),
                        signUpRequest.getFirstName(), signUpRequest.getLastName());

                roleEntity = roleRepository.findByName(RoleName.ROLE_STUDENT)
                        .orElseThrow(() -> new AppException("Student Role not set."));
            } else if (signUpRequest.getTypeRole().equalsIgnoreCase("monitor")) {
                user = new Monitor(new Credential(signUpRequest.getEmail(), signUpRequest.getPassword()),
                        new Address("", "", "", "", ""),
                        signUpRequest.getFirstName(), signUpRequest.getLastName());

                roleEntity = roleRepository.findByName(RoleName.ROLE_MONITOR)
                        .orElseThrow(() -> new AppException("Monitor Role not set."));
            }
        } else if (signUpRequest.getTypeForm().equalsIgnoreCase("entreprise")) {
            user = new Entreprise(new Credential(signUpRequest.getEmail(), signUpRequest.getPassword()),
                    new Address("", "", "", "", ""),
                    signUpRequest.getEnterpriseName());

            roleEntity = roleRepository.findByName(RoleName.ROLE_ENTERPRISE)
                    .orElseThrow(() -> new AppException("Enterprise Role not set."));
        }

        user.getCredential().setPassword(passwordEncoder.encode(user.getCredential().getPassword()));
        user.setCreatedBy(user.getCredential().getEmail());

        Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                .orElseThrow(() -> new AppException("User Role not set."));

        user.getRoles().add(userRole);
        user.getRoles().add(roleEntity);

        userService.saveUserAddress(user.getAddress());
        userService.saveUserCredential(user.getCredential());

        User result = userService.saveUser(user);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath().path("/users/{email}")
                .buildAndExpand(result.getCredential().getEmail()).toUri();

        return ResponseEntity.created(location).body(new ApiResponse(true, "User registered successfully"));
    }
}
