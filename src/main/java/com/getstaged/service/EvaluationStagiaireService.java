package com.getstaged.service;

import com.getstaged.domain.Entreprise;
import com.getstaged.domain.EvaluationStagiaire;
import com.getstaged.domain.Student;
import com.getstaged.payload.EvaluationStagiaireSummary;
import com.getstaged.repository.EntrepriseRepository;
import com.getstaged.repository.EvaluationStagiaireRepository;
import com.getstaged.repository.StudentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EvaluationStagiaireService {

  @Autowired
  StudentRepository studentRepository;
  @Autowired
  EntrepriseRepository entrepriseRepository;
  /*@Autowired
  EntrepriseOfferRepository entrepriseOfferRepository;*/
  @Autowired
  EvaluationStagiaireRepository evaluationStagiaireRepository;

  private static final Logger logger = LoggerFactory.getLogger(EvaluationStagiaireService.class);

  public  EvaluationStagiaire convertToEvaluationStagiaire(EvaluationStagiaireSummary eval) {
    /*Student eleve = studentRepository.findStudentById(eval.getEleveID());
    Entreprise entreprise = entrepriseRepository.getEntrepriseById(eval.getEntrepriseID());
    EntrepriseOffer entrepriseOffer = entrepriseOfferRepository.getById(eval.getOffreID());

    return new EvaluationStagiaire(eval,eleve,entreprise, entrepriseOffer);*/
    return new EvaluationStagiaire(eval);
  }
  public EvaluationStagiaire findEvaluationStagiaire(Integer evalId){
    return evaluationStagiaireRepository.getById(evalId);
  }
}
