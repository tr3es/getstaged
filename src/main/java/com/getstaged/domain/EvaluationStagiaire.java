package com.getstaged.domain;

import com.getstaged.payload.EvaluationStagiaireSummary;

import java.util.HashMap;
import java.util.Map;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.Data;

@Data
@Entity
public class EvaluationStagiaire {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "eval_id", nullable = false)
    private Integer id;

  /*@OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "student_eval")
  private Student eleve;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "entreprise_eval")
  private Entreprise entreprise;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "offre_eval")
  private EntrepriseOffer offre;*/

    @Column(name = "student_eval")
    private Long eleve;

    @Column(name = "entreprise_eval")
    private Long entreprise;

    @Column(name = "offre_eval")
    private Long offre;

    @ElementCollection
    private Map<Integer, Integer> tableauReponses;

    @ElementCollection
    private Map<Integer, String> listeCommentaires;

    @Column(name = "niveauAppreciation_eval", nullable = false)
    private int niveauAppreciationGlobale;

    @Column(name = "precisionsAppreciation_eval")
    private String precisionsAppreciationGlobale;

    @Column(name = "heuresEncadrement_eval")
    private double heuresEncadrement;

    @Column(name = "accueilPro_eval")
    private int accueilProchain;

    @Column(name = "discussion_eval")
    private int discussion;

    @Column(name = "formation_eval")
    private String formationStagiaire;

    @Column(name = "date_eval")
    private String dateSoumission;

    //public EvaluationStagiaire(EvaluationStagiaireSummary eval, Student eleve, Entreprise entreprise, EntrepriseOffer entrepriseOffer){
    public EvaluationStagiaire(EvaluationStagiaireSummary eval) {
        this.eleve = eval.getEleveID();
        this.entreprise = eval.getEntrepriseID();
        this.offre = eval.getOffreID();
    /*this.eleve = eleve;
    this.entreprise = entreprise;
    this.offre = entrepriseOffer;*/
        //this.tableauReponses = eval.getTableauReponses();
        this.tableauReponses = new HashMap<>();
        for (int i = 0; i < eval.getTableauReponses().size(); i++) {
            tableauReponses.put(i, eval.getTableauReponses().get(i));
        }
        //this.listeCommentaires = eval.getListeCommentaires();
        this.listeCommentaires = new HashMap<>();
        for (int i = 0; i < eval.getListeCommentaires().size(); i++) {
            listeCommentaires.put(i, eval.getListeCommentaires().get(i));
        }
        this.niveauAppreciationGlobale = eval.getNiveauAppreciationGlobale();
        this.precisionsAppreciationGlobale = eval.getPrecisionsAppreciationGlobale();
        this.heuresEncadrement = eval.getHeuresEncadrement();
        this.accueilProchain = eval.getAccueilProchain();
        this.formationStagiaire = eval.getFormationStagiaire();
        this.dateSoumission = eval.getDateSoumission();
        this.discussion = eval.getDiscussion();
    }
}
