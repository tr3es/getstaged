package com.getstaged.domain;

import com.getstaged.security.RoleName;
import lombok.Data;
import org.hibernate.annotations.NaturalId;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;


@Entity
@Table(name = "roles")
@Data
public class Role implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @NaturalId
    @NotNull
    @Column(length = 60)
    private RoleName name;

    public Role(@NotNull RoleName name) {
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

        Role role = (Role) o;

        return !(name != null ? !name.equals(role.name) : role.name != null);
    }

    @Override
    public int hashCode() {
        return name != null ? name.hashCode() : 0;
    }

    @Override
    public String toString() {
        return "Role{" +
                "roleName='" + name + '\'' +
                "}";
    }
}
