package com.getstaged.domain;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import lombok.Data;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Data
@Entity
@Table(name = "Students")
@DiscriminatorValue("STUDENT")
public class Student extends User {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "monitor_id", referencedColumnName = "user_id")
    private Monitor monitor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entreprise_id", referencedColumnName = "user_id")
    private Entreprise entreprise;

    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(name = "student_offers",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "offer_id"))
    private Set<Offer> offers = new HashSet<Offer>();

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stage_id")
    private Stage stage;

    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(name = "students_periodes", joinColumns = @JoinColumn(name="user_id"),
                inverseJoinColumns = @JoinColumn(name = "offreperiode_id"))
    protected Set<OfferPeriode> periodes = new HashSet<>();

    public Student() {

    }

    public Student(@NotNull Credential credential,
                   @NotNull Address address,
                   @NotNull @Size(max = 50) String firstName,
                   @NotNull @Size(max = 50) String lastName) {
        super(credential, address, firstName, lastName);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Student{" +
                "id=" + id +
                ", credential=" + credential +
                ", address=" + address +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", roles=" + roles +
                ", createdBy=" + getCreatedBy() +
                '}';
    }

    public void setMonitor(Monitor monitor) {
        this.monitor = monitor;
        monitor.getStudents().add(this);
    }

    /*public void setEntreprise(Entreprise entreprise) {
        this.entreprise = entreprise;
        entreprise.getStudents().add(this);
    }*/
}
