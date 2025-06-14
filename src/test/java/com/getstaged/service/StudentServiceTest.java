package com.getstaged.service;

import com.getstaged.GetStagedApplication;
import com.getstaged.domain.*;
import com.getstaged.exception.AppException;
import com.getstaged.repository.*;
import com.getstaged.security.RoleName;
import org.junit.After;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Set;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.*;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = GetStagedApplication.class)
public class StudentServiceTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CredentialRepository credentialRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private StudentService studentService;

    private User student1;
    private Credential credential;
    private Address address1;
    private String lastName = "Dubois";
    private String firstName = "Dodo";
    private String email = "dodo@gmail.ca";
    private String password = "11111";

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(true);
        credential = new Credential(email, password);
        address1 = new Address("13, Rue Lavoie","H3S E4R","Montreal","Québec","Canada");
        student1 = new Student(credential, address1, firstName, lastName);
        student1.setCreatedBy(email);

        Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                .orElseThrow(() -> new AppException("User Role not set."));
        student1.getRoles().add(userRole);
    }

    @Test
    public void whenFindByCredential_thenReturnEmployee() {
        saveUser();
        User found = userRepository.findUserByCredential(student1.getCredential());
        assertThat(found).extracting("firstName", "lastName")
                .contains(student1.getFirstName(), student1.getLastName());
    }

    @Ignore
    @Test
    public void testUserRoleSet(){
        saveUser();
        User found = userRepository.findUserByCredential(student1.getCredential());
        Set<Role> test = found.getRoles();
        assertThat(found.getRoles()
                        .stream()
                        .map(Role::getName)
                        .collect(Collectors.toList())).contains(RoleName.ROLE_USER);
    }

    private void saveUser(){
        credentialRepository.save(credential);
        addressRepository.save(address1);
        userRepository.save(student1);
    }

    @After
    public void tearDown() throws Exception {
        addressRepository.deleteById(address1.getId());
        credentialRepository.deleteById(credential.getId());
        student1 = null;
        credential = null;
        address1 = null;
    }
}
