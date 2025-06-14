package com.getstaged.payload;

import lombok.Data;

@Data
public class EntrepriseSummary {

  private Long id;
  private String adresse;
  private String name;
  private String emailContact;

  public EntrepriseSummary(Long id, String adresse, String name, String emailContact) {
    this.id = id;
    this.adresse = adresse;
    this.name = name;
    this.emailContact = emailContact;
  }
}
