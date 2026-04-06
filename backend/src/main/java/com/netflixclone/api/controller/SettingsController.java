package com.netflixclone.api.controller;

import com.netflixclone.api.model.User;
import com.netflixclone.api.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class SettingsController {

    private final AuthService authService;

    public SettingsController(AuthService authService) {
        this.authService = authService;
    }

    record Notifications(boolean email, boolean push, boolean marketing) {}
    record Playback(boolean autoplay, String quality) {}
    record Preferences(List<String> genres, List<String> languages, String maturity) {}
    record SettingsPayload(Notifications notifications, Playback playback, Preferences preferences) {}

    @GetMapping("/settings")
    public ResponseEntity<?> getSettings(@RequestHeader(value = "Authorization", required = false) String auth) {
        Optional<User> userOpt = resolveUser(auth);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid token"));
        }
        User user = userOpt.get();
        return ResponseEntity.ok(Map.of(
                "notifications", Map.of(
                        "email", user.isNotificationsEmail(),
                        "push", user.isNotificationsPush(),
                        "marketing", user.isNotificationsMarketing()
                ),
                "playback", Map.of(
                        "autoplay", user.isAutoplay(),
                        "quality", user.getPlaybackQuality()
                ),
                "preferences", Map.of(
                        "genres", user.getPreferredGenres(),
                        "languages", user.getPreferredLanguages(),
                        "maturity", user.getMaturityRating()
                )
        ));
    }

    @PutMapping("/settings")
    public ResponseEntity<?> updateSettings(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @RequestBody SettingsPayload payload) {
        Optional<User> userOpt = resolveUser(auth);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid token"));
        }
        User user = userOpt.get();

        if (payload != null) {
            Notifications n = payload.notifications();
            if (n != null) {
                user.setNotificationsEmail(n.email());
                user.setNotificationsPush(n.push());
                user.setNotificationsMarketing(n.marketing());
            }

            Playback p = payload.playback();
            if (p != null) {
                user.setAutoplay(p.autoplay());
                if (p.quality() != null && !p.quality().isBlank()) {
                    user.setPlaybackQuality(p.quality().trim());
                }
            }

            Preferences pref = payload.preferences();
            if (pref != null) {
                if (pref.genres() != null) {
                    user.setPreferredGenres(pref.genres());
                }
                if (pref.languages() != null) {
                    user.setPreferredLanguages(pref.languages());
                }
                if (pref.maturity() != null && !pref.maturity().isBlank()) {
                    user.setMaturityRating(pref.maturity().trim());
                }
            }
        }

        authService.updateUser(user);
        return getSettings(auth);
    }

    private Optional<User> resolveUser(String auth) {
        if (auth == null || !auth.startsWith("Bearer ")) {
            return Optional.empty();
        }
        String token = auth.substring(7);
        return authService.getUserByToken(token);
    }
}
