package com.getstaged.service.mail;

import com.getstaged.domain.Entreprise;
import com.getstaged.domain.Offer;
import com.getstaged.domain.Student;

public class StagiaireSelectedNotification {

    private Student student;
    private Entreprise entreprise;
    private String entrepriseEmail;
    private static String SUBJECT = "Stage ATE - Cégep André-laurendeau";
    private Offer offer;

    public StagiaireSelectedNotification(Student student, Entreprise entreprise, Offer offer) {
        this.student = student;
        this.entreprise = entreprise;
        entrepriseEmail = entreprise.getCredential().getEmail();
        this.offer = offer;
    }

    private String buildMessage() {
        return "Bonjour , \n"
                + " Ceci est un message automatisé du système de stage du Cégep André-Laurendeau visant à vous avertir que l'étudiant " +
                student.getFirstName() + " " + student.getLastName() + " a accepté votre offre de stage pour le poste de  " + offer.getTitrePoste()
                + ". \n" + "Si vous désirez contacter l'étudiant, ses coordonnées sont: \n Courriel: " + student.getCredential().getEmail()
                + " \n \n Merci pour votre participation au programme ATE!";
    }

    public void envoyerMessage(String targetEmail) {
        EmailService emailService = new EmailService();
        emailService.sendSimpleMessage(targetEmail, SUBJECT, buildMessage());
    }
}
