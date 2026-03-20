package com.netflixclone.api.service;

import com.netflixclone.api.model.ContactUs;
import com.netflixclone.api.repository.ContactUsRepository;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.Set;

@Service
public class ContactService {

    private final ContactUsRepository repo;
    private final GridFsTemplate gridFsTemplate;

    private static final Set<String> ALLOWED_CATEGORIES = Set.of(
            "General Inquiry",
            "Technical Support",
            "Billing Question",
            "Feature Request",
            "Partnership",
            "Other"
    );
public List<ContactUs> getAllContacts() {
    return repo.findAll();
}
    public ContactService(ContactUsRepository repo, GridFsTemplate gridFsTemplate) {
        this.repo = repo;
        this.gridFsTemplate = gridFsTemplate;
    }

    public ContactUs createContact(String name,
                                   String email,
                                   String subject,
                                   String message,
                                   String category,
                                   MultipartFile attachment) throws IOException {

        if (name == null || name.isBlank() || email == null || email.isBlank() || message == null || message.length() < 10) {
            throw new IllegalArgumentException("Invalid contact payload");
        }

        String cat = (category == null || !ALLOWED_CATEGORIES.contains(category)) ? "Other" : category;

        ContactUs contact = new ContactUs();
        contact.setName(name);
        contact.setEmail(email);
        contact.setSubject(subject);
        contact.setMessage(message);
        contact.setCategory(cat);
        contact.setCreatedAt(Instant.now());

        if (attachment != null && !attachment.isEmpty()) {
            String original = attachment.getOriginalFilename();
            ObjectId fileId = gridFsTemplate.store(attachment.getInputStream(), original == null ? "file" : original, attachment.getContentType());

            contact.setAttachmentFilename(original);
            contact.setAttachmentContentType(attachment.getContentType());
            contact.setAttachmentId(fileId != null ? fileId.toHexString() : null);
        }

        return repo.save(contact);
    }

    public boolean isAllowedCategory(String category) {
        return ALLOWED_CATEGORIES.contains(category);
    }
}
