package com.getstaged.domain;

import com.getstaged.domain.audit.AbstractAuditingEntity;
import com.getstaged.payload.OfferRequestSummary;
import com.getstaged.payload.OfferSummary;

import com.getstaged.util.ModelMapper;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import javax.persistence.*;

import javax.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Entity
@Builder
@AllArgsConstructor
@Table(name = "offers")
public class Offer extends AbstractAuditingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "offer_id", nullable = false)
    private Long id;

    @JoinColumn(name = "entrepriseID", nullable = false)
    private Long entrepriseID;

    @Column(name = "is_active", nullable = false)
    private boolean isActive;

    @Column(name = "is_valid", nullable = false)
    @Builder.Default
    private boolean isValid = false;

    @Column(name = "programme")
    private String programme;

    @JoinColumn(name = "periode")
    @ManyToOne
    private OfferPeriode periode;

    @Column(name = "duree")
    private Integer duree;

    @Column(name = "titre_poste")
    private String titrePoste;

    @Column(name = "nombre_poste", nullable = false)
    private int nombrePoste;

    @Column(name = "horaire_travail")
    private String horaireTravail;

    @Column(name = "taux_horaire")
    private Double tauxHoraire;

    @Size(max = 512)
    @Column(name = "description_mandat", nullable = false)
    private String descriptionMandat;

    @Size(max = 512)
    @Column(name = "exigences", nullable = false)
    private String exigences;

    @Override
    public String toString() {
        return "Offer{" +
            "id=" + id +
            ", entrepriseID=" + entrepriseID +
            ", isActive=" + isActive +
            ", isValid=" + isValid +
            ", programme='" + programme + '\'' +
            ", periode='" + periode + '\'' +
            ", duree=" + duree +
            ", titrePoste='" + titrePoste + '\'' +
            ", nombrePoste=" + nombrePoste +
            ", horaireTravail='" + horaireTravail + '\'' +
            ", tauxHoraire=" + tauxHoraire +
            ", descriptionMandat='" + descriptionMandat + '\'' +
            ", exigences='" + exigences + '\'' +
            '}';
    }

    @ManyToMany(fetch = FetchType.LAZY,
            cascade = {
                    CascadeType.PERSIST,
                    CascadeType.MERGE
            },
            mappedBy = "offers")
    private Set<Student> students = new HashSet<>();

    @OneToMany(cascade = CascadeType.ALL,
            fetch = FetchType.LAZY,
            mappedBy = "offer")
    private Set<ApplicationOffer> applicationOffers = new HashSet<>();

    public Offer() {
    }

    public Offer(OfferSummary offer, String username) {

        this.id = offer.getId();
        this.entrepriseID = offer.getEntrepriseID();
        this.isActive = true;
        this.isValid = false;
        this.descriptionMandat = offer.getDescriptionMandat();
        this.duree = offer.getDuree();
        this.horaireTravail = offer.getHoraireTravail();
        this.exigences = offer.getExigences();
        this.nombrePoste = offer.getNombrePoste();
        this.periode = ModelMapper.mapOfferPeriodeSummaryToOfferPeriode(offer.getPeriode());
        this.programme = offer.getProgramme();
        this.titrePoste = offer.getTitrePoste();
        this.tauxHoraire = Double.parseDouble(offer.getTauxHoraire());
        super.setCreatedBy(username);
    }

    public Offer(OfferRequestSummary offer,OfferPeriode periode, String username) {

      this.id = offer.getId();
      this.entrepriseID = offer.getEntrepriseID();
      this.isActive = true;
      this.isValid = false;
      this.descriptionMandat = offer.getDescriptionMandat();
      this.duree = offer.getDuree();
      this.horaireTravail = offer.getHoraireTravail();
      this.exigences = offer.getExigences();
      this.nombrePoste = offer.getNombrePoste();
      this.periode = periode;
      this.programme = offer.getProgramme();
      this.titrePoste = offer.getTitrePoste();
      this.tauxHoraire = Double.parseDouble(offer.getTauxHoraire());
      super.setCreatedBy(username);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Offer that = (Offer) o;
        return isActive() == that.isActive() &&
                getNombrePoste() == that.getNombrePoste() &&
                Double.compare(that.getTauxHoraire(), getTauxHoraire()) == 0 &&
                Objects.equals(getId(), that.getId()) &&
                Objects.equals(getProgramme(), that.getProgramme()) &&
                Objects.equals(getPeriode(), that.getPeriode()) &&
                Objects.equals(getDuree(), that.getDuree()) &&
                Objects.equals(getTitrePoste(), that.getTitrePoste()) &&
                Objects.equals(getHoraireTravail(), that.getHoraireTravail()) &&
                Objects.equals(getDescriptionMandat(), that.getDescriptionMandat()) &&
                Objects.equals(getExigences(), that.getExigences());
    }

    @Override
    public int hashCode() {
        return Objects
                .hash(getId(), isActive(), getProgramme(), getPeriode(), getDuree(),
                        getTitrePoste(), getNombrePoste(), getHoraireTravail(), getTauxHoraire(),
                        getDescriptionMandat(), getExigences());
    }
}