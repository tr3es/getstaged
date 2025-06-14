package com.getstaged.payload;

import com.getstaged.domain.OfferPeriode;
import lombok.Data;

@Data
public class OfferSummary {

    private Long id;
    private Long entrepriseID;
    private String programme;
    private OfferPeriodeSummary periode;
    private int duree;
    private String titrePoste;
    private int nombrePoste;
    private String horaireTravail;
    private String tauxHoraire;
    private String descriptionMandat;
    private String exigences;

    public OfferSummary(Long id, Long entrepriseID, String programme, OfferPeriodeSummary periode, int duree,
                        String titrePoste, int nombrePoste, String horaireTravail, String tauxHoraire,
                        String descriptionMandat, String exigences) {
        this.id = id;
        this.entrepriseID = entrepriseID;
        this.programme = programme;
        this.periode = periode;
        this.duree = duree;
        this.titrePoste = titrePoste;
        this.nombrePoste = nombrePoste;
        this.horaireTravail = horaireTravail;
        this.tauxHoraire = tauxHoraire;
        this.descriptionMandat = descriptionMandat;
        this.exigences = exigences;
    }

}
