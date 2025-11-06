package com.api.flux.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.UUID;

@Setter
@Getter
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
        this.id = UUID.randomUUID();
    }

    public User(String name, String lastName, LocalDate dateOfBirth, String email, String password, String profileImageUrl) {
        this.id = UUID.randomUUID();
        this.name = name;
        this.lastName = lastName;
        this.dateOfBirth = dateOfBirth;
        this.email = email;
        this.password = password;
        this.profileImageUrl = profileImageUrl;
    }
}
