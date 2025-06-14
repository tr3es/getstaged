package com.getstaged.payload;

import lombok.Data;

@Data
public class SchoolSummary extends UserSummary {

    private String firstName;
    private String lastName;

    public SchoolSummary(Long id, String email, String typeRole, String firstName, String lastName) {
        super(id, email, typeRole);
        this.firstName = firstName;
        this.lastName = lastName;
    }
}
