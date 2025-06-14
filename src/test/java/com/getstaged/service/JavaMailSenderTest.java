package com.getstaged.service;


import javax.mail.MessagingException;

import com.getstaged.service.mail.JavaMailSender;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.mail.javamail.JavaMailSenderImpl;

public class JavaMailSenderTest {

  JavaMailSender jms;

  @Before
  public void setUp() throws Exception {
    jms = new JavaMailSender();
  }

  @After
  public void tearDown() throws Exception {
    jms = null;
  }

  @Test
  public void getJavaMailSender() throws MessagingException {
    JavaMailSenderImpl jmsi = jms.getJavaMailSender();
    assert(jms.getJavaMailSender()!= null);
  }
}