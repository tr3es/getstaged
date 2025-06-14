package com.getstaged.controller;

import com.getstaged.controller.StudentController;
import com.getstaged.service.mail.EmailService;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class StudentControllerTest {

  @Mock
  private StudentController studentController;
  private Long studID;
  private Long offerID;

  @Mock
  EmailService emailService;

  @Before
  public void setUp() throws Exception {
    studentController = new StudentController();
  }

  @After
  public void tearDown() throws Exception {
    studentController = null;
  }

  @Test(expected = Exception.class)
  public void sendEmailForAcceptanceNotification() {
    assert(studentController.sendEmailForAcceptanceNotification(studID,offerID) != null);
  }

  @Test(expected = Exception.class)
  public void sendEmailWithEntente() {
    assert (studentController.sendEmailWithEntente(studID) != null);
  }

}