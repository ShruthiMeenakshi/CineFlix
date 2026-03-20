package com.netflixclone.api.service;

import com.netflixclone.api.model.User;
import com.netflixclone.api.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private final Map<String, String> tokens = new ConcurrentHashMap<>(); // token -> username

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(String username, String email, String password) {
        if (username == null || username.isBlank() || email == null || email.isBlank() || password == null || password.length() < 6) {
            throw new IllegalArgumentException("Invalid signup data");
        }
        Optional<User> byUser = userRepository.findByUsername(username);
        if (byUser.isPresent()) throw new IllegalStateException("username_taken");
        Optional<User> byEmail = userRepository.findByEmail(email);
        if (byEmail.isPresent()) throw new IllegalStateException("email_taken");

        User u = new User();
        u.setUsername(username);
        u.setEmail(email);
        u.setPassword(encoder.encode(password));
        u.setDisplayName(username);

        return userRepository.save(u);
    }

    public String authenticate(String username, String password) {
        if (username == null || password == null) return null;
        Optional<User> maybe = userRepository.findByUsername(username);
        if (maybe.isPresent()) {
            User u = maybe.get();
            if (encoder.matches(password, u.getPassword())) {
                String token = UUID.randomUUID().toString();
                tokens.put(token, username);
                return token;
            }
        }
        return null;
    }

    public String validateToken(String token) {
        return tokens.get(token);
    }

    public void revokeToken(String token) {
        tokens.remove(token);
    }
}
