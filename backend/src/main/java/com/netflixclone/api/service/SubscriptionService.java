package com.netflixclone.api.service;

import com.netflixclone.api.model.Subscription;
import com.netflixclone.api.repository.SubscriptionRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;

    public SubscriptionService(SubscriptionRepository subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }

    public boolean register(String toEmail) {
        if (subscriptionRepository.existsByEmail(toEmail)) {
            return false;
        }
        Subscription subscription = new Subscription(toEmail);
        subscriptionRepository.save(subscription);
        return true;
    }

    public List<Subscription> listSubscriptions() {
        return subscriptionRepository.findAll();
    }

    public long countSubscriptions() {
        return subscriptionRepository.count();
    }
}
