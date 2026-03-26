import React, { useState } from "react";
import "../style/Signup.css";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    emergencyContact: "",
    emergencyName: "",
    favFood: "",
    favSport: "",
    acceptTerms: false,
    idProofType: "",
    idProofDocument: "",
  });

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [idProofFile, setIdProofFile] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
     
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const uploadIdProof = async (file) => {
  try {
    setUploadingFile(true);
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    const response = await fetch(
      "http://spincity.onrender.com/api/auth/customer/upload-id-proof",
      {
        method: "POST",
        body: formDataUpload, // ✅ NO Content-Type header
      }
    );

    if (response.ok) {
      const data = await response.json();
      setFormData((prev) => ({
        ...prev,
        idProofDocument: data.filePath, // ✅ save path
      }));
    } else {
      alert("❌ File upload failed. Please try again.");
    }
  } catch (err) {
    console.error("Upload error:", err);
    alert("❌ Server error during upload.");
  } finally {
    setUploadingFile(false);
  }
};
  const registerCustomer = async () => {
  try {
    const response = await fetch(
      "http://spincity.onrender.com/api/auth/customer/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          dateOfBirth: formData.dateOfBirth,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          emergencyContact: formData.emergencyContact,
          emergencyName: formData.emergencyName,
          favFood: formData.favFood,
          favSport: formData.favSport,
          idProofType: formData.idProofType,
          idProofDocument: formData.idProofDocument,
        }),
      }
    );

    if (response.ok) {
      alert("Registration Successful 🎉");
      navigate("/login", { replace: true });
    } else {
      const err = await response.text();
      alert("Signup Failed: " + err);
    }
  } catch (error) {
    console.error(error);
    alert("Server Error");
  }
};
 
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIdProofFile(file);
    uploadIdProof(file); // ✅ upload immediately on file select
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
  if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
    alert("Please fill all required fields");
    return;
  }
  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match!");
    return;
  }
  // ✅ ADD THESE IN STEP 1
  if (!formData.idProofType) {
    alert("Please select ID proof type");
    return;
  }
  if (!idProofFile && !formData.idProofDocument) {
    alert("Please upload your ID proof document");
    return;
  }
  if (uploadingFile) {
    alert("⏳ Please wait, file is still uploading...");
    return;
  }
  setStep(2);

}  else {
  if (!formData.acceptTerms) {
    alert("Please accept terms and conditions");
    return;
  }
  // ✅ ADD THESE VALIDATIONS
  if (!formData.idProofType) {
    alert("Please select ID proof type");
    return;
  }
  if (!formData.idProofDocument) {
    alert("Please upload your ID proof document");
    return;
  }
  registerCustomer();
}
  };

  const goBack = () => {
    setStep(1);
  };

  return (
    <div className="signup-wrapper">
      {/* Background Animation */}
      <div className="animated-bg">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
        <div className="circle circle-4"></div>
      </div>

      {/* Left Side - Branding */}
      <div className="signup-left">
        <div className="brand-section">
          <div className="brand-logo-large">
            <span className="brand-spin-large">Spin</span>
            <span className="brand-city-large">City</span>
          </div>
          <h2 className="brand-tagline">Your Journey Begins Here</h2>
          <p className="brand-description">
            Join thousands of happy riders exploring the city on two wheels.
            Ride freely, ride safely with SpinCity.
          </p>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Premium Quality Bikes</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>24/7 Customer Support</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Flexible Rental Plans</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Safe & Secure Rides</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="signup-right">
        <div className="signup-container">
          {/* Progress Indicator */}
          <div className="progress-indicator">
            <div className={`progress-step ${step >= 1 ? "active" : ""}`}>
              <div className="step-circle">1</div>
              <span className="step-label">Account</span>
            </div>
            <div className={`progress-line ${step >= 2 ? "active" : ""}`}></div>
            <div className={`progress-step ${step >= 2 ? "active" : ""}`}>
              <div className="step-circle">2</div>
              <span className="step-label">Details</span>
            </div>
          </div>

          <div className="signup-card">
            <div className="signup-header">
              <h1 className="signup-title">Create Account</h1>
              <p className="signup-subtitle">
                {step === 1
                  ? "Enter your basic information"
                  : "Complete your profile"}
              </p>
            </div>

            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="form-step animate-slide-in">
                

                <div className="form-group">
                  <label htmlFor="fullName">Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
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

                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    required
                  />
                  <small className="form-hint">
                    We'll send booking confirmations here
                  </small>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="password">Password *</label>
                    <div className="password-input">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create strong password"
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

                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password *</label>
                    <div className="password-input">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter password"
                        required
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                      </button>
                    </div>
                  </div>
                  
                </div>

                        {/* ID Proof Section */}
                  <div className="form-group">
                    <label htmlFor="idProofType">ID Proof Type *</label>
                    <select
                      id="idProofType"
                      name="idProofType"
                      value={formData.idProofType}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">Select ID Proof</option>
                      <option value="Aadhar">Aadhar Card</option>
                      
                      <option value="Driving License">Driving License</option>
                     
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="idProofFile">
                      Upload ID Proof * (JPG, PNG or PDF)
                    </label>
                    <div className="file-upload-wrap">
                      <input
                        type="file"
                        id="idProofFile"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={handleFileChange}
                        className="file-input"
                      />
                      {uploadingFile && (
                        <p className="upload-status">⏳ Uploading...</p>
                      )}
                      {formData.idProofDocument && !uploadingFile && (
                        <p className="upload-success">
                          ✅ File uploaded successfully
                        </p>
                      )}
                    </div>
                    <small className="form-hint">
                      Upload a clear photo or scan of your ID proof
                    </small>
                  </div>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleSubmit}
                >
                  Continue
                  <span className="btn-arrow">→</span>
                </button>
              </div>
            )}

            {/* Step 2: Additional Details */}
            {step === 2 && (
              <div className="form-step animate-slide-in">
                <div className="form-group">
                  <label htmlFor="dateOfBirth">Date of Birth *</label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                  />
                  <small className="form-hint">
                    You must be 18+ to rent a bicycle
                  </small>
                </div>

                <div className="form-group">
                  <label htmlFor="address">Address *</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street address, apartment, suite"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Your city"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="state">State *</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="State"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="pincode">Pincode *</label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="000000"
                      required
                    />
                  </div>
                </div>

                <div className="emergency-section">
                  <h3 className="section-title">Emergency Contact</h3>
                  <p className="section-desc">
                    For your safety, please provide emergency contact details
                  </p>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="emergencyName">Contact Name *</label>
                      <input
                        type="text"
                        id="emergencyName"
                        name="emergencyName"
                        value={formData.emergencyName}
                        onChange={handleChange}
                        placeholder="Emergency contact name"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="emergencyContact">Contact Number *</label>
                      <input
                        type="tel"
                        id="emergencyContact"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleChange}
                        placeholder="+91 XXXXX XXXXX"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="emergency-section">
                  <h3 className="section-title">Addintional Information</h3>
                  <p className="section-desc">
                    In Future in case if you forgot password you will have to
                    give answer of these questions to get password by email.
                  </p>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="favFood">Favorite Food *</label>
                      <input
                        type="text"
                        id="favFood"
                        name="favFood"
                        value={formData.favFood}
                        onChange={handleChange}
                        placeholder="Favorite Food"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="favSport">Favorite Sport *</label>
                      <input
                        type="text"
                        id="favSport"
                        name="favSport"
                        value={formData.favSport}
                        onChange={handleChange}
                        placeholder="Favorite Sport"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="info-box">
                  <span className="info-icon">ℹ️</span>
                  <div className="info-content">
                    <strong>Document Verification</strong>
                    <p>
                      Government ID (Aadhar/Driving License) will be required
                      during your first bike pickup for security purposes.
                    </p>
                  </div>
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="checkbox-text">
                      I agree to the <a href="#terms">Terms & Conditions</a> and{" "}
                      <a href="#privacy">Privacy Policy</a>
                    </span>
                  </label>
                </div>

                <div className="form-buttons">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={goBack}
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleSubmit}
                  >
                    Create Account
                    <span className="btn-arrow">✓</span>
                  </button>
                </div>
              </div>
            )}

            <div className="signup-footer">
              <p>
                Already have an account? <Link to="/login">LogIn</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
