package com.getstaged.payload;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
public class EnterpriseSummary extends UserSummary {

    private String nameEnterprise;

    public EnterpriseSummary(Long id, String email, String typeRole, String nameEnterprise) {
        super(id, email, typeRole);
        this.nameEnterprise = nameEnterprise;
    }
}
