package com.getstaged.domain;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.getstaged.util.Constants;
import lombok.Data;

@Data
@Entity
@Table(name = "credentials")
@JsonPropertyOrder({"email", "password"})
public class Credential {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "credential_id")
    private Long id;

    @NotNull
    @Pattern(regexp = Constants.LOGIN_REGEX)
    @Column(length = 50, unique = true, nullable = false)
    private String email;

    @NotNull
    @JsonIgnore
    @Size(max = 100)
    private String password;

    @OneToOne(fetch = FetchType.LAZY,
            cascade = CascadeType.ALL,
            mappedBy = "credential")
    private User user;

    public Credential() {

    }

    public Credential(@NotNull @Pattern(regexp = Constants.LOGIN_REGEX) String email, @NotNull String password) {
        this.email = email;
        this.password = password;
    }

    @Override
    public String toString() {
        return "Credential{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
