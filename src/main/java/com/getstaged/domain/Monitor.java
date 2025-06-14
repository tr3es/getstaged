package com.getstaged.domain;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Data
@Entity
@Table(name = "Monitors")
@DiscriminatorValue("MONITOR")
public class Monitor extends User {

    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL,
            fetch = FetchType.LAZY,
            mappedBy = "monitor",
            targetEntity = Student.class)
    private Set<Student> students = new HashSet<Student>();

    public Monitor() {
    }

    public Monitor(@NotNull Credential credential,
                   @NotNull Address address,
                   @NotNull @Size(max = 50) String firstName,
                   @NotNull @Size(max = 50) String lastName) {
        super(credential, address, firstName, lastName);
    }

    @Override
    public String toString() {
        return "Monitor{" +
                "id=" + id +
                ", credential=" + credential +
                ", address=" + address +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", roles=" + roles +
                ", createdBy=" + getCreatedBy() +
                '}';
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

}
