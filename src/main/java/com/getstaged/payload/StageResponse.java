package com.getstaged.payload;

import com.getstaged.domain.Offer;
import com.getstaged.domain.Student;
import lombok.Data;

@Data
public class StageResponse {

  private Long stageId;
  private String dateDebut;
  private String dateFin;
  private OfferResponse offerResponse;
  private StudentResponse studentResponse;

}
