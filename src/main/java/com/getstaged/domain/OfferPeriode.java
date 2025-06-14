package com.getstaged.domain;

import java.util.Objects;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Entity
@Builder
@AllArgsConstructor
@Table(name = "offer_periode", uniqueConstraints={
    @UniqueConstraint(columnNames = {"saison", "annee"})
})
public class OfferPeriode {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "offreperiode_id", nullable = false)
  private Long id;

  @Column(name = "saison")
  private String saison;

  @Column(name = "annee")
  private int annee;

  @Column(name = "est_active")
  private boolean estActive;

  public OfferPeriode(String saison, int annee, boolean estActive) {
    this.saison = saison;
    this.annee = annee;
    this.estActive = estActive;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    OfferPeriode periode = (OfferPeriode) o;
    return getAnnee() == periode.getAnnee() &&
        isEstActive() == periode.isEstActive() &&
        Objects.equals(getId(), periode.getId()) &&
        Objects.equals(getSaison(), periode.getSaison());
  }

  @Override
  public int hashCode() {
    return Objects.hash(getId(), getSaison(), getAnnee(), isEstActive());
  }
}
