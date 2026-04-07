package com.netflixclone.api.controller;

import com.netflixclone.api.service.SubscriptionService;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/subscribe")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @PostMapping
    public ResponseEntity<?> subscribe(@RequestBody SubscriptionRequest request) {
        String email = request == null ? null : request.email();
        if (email == null || email.trim().isEmpty() || !email.contains("@")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid email address."));
        }

        try {
            subscriptionService.sendThankYou(email.trim());
            return ResponseEntity.ok(Map.of("message", "Thank you email sent."));
        } catch (MailException ex) {
            return ResponseEntity.status(502).body(Map.of("error", "Email delivery failed."));
        }
    }

    public record SubscriptionRequest(String email) {}
}
