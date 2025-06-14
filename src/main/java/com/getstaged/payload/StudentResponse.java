package com.getstaged.payload;

import lombok.Data;

@Data
public class StudentResponse {

    protected Long id;
    protected Long monitorId;
    protected String firstName;
    protected String lastName;
    protected String email;
    protected boolean isStaged;
    protected boolean isMonitored;
    protected String statusCv;
    protected String status;
    private boolean isBlocked;

    public StudentResponse( ) {
    }

    public StudentResponse(Long id, Long monitorId, String firstName, String lastName,String email) {
        this.id = id;
        this.monitorId = monitorId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }
}
