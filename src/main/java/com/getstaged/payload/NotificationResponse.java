package com.getstaged.payload;

import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class NotificationResponse {

    private Long id;

    @NotNull
    private String title;

    @NotNull
    private String message;

    @NotNull
    private String statusNotification;
    private boolean isSeen;

    @NotNull
    private Long userId;
}
