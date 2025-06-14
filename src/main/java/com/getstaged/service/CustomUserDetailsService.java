package com.getstaged.service;

import com.getstaged.domain.Credential;
import com.getstaged.domain.User;
import com.getstaged.repository.CredentialRepository;
import com.getstaged.repository.UserRepository;
import com.getstaged.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    CredentialRepository credentialRepository;

    @Transactional
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        User user = null;
        Credential credential = null;
        credential = credentialRepository.findByEmail(email);
        user = userRepository.findById(credential.getId()).orElseThrow(
                () -> new UsernameNotFoundException("User not found with email : " + email)
        );
        return UserPrincipal.create(user);
    }

    @Transactional
    public UserDetails loadUserById(Long id) {
        User user = null;
        user = userRepository.findById(id).orElseThrow(
                () -> new UsernameNotFoundException("User not found with id : " + id)
        );
        return UserPrincipal.create(user);
    }

}
