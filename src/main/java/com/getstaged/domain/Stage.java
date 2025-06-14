package com.getstaged.domain;

import com.fasterxml.jackson.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "stage")
public class Stage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long stageId;

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", referencedColumnName = "user_id")
    private Student student;

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "offer_id", referencedColumnName = "offer_id")
    private Offer offer;

    @Column(name = "date_debut")
    private String dateDebut;

    @Column(name = "date_fin")
    private String dateFin;

    @Override
    public String toString() {
        return "Stage{" +
                "stageId=" + stageId +
                ", student=" + student +
                ", offer=" + offer +
                ", dateDebut='" + dateDebut + '\'' +
                ", dateFin='" + dateFin + '\'' +
                '}';
    }
}
