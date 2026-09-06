package com.education.plateforme.mapper;

import com.education.plateforme.dto.response.UserSummaryResponse;
import com.education.plateforme.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserSummaryResponse toSummary(User user) {
        if (user == null) {
            return null;
        }
        return UserSummaryResponse.builder()
                .id(user.getId())
                .nom(user.getNom())
                .prenom(user.getPrenom())
                .email(user.getEmail())
                .role(user.getRole())
                .mustChangePassword(user.getMustChangePassword())
                .build();
    }
}
