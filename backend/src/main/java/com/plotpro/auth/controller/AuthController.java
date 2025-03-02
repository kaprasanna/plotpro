package com.plotpro.auth.controller;

import com.plotpro.auth.service.OtpService;
import com.plotpro.user.dto.RegistrationRequest;
import com.plotpro.user.model.User;
import com.plotpro.user.service.UserService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    @Autowired
    private UserService userService;
    
    @Autowired
    private OtpService otpService;
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegistrationRequest request) {
        User user = userService.registerUser(request);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "User registered successfully");
        response.put("userId", user.getId());
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestParam String mobile) {
        String otp = otpService.generateOtp(mobile);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "OTP sent successfully");
        // In production, don't return the OTP!
        response.put("otp", otp); // Only for testing
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestParam String mobile, @RequestParam String otp) {
        logger.debug("Verifying OTP for mobile: {} with OTP: {}", mobile, otp);
        boolean verified = otpService.verifyOtp(mobile, otp);
        
        if (verified) {
            userService.verifyUser(mobile);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "OTP verified successfully");
            response.put("verified", true);
            
            return ResponseEntity.ok(response);
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Invalid OTP");
            response.put("verified", false);
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    // Add a test endpoint
    @GetMapping("/status")
    public ResponseEntity<?> status() {
        logger.debug("Auth status endpoint called");
        return ResponseEntity.ok().body(Map.of("status", "up"));
    }
}