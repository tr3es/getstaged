package com.getstaged.service.mail;

import com.getstaged.domain.EntenteStage;
import com.getstaged.domain.Entreprise;
import com.getstaged.domain.Offer;
import com.getstaged.domain.Student;
import com.getstaged.repository.StudentRepository;

import java.io.FileNotFoundException;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@Component
public class EmailService {

    //TODO: modifier...
    private static String email = "GetStagedLogics@gmail.com";

    @Autowired
    StudentRepository studentRepository;

    public void sendSimpleMessage(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        JavaMailSender emailSender = new JavaMailSender();
        emailSender.getJavaMailSender().send(message);
    }

    public void sendNotif(Student stud, Offer offer, Entreprise ent) {
        StagiaireSelectedNotification ssn = new StagiaireSelectedNotification(stud, ent, offer);
        ssn.envoyerMessage(email);
        //remplacer par:
        //ssn.envoyerMessage(ent.getCredential().getEmail());
    }

    public void sendNotifEntente(Student student, Offer offer, Entreprise entreprise, EntenteStage ententeStage) {
        EntenteSigneeNotification esn = new EntenteSigneeNotification(student, entreprise, offer, ententeStage);
        esn.envoyer();
    }

    //SOURCE: https://www.baeldung.com/spring-email
    public void sendMessageWithAttachment(String to, String subject, String text, EntenteStage ententeStage)
            throws MessagingException, FileNotFoundException {
        JavaMailSender emailSender = new JavaMailSender();
        MimeMessage message = emailSender.getJavaMailSender().createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(text);
        helper.addAttachment("EntenteStage.pdf", (new ByteArrayResource(ententeStage.getFile_data())));

        emailSender.getJavaMailSender().send(message);
    }
}
