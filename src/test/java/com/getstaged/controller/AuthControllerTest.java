package com.getstaged.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.getstaged.GetStagedApplication;
import com.getstaged.config.SecurityConfig;
import com.getstaged.payload.LoginRequest;
import com.getstaged.service.StudentService;
import com.getstaged.service.UserService;
import net.minidev.json.JSONObject;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.FilterFactory;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import javax.print.attribute.standard.Media;
import javax.servlet.Filter;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK, classes = GetStagedApplication.class)
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application.properties")
public class AuthControllerTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext context;

    @Mock
    private AuthController authController;

    @Autowired
    private Filter springSecurityFilterChain;

    @Autowired
    private StudentService studentService;

    @Before
    public void setup() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .addFilters(springSecurityFilterChain)
                .build();
    }


    @Test
    @WithMockUser(roles = "USER")
    public void signedInTest() throws Exception {
        JSONObject credential = new JSONObject();
        credential.put("email","admin@getstaged.com");
        credential.put("password", "admin");
        mockMvc.perform(post("/api/auth/signin")
                .content(credential.toString())
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "USER")
    public void registerStudentTest() throws Exception {
        JSONObject credential = new JSONObject();
        credential.put("firstName", "test10");
        credential.put("lastName", "TEST10");
        credential.put("email","test10@claurendeau.qc.ca");
        credential.put("password", "111111");
        credential.put("typeForm", "school");
        credential.put("typeRole", "student");
        mockMvc.perform(post("/api/auth/signup")
                .content(credential.toString())
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(status().isCreated());
    }

    @After
    public void tearDown() throws Exception {

    }
}