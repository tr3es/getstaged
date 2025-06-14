package com.getstaged.pdf;

import static org.junit.Assert.*;

import com.getstaged.domain.EvaluationStagiaire;
import com.getstaged.repository.EvaluationStagiaireRepository;
import com.getstaged.service.EvaluationStagiaireService;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

public class EvalPDFServiceTest {


  @Autowired
  EvaluationStagiaireRepository evaluationStagiaireRepository;

  @Test
  public void genererDocumentPDF() {

  }
}