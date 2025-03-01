package com.plotpro.layout.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

import com.plotpro.user.model.User;

@Data
@Entity
@Table(name = "layouts")
public class Layout {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String location;
    private String description;
    
    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}