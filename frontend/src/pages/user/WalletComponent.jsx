import React, { useState } from 'react';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, CreditCard, Clock, CheckCircle, XCircle } from 'lucide-react';
import '../../style/user/wallet.css';

const WalletComponent = () => {
  const [balance, setBalance] = useState(2450.00);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [amount, setAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(null);

  const quickAmounts = [100, 250, 500, 1000, 2000];

  const transactions = [
    {
      id: 1,
      type: 'credit',
      amount: 500,
      description: 'Added to wallet',
      date: '2026-01-16',
      time: '10:30 AM',
      status: 'completed'
    },
    {
      id: 2,
      type: 'debit',
      amount: 150,
      description: 'Bike rental - Mountain Pro',
      date: '2026-01-15',
      time: '04:15 PM',
      status: 'completed'
    },
    {
      id: 3,
      type: 'debit',
      amount: 200,
      description: 'Bike rental - City Cruiser',
      date: '2026-01-14',
      time: '09:45 AM',
      status: 'completed'
    },
    {
      id: 4,
      type: 'credit',
      amount: 1000,
      description: 'Added to wallet',
      date: '2026-01-13',
      time: '11:20 AM',
      status: 'completed'
    },
    {
      id: 5,
      type: 'debit',
      amount: 180,
      description: 'Bike rental - Speed Racer',
      date: '2026-01-12',
      time: '02:30 PM',
      status: 'completed'
    },
    {
      id: 6,
      type: 'credit',
      amount: 1500,
      description: 'Refund - Cancelled booking',
      date: '2026-01-11',
      time: '03:45 PM',
      status: 'completed'
    }
  ];

  const handleAddMoney = () => {
    const amountToAdd = selectedAmount || parseFloat(amount);
    if (amountToAdd > 0) {
      setBalance(balance + amountToAdd);
      setAmount('');
      setSelectedAmount(null);
      setShowAddMoney(false);
    }
  };

  const handleQuickAmount = (value) => {
    setSelectedAmount(value);
    setAmount(value.toString());
  };

  return (
    <div className="wallet-container">
      <div className="wallet-header">
        <h1 className="wallet-title">
          <Wallet className="wallet-icon" />
          My Wallet
        </h1>
        <p className="wallet-subtitle">Manage your balance and transactions</p>
      </div>

      {/* Balance Card */}
      <div className="balance-card">
        <div className="balance-content">
          <div className="balance-info">
            <p className="balance-label">Available Balance</p>
            <h2 className="balance-amount">₹{balance.toFixed(2)}</h2>
            <p className="balance-note">Use this balance for bike rentals</p>
          </div>
          <button 
            className="add-money-btn"
            onClick={() => setShowAddMoney(!showAddMoney)}
          >
            <Plus size={20} />
            Add Money
          </button>
        </div>

        {/* Add Money Section */}
        {showAddMoney && (
          <div className="add-money-section">
            <h3 className="add-money-title">Add Money to Wallet</h3>
            
            <div className="quick-amounts">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  className={`quick-amount-btn ${selectedAmount === amt ? 'active' : ''}`}
                  onClick={() => handleQuickAmount(amt)}
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            <div className="custom-amount">
              <label className="custom-amount-label">Or enter custom amount</label>
              <div className="amount-input-group">
                <span className="currency-symbol">₹</span>
                <input
                  type="number"
                  className="amount-input"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setSelectedAmount(null);
                  }}
                />
              </div>
            </div>

            <div className="payment-methods">
              <h4 className="payment-title">Select Payment Method</h4>
              <div className="payment-options">
                <button className="payment-option">
                  <CreditCard size={20} />
                  <span>Credit/Debit Card</span>
                </button>
                <button className="payment-option">
                  <Wallet size={20} />
                  <span>UPI</span>
                </button>
                <button className="payment-option">
                  <CreditCard size={20} />
                  <span>Net Banking</span>
                </button>
              </div>
            </div>

            <div className="add-money-actions">
              <button 
                className="cancel-btn"
                onClick={() => {
                  setShowAddMoney(false);
                  setAmount('');
                  setSelectedAmount(null);
                }}
              >
                Cancel
              </button>
              <button 
                className="confirm-add-btn"
                onClick={handleAddMoney}
                disabled={!amount || parseFloat(amount) <= 0}
              >
                Add ₹{amount || '0'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transaction History */}
      <div className="transactions-section">
        <div className="transactions-header">
          <h2 className="transactions-title">Transaction History</h2>
          <p className="transactions-subtitle">All your wallet activities</p>
        </div>

        <div className="transactions-list">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="transaction-item">
              <div className="transaction-icon-wrapper">
                {transaction.type === 'credit' ? (
                  <div className="transaction-icon credit">
                    <ArrowDownLeft size={20} />
                  </div>
                ) : (
                  <div className="transaction-icon debit">
                    <ArrowUpRight size={20} />
                  </div>
                )}
              </div>

              <div className="transaction-details">
                <p className="transaction-description">{transaction.description}</p>
                <div className="transaction-meta">
                  <Clock size={14} />
                  <span>{transaction.date} • {transaction.time}</span>
                </div>
              </div>

              <div className="transaction-amount-wrapper">
                <p className={`transaction-amount ${transaction.type}`}>
                  {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                </p>
                <span className="transaction-status">
                  <CheckCircle size={14} />
                  Completed
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WalletComponent;