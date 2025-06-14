package com.getstaged.controller;

import com.getstaged.GetStagedApplication;
import com.getstaged.controller.AuthController;
import com.getstaged.domain.User;
import com.getstaged.repository.UserRepository;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.persistence.EntityManager;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = GetStagedApplication.class)
public class UserResourceTest {

    private static final String DEFAULT_FIRSTNAME = "Johny";
    private static final String DEFAULT_LASTNAME = "Deepe";
    private static final String DEFAULT_PASSWORD = "pass@toto";
    private static final String DEFAULT_EMAIL = "test@localhost";


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EntityManager em;

    private AuthController authController;

    private User user;

    @Before
    public void setUp() throws Exception {
        authController = new AuthController();
    }


}
