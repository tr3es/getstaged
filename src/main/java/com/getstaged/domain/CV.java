package com.getstaged.domain;

import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Data
@Getter
@Setter
@Entity
@ToString
@Table(name = "cvs")
public class CV {

    @Id
    @Column(name = "id")
    protected Long id;

    @NotNull
    @Column(length = 50)
    protected String name;

    @NotNull
    @Column(length = 50)
    protected String email;

    @NotNull
    @Column(name = "approved")
    protected String approved;

    @NotNull
    @Column(name = "file_name")
    protected String file_name;

    @NotNull
    @Column(name = "file_type")
    protected String file_type;

    @Lob
    @NonNull
    @Column(name = "file_data")
    protected byte[] file_data;

    @Column(name = "download_uri")
    protected String download_uri;

   /* @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private Student student;*/

    public CV(@NotNull Long id, @NotNull String name, @NotNull String email, @NotNull String file_name, String file_type, byte[] file_data, String download_uri) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.approved = "En approbation";
        this.file_name = file_name;
        this.file_type = file_type;
        this.file_data = file_data;
        this.download_uri = download_uri;
    }
}
