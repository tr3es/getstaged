package com.getstaged.domain;

import lombok.Data;
import javax.persistence.*;
import javax.validation.constraints.Size;

@Data
@Entity
@Table(name = "Addresses")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "address_id")
    private Long id;

    private String address;

    @Size(max = 100)
    @Column(name = "postal_code")
    private String postalCode;

    @Size(max = 100)
    private String city;

    @Size(max = 100)
    private String state;

    @Size(max = 100)
    private String country;

    public Address() {

    }

    public Address(String address, @Size(max = 100) String postalCode, @Size(max = 100) String city, @Size(max = 100) String state, @Size(max = 100) String country) {
        this.address = address;
        this.postalCode = postalCode;
        this.city = city;
        this.state = state;
        this.country = country;
    }

    @OneToOne(fetch = FetchType.LAZY,
            cascade = CascadeType.ALL,
            mappedBy = "address")
    private User user;

    @Override
    public String toString() {
        return "Address{" +
                "id=" + id +
                ", address='" + address + '\'' +
                ", postalCode='" + postalCode + '\'' +
                ", city='" + city + '\'' +
                ", state='" + state + '\'' +
                ", country='" + country + '\'' +
                '}';
    }
}
