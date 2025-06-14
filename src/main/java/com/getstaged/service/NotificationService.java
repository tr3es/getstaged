package com.getstaged.service;

import com.getstaged.domain.*;
import com.getstaged.repository.NotificationRepository;
import com.getstaged.repository.UserRepository;
import com.getstaged.util.NotificationHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.validation.constraints.NotNull;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private StudentService studentService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OfferService offerService;

    public void buildNotification(Long offerId, Long studentId, StatusOffer statusOffer) {
        Student student = studentService.getStudent(studentId);
        Offer offer = offerService.findOffer(offerId);

        Notification notification = new Notification();

        switch (statusOffer) {
            case APPROVE:
                notification = constructNotification("Application accepté",
                        NotificationHelper.constructMessageNotificationApproveOffer(offer.getProgramme()),
                        StatusNotification.SUCCESS);
                break;

            case REFUSAL:
                notification = constructNotification("Application refusé",
                        NotificationHelper.constructMessageNotificationRefusOffer(offer.getProgramme()),
                        StatusNotification.ERROR);
                break;
        }

        /*notification.setCreatedBy(student.getCredential().getEmail());*/
        notification.setUser(student);
        notificationRepository.save(notification);
    }

    private Notification constructNotification(@NotNull String title,
                                               @NotNull String message,
                                               @NotNull StatusNotification statusNotification) {
        Notification notification = new Notification();
        notification.setTitle(title);
        notification.setMessage(NotificationHelper
                .constructMessageNotificationApproveOffer(message));
        notification.setStatusNotification(statusNotification);
        return notification;
    }
}
