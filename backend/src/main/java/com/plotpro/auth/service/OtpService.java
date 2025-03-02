package com.plotpro.auth.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;

@Service
public class OtpService {
    private final Map<String, String> otpStorage = new HashMap<>();
    private final SecureRandom random = new SecureRandom();
    
    public String generateOtp(String mobile) {
        // Generate a 6-digit OTP
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            otp.append(random.nextInt(10));
        }
        
        // Store OTP (in production, this would be temporary storage)
        otpStorage.put(mobile, otp.toString());
        
        // In a real application, send OTP via SMS here
        System.out.println("OTP for " + mobile + ": " + otp);
        
        return otp.toString();
    }
    
    public boolean verifyOtp(String mobile, String otp) {
        String storedOtp = otpStorage.get(mobile);
        if (storedOtp != null && storedOtp.equals(otp)) {
            // Remove OTP after successful verification
            otpStorage.remove(mobile);
            return true;
        }
        return false;
    }
}