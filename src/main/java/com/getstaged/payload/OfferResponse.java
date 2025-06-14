package com.getstaged.payload;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.List;

@Data
public class OfferResponse {

    private Long id;

    private UserSummary createdBy;
    private String nameEnterprise;
    private int nombrePoste;
    private String titrePoste;
    private String programme;
    private String description;
    private OfferPeriodeSummary periode;
    private Integer duree;
    private String exigences;
    private String horaireTravail;

    @NotBlank
    private double tauxHoraire;

    private List<ApplyResponse> applies = new ArrayList<>();

    @NotBlank
    private boolean isValid;
    private boolean isActive;
}
