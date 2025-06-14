package com.getstaged.domain;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

@Data
@Entity
@Table(name = "enterprises")
@DiscriminatorValue("ENTREPRISE")
public class Entreprise extends User {

    @Column(name = "nom_entreprise", nullable = false)
    private String name;

    @OneToMany(cascade = CascadeType.ALL,
            fetch = FetchType.LAZY,
            mappedBy = "entreprise",
            targetEntity = Student.class)
    @JsonIgnore
    private Set<Student> students = new HashSet<Student>();

    public Entreprise() {
    }

    public Entreprise(Credential credential, Address address, String nameEnterprise) {
        super(credential, address);
        this.name = nameEnterprise;
    }

    public Entreprise(Credential credential, Address address,
                      List<Offer> listeOffres, String name) {
        this.credential = credential;
        this.address = address;
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        if (!super.equals(o)) {
            return false;
        }
        Entreprise that = (Entreprise) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(getCredential(), that.getCredential()) &&
                Objects.equals(address, that.address) &&
                Objects.equals(name, that.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), id, getCredential(), address, name);
    }

    public void addStudents(Student student) {
        this.students.add(student);
        student.setEntreprise(this);
    }
}
