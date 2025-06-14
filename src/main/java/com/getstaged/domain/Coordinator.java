package com.getstaged.domain;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import lombok.Data;

@Data
@Entity
@Table(name = "coordinators")
@DiscriminatorValue("COORDINATOR")
public class Coordinator extends User {

    public Coordinator(@NotNull Credential credential,
                       @NotNull Address address,
                       @NotNull @Size(max = 50) String firstName,
                       @NotNull @Size(max = 50) String lastName) {
        super(credential, address, firstName, lastName);
    }
}
