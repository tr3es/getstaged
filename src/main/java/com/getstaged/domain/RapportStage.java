package com.getstaged.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.Arrays;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import lombok.Data;
import lombok.NonNull;

@Data
@Entity
@Table(name = "RapportStage")
public class RapportStage {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long rapportId;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "student_id", referencedColumnName = "user_id", unique = true)
  @JsonIgnore
  private Student student;

  @NotNull
  @Column(name = "file_name")
  protected String file_name;

  @NotNull
  @Column(name = "file_type")
  private String file_type;

  @Lob
  @NonNull
  @Column(name = "file_data")
  private byte[] file_data;

  @Column(name = "download_uri")
  private String download_uri;

  public RapportStage(Student student,
      @NotNull String file_name, @NotNull String file_type, byte[] file_data,
      String download_uri) {
    this.student = student;
    this.file_name = file_name;
    this.file_type = file_type;
    this.file_data = file_data;
    this.download_uri = download_uri;
  }

  @Override
  public String toString() {
    return "RapportStage{" +
        "rapportId=" + rapportId +
        ", student=" + student +
        ", file_name='" + file_name + '\'' +
        ", file_type='" + file_type + '\'' +
        ", file_data=" + Arrays.toString(file_data) +
        ", download_uri='" + download_uri + '\'' +
        '}';
  }
}
