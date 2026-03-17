package com.spincity.controller.auth;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class LogoutController {

    // Works for all user types — just invalidates on frontend
    // JWT is stateless so we just return success
    // Frontend clears localStorage on receiving this response

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        // JWT is stateless — no server-side session to invalidate
        // Frontend will clear the token from localStorage
        return ResponseEntity.ok().body(
                java.util.Map.of(
                        "message", "Logged out successfully",
                        "status", "success"
                )
        );
    }
}