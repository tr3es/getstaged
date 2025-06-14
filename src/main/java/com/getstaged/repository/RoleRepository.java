package com.getstaged.repository;

import com.getstaged.domain.Role;
import com.getstaged.security.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {
    Optional<Role> findByName(RoleName roleName);

    @Override
    <S extends Role> S save(S role);
}
