package com.netflixclone.api.controller;

import com.netflixclone.api.model.ContactUs;
import com.netflixclone.api.service.ContactService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

 @GetMapping
public ResponseEntity<?> getAllContacts() {
    return ResponseEntity.ok(contactService.getAllContacts());
}
    @PostMapping(consumes = { "multipart/form-data" })
    public ResponseEntity<ContactUs> submitContact(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam(required = false) String subject,
            @RequestParam String message,
            @RequestParam(required = false) String category,
            @RequestPart(required = false) MultipartFile attachment
    ) {
        try {
            ContactUs saved = contactService.createContact(name, email, subject, message, category, attachment);
            URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                    .path("/{id}")
                    .buildAndExpand(saved.getId())
                    .toUri();
            return ResponseEntity.created(location).body(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            return ResponseEntity.status(500).build();
        }
    }
}
