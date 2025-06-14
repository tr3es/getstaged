package com.getstaged.domain;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;

@Data
@Embeddable
public class ApplicationOfferKey implements Serializable {

    @Column(name = "offer_id", nullable = false)
    private Long offerId;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    public ApplicationOfferKey(Long offerId, Long studentId) {
        this.offerId = offerId;
        this.studentId = studentId;
    }
}
