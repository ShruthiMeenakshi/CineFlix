package com.netflixclone.api.controller;

import com.netflixclone.api.model.ContactUs;
import com.netflixclone.api.repository.ContactUsRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactUsRepository contactRepo;

    public ContactController(ContactUsRepository contactRepo) {
        this.contactRepo = contactRepo;
    }

    @PostMapping
    public ResponseEntity<ContactUs> submit(@RequestBody ContactUs payload) {
        if (payload.getCreatedAt() == null) {
            payload.setCreatedAt(java.time.Instant.now());
        }
        ContactUs saved = contactRepo.save(payload);
        return ResponseEntity.created(URI.create("/api/contact/" + saved.getId())).body(saved);
    }
}
