package com.netflixclone.api.service;

import com.netflixclone.api.model.User;
import com.netflixclone.api.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final Map<String, String> tokens = new ConcurrentHashMap<>(); // token -> username

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
        // seed demo users if repository empty
        if (userRepository.count() == 0) {
            userRepository.save(new User("user", "password", "user@example.com", "user"));
            userRepository.save(new User("admin", "admin", "admin@example.com", "admin"));
        }
    }

    public String authenticate(String username, String password) {
        if (username == null || password == null) return null;
        User u = userRepository.findByUsername(username);
        if (u != null && password.equals(u.getPassword())) {
            String token = UUID.randomUUID().toString();
            tokens.put(token, username);
            return token;
        }
        return null;
    }

    public String register(String username, String password) {
        if (username == null || username.isBlank() || password == null || password.isBlank()) return null;
        if (userRepository.existsByUsername(username)) return null;
        User user = new User(username, password, username + "@example.com", username);
        userRepository.save(user);
        String token = UUID.randomUUID().toString();
        tokens.put(token, username);
        return token;
    }

    public String validateToken(String token) {
        return tokens.get(token);
    }

    public void revokeToken(String token) {
        tokens.remove(token);
    }
}
