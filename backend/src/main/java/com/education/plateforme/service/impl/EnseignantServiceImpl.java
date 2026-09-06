package com.education.plateforme.service.impl;

import com.education.plateforme.dto.request.EnseignantCreateRequest;
import com.education.plateforme.dto.request.EnseignantUpdateRequest;
import com.education.plateforme.dto.request.UpdateProfileRequest;
import com.education.plateforme.dto.response.EleveResponse;
import com.education.plateforme.dto.response.EnseignantResponse;
import com.education.plateforme.entity.Affectation;
import com.education.plateforme.entity.Eleve;
import com.education.plateforme.entity.Enseignant;
import com.education.plateforme.entity.Matiere;
import com.education.plateforme.entity.Role;
import com.education.plateforme.entity.User;
import com.education.plateforme.exception.BadRequestException;
import com.education.plateforme.exception.DuplicateResourceException;
import com.education.plateforme.exception.ResourceNotFoundException;
import com.education.plateforme.mapper.EleveMapper;
import com.education.plateforme.mapper.EnseignantMapper;
import com.education.plateforme.repository.AffectationRepository;
import com.education.plateforme.repository.CoursRepository;
import com.education.plateforme.repository.EnseignantRepository;
import com.education.plateforme.repository.MatiereRepository;
import com.education.plateforme.repository.UserRepository;
import com.education.plateforme.service.EnseignantService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EnseignantServiceImpl implements EnseignantService {

    private final EnseignantRepository enseignantRepository;
    private final UserRepository userRepository;
    private final MatiereRepository matiereRepository;
    private final CoursRepository coursRepository;
    private final AffectationRepository affectationRepository;
    private final PasswordEncoder passwordEncoder;
    private final EnseignantMapper enseignantMapper;
    private final EleveMapper eleveMapper;

    @Override
    @Transactional(readOnly = true)
    public List<EnseignantResponse> getAll(Long matiereId) {
        List<Enseignant> enseignants = (matiereId == null)
                ? enseignantRepository.findAll()
                : enseignantRepository.findByMatieres_Id(matiereId);
        return enseignants.stream().map(enseignantMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public EnseignantResponse getById(Long id) {
        return enseignantMapper.toResponse(findOrThrow(id));
    }

    @Override
    @Transactional
    public EnseignantResponse create(EnseignantCreateRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Un compte existe deja avec cet email.");
        }

        Set<Matiere> matieres = resoudreMatieres(request.getMatieresIds());
        String paysValide = validerOrigineDiplome(request.getOrigineDiplome(), request.getPaysDiplome());

        User user = User.builder()
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getMotDePasseTemporaire()))
                .telephone(request.getTelephone())
                .role(Role.ENSEIGNANT)
                .enabled(true)
                .mustChangePassword(true)
                .build();
        user = userRepository.save(user);

        Enseignant enseignant = Enseignant.builder()
                .user(user)
                .specialite(request.getSpecialite())
                .diplome(request.getDiplome())
                .origineDiplome(request.getOrigineDiplome())
                .paysDiplome(paysValide)
                .experience(request.getExperience())
                .dateEmbauche(request.getDateEmbauche())
                .biographie(request.getBiographie())
                .matieres(matieres)
                .niveaux(new java.util.HashSet<>(request.getNiveaux()))
                .build();

        return enseignantMapper.toResponse(enseignantRepository.save(enseignant));
    }

    @Override
    @Transactional
    public EnseignantResponse update(Long id, EnseignantUpdateRequest request) {
        Enseignant enseignant = findOrThrow(id);
        appliquerMiseAJourCommune(enseignant, request.getNom(), request.getPrenom(), request.getTelephone(),
                request.getSpecialite(), request.getDiplome(), request.getExperience(), request.getBiographie(),
                request.getOrigineDiplome(), request.getPaysDiplome());
        enseignant.setDateEmbauche(request.getDateEmbauche());

        if (request.getMatieresIds() != null) {
            enseignant.setMatieres(resoudreMatieres(request.getMatieresIds()));
        }
        if (request.getNiveaux() != null) {
            enseignant.setNiveaux(new java.util.HashSet<>(request.getNiveaux()));
        }

        return enseignantMapper.toResponse(enseignantRepository.save(enseignant));
    }

    @Override
    @Transactional
    public void toggleActivation(Long id, boolean enabled) {
        Enseignant enseignant = findOrThrow(id);
        enseignant.getUser().setEnabled(enabled);
        enseignantRepository.save(enseignant);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Enseignant enseignant = findOrThrow(id);

        boolean aDesCours = coursRepository.existsByEnseignantId(id);
        boolean aDesAffectations = !affectationRepository.findByEnseignantId(id).isEmpty();

        if (aDesCours || aDesAffectations) {
            throw new BadRequestException(
                    "Impossible de supprimer cet enseignant : il a des cours publies et/ou des eleves affectes. "
                            + "Utilisez la desactivation (PATCH /activation) a la place.");
        }

        enseignantRepository.delete(enseignant);
    }

    @Override
    @Transactional(readOnly = true)
    public EnseignantResponse getMyProfile(String email) {
        return enseignantMapper.toResponse(findByEmailOrThrow(email));
    }

    @Override
    @Transactional
    public EnseignantResponse updateMyProfile(String email, UpdateProfileRequest request) {
        Enseignant enseignant = findByEmailOrThrow(email);
        appliquerMiseAJourCommune(enseignant, request.getNom(), request.getPrenom(), request.getTelephone(),
                request.getSpecialite(), request.getDiplome(), request.getExperience(), request.getBiographie(),
                request.getOrigineDiplome(), request.getPaysDiplome());

        return enseignantMapper.toResponse(enseignantRepository.save(enseignant));
    }

    @Override
    @Transactional(readOnly = true)
    public List<EleveResponse> getMesEleves(String enseignantEmail) {
        Enseignant enseignant = findByEmailOrThrow(enseignantEmail);

        List<Affectation> mesAffectations = affectationRepository.findByEnseignantId(enseignant.getId());

        return mesAffectations.stream()
                .map(Affectation::getEleve)
                .collect(Collectors.toMap(Eleve::getId, e -> e, (a, b) -> a))
                .values().stream()
                .map(eleve -> eleveMapper.toResponse(eleve, affectationRepository.findByEleveId(eleve.getId())))
                .toList();
    }

    private Set<Matiere> resoudreMatieres(List<Long> matieresIds) {
        Set<Matiere> matieres = new HashSet<>();
        for (Long matiereId : matieresIds) {
            Matiere matiere = matiereRepository.findById(matiereId)
                    .orElseThrow(() -> new ResourceNotFoundException("Matiere introuvable, id=" + matiereId));
            matieres.add(matiere);
        }
        return matieres;
    }

    private void appliquerMiseAJourCommune(Enseignant enseignant, String nom, String prenom, String telephone,
                                            String specialite, String diplome, Integer experience, String biographie,
                                            com.education.plateforme.entity.TypeBac origineDiplomeDemandee, String paysDiplomeDemande) {
        enseignant.getUser().setNom(nom);
        enseignant.getUser().setPrenom(prenom);
        enseignant.getUser().setTelephone(telephone);
        enseignant.setSpecialite(specialite);
        enseignant.setDiplome(diplome);
        enseignant.setExperience(experience);
        enseignant.setBiographie(biographie);

        String paysValide = validerOrigineDiplome(origineDiplomeDemandee, paysDiplomeDemande);
        enseignant.setOrigineDiplome(origineDiplomeDemandee);
        enseignant.setPaysDiplome(paysValide);
    }

    
    private String validerOrigineDiplome(com.education.plateforme.entity.TypeBac origineDiplome, String paysDiplome) {
        if (origineDiplome == com.education.plateforme.entity.TypeBac.ETRANGER) {
            if (paysDiplome == null || paysDiplome.isBlank()) {
                throw new BadRequestException("Le pays est obligatoire lorsque le diplome est etranger.");
            }
            return paysDiplome;
        }
        return null; // TUNISIEN ou non precise : aucun pays a stocker.
    }

    private Enseignant findOrThrow(Long id) {
        return enseignantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enseignant introuvable, id=" + id));
    }

    private Enseignant findByEmailOrThrow(String email) {
        return enseignantRepository.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Enseignant introuvable pour cet utilisateur."));
    }
}
