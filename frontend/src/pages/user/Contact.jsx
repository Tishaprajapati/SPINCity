import React, { useState } from "react";
import "../../style/user/contact.css";
import cycle from "../../assets/video/v3.mp4";
import Navbar from "./Navbar";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import {FaPhone, FaWhatsapp } from 'react-icons/fa';

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [activeTab, setActiveTab] = useState("general");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/customers/contact",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (response.ok) {
        alert("✅ Message sent! We'll get back to you within 24 hours.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        alert("❌ " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server error. Please try again.");
    }
  };

  const contactInfo = [
    {
      icon: <MapPin size={24} color="#16a34a" strokeWidth={1.8} />,
      title: "Visit Us",
      details: [
        "B-801, shaligram banglows, behind motera stadium sabarmati, Ahmedabad",
      ],
      color: "#8BA3E8",
    },
    {
      icon: <Phone size={24} color="#16a34a" strokeWidth={1.8} />,
      title: "Call Us",
      details: ["+91 98765 43210", "+91 98765 43211"],
      color: "#6C92F4",
    },
    {
      icon: <Mail size={24} color="#16a34a" strokeWidth={1.8} />,
      title: "Email Us",
      details: ["dkp_dkp2000@spincity.com", "support@spincity.com"],
      color: "#667eea",
    },
    {
      icon: <Clock size={24} color="#16a34a" strokeWidth={1.8} />,
      title: "Working Hours",
      details: ["Mon - Sat: 7:00 AM - 2:00 AM", "Sunday: 8:00 AM - 11:00 PM"],
      color: "#764ba2",
    },
  ];

  const faqs = [
    {
      question: "How do I rent a cycle?",
      answer:
        "Simply sign up, browse our cycles, select your preferred bike and rental period, and complete the booking. You can pick up the bike from any of our locations.",
    },
    {
      question: "What documents do I need?",
      answer:
        "You need a valid government ID (Aadhar Card or Driving License) for verification during your first bike pickup.",
    },
    {
      question: "Can I extend my rental period?",
      answer:
        "Yes! You can extend your rental through our app or by contacting customer support before your rental period ends.",
    },
    {
      question: "What if the bike gets damaged?",
      answer:
        "All rentals include basic insurance. Report any damage immediately to our support team for assistance.",
    },
  ];

  const locations = [
    {
      name: "Sabarmati Riverfront",
      address: "Sabarmati Riverfront, Ahmedabad",
      phone: "+91 98765 43210",
    },
    {
      name: "IIM Ahmedabad",
      address: "IIM Road, Vastrapur, Ahmedabad",
      phone: "+91 98765 43211",
    },
    {
      name: "Railway Station",
      address: "Ahmedabad Junction Railway Station",
      phone: "+91 98765 43212",
    },
  ];

  return (
    <div className="contact-wrapper">
      <div>
        <Navbar />
      </div>
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-overlay"></div>
        <video
          className="hero-single-image"
          src={cycle}
          autoPlay
          loop
          muted
          playsInline
        ></video>
        <div className="container hero-content">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-8 mx-auto text-center">
              <h1 className="hero-title animate-fade-in">
                Let's Connect & Ride Together
              </h1>
              <p className="hero-subtitle animate-fade-in-delay">
                Have questions? Need assistance? We're here to help you every
                step of the way.
              </p>
              <div className="hero-stats animate-fade-in-delay-2">
                <div className="stat-box">
                  <div className="stat-number">24/7</div>
                  <div className="stat-label">Support Available</div>
                </div>
                <div className="stat-box">
                  <div className="stat-number">&lt;5min</div>
                  <div className="stat-label">Average Response</div>
                </div>
                <div className="stat-box">
                  <div className="stat-number">10K+</div>
                  <div className="stat-label">Happy Customers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="contact-info-section">
        <div className="container">
          <div className="row g-4">
            {contactInfo.map((info, index) => (
              <div key={index} className="col-md-6 col-lg-3">
                <div
                  className="contact-info-card"
                  style={{ "--card-color": info.color }}
                >
                  <div className="info-icon">{info.icon}</div>
                  <h3 className="info-title">{info.title}</h3>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="info-detail">
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Form Section */}
      <section className="contact-form-section">
        <div className="container">
          <div className="row g-5">
            {/* Left Side - Form */}
            <div className="col-lg-7">
              <div className="form-card">
                <div className="form-header">
                  <h2 className="form-title">Send Us a Message</h2>
                  <p className="form-subtitle">
                    Fill out the form below and we'll get back to you as soon as
                    possible
                  </p>
                </div>

                {/* Tab Navigation */}
                <div className="tab-navigation">
                  <button
                    className={`tab-btn ${
                      activeTab === "general" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("general")}
                  >
                    💬 General Inquiry
                  </button>
                  <button
                    className={`tab-btn ${
                      activeTab === "support" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("support")}
                  >
                    🛠️ Support
                  </button>
                  <button
                    className={`tab-btn ${
                      activeTab === "business" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("business")}
                  >
                    🤝 Business
                  </button>
                </div>

                <div className="contact-form">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="name">Full Name *</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="email">Email Address *</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="subject">Subject</label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="How can we help?"
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="message">Your Message *</label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows="6"
                          placeholder="Tell us more about your inquiry..."
                          required
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <button className="btn-submit" onClick={handleSubmit}>
                    Send Message
                    <span className="btn-arrow">→</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Additional Info */}
            <div className="col-lg-5">
              {/* Quick Contact */}
              <div className="quick-contact-card">
                <h3 className="section-title">Need Quick Help?</h3>
                <p className="section-desc">
                  Choose the fastest way to reach us
                </p>

                <div className="quick-options">
                  <button className="quick-btn">
                    <span className="quick-icon"><FaPhone size={18} color="#16a34a" /></span>

                    <div>
                      <div className="quick-title">Call Support</div>
                      <a href="tel:+919876543210" className="quick-desc">
                        +91 98765 43210
                      </a>
                    </div>
                  </button>
                  <a
                    href="https://wa.me/919429766948" // ✅ put your number here (91 + your number)
                    target="_blank"
                    rel="noopener noreferrer"
                    className="quick-btn"
                    style={{ textDecoration: "none" }}
                  >
                    <span className="quick-icon"><FaWhatsapp size={20} color="#25D366" /></span>
                    <div>
                      <div className="quick-title">WhatsApp</div>
                      <div className="quick-desc">Quick Response</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Locations */}
              <div className="locations-card">
                <h3 className="section-title">Our Locations</h3>
                <div className="locations-list">
                  {locations.map((location, index) => (
                    <div key={index} className="location-item">
                      <div className="location-icon">📍</div>
                      <div className="location-info">
                        <h4 className="location-name">{location.name}</h4>
                        <p className="location-address">{location.address}</p>
                        <p className="location-phone">{location.phone}</p>
                      </div>
                    </div>
                  ))}
                  <p className="more-locations">
                    📍 & 11 more stations across Ahmedabad —{" "}
                    <a href="/rentcycle">View all stations →</a>
                  </p>
                </div>
              </div>

              {/* Social Media */}
              <div className="social-card">
                <h3 className="section-title">Follow Us</h3>
                <div className="social-links">
                  <a  href="https://www.facebook.com/share/1CDsdiRmbZ/" className="social-link facebook">
                    <span>f</span>
                  </a>
                  
                  <a href="https://www.instagram.com/kirtida.prajapati" className="social-link instagram">
                    <span>i</span>
                  </a>
                  <a href="https://www.linkedin.com/in/tisha-prajapati-a94261289/" className="social-link linkedin">
                    <span>in</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title-main">Frequently Asked Questions</h2>
            <p className="section-subtitle-main">
              Quick answers to common questions
            </p>
          </div>
          <div className="row">
            {faqs.map((faq, index) => (
              <div key={index} className="col-lg-6 mb-4">
                <div className="faq-card">
                  <div className="faq-icon">❓</div>
                  <h4 className="faq-question">{faq.question}</h4>
                  <p className="faq-answer">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="map-container">
          <div className="map-overlay">
            <div className="map-info">
              <h3>Find Us Here</h3>
              <p>Visit our main office for in-person assistance</p>
              <button className="btn-directions">Get Directions →</button>
            </div>
          </div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d235013.74842745328!2d72.41493037803657!3d23.020497948290968!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sAhmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1234567890123"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="SpinCity Location"
          ></iframe>
        </div>
      </section>
    </div>
  );
}

export default Contact;
