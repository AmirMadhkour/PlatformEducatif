package com.education.plateforme.service.impl;

import com.education.plateforme.dto.request.ChangePasswordRequest;
import com.education.plateforme.dto.request.LoginRequest;
import com.education.plateforme.dto.request.MatiereSouhaiteeRequest;
import com.education.plateforme.dto.request.RegisterRequest;
import com.education.plateforme.dto.request.UpdateProfileRequest;
import com.education.plateforme.dto.response.LoginResponse;
import com.education.plateforme.dto.response.MessageResponse;
import com.education.plateforme.dto.response.RegisterResponse;
import com.education.plateforme.dto.response.UserSummaryResponse;
import com.education.plateforme.entity.Affectation;
import com.education.plateforme.entity.Eleve;
import com.education.plateforme.entity.Matiere;
import com.education.plateforme.entity.Role;
import com.education.plateforme.entity.User;
import com.education.plateforme.exception.BadRequestException;
import com.education.plateforme.exception.DuplicateResourceException;
import com.education.plateforme.exception.ResourceNotFoundException;
import com.education.plateforme.mapper.UserMapper;
import com.education.plateforme.repository.AffectationRepository;
import com.education.plateforme.repository.EleveRepository;
import com.education.plateforme.repository.MatiereRepository;
import com.education.plateforme.repository.UserRepository;
import com.education.plateforme.security.JwtUtils;
import com.education.plateforme.security.UserDetailsImpl;
import com.education.plateforme.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final EleveRepository eleveRepository;
    private final MatiereRepository matiereRepository;
    private final AffectationRepository affectationRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserMapper userMapper;

    @Override
    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Un compte existe deja avec cet email.");
        }



        com.education.plateforme.entity.TypeBac typeBac = null;
        String paysBac = null;
        if (request.getNiveau() == com.education.plateforme.entity.Niveau.BACCALAUREAT) {
            if (request.getTypeBac() == null) {
                throw new BadRequestException("Le type de baccalaureat (tunisien ou etranger) est obligatoire.");
            }
            typeBac = request.getTypeBac();
            if (typeBac == com.education.plateforme.entity.TypeBac.ETRANGER) {
                if (request.getPaysBac() == null || request.getPaysBac().isBlank()) {
                    throw new BadRequestException("Le pays est obligatoire pour un baccalaureat etranger.");
                }
                paysBac = request.getPaysBac();
            }
        }

        User user = User.builder()
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .telephone(request.getTelephone())
                .role(Role.ELEVE)
                .enabled(false)
                .mustChangePassword(false)
                .build();
        user = userRepository.save(user);

        Eleve eleve = Eleve.builder()
                .user(user)
                .niveau(request.getNiveau())
                .typeBac(typeBac)
                .paysBac(paysBac)
                .classe(request.getClasse())
                .dateNaissance(request.getDateNaissance())
                .parentNom(request.getParentNom())
                .parentTelephone(request.getParentTelephone())
                .adresse(request.getAdresse())
                .valide(false)
                .build();
        eleve = eleveRepository.save(eleve);

        for (MatiereSouhaiteeRequest ms : request.getMatieresSouhaitees()) {
            Matiere matiere = matiereRepository.findById(ms.getMatiereId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Matiere introuvable, id=" + ms.getMatiereId()));

            Affectation affectation = Affectation.builder()
                    .eleve(eleve)
                    .matiere(matiere)
                    .enseignant(null)
                    .typeCours(ms.getTypeCours())
                    .build();
            affectationRepository.save(affectation);
        }

        return RegisterResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .message("Compte cree avec succes. Il est en attente de validation par l'administrateur "
                        + "et d'affectation d'un enseignant pour chaque matiere demandee.")
                .build();
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable."));

        String token = jwtUtils.generateToken(userDetails);

        return LoginResponse.builder()
                .token(token)
                .user(userMapper.toSummary(user))
                .build();
    }

    @Override
    @Transactional
    public MessageResponse changePassword(String emailUtilisateurConnecte, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(emailUtilisateurConnecte)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable."));

        boolean changementInitialForce = Boolean.TRUE.equals(user.getMustChangePassword());

        if (!changementInitialForce) {

            if (request.getAncienMotDePasse() == null
                    || !passwordEncoder.matches(request.getAncienMotDePasse(), user.getPassword())) {
                throw new BadRequestException("L'ancien mot de passe est incorrect.");
            }
        }






        user.setPassword(passwordEncoder.encode(request.getNouveauMotDePasse()));
        user.setMustChangePassword(false);
        userRepository.save(user);

        return MessageResponse.builder()
                .message("Mot de passe modifie avec succes.")
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public UserSummaryResponse getCurrentUserSummary(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable."));
        return userMapper.toSummary(user);
    }

    @Override
    @Transactional
    public UserSummaryResponse updateBasicProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable."));

        user.setNom(request.getNom());
        user.setPrenom(request.getPrenom());
        user.setTelephone(request.getTelephone());
        user = userRepository.save(user);

        return userMapper.toSummary(user);
    }
}
