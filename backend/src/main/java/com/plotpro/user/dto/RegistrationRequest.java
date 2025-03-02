package com.plotpro.user.dto;

import lombok.Data;

@Data
public class RegistrationRequest {
    private String name;
    private String email;
    private String mobile;
    private String companyName;
    private String role;
    private String password;
}