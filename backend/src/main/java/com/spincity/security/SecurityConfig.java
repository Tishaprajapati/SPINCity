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
                        // ✅ PUBLIC first — no token needed
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/customers/forgot-password",
                                "/api/customers/contact",
                                "/uploads/**",
                                "/error"
                        ).permitAll()

                        // ✅ ADMIN only
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        .requestMatchers("/api/customers/notifications/send")
                        .hasRole("ADMIN")
                        // ✅ EMPLOYEE
                        // ✅ To this — add STAFF
                        .requestMatchers("/api/employee/**")
                        .hasAnyRole("ADMIN", "EMPLOYEE", "STAFF")

                        // ✅ USER/CUSTOMER — membership
                        .requestMatchers("/api/user/membership/**")
                        .hasAnyRole("USER", "ADMIN", "EMPLOYEE", "CUSTOMER")

                        // ✅ USER/CUSTOMER — rentals
                        .requestMatchers("/api/user/rentals/**")
                        .hasAnyRole("USER", "ADMIN", "EMPLOYEE", "CUSTOMER")

                        // ✅ USER/CUSTOMER — all other user endpoints
                        .requestMatchers("/api/user/**")
                        .hasAnyRole("USER", "ADMIN", "EMPLOYEE", "CUSTOMER")

                        .requestMatchers("/api/customers/**")
                        .hasAnyRole("USER", "ADMIN", "EMPLOYEE", "CUSTOMER")
                        // ✅ CYCLES — public read
                        .requestMatchers("/api/cycles/**").permitAll()

                        // ✅ STATIONS
                        .requestMatchers("/api/stations/**")
                        .hasAnyRole("USER", "ADMIN", "EMPLOYEE", "CUSTOMER")


//                        .requestMatchers("/api/employee/ride-status/**").permitAll()
                        // ✅ Everything else needs auth
                        .anyRequest().authenticated()
                )

                .addFilterBefore(jwtFilter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
