package com.getstaged.service.mail;

import java.util.Properties;

import org.springframework.context.annotation.Bean;
import org.springframework.mail.javamail.JavaMailSenderImpl;

public class JavaMailSender {

    public JavaMailSenderImpl getJavaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost("smtp.gmail.com");
        mailSender.setPort(587);

        mailSender.setUsername("getstagedeq3@gmail.com");
        mailSender.setPassword("G3tst@g3d");

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.debug", "false");

        return mailSender;
    }
}
