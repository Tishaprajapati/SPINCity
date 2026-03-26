package com.spincity.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // IMPORTANT — JWT apps are stateless
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authorizeHttpRequests(auth -> auth
                        // ✅ PUBLIC
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/customers/forgot-password",
                                "/api/customers/contact",
                                "/uploads/**",
                                "/error"
                        ).permitAll()

                        // ✅ ADMIN — must be BEFORE /api/customers/**
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/customers/notifications/send").hasRole("ADMIN")

                        // ✅ EMPLOYEE
                        .requestMatchers("/api/employee/**").hasAnyRole("ADMIN", "EMPLOYEE", "STAFF")

                        // ✅ CUSTOMER
                        .requestMatchers("/api/customers/**").hasAnyRole("USER", "ADMIN", "EMPLOYEE", "CUSTOMER")
                        .requestMatchers("/api/user/membership/**").hasAnyRole("USER", "ADMIN", "EMPLOYEE", "CUSTOMER")
                        .requestMatchers("/api/user/rentals/**").hasAnyRole("USER", "ADMIN", "EMPLOYEE", "CUSTOMER")
                        .requestMatchers("/api/user/**").hasAnyRole("USER", "ADMIN", "EMPLOYEE", "CUSTOMER")

                        // ✅ OTHER
                        .requestMatchers("/api/cycles/**").permitAll()
                        .requestMatchers("/api/stations/**").hasAnyRole("USER", "ADMIN", "EMPLOYEE", "CUSTOMER")

                        .anyRequest().authenticated()
                )

                .addFilterBefore(jwtFilter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173",     "http://localhost:3000",          // optional: other dev
                "https://spin-city.vercel.app" ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
