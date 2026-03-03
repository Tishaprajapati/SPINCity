package com.spincity.controller.user;

import com.spincity.dto.request.WalletRechargeRequest;
import com.spincity.dto.response.WalletTransactionDTO;
import com.spincity.service.user.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user/wallet")
@CrossOrigin(origins = "http://localhost:5173")
public class WalletController {

    @Autowired
    private WalletService walletService;

    /**
     * Recharge wallet
     * POST /api/user/wallet/recharge
     */
    @PostMapping("/recharge")
    public ResponseEntity<?> rechargeWallet(@RequestBody WalletRechargeRequest request) {
        try {
            WalletTransactionDTO transaction = walletService.rechargeWallet(request);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Get wallet transaction history
     * GET /api/user/wallet/transactions/{customerId}
     */
    @GetMapping("/transactions/{customerId}")
    public ResponseEntity<List<WalletTransactionDTO>> getWalletTransactions(@PathVariable Integer customerId) {
        try {
            List<WalletTransactionDTO> transactions = walletService.getWalletTransactions(customerId);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get wallet balance
     * GET /api/user/wallet/balance/{customerId}
     */
    @GetMapping("/balance/{customerId}")
    public ResponseEntity<?> getWalletBalance(@PathVariable Integer customerId) {
        try {
            Double balance = walletService.getWalletBalance(customerId);
            Map<String, Double> response = new HashMap<>();
            response.put("balance", balance);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}