package com.education.plateforme.dto.response;

import com.education.plateforme.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSummaryResponse {

    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private Role role;
    private Boolean mustChangePassword;
}
