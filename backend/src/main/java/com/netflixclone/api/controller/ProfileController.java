package com.netflixclone.api.controller;

import com.netflixclone.api.service.AuthService;
import com.netflixclone.api.service.OmdbService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

import com.netflixclone.api.model.User;

@RestController
@RequestMapping("/api")
public class ProfileController {

    private final AuthService authService;
    private final OmdbService omdbService;

    public ProfileController(AuthService authService, OmdbService omdbService) {
        this.authService = authService;
        this.omdbService = omdbService;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> profile(@RequestHeader(value = "Authorization", required = false) String auth) {
        if (auth == null || !auth.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Missing token"));
        }
        String token = auth.substring(7);
        Optional<User> userOpt = authService.getUserByToken(token);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid token"));
        }
        User user = userOpt.get();
        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail(),
                "displayName", user.getDisplayName()
        ));
    }

    @GetMapping("/recommendations")
    public ResponseEntity<?> recommendations(@RequestHeader(value = "Authorization", required = false) String auth) {
        if (auth == null || !auth.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Missing token"));
        }
        String token = auth.substring(7);
        if (authService.validateToken(token) == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid token"));
        }
        return ResponseEntity.ok(omdbService.getRecommendations(8));
    }
}
