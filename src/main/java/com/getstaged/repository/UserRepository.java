package com.getstaged.repository;

import com.getstaged.domain.Credential;
import com.getstaged.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Override
    Optional<User> findById(Long id);

    Boolean existsByCredentialEmail(String email);

    User findUserByCredential(Credential credential);

    List<User> findByIdIn(List<Long> userIds);


}
