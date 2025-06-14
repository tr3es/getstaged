package com.getstaged.payload;

import lombok.Data;

@Data
public abstract class UserSummary {

    protected Long id;
    protected String email;
    protected String typeRole;

    public UserSummary() {

    }

    public UserSummary(Long id, String email, String typeRole) {
        this.id = id;
        this.email = email;
        this.typeRole = typeRole;
    }
}
