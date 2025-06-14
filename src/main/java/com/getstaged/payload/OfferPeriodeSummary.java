package com.getstaged.payload;

import lombok.Data;

@Data
public class OfferPeriodeSummary {

  private Long id;
  private String saison;
  private String annee;
  private boolean estActive;

  public OfferPeriodeSummary(Long id, String saison, String annee, boolean estActive) {
    this.id = id;
    this.saison = saison;
    this.annee = annee;
    this.estActive = estActive;
  }
}
