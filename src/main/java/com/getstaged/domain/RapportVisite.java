package com.getstaged.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NonNull;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Arrays;

@Data
@Entity
@Table(name = "RapportVisite")
public class RapportVisite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", referencedColumnName = "user_id", unique = true)
    @JsonIgnore
     Student student;

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

    @Column(name = "confirme_student")
    private Boolean confirmed_student;

    @Column(name = "confirme_entreprise")
    private Boolean confirmed_entreprise;

    @Column(name = "confirme_college")
    private Boolean confirmed_college;

    public RapportVisite(Student student, @NotNull String file_name, @NotNull String file_type, byte[] file_data, String download_uri) {
        this.student = student;
        this.file_name = file_name;
        this.file_type = file_type;
        this.file_data = file_data;
        this.download_uri = download_uri;
    }

    @Override
    public String toString() {
        return "RapportVisite{" +
                "stageId=" + id +
                ", student=" + student.toString() +
                ", file_name='" + file_name + '\'' +
                ", file_type='" + file_type + '\'' +
                ", file_data=" + Arrays.toString(file_data) +
                ", download_uri='" + download_uri + '\'' +
                '}';
    }
}
