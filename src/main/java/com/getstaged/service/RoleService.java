package com.getstaged.service;

import com.getstaged.domain.Role;
import com.getstaged.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;

    public void saveRole(Role role){
        roleRepository.save(role);
    }

    public boolean existRoleName(Role role){
        return !roleRepository.findByName(role.getName()).isPresent();
    }
}
