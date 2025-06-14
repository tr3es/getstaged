package com.getstaged.util;

public final class NotificationHelper {

    public static String constructMessageNotificationNewOffer(Long id){
        return "Vous avez reçu une nouvelle application sur l'offre " + id;
    }

    public static String constructMessageNotificationApproveOffer(String programme){
        return "Votre application sur l'offre pour le programme "+programme+" a été accepté!";
    }

    public static String constructMessageNotificationRefusOffer(String programme){
        return "Votre application sur l'offre pour le programme "+programme+" a été refusé!";
    }
}
