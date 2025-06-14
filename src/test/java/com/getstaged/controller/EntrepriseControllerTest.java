package com.getstaged.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static sun.plugin2.util.PojoUtil.toJson;

import com.getstaged.domain.Offer;
import com.getstaged.payload.EvaluationStagiaireSummary;
import com.getstaged.payload.OfferRequestSummary;
import com.getstaged.repository.OfferRepository;
import com.getstaged.security.UserPrincipal;
import java.util.ArrayList;
import net.minidev.json.JSONObject;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc(secure=false)
public class EntrepriseControllerTest {

  @Autowired
  private MockMvc mvc;

  @Autowired
  private WebApplicationContext context;


  @Autowired
  private OfferRepository offerRepository;

  @Autowired
  private WebApplicationContext webApplicationContext;

  @Mock
  MockMultipartFile file;

  @Before
  public void setUp(){
    mvc = MockMvcBuilders
        .webAppContextSetup(context)
        .build();
    file = new MockMultipartFile("data", "filename.txt", "text/plain", "some xml".getBytes());

  }

  @Test
  public void getCurrentEntreprise() throws Exception {
    this.mvc.perform(get("/api/profil?id=1")).andExpect(status().isOk());
  }

  @Test
  public void getEntreprise() throws Exception {
    this.mvc.perform(get("/api/entreprise?id=1")).andExpect(status().isOk());
  }

  @Test
  @WithMockUser(roles = "USER")
  public void getOfferList() throws Exception {
    this.mvc.perform(get("/api/offres").param("id","1")).andExpect(status().isOk());
  }

  @Test
  @WithMockUser(roles = "USER")
  public void deleteOffer() throws Exception {
    offerRepository.save(new Offer());
    this.mvc.perform(delete("/api/entreprises/offres/1")).andExpect(status().isOk());
  }

  @Test
  @WithMockUser(roles = "USER")
  public void getEntrepriseOffers() throws Exception {
    UserPrincipal user = new UserPrincipal(1L,"test","test","test","test","USER",null);
    this.mvc.perform(get("/api/entreprises/offers")
        .content(user.toString())
        .requestAttr("page", 1)
        .requestAttr("size",1)).andExpect(status().isOk());
  }

  @Test
  public void getEntrepriseStages() throws Exception {
    JSONObject credential = new JSONObject();
    credential.put("email","admin@getstaged.com");
    credential.put("password", "admin");
    this.mvc.perform(get("/api/entreprise/stages").content(credential.toString())).andExpect(status().isOk());
  }

  @Test
  @WithMockUser(roles = "USER")
  public void handleEntenteUpload() throws Exception {
    mvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    mvc.perform(MockMvcRequestBuilders.multipart("/api/entreprise/ententeStage/1").file("file",file.getBytes())).andExpect(status().isOk());
  }

  @Test
  public void sendEmailWithEntente() throws Exception {
    this.mvc.perform(get("/api/entreprise/ententeSigneeEmail").param("student", "1")).andExpect(status().isOk());
  }

  @Test
  public void getOfferDetail() throws Exception {
    this.mvc.perform(get("/api/VotreEntreprise/Offre/1")).andExpect(status().isOk());
  }

  @Test
  public void createOffer() throws Exception {
    OfferRequestSummary sum = new OfferRequestSummary();
    sum.setId(1L);
    sum.setEntrepriseID(1L);
    sum.setPeriode(1L);
    this.mvc.perform(post("/api/VotreEntreprise")
      .contentType(MediaType.APPLICATION_JSON)
      .content(toJson(sum))).andExpect(status().isOk());
  }

  @Test
  public void createEvaluationStagiaire() throws Exception {
    EvaluationStagiaireSummary sum = new EvaluationStagiaireSummary(1L,1L,
        1L,null,null,1,"",
        2.5,1,"","",1);
    this.mvc.perform(post("/api/VotreEntreprise/EvaluationStagiaire")
        .contentType(MediaType.APPLICATION_JSON)
        .content(toJson(sum))).andExpect(status().isOk());
  }

  @Test
  public void getEvaluationDetail() throws Exception {
    this.mvc.perform(get("/api/EvaluationStagiaire/1")).andExpect(status().isOk());
  }

  @Test
  public void createPDFFromHTML() throws Exception {
    String html ="<div> test</div>";
    mvc.perform(post("/api/createEval/1")
        .content(html)
    ).andExpect(status().isOk());
  }

  @Test
  public void handFileDownload() throws Exception {
    this.mvc.perform(get("/api//downloadEval/1")).andExpect(status().isOk());
  }

  @After
  public void tearDown(){

  }
}