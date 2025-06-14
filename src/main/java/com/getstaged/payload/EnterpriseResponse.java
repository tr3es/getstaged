package com.getstaged.payload;

import lombok.Data;

@Data
public class EnterpriseResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private boolean isBlocked;
}
