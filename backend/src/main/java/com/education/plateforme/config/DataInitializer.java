package com.education.plateforme.config;

import com.education.plateforme.entity.Matiere;
import com.education.plateforme.entity.Role;
import com.education.plateforme.entity.User;
import com.education.plateforme.repository.MatiereRepository;
import com.education.plateforme.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;


@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private static final String ADMIN_EMAIL = "admin@eduplatform.tn";
    private static final String ADMIN_PASSWORD_DEMO = "Admin1234";

    private static final List<String> MATIERES_REFERENCE = List.of(
            "Mathematiques", "Physique-Chimie", "Francais", "SVT", "Informatique", "Anglais"
    );

    private final UserRepository userRepository;
    private final MatiereRepository matiereRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedAdmin();
        seedMatieresReference();
    }

    private void seedAdmin() {
        if (userRepository.existsByEmail(ADMIN_EMAIL)) {
            return;
        }

        User admin = User.builder()
                .nom("Principal")
                .prenom("Admin")
                .email(ADMIN_EMAIL)
                .password(passwordEncoder.encode(ADMIN_PASSWORD_DEMO))
                .role(Role.ADMIN)
                .enabled(true)
                .mustChangePassword(true)
                .build();
        userRepository.save(admin);

        log.warn("=====================================================================");
        log.warn("Compte ADMIN initial cree : {} / {}", ADMIN_EMAIL, ADMIN_PASSWORD_DEMO);
        log.warn("Identifiants de DEMO uniquement -- a changer immediatement via");
        log.warn("POST /api/auth/change-password (mustChangePassword=true).");
        log.warn("=====================================================================");
    }

    private void seedMatieresReference() {
        for (String nom : MATIERES_REFERENCE) {
            if (!matiereRepository.existsByNom(nom)) {
                matiereRepository.save(Matiere.builder().nom(nom).build());
            }
        }
    }
}
