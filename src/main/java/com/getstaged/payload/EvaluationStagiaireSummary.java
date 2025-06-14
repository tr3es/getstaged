package com.getstaged.payload;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EvaluationStagiaireSummary {

  private Long eleveID;
  private Long entrepriseID;
  private Long offreID;
  private List<Integer> tableauReponses;
  private List<String> listeCommentaires;
  private int niveauAppreciationGlobale;
  private String precisionsAppreciationGlobale;
  private double heuresEncadrement;
  private int AccueilProchain; //caps
  private  String formationStagiaire;
  private String dateSoumission;
  private int discussion;

  /*"nomEleve":"",
      "programmeEtude":"",
      "nomEntreprise":"",
      "nomSuperviseur":"",
      "fonctionSuperviseur":"",
      "telephoneSuperviseur":"",*/
      /*"tableauReponses":[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
    "listeCommentaires":["aaa"],
    "niveauAppreciationGlobale":1,
      "precisionsAppreciationGlobale":"aaaaaaaaaaa",
      "heuresEncadrement":"6",
          "AccueilProchain":2,
      "formationStagiaire":"non",
      "dateSoumission":"Tue Oct 23 2018"*/
}
