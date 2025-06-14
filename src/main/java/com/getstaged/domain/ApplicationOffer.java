package com.getstaged.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "application_offers")
@Data
public class ApplicationOffer {

    @EmbeddedId
    private ApplicationOfferKey applicationId;

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(length = 40)
    @Builder.Default
    private StatusOffer statusOfferName = StatusOffer.NONE;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "offer_apply", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private Offer offer;

    @Column(name = "entrepriseNom", nullable = true)
    private String entrepriseNom;

    @Column(name = "dateEntrevue")
    private String date = "2018/11/14";

    public ApplicationOffer(){

    }

    public ApplicationOffer(ApplicationOfferKey applicationId, Offer offer) {
        this.applicationId = applicationId;
        this.offer = offer;
    }
}
