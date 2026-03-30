import React, { useState } from "react";
import "../style/login.css";
import { Link, useNavigate } from "react-router-dom";
import { setCustomerAuth, setStaffAuth } from "../auth/authStorage";

function Login() {
  const navigate = useNavigate();
  const [favFood, setFavFood] = useState("");
  const [favSport, setFavSport] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleChange = (e) => {
    console.log("handlechange entered");
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleGoogleLogin = () => {
    alert("Google Sign-In integration will be implemented with backend!");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("handlelogin entered");
    if (!formData.email || !formData.password) {
      alert("Please fill required fields");
      setIsLoading(false);
      return;
    }

    try {
      const endpoint =
        formData.userType === "staff"
          ? "https://spincity.onrender.com/api/auth/staff/login"
          : "https://spincity.onrender.com/api/auth/customer/login";

      const bodyData = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password.trim(),
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) {
        alert("Invalid credentials");
        return;
      }

      const data = await res.json(); // staff object aavse
      console.log("FULL STAFF RESPONSE:", JSON.stringify(data, null, 2));

      if (formData.userType === "staff") {
        console.log("STAFF LOGIN RESPONSE ✅", data);

        setStaffAuth({ token: data.token, role: data.role, user: data.user });

        if (data.role === "ADMIN") {
          console.log("admin dashboard now will come");
          navigate("/admindashboard", { replace: true });
        } else if (
          data.user.designation === "Cycle Maintenance" ||
          data.role === "MAINTENANCE"
        ) {
          // ✅ ADD THIS BLOCK
          navigate("/maintenancedashboard", { replace: true });
        } else {
          navigate("/employeedashboard", { replace: true });
        }
      } else {
        console.log("LOGIN FULL RESPONSE ✅", data);

        // Ensure valid structure
        if (data && data.user && data.user.customerId) {
          setCustomerAuth({ token: data.token, user: data.user });
          navigate("/userdashboard", { replace: true });
        } else {
          console.error("Invalid login response structure", data);
          alert("Login failed — invalid server response");
        }
      }
    } catch (error) {
      console.error(error);
      alert("Server Error");
    } finally {
      setIsLoading(false); // ← and this
    }
  };
  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (!resetEmail || !favFood || !favSport) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch(
        "https://spincity.onrender.com/api/customers/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: resetEmail,
            favFood: favFood,
            favSport: favSport,
          }),
        },
      );

      if (res.ok) {
        alert("Password sent to your email!");
        setForgotPassword(false);
        setResetEmail("");
        setFavFood("");
        setFavSport("");
      } else {
        alert("Verification failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="login-wrapper">
      {/* Background Animation */}
      <div className="animated-bg">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
        <div className="circle circle-4"></div>
      </div>

      {/* Left Side - Branding */}
      <div className="login-left">
        <div className="login-brand-section">
          <div className="brand-logo-large">
            <span className="brand-spin-large">Spin</span>
            <span className="brand-city-large">City</span>
          </div>
          <h2 className="brand-tagline">Welcome Back, Rider!</h2>
          <p className="brand-description">
            Your next adventure awaits. Sign in to access premium bikes, track
            your rides, and explore the city on two wheels.
          </p>

          <div className="stats-section">
            <div className="stat-item">
              <div className="stat-number">10+</div>
              <div className="stat-label">Happy Riders</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100+</div>
              <div className="stat-label">Premium Cycles</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">14</div>
              <div className="stat-label">Locations</div>
            </div>
          </div>

          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">🚴</span>
              <span>Instant Bike Access</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📍</span>
              <span>Track Your Rides</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💳</span>
              <span>Easy Payments</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎁</span>
              <span>Exclusive Rewards</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-right">
        <div className="login-container">
          {!forgotPassword ? (
            <div className="login-card">
              <div className="login-header">
                <h1 className="login-title">Welcome Back</h1>
                <p className="login-subtitle">
                  Sign in to continue your journey
                </p>
              </div>

              <div className="login-form-container">
                <div className="divider">
                  <span>or sign in with email</span>
                </div>
                <div className="login-from-group">
                  <label>User Type</label>
                  <select
                    name="userType"
                    value={formData.userType || "customer"}
                    onChange={(e) =>
                      setFormData({ ...formData, userType: e.target.value })
                    }
                  >
                    <option value="customer">Customer</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>
                {/* Login Form */}
                <div className="form-content">
                  <div className="login-from-group">
                    <label htmlFor="email">Email Address</label>
                    <div className="login-input-wrapper">
                      <span className="login-input-icon">📧</span>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  {/* <div className="login-from-group">
                    <label htmlFor="password">Password</label>
                    <div className="login-input-wrapper">
                      <span className="login-input-icon">🔒</span>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "👁️" : "👁️‍🗨️"}
                      </button>
                    </div>
                  </div> */}

                  <div className="login-from-group">
                    <label htmlFor="password">Password</label>
                    <div className="login-input-wrapper">
                      <span className="login-input-icon">🔒</span>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "👁️" : "👁️‍🗨️"}
                      </button>
                    </div>
                  </div>

                  <div className="form-options">
                    <button
                      type="button"
                      className="forgot-link"
                      onClick={() => setForgotPassword(true)}
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleLogin}
                    disabled={isLoading}
                  >
                    {isLoading ? "⏳ Connecting to server..." : "LogIn"}
                    {!isLoading && <span className="btn-arrow">→</span>}
                  </button>
                </div>
              </div>

              <div className="login-footer">
                <p>
                  Don't have an account? Already have an account?{" "}
                  <Link to="/signup">SignUp</Link>
                </p>
              </div>
            </div>
          ) : (
            // Forgot Password Form
            <div className="login-card forgot-card">
              <button
                className="back-button"
                onClick={() => setForgotPassword(false)}
              >
                ← Back to Login
              </button>

              <div className="login-header">
                <div className="forgot-icon">🔑</div>
                <h1 className="login-title">Forgot Password?</h1>
                <p className="login-subtitle">
                  No worries! Enter your email and we'll send you a reset link.
                </p>
              </div>

              <div className="form-content">
                <div className="login-from-group">
                  <label htmlFor="resetEmail">Email Address</label>
                  <div className="login-input-wrapper">
                    <span className="login-input-icon">📧</span>
                    <input
                      type="email"
                      id="resetEmail"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="login-from-group">
                  <label htmlFor="favFood">Favorite Food</label>
                  <div className="login-input-wrapper">
                    <span className="login-input-icon">🍕</span>
                    <input
                      type="text"
                      id="favFood"
                      value={favFood}
                      onChange={(e) => setFavFood(e.target.value)}
                      placeholder="Your favorite food"
                      required
                    />
                  </div>
                </div>

                <div className="login-from-group">
                  <label htmlFor="favSport">Favorite Sport</label>
                  <div className="login-input-wrapper">
                    <span className="login-input-icon">🏏</span>
                    <input
                      type="text"
                      id="favSport"
                      value={favSport}
                      onChange={(e) => setFavSport(e.target.value)}
                      placeholder="Your favorite sport"
                      required
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-primary"
                  onClick={handlePasswordReset}
                >
                  Send Reset Link
                  <span className="btn-arrow">✉️</span>
                </button>

                <div className="info-box-small">
                  <span className="info-icon-small">ℹ️</span>
                  <span>
                    Check your spam folder if you don't receive the email within
                    5 minutes.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Bike Animation */}
      <div className="floating-bike">
        <div className="bike-icon">🚴‍♂️</div>
      </div>
    </div>
  );
}

export default Login;
