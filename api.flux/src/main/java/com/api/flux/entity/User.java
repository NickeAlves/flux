package com.api.flux.entity;

import jakarta.persistence.PrePersist;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.UUID;

@Document(collection = "users")
public class User {
    @Id
    private UUID id;

    private String name;
    private String lastName;
    private LocalDate dateOfBirth;
    private String email;
    private String password;
    private String profileImageUrl;

    public User() {
    }

    public User(String name, String lastName, LocalDate dateOfBirth, String email, String password, String profileImageUrl) {
        this.name = name;
        this.lastName = lastName;
        this.dateOfBirth = dateOfBirth;
        this.email = email;
        this.password = password;
        this.profileImageUrl = profileImageUrl;
    }

    @PrePersist
    public void generateId() {
        if (id == null) {
            id = UUID.randomUUID();
        }
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }
}
