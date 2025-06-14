package com.getstaged.service;

import com.getstaged.domain.Address;
import com.getstaged.domain.Credential;
import com.getstaged.domain.Notification;
import com.getstaged.domain.User;
import com.getstaged.exception.ResourceNotFoundException;
import com.getstaged.payload.NotificationResponse;
import com.getstaged.repository.AddressRepository;
import com.getstaged.repository.CredentialRepository;
import com.getstaged.repository.UserRepository;
import com.getstaged.util.Constants;
import com.getstaged.util.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private CredentialRepository credentialRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    AddressRepository addressRepository;

    public User getUserByEmail(String email) {
        Credential credential = credentialRepository.findByEmail(email);
        User user = userRepository.findById(credential.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return user;
    }

    public List<NotificationResponse> getAllNotifications(Long userId) {
        User user = userRepository.getOne(userId);
        List<Notification> notifications = new ArrayList<>(user.getNotifications());
        Collections.reverse(notifications);
        List<NotificationResponse> notificationResponses = notifications.stream()
                .filter(notification -> !notification.isChecked())
                .map(ModelMapper::mapNotificationToNotificationResponse)
                .limit(Constants.DEFAULT_LIMIT_NOTIFICATIONS)
                .collect(Collectors.toList());

        return notificationResponses;
    }

    public Boolean isEmailUserAvailable(String email) {
        return !userRepository.existsByCredentialEmail(email);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public Credential saveUserCredential(Credential credential) {
        return credentialRepository.save(credential);
    }

    public Address saveUserAddress(Address address) {
        return addressRepository.save(address);
    }
}
