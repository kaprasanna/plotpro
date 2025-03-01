package com.plotpro.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.Customizer;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authz -> authz
                .anyRequest().permitAll()  // Allow all requests without authentication
            )
            .csrf(csrf -> csrf.disable())  // Disable CSRF protection (useful for development)
            .httpBasic(Customizer.withDefaults())  // Optional: keep this if you want to be able to add auth later
            .formLogin(Customizer.withDefaults());  // Optional: keep this if you want to be able to add form login later
        
        return http.build();
    }
}