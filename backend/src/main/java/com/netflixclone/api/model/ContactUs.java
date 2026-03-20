package com.netflixclone.api.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Document(collection = "ContactUs")
public class ContactUs {

    @Id
    private String id;
    private String name;
    private String email;
    private String subject;
    private String message;
    private String category;
    private Instant createdAt;

    public ContactUs() {}

    public ContactUs(String name, String email, String subject, String message, String category) {
        this.name = name;
        this.email = email;
        this.subject = subject;
        this.message = message;
        this.category = category;
        this.createdAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
