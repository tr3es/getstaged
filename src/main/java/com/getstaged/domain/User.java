
package com.getstaged.domain;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.getstaged.domain.audit.AbstractAuditingEntity;
import lombok.Builder;
import lombok.Data;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.Stack;

@Data
@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "DISCRIMINATOR", discriminatorType = DiscriminatorType.STRING)
public abstract class User extends AbstractAuditingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    protected Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "credential_id", nullable = false)
    protected Credential credential;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "address_id")
    protected Address address;

    @Size(max = 50)
    @Column(name = "first_name", length = 50)
    protected String firstName;

    @Size(max = 50)
    @Column(name = "last_name", length = 50)
    protected String lastName;

    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    private Gender gender;

    @Builder.Default
    private boolean activated = false;

    @Builder.Default
    private boolean isBlocked = false;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    protected Set<Role> roles = new HashSet<Role>();

    @OneToMany(cascade = CascadeType.ALL,
            fetch = FetchType.LAZY,
            mappedBy = "user")
    private Set<Notification> notifications;

    public User() {

    }

    public User(@NotNull Credential credential,
                @NotNull Address address) {
        this.credential = credential;
        this.address = address;
        notifications = new HashSet<>();
    }

    public User(@NotNull Credential credential,
                @NotNull Address address,
                @NotNull @Size(max = 50) String firstName,
                @NotNull @Size(max = 50) String lastName) {
        this.credential = credential;
        this.address = address;
        this.firstName = firstName;
        this.lastName = lastName;
        notifications = new HashSet<>();
    }

    @Transient
    public String getDiscriminatorValue() {
        return limitString(this.getClass().getName());
    }

    private String limitString(String name) {
        return name.substring(name.lastIndexOf(".") + 1).toLowerCase();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        User user = (User) o;
        return !(user.getId() == null || getId() == null) && Objects.equals(getId(), user.getId());
    }

    public Credential getCredential() {
        return credential;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", credential=" + credential +
                ", address=" + address +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", gender=" + gender +
                ", roles=" + roles +
                ", createdBy=" + getCreatedBy() +
                '}';
    }


}
