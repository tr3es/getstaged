package com.getstaged.domain;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import lombok.Data;

@Data
@Entity
@DiscriminatorValue("DIRECTOR")
public class Director extends User{

    public Director(@NotNull Credential credential,
                      @NotNull Address address,
                      @NotNull @Size(max = 50) String firstName,
                      @NotNull @Size(max = 50) String lastName) {
        super(credential, address, firstName, lastName);
    }

}
