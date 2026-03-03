package com.spincity.service.user;

import com.spincity.dto.request.WalletRechargeRequest;
import com.spincity.dto.response.WalletTransactionDTO;

import java.util.List;

public interface WalletService {
    WalletTransactionDTO rechargeWallet(WalletRechargeRequest request);
    List<WalletTransactionDTO> getWalletTransactions(Integer customerId);
    Double getWalletBalance(Integer customerId);
}