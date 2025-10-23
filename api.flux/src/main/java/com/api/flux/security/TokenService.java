package com.api.flux.security;

import com.api.flux.entity.User;
import com.api.flux.repository.UserRepository;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Date;
import java.util.UUID;

@Service
public class TokenService {

    @Value("${auth.token}")
    private String secretKey;

    private final UserRepository userRepository;

    public TokenService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public String generateToken(User user) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secretKey);
            return JWT.create()
                    .withIssuer("flux")
                    .withSubject(user.getEmail())
                    .withExpiresAt(generateExpirationDate())
                    .sign(algorithm);
        } catch (Exception e) {
            throw new RuntimeException("Error while generating token: " + e);
        }
    }

    public String validateToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secretKey);
            return JWT.require(algorithm)
                    .withIssuer("flux")
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (JWTVerificationException e) {
            return null;
        }
    }

    public Date generateExpirationDate() {
        return Date.from(LocalDateTime.now().plusHours(24).toInstant(ZoneOffset.UTC));
    }

    public UUID getAuthenticatedUserId() {
        try {
            String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            if (email == null) {
                throw new IllegalStateException("Authenticated principal is null");
            }

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalStateException("User not found for email: " + email));

            return user.getId();

        } catch (Exception e) {
            throw new IllegalStateException("Unable to retrieve authenticated user ID", e);
        }
    }
}
