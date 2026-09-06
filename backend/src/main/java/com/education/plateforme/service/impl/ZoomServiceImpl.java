package com.education.plateforme.service.impl;

import com.education.plateforme.exception.ZoomIntegrationException;
import com.education.plateforme.service.ZoomService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.Map;


@Service
@Slf4j
public class ZoomServiceImpl implements ZoomService {

    @Value("${zoom.account-id}")
    private String accountId;

    @Value("${zoom.client-id}")
    private String clientId;

    @Value("${zoom.client-secret}")
    private String clientSecret;

    @Value("${zoom.timezone:Africa/Tunis}")
    private String timezone;

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();


    private String tokenEnCache;
    private Instant expirationToken = Instant.EPOCH;

    private void verifierConfiguration() {
        if (accountId == null || accountId.isBlank() || clientId == null || clientId.isBlank()
                || clientSecret == null || clientSecret.isBlank()) {
            throw new ZoomIntegrationException("L'integration Zoom n'est pas configuree sur ce serveur.");
        }
    }

    private synchronized String obtenirAccessToken() {
        if (tokenEnCache != null && Instant.now().isBefore(expirationToken)) {
            return tokenEnCache;
        }
        verifierConfiguration();
        try {
            String identifiants = Base64.getEncoder().encodeToString(
                    (clientId + ":" + clientSecret).getBytes(StandardCharsets.UTF_8));
            String url = "https://zoom.us/oauth/token?grant_type=account_credentials&account_id="
                    + URLEncoder.encode(accountId, StandardCharsets.UTF_8);

            HttpResponse<String> reponse = httpClient.send(
                    HttpRequest.newBuilder(URI.create(url))
                            .header("Authorization", "Basic " + identifiants)
                            .POST(HttpRequest.BodyPublishers.noBody())
                            .build(),
                    HttpResponse.BodyHandlers.ofString());

            JsonNode json = objectMapper.readTree(reponse.body());
            if (json.has("error") || !json.has("access_token")) {
                throw new ZoomIntegrationException("Authentification Zoom refusee : "
                        + json.path("reason").asText(reponse.body()));
            }

            tokenEnCache = json.get("access_token").asText();
            long dureeSecondes = json.path("expires_in").asLong(3300);
            expirationToken = Instant.now().plusSeconds(Math.max(dureeSecondes - 60, 60)); // marge de securite
            return tokenEnCache;
        } catch (java.io.IOException | InterruptedException e) {
            if (e instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            throw new ZoomIntegrationException("Impossible de s'authentifier aupres de Zoom.", e);
        }
    }

    private String formaterDebut(LocalDate dateCours, LocalTime heureDebut) {


        return dateCours.atTime(heureDebut).format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"));
    }

    private long dureeMinutes(LocalTime heureDebut, LocalTime heureFin) {
        long minutes = java.time.Duration.between(heureDebut, heureFin).toMinutes();
        return minutes > 0 ? minutes : 60;
    }

    @Override
    public ReunionCreee creerReunion(String titre, LocalDate dateCours, LocalTime heureDebut, LocalTime heureFin) {
        try {
            Map<String, Object> corps = Map.of(
                    "topic", titre,
                    "type", 2,
                    "start_time", formaterDebut(dateCours, heureDebut),
                    "duration", dureeMinutes(heureDebut, heureFin),
                    "timezone", timezone,
                    "settings", Map.of("join_before_host", true, "waiting_room", false)
            );

            HttpResponse<String> reponse = httpClient.send(
                    HttpRequest.newBuilder(URI.create("https://api.zoom.us/v2/users/me/meetings"))
                            .header("Authorization", "Bearer " + obtenirAccessToken())
                            .header("Content-Type", "application/json")
                            .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(corps)))
                            .build(),
                    HttpResponse.BodyHandlers.ofString());

            JsonNode json = objectMapper.readTree(reponse.body());
            if (!json.has("join_url")) {
                throw new ZoomIntegrationException("Zoom n'a pas pu creer la reunion : "
                        + json.path("message").asText(reponse.body()));
            }

            log.info("[ZOOM] Reunion creee, id={}", json.get("id").asText());
            return new ReunionCreee(json.get("join_url").asText(), json.get("id").asText());
        } catch (java.io.IOException | InterruptedException e) {
            if (e instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            throw new ZoomIntegrationException("Impossible de creer la reunion Zoom.", e);
        }
    }

    @Override
    public void mettreAJourReunion(String meetingId, String titre, LocalDate dateCours,
                                    LocalTime heureDebut, LocalTime heureFin) {
        if (meetingId == null) {
            return; // cours cree avant Zoom, pas de reunion Zoom a mettre a jour
        }
        try {
            Map<String, Object> corps = Map.of(
                    "topic", titre,
                    "start_time", formaterDebut(dateCours, heureDebut),
                    "duration", dureeMinutes(heureDebut, heureFin),
                    "timezone", timezone
            );

            HttpRequest requete = HttpRequest.newBuilder(URI.create("https://api.zoom.us/v2/meetings/" + meetingId))
                    .header("Authorization", "Bearer " + obtenirAccessToken())
                    .header("Content-Type", "application/json")
                    .method("PATCH", HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(corps)))
                    .build();

            httpClient.send(requete, HttpResponse.BodyHandlers.ofString());
            log.info("[ZOOM] Reunion mise a jour, id={}", meetingId);
        } catch (Exception e) {

            log.error("[ZOOM] Mise a jour de la reunion impossible, id={}", meetingId, e);
        }
    }

    @Override
    public void supprimerReunion(String meetingId) {
        if (meetingId == null) {
            return;
        }
        try {
            HttpRequest requete = HttpRequest.newBuilder(URI.create("https://api.zoom.us/v2/meetings/" + meetingId))
                    .header("Authorization", "Bearer " + obtenirAccessToken())
                    .DELETE()
                    .build();
            httpClient.send(requete, HttpResponse.BodyHandlers.ofString());
            log.info("[ZOOM] Reunion supprimee, id={}", meetingId);
        } catch (Exception e) {
            log.error("[ZOOM] Suppression de la reunion impossible, id={} (nettoyage local applique quand meme)", meetingId, e);
        }
    }
}
