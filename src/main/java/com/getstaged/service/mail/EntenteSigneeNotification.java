package com.getstaged.service.mail;

import com.getstaged.domain.EntenteStage;
import com.getstaged.domain.Entreprise;
import com.getstaged.domain.Offer;
import com.getstaged.domain.Student;

public class EntenteSigneeNotification {

    private Student student;
    private Entreprise entreprise;
    private String entrepriseEmail;
    private static String SUBJECT = "Stage ATE - Cégep André-laurendeau";
    private static String EMAIL_RESPONSABLE_ATE = "email";
    private Offer offer;
    private EntenteStage ententeStage;
    private String message;

    public EntenteSigneeNotification(Student student, Entreprise entreprise, Offer offer,
                                     EntenteStage ententeStage) {
        this.student = student;
        this.entreprise = entreprise;
        entrepriseEmail = entreprise.getCredential().getEmail();
        this.offer = offer;
        this.ententeStage = ententeStage;
        this.message = buildMessage();
    }

    private String buildMessage() {
        return "Bonjour , \n"
                + " Ceci est un message automatisé du système de stage du Cégep André-Laurendeau visant à vous avertir que l'étudiant " +
                student.getFirstName() + " " + student.getLastName() + " a signé l'entente de stage pour le poste de  " + offer.getTitrePoste()
                + ". \n" + "Si vous désirez contacter l'étudiant, ses coordonnées sont: \n Courriel: " + student.getCredential().getEmail()
                + " \n Voici en pièce-jointe une copie de l'entente."
                + "\n \n Merci pour votre participation au programme ATE!";
    }

    public void envoyer() {
        EmailService emailService = new EmailService();
        try {
            //TODO: uncomment
            emailService.sendMessageWithAttachment("GetStagedLogics@gmail.com", SUBJECT, message, ententeStage);
            //emailService.sendMessageWithAttachment(student.getCredential().getEmail(),SUBJECT, buildMessage(),ententeStage);
            //emailService.sendMessageWithAttachment(entreprise.getCredential().getEmail(),SUBJECT, buildMessage(),ententeStage);
            //emailService.sendMessageWithAttachment(EMAIL_RESPONSABLE_ATE,SUBJECT, buildMessage(),ententeStage);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}