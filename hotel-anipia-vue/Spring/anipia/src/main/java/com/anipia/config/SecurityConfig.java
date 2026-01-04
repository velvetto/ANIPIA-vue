package com.anipia.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // ✅ POVOLÍ CORS z WebConfig
            .cors(cors -> {})

            // ❌ CSRF vypnuto (OK pro REST API)
            .csrf(csrf -> csrf.disable())

            // ✅ H2 console
            .headers(headers ->
                headers.frameOptions(frameOptions -> frameOptions.sameOrigin())
            )

            // ✅ povolení requestů
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers("/uploads/**").permitAll()
                .anyRequest().permitAll()
            );

        return http.build();
    }
}
