package com.netflixclone.api.controller;

import com.netflixclone.api.model.Subscription;
import com.netflixclone.api.service.SubscriptionService;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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

        boolean created = subscriptionService.register(email.trim());
        if (created) {
            return ResponseEntity.ok(Map.of("message", "Subscription saved."));
        }
        return ResponseEntity.ok(Map.of("message", "Already subscribed."));
    }

    @GetMapping
    public ResponseEntity<List<Subscription>> listSubscriptions() {
        return ResponseEntity.ok(subscriptionService.listSubscriptions());
    }

    @GetMapping("/status")
    public ResponseEntity<?> subscriptionStatus() {
        return ResponseEntity.ok(Map.of("count", subscriptionService.countSubscriptions()));
    }

    public record SubscriptionRequest(String email) {}
}
