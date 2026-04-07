package com.netflixclone.api.repository;

import com.netflixclone.api.model.Subscription;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubscriptionRepository extends MongoRepository<Subscription, String> {
    boolean existsByEmail(String email);
}
