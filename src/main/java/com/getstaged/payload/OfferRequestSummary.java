package com.getstaged.payload;

import lombok.Data;

@Data
public class OfferRequestSummary {

  private Long id;
  private Long entrepriseID;
  private String programme;
  private Long periode;
  private int duree;
  private String titrePoste;
  private int nombrePoste;
  private String horaireTravail;
  private String tauxHoraire;
  private String descriptionMandat;
  private String exigences;

  public OfferRequestSummary() {
  }
}
