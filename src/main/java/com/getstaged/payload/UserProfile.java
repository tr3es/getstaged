package com.getstaged.payload;

import lombok.Data;

import java.time.Instant;

@Data
public class UserProfile {

    private Long id;
    private String email;
    private String name;
    private Instant joinedAt;

    public UserProfile(Long id, String email, String name, Instant joinedAt) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.joinedAt = joinedAt;
    }
}
