import React, { useEffect, useState } from "react";
import "../../style/user/userprofile.css";
import userService from "../../service/userService";
import Navbar from "./Navbar";
import logout from "../../service/logout";
import { getTokenForPath } from "../../auth/authStorage";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [membership, setMembership] = useState(null);
  const [currentMembership, setCurrentMembership] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showBenefitsModal, setShowBenefitsModal] = useState(false);

  const customerId = localStorage.getItem("customerId");

  useEffect(() => {
    if (customerId) {
      fetchProfile();
      fetchDashboard();
      fetchMembership();
    }
  }, [customerId]);

  useEffect(() => {
    const fetchMembershipData = async () => {
      const customerId = localStorage.getItem("customerId");

      try {
        // Fetch current membership
        const membershipRes =
          await userService.getCurrentMembership(customerId);
        setCurrentMembership(membershipRes);
      } catch (err) {
        console.log("No active membership, user might have BASIC plan");
        // Set default BASIC membership
        setCurrentMembership({
          planName: "BASIC",
          status: "ACTIVE",
          startDate: new Date().toISOString().split("T")[0],
          endDate: "2099-12-31",
        });
      }

      try {
        // Fetch available plans
        const plansRes = await userService.getMembershipPlans();
        setAvailablePlans(plansRes);
      } catch (err) {
        console.error("Failed to load plans:", err);
      }
    };

    fetchMembershipData();
  }, []);

  const handleUpgrade = async (planId) => {
    const customerId = localStorage.getItem("customerId");

    try {
      await userService.upgradeMembership(customerId, planId);
      alert("Plan upgraded successfully!");
      window.location.reload();

      if (response.ok) {
        alert("Plan upgraded successfully! 🎉");
        window.location.reload(); // Refresh to show new plan
      } else {
        alert("Upgrade failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };
  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;

    setPreferences((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const fetchDashboard = async () => {
    try {
      const data = await userService.getDashboard(customerId);
      setDashboard(data);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    }
  };

  const fetchMembership = async () => {
    try {
      const data = await userService.getCurrentMembership(customerId);
      setMembership(data);
    } catch (err) {
      console.log("No membership found");
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await userService.getProfile(customerId);

      // Map backend data to formData

      setFormData({
        fullName: data.customerName || "",
        email: data.customerEmail || "",
        phone: data.customerPhone || "",
        dateOfBirth: "",
        emergencyName: data.emergencyName || "",
        emergencyContact: data.emergencyContact || "",
        address: data.customerAddress || "",
        idProofType: data.idProofType || "",
       idProofDocument: data.idProofDocument || "", 

      });
      setPreferences({
  notifications: data.notificationsEnabled !== false, // default true
  theme: "Light",
});
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [preferences, setPreferences] = useState({
    notifications: true,
    theme: "Light",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async () => {
    try {
      const updateData = {
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        customerAddress: formData.address,
        emergencyContact: formData.emergencyContact,
        emergencyName: formData.emergencyName,
        idProofType: formData.idProofType,
         idProofDocument: formData.idProofDocument,

        // Optional (if you want age)
        age: formData.dateOfBirth
          ? new Date().getFullYear() -
            new Date(formData.dateOfBirth).getFullYear()
          : null,
      };

      await userService.updateProfile(customerId, updateData);

      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

 const handleChangePassword = async () => {
  if (!passwordData.currentPassword) {
    alert("Please enter your current password");
    return;
  }
  if (!passwordData.newPassword) {
    alert("Please enter a new password");
    return;
  }
  if (passwordData.newPassword !== passwordData.confirmPassword) {
    alert("New passwords do not match!");
    return;
  }
  if (passwordData.newPassword.length < 4) {
    alert("New password must be at least 4 characters");
    return;
  }

  try {
    const token = getTokenForPath(window.location.pathname);
    const response = await fetch(
      `http://spincity.onrender.com/api/customers/${customerId}/change-password`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      alert("✅ Password changed successfully! Please login again.");
      // ✅ Clear password fields
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      // ✅ Logout user since password changed
      await logout();
    } else {
      alert("❌ " + (data.error || "Failed to change password"));
    }
  } catch (error) {
    console.error("Error changing password:", error);
    alert("❌ Server error. Please try again.");
  }
};

  const handleSavePreferences = async () => {
  try {
    const token = getTokenForPath(window.location.pathname);
    const response = await fetch(
      `http://spincity.onrender.com/api/customers/${customerId}/notifications`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          enabled: preferences.notifications,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      alert(
        preferences.notifications
          ? "✅ Notifications enabled!"
          : "🔕 Notifications disabled!"
      );
    } else {
      alert("❌ " + (data.error || "Failed to save preferences"));
    }
  } catch (err) {
    console.error("Error saving preferences:", err);
    alert("❌ Server error. Please try again.");
  }
};
  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (!formData) {
    return <div className="error">Failed to load profile</div>;
  }
const getCancelRefundMessage = () => {
  if (!currentMembership || !currentMembership.startDate) return null;

  const start = new Date(currentMembership.startDate);
  const now = new Date();
  const daysUsed = Math.floor((now - start) / (1000 * 60 * 60 * 24));

  const plan = currentMembership.planName;

  // No refund thresholds per plan
  if (plan === "WEEKLY"    && daysUsed >= 3)   return { refund: false, daysUsed };
  if (plan === "MONTHLY"   && daysUsed >= 15)  return { refund: false, daysUsed };
  if (plan === "QUARTERLY" && daysUsed >= 45)  return { refund: false, daysUsed };

  // Still within refund window
  return { refund: true, daysUsed };
};
 const handleCancel = async () => {
  const refundInfo = getCancelRefundMessage();

  if (!refundInfo) {
    alert("Unable to determine membership status.");
    return;
  }

  let confirmMsg = "";

  if (refundInfo.refund) {
    confirmMsg =
      `You have used ${refundInfo.daysUsed} day(s) of your ${currentMembership.planName} plan.\n\n` +
      `✅ You are eligible for a refund.\n` +
      `💰 Your money will be refunded within 7 business days.\n\n` +
      `Are you sure you want to cancel?`;
  } else {
    const thresholdMap = {
      WEEKLY:    "3 days",
      MONTHLY:   "15 days",
      QUARTERLY: "45 days",
    };
    const threshold = thresholdMap[currentMembership.planName];
    confirmMsg =
      `You have used ${refundInfo.daysUsed} day(s) of your ${currentMembership.planName} plan.\n\n` +
      `❌ No Refund Applicable\n` +
      `Since you have already used more than ${threshold} of your plan, ` +
      `you will NOT receive a refund on cancellation.\n\n` +
      `Are you sure you still want to cancel?`;
  }

  if (!confirm(confirmMsg)) return;

  try {
    await userService.cancelMembership(customerId);

    if (refundInfo.refund) {
      alert("✅ Membership cancelled.\n💰 Refund will be processed within 7 business days.");
    } else {
      alert("✅ Membership cancelled.\n❌ No refund will be issued as per our refund policy.");
    }

    window.location.reload();
  } catch (error) {
    console.error("Cancel failed:", error);
    alert("❌ Failed to cancel membership. Please try again.");
  }
};

  return (
    <div className="user-profile-page">
      <Navbar />
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="header-content">
            <div className="profile-avatar-section">
              <div className="avatar-wrapper">
                <img
                  src="https://img.freepik.com/free-vector/young-man-bicycle-avatar-character_24877-52961.jpg?semt=ais_hybrid&w=740&q=80"
                  alt="Profile Avatar"
                  className="profile-avatar-large"
                />
              
              </div>
              <div className="profile-header-info">
                <h1>{formData.fullName}</h1>
                <p className="profile-email">{formData.email}</p>
                <div className="profile-badges">
                  <span className="badge verified">✓ Verified</span>
                  <span className="badge member">Monthly Member</span>
                </div>
              </div>
            </div>
            <div className="profile-stats-compact">
              <div className="stat-compact">
                <span className="stat-value">{dashboard?.totalRides ?? 0}</span>
                <span className="stat-label">Total Rides</span>
              </div>

              <div className="stat-compact">
                <span className="stat-value">
                  ₹{dashboard?.totalSpent ?? 0}
                </span>
                <span className="stat-label">Total Spent</span>
              </div>

              <div className="stat-compact">
                <span className="stat-value">
                  {dashboard?.memberSince
                    ? new Date(dashboard.memberSince).toLocaleDateString(
                        "en-IN",
                        {
                          month: "short",
                          year: "numeric",
                        },
                      )
                    : "--"}
                </span>
                <span className="stat-label">Member Since</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="profile-tabs">
          <button
            className={`tab-btn ${activeTab === "personal" ? "active" : ""}`}
            onClick={() => setActiveTab("personal")}
          >
            👤 Personal Info
          </button>
          <button
            className={`tab-btn ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            🔒 Security
          </button>
          <button
            className={`tab-btn ${activeTab === "preferences" ? "active" : ""}`}
            onClick={() => setActiveTab("preferences")}
          >
            ⚙️ Preferences
          </button>
          <button
            className={`tab-btn ${activeTab === "membership" ? "active" : ""}`}
            onClick={() => setActiveTab("membership")}
          >
            ⭐ Membership
          </button>
        </div>

        {/* Tab Content */}
        <div className="profile-content">
          {/* Personal Info Tab */}
          {activeTab === "personal" && (
            <div className="tab-content animate-fade-in">
              <div className="content-header">
                <h2>Personal Information</h2>
                {!isEditing ? (
                  <button
                    className="btn-edit"
                    onClick={() => setIsEditing(true)}
                  >
                    ✏️ Edit Profile
                  </button>
                ) : (
                  <div className="edit-actions">
                    <button
                      className="btn-cancel"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                    <button className="btn-save" onClick={handleSaveProfile}>
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Emergency Name</label>
                  <input
                    type="text"
                    name="emergencyName"
                    value={formData.emergencyName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Emergency Contact</label>
                  <input
                    type="tel"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="form-input"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="form-input"
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>ID Proof Type</label>
                  <select
                    name="idProofType"
                    value={formData.idProofType}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="form-input"
                  >
                    <option value="Aadhar Card">Aadhar Card</option>
                    <option value="PAN Card">PAN Card</option>
                    <option value="Driving License">Driving License</option>
                    <option value="Passport">Passport</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>ID Proof Number</label>
                  <input
                    type="text"
                    name="idProofNumber"
                    value={formData.idProofNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="tab-content animate-fade-in">
              <div className="content-header">
                <h2>Security Settings</h2>
              </div>

              <div className="security-section">
                <h3>Change Password</h3>
                <p className="section-description">
                  Ensure your account is using a strong password to stay secure
                </p>

                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                      className="form-input"
                    />
                  </div>
                </div>

                <button className="btn-primary" onClick={handleChangePassword}>
                  Update Password
                </button>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <div className="tab-content animate-fade-in">
              <div className="content-header">
                <h2>Preferences</h2>
              </div>

              <div className="preferences-section">
                <h3>Notifications</h3>

                <div className="preference-item">
                  <div className="preference-info">
                    <h4>Enable Notifications</h4>
                    <p>Turn all ride alerts and updates on or off</p>
                  </div>

                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="notifications"
                      checked={preferences.notifications}
                      onChange={handlePreferenceChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <button className="btn-primary" onClick={handleSavePreferences}>
                Save Preferences
              </button>
            </div>
          )}

          {/* Membership Tab */}
          {activeTab === "membership" && (
            <div className="tab-content animate-fade-in">
              <div className="content-header">
                <h2>Membership Details</h2>
              </div>

              {currentMembership && (
                <div className="membership-current">
                  <div className="membership-card-header">
                    <h3>Current Plan</h3>
                    <span
                      className={`plan-badge ${currentMembership.status.toLowerCase()}`}
                    >
                      {currentMembership.status}
                    </span>
                  </div>
                  <div className="membership-details">
                    <div className="plan-info">
                      <h2>{currentMembership.planName}</h2>
                      <p className="plan-price">
                        {availablePlans.find(
                          (p) => p.planName === currentMembership.planName,
                        )?.price
                          ? `₹${availablePlans.find((p) => p.planName === currentMembership.planName).price}`
                          : "Free"}
                      </p>
                    </div>

                    {currentMembership.planName === "BASIC" ? (
                      <div className="basic-plan-benefits">
                        <div className="benefits-prompt">
                          <div className="prompt-icon">🎁</div>
                          <h4>Want to Save More?</h4>
                          <p>
                            Discover amazing benefits and discounts by upgrading
                            to a premium membership!
                          </p>
                          <button
                            className="btn-view-benefits"
                            onClick={() => setShowBenefitsModal(true)}
                          >
                            🚲 View Membership Benefits
                          </button>
                        </div>
                      </div>
                   ) : (
  <>
    <div className="plan-benefits">
      {currentMembership.planName === "WEEKLY" && (
        <>
          <div className="benefit">✓ 10% discount on all rides</div>
          <div className="benefit">✓ Auto-applied at checkout</div>
          <div className="benefit">✓ Valid for 7 days from purchase</div>
          <div className="benefit">✓ Best for short-term frequent riders</div>
        </>
      )}
      {currentMembership.planName === "MONTHLY" && (
        <>
          <div className="benefit">✓ 20% discount on all rides</div>
          <div className="benefit">✓ First 15 min FREE on every ride</div>
          <div className="benefit">✓ Ride ≤ 15 min → entire ride FREE</div>
          <div className="benefit">✓ Valid for 30 days from purchase</div>
          <div className="benefit">✓ Best for daily commuters</div>
        </>
      )}
      {currentMembership.planName === "QUARTERLY" && (
        <>
          <div className="benefit">✓ 30% discount on all rides</div>
          <div className="benefit">✓ First 30 min FREE on every ride</div>
          <div className="benefit">✓ Ride ≤ 30 min → entire ride FREE</div>
          <div className="benefit">✓ Priority booking at all stations</div>
          <div className="benefit">✓ Valid for 90 days from purchase</div>
        </>
      )}
    </div>
    <div className="plan-validity">
      <p><strong>Valid Until:</strong> {currentMembership.endDate}</p>
     
    </div>
  </>
)}
                  </div>
                  <div className="membership-actions">
                    {currentMembership.planName !== "BASIC" && (
                      <button className="btn-secondary" onClick={handleCancel}>
                        Cancel Plan
                      </button>
                    )}
                   
                  </div>
                </div>
              )}

             </div>
          )}

          {/* Upgrade Modal */}

          {showUpgradeModal && (
            <div
              className="modal-overlay-upgrade"
              onClick={() => setShowUpgradeModal(false)}
            >
              <div
                className="upgrade-modal-container"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Animated Bike Background */}
                <div className="bike-animation-track">
                  <div className="animated-bike">🚴</div>
                </div>

                <div className="upgrade-modal-header">
                  <h2>🚲 Choose Your Plan</h2>
                  <p>Unlock amazing benefits and start saving today!</p>
                  <button
                    className="close-upgrade-modal"
                    onClick={() => setShowUpgradeModal(false)}
                  >
                    ✕
                  </button>
                </div>

                <div className="upgrade-plans-grid">
                  {availablePlans
                    .filter(
                      (plan) =>
                        plan.planName !== "BASIC" && plan.planName !== "HOURLY",
                    )
                    .map((plan, index) => (
                      <div
                        key={plan.id}
                        className="upgrade-plan-card"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="plan-badge">
                          {plan.planName === "QUARTERLY" && "⭐ BEST VALUE"}
                          {plan.planName === "MONTHLY" && "🔥 POPULAR"}
                          {plan.planName === "WEEKLY" && "🎯 STARTER"}
                        </div>

                        <h3 className="plan-title">{plan.planName}</h3>

                        <div className="plan-price-box">
                          <span className="plan-currency">₹</span>
                          <span className="plan-amount">{plan.price}</span>
                        </div>

                        <div className="plan-duration">
                          <span>📅 {plan.durationInDays} days coverage</span>
                        </div>

                 <div className="plan-benefits-list">
  {plan.planName === "WEEKLY" && (
    <>
      <div className="benefit-item">✓ 10% discount on all rides</div>
      <div className="benefit-item">✓ Auto-applied at checkout</div>
      <div className="benefit-item">✓ Valid for 7 days from purchase</div>
      <div className="benefit-item">✓ Best for short-term frequent riders</div>
    </>
  )}
  {plan.planName === "MONTHLY" && (
    <>
      <div className="benefit-item">✓ 20% discount on all rides</div>
      <div className="benefit-item">✓ First 15 min FREE on every ride</div>
      <div className="benefit-item">✓ If ride ≤ 15 min → entire ride FREE</div>
      <div className="benefit-item">✓ Valid for 30 days from purchase</div>
      <div className="benefit-item">✓ Best for daily commuters</div>
    </>
  )}
  {plan.planName === "QUARTERLY" && (
    <>
      <div className="benefit-item">✓ 30% discount on all rides</div>
      <div className="benefit-item">✓ First 30 min FREE on every ride</div>
      <div className="benefit-item">✓ If ride ≤ 30 min → entire ride FREE</div>
      <div className="benefit-item">✓ Priority booking at all stations</div>
      <div className="benefit-item">✓ Valid for 90 days from purchase</div>
      <div className="benefit-item">✓ Maximum savings for heavy riders</div>
    </>
  )}
</div>

                        <button
                          className="btn-upgrade-plan"
                          onClick={() => handleUpgrade(plan.id)}
                        >
                          Select {plan.planName} →
                        </button>
                      </div>
                    ))}
                </div>

                <div className="upgrade-footer-note">
                  <p>
                    💡 All plans auto-renew. Cancel anytime from your profile.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Benefits Guide Modal */}
          {showBenefitsModal && (
            <div
              className="modal-overlay"
              onClick={() => setShowBenefitsModal(false)}
            >
              <div
                className="benefits-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="modal-close"
                  onClick={() => setShowBenefitsModal(false)}
                >
                  ✕
                </button>

                <div className="benefits-header">
                  <h1>🚲 Cycle Rental Membership Guide</h1>
                  <p>Everything you need to know about our membership plans</p>
                </div>

                <div className="benefits-content">
                  {/* Section 1 */}
                  <div className="guide-section">
                    <div className="section-number">1️⃣</div>
                    <h2>What is a Membership Plan?</h2>
                    <p>
                      A membership plan is an{" "}
                      <strong>optional subscription</strong> that helps you save
                      money when renting cycles.
                    </p>
                    <div className="info-box">
                      <p>
                        ✅ Ride without a membership and pay normal rental
                        charges
                      </p>
                      <p>
                        ✅ Buy a membership and get discounts or free ride time
                      </p>
                    </div>
                    <p className="note">
                      💡 Membership does not replace rental pricing — it simply
                      gives you <strong>benefits on top of it</strong>.
                    </p>
                  </div>

                  {/* Section 2 */}
                  <div className="guide-section">
                    <div className="section-number">2️⃣</div>
                    <h2>Pay-As-You-Go (BASIC Plan – ₹0)</h2>
                    <p>
                      This is the <strong>default option</strong> for all users.
                    </p>
                    <ul>
                      <li>No subscription fee</li>
                      <li>No commitment</li>
                      <li>You only pay for the time you use the cycle</li>
                    </ul>
                    <div className="plan-card basic-card">
                      <h4>How it works</h4>
                      <p>
                        Charges are calculated based on hourly/daily pricing. No
                        discounts or special benefits are applied.
                      </p>
                      <div className="best-for">
                        <strong>Best for:</strong> Occasional riders •
                        First-time users • Rare usage
                      </div>
                    </div>
                  </div>

                  {/* Section 3 */}
                  <div className="guide-section">
                    <div className="section-number">3️⃣</div>
                    <h2>Weekly Membership — ₹199</h2>
                    <p>
                      Valid for <strong>7 days</strong> from purchase.
                    </p>
                    <div className="plan-card weekly-card">
                      <h4>Benefits</h4>
                      <p className="discount-badge">
                        10% discount on all rides
                      </p>
                      <div className="example-box">
                        <strong>Example:</strong> Ride normally costs ₹100 → You
                        pay only <span className="highlight">₹90</span>
                      </div>
                      <div className="best-for">
                        <strong>Best for:</strong> Short-term regular riders •
                        Visitors • Students
                      </div>
                    </div>
                  </div>

                  {/* Section 4 */}
                  <div className="guide-section">
                    <div className="section-number">4️⃣</div>
                    <h2>Monthly Membership — ₹499</h2>
                    <p>
                      Valid for <strong>30 days</strong>.
                    </p>
                    <div className="plan-card monthly-card">
                      <h4>Benefits</h4>
                      <p className="discount-badge">
                        20% discount on rides + First 15 min FREE
                      </p>
                      <div className="example-box">
                        <strong>Example:</strong> 20-minute ride
                        <br />• First 15 min → FREE
                        <br />• Remaining 5 min → Charged with discount
                      </div>
                      <div className="best-for">
                        <strong>Best for:</strong> Daily commuters •
                        Office/college travel • Frequent riders
                      </div>
                    </div>
                  </div>

                  {/* Section 5 */}
                  <div className="guide-section">
                    <div className="section-number">5️⃣</div>
                    <h2>Quarterly Membership — ₹1199</h2>
                    <p>
                      Valid for <strong>90 days</strong>.
                    </p>
                    <div className="plan-card quarterly-card">
                      <h4>Benefits</h4>
                      <p className="discount-badge">
                        30% discount + First 30 min FREE + Priority booking
                      </p>
                      <div className="example-box">
                        <strong>Example:</strong> 25-minute ride →{" "}
                        <span className="highlight">Entire ride FREE!</span>
                      </div>
                      <div className="best-for">
                        <strong>Best for:</strong> Heavy users • Long-term
                        riders • Maximum savings
                      </div>
                    </div>
                  </div>

                  {/* Comparison Table */}
                  <div className="guide-section">
                    <div className="section-number">6️⃣</div>
                    <h2>Choosing the Right Plan</h2>
                    <table className="comparison-table">
                      <thead>
                        <tr>
                          <th>Usage Type</th>
                          <th>Recommended Plan</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Rare usage</td>
                          <td>
                            <span className="plan-pill basic">
                              Pay-As-You-Go
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>1 week frequent rides</td>
                          <td>
                            <span className="plan-pill weekly">Weekly</span>
                          </td>
                        </tr>
                        <tr>
                          <td>Daily commuting</td>
                          <td>
                            <span className="plan-pill monthly">Monthly</span>
                          </td>
                        </tr>
                        <tr>
                          <td>Long-term regular usage</td>
                          <td>
                            <span className="plan-pill quarterly">
                              Quarterly
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Important Notes */}
                  <div className="guide-section">
                    <div className="section-number">7️⃣</div>
                    <h2>Important Notes</h2>
                    <ul className="notes-list">
                      <li>
                        ⏰ Membership benefits apply only while the plan is
                        active
                      </li>
                      <li>
                        💸 Discounts are automatically applied during billing
                      </li>
                      <li>🔄 Free minutes reset for each ride</li>
                      <li>
                        ⚠️ Membership fees are non-refundable after activation
                      </li>
                    </ul>
                  </div>

                  {/* Summary */}
                  <div className="guide-summary">
                    <h2>🎯 Summary</h2>
                    <p>
                      You <strong>always</strong> have the option to ride
                      without membership. Membership simply rewards frequent
                      riders with:
                    </p>
                    <div className="summary-benefits">
                      <div className="summary-item">💰 Lower prices</div>
                      <div className="summary-item">⏱️ Free ride time</div>
                      <div className="summary-item">🎯 Better availability</div>
                    </div>
                    <p className="final-note">
                      The more you ride, the more you save with higher plans!
                    </p>
                  </div>
                </div>

                <div className="benefits-footer">
                  <button
                    className="btn-close-guide"
                    onClick={() => setShowBenefitsModal(false)}
                  >
                    Got It!
                  </button>
                  <button
                    className="btn-upgrade-now"
                    onClick={() => {
                      setShowBenefitsModal(false);
                      setShowUpgradeModal(true);
                    }}
                  >
                    Upgrade Now →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
