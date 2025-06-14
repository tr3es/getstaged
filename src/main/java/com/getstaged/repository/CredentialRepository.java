package com.getstaged.repository;

import com.getstaged.domain.Credential;
import com.getstaged.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CredentialRepository extends JpaRepository<Credential, Long> {
    boolean existsByEmail(String email);

    Credential findByEmail(String email);
}
