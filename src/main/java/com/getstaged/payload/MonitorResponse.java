package com.getstaged.payload;

import lombok.Data;

@Data
public class MonitorResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private int numberStagiaires;
    private boolean isBlocked;
}
