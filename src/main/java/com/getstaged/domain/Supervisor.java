package com.getstaged.domain;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import lombok.Data;


@Data
@Entity
@Table(name = "supervisors")
@DiscriminatorValue("SUPERVISOR")
public class Supervisor extends User {


    public Supervisor(@NotNull Credential credential,
                      @NotNull Address address,
                      @NotNull @Size(max = 50) String firstName,
                      @NotNull @Size(max = 50) String lastName) {
        super(credential, address, firstName, lastName);
    }
}
