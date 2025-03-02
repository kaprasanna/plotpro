package com.plotpro.user.service;

import com.plotpro.user.dto.RegistrationRequest;
import com.plotpro.user.model.User;
import com.plotpro.user.repository.UserRepository;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public User registerUser(RegistrationRequest request) {
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }
        
        if (userRepository.existsByMobile(request.getMobile())) {
            throw new RuntimeException("Mobile number already in use");
        }
        
        // Create user entity
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setMobile(request.getMobile());
        user.setCompanyName(request.getCompanyName());
        user.setRole(request.getRole());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setVerified(false); // Will be set to true after OTP verification
        
        // Save user
        return userRepository.save(user);
    }
    
    public void verifyUser(String mobile) {
        // Check if user exists first
        Optional<User> userOptional = userRepository.findByMobile(mobile);
        
        if (userOptional.isPresent()) {
            // If user exists, mark as verified
            User user = userOptional.get();
            user.setVerified(true);
            userRepository.save(user);
        }
        // If user doesn't exist yet, that's ok - they'll be created during registration
    }

    
}