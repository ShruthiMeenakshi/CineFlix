package com.netflixclone.api.repository;

import com.netflixclone.api.model.ContactUs;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactUsRepository extends MongoRepository<ContactUs, String> {
}
