package com.getstaged.payload;

import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
public class SignUpRequest {

    @Size(min = 4, max = 50)
    private String firstName;

    @Size(min = 4, max = 50)
    private String lastName;

    @NotBlank
    @Size(max = 100)
    @Email
    private String email;

    @NotBlank
    @Size(min = 6, max = 20)
    private String password;

    @NotBlank
    private String typeForm;

    @NotBlank
    @Size(max = 15)
    private String typeRole;

    private String enterpriseName;
}
