// import React, { useState, useEffect } from 'react';
// import '../style/home.css';

// function HomePage() {
//   const [scrolled, setScrolled] = useState(false);
//   const [activeSection, setActiveSection] = useState('home');

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 50);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const bikes = [
//     {
//       id: 1,
//       name: 'Mountain Explorer',
//       price: '$15/day',
//       image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbgq_69-6Y9yDjKH5s_B_2_MR7HHdDWlG7pQ&s',
//       type: 'Mountain Bike'
//     },
//     {
//       id: 2,
//       name: 'City Cruiser',
//       price: '$10/day',
//       image: 'https://bike.shimano.com/content/dam/one-website/common/stories/shimano-105-mechanical-magic/FullMediaBanner_Article-Banner_PC_v2.jpg',
//       type: 'City Bike'
//     },
//     {
//       id: 3,
//       name: 'Speed Racer',
//       price: '$20/day',
//       image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEM8wlCHJ-oKMvxMiL0I6CymsG9q-AXAIM6A&s',
//       type: 'Road Bike'
//     }
//   ];

//   const features = [
//     { icon: '🚴', title: 'Premium Bikes', desc: 'Top-quality bicycles for every terrain' },
//     { icon: '📱', title: 'Easy Booking', desc: 'Book instantly through our platform' },
//     { icon: '🔒', title: 'Secure & Safe', desc: 'GPS tracking and insurance included' },
//     { icon: '💰', title: 'Best Prices', desc: 'Competitive rates with flexible plans' }
//   ];

//   return (
//     <div className="App">
//       {/* Navbar */}
//       <nav className={`navbar navbar-expand-lg fixed-top ${scrolled ? 'navbar-scrolled' : ''}`}>
//         <div className="container">
//           <a className="navbar-brand brand-logo" href="#home">
//             <span className="brand-spin">Spin</span><span className="brand-city">City</span>
//           </a>
//           <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
//             <span className="navbar-toggler-icon"></span>
//           </button>
//           <div className="collapse navbar-collapse" id="navbarNav">
//             <ul className="navbar-nav ms-auto">
//               <li className="nav-item"><a className="nav-link" href="#home">Home</a></li>
//               <li className="nav-item"><a className="nav-link" href="#bikes">Bikes</a></li>
//               <li className="nav-item"><a className="nav-link" href="#features">Features</a></li>
//               <li className="nav-item"><a className="nav-link" href="#contact">Contact</a></li>
//               <li className="nav-item"><a className="nav-link btn-rent" href="#book">Rent Now</a></li>
//             </ul>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section id="home" className="hero-section">
//         <div className="hero-overlay"></div>
//         <div className="hero-image" style={{backgroundImage: `url(https://media.istockphoto.com/id/1466459662/video/tracking-shot-cyclist-cycling-uphill-on-road-in-sunrise-mountains.jpg?b=1&s=640x640&k=20&c=2qD3p-tOwwEQdzcWTiwTB3RiKMLVVixxG5nUc3G6X1k=)`}}></div>
//         <div className="container hero-content">
//           <div className="row align-items-center min-vh-100">
//             <div className="col-lg-8">
//               <h1 className="hero-title animate-fade-in">
//                 Explore the City<br />
//                 <span className="highlight">On Two Wheels</span>
//               </h1>
//               <p className="hero-subtitle animate-fade-in-delay">
//                 Premium bicycle rentals for every adventure. Experience freedom, flexibility, and fun with SpinCity.
//               </p>
//               <div className="hero-buttons animate-fade-in-delay-2">
//                 <a href="#bikes" className="btn btn-primary btn-lg me-3 pulse-button">Browse Bikes</a>
//                 <a href="#contact" className="btn btn-outline-light btn-lg">Learn More</a>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="scroll-indicator">
//           <div className="scroll-arrow"></div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section id="features" className="features-section py-5">
//         <div className="container">
//           <div className="text-center mb-5">
//             <h2 className="section-title">Why Choose SpinCity?</h2>
//             <p className="section-subtitle">Experience the best cycling rental service in town</p>
//           </div>
//           <div className="row g-4">
//             {features.map((feature, index) => (
//               <div key={index} className="col-md-6 col-lg-3">
//                 <div className="feature-card">
//                   <div className="feature-icon">{feature.icon}</div>
//                   <h4 className="feature-title">{feature.title}</h4>
//                   <p className="feature-desc">{feature.desc}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Bikes Section */}
//       <section id="bikes" className="bikes-section py-5">
//         <div className="container">
//           <div className="text-center mb-5">
//             <h2 className="section-title">Our Premium Fleet</h2>
//             <p className="section-subtitle">Choose from our collection of high-quality bicycles</p>
//           </div>
//           <div className="row g-4">
//             {bikes.map((bike, index) => (
//               <div key={bike.id} className="col-md-6 col-lg-4">
//                 <div className="bike-card">
//                   <div className="bike-image-container">
//                     <img src={bike.image} alt={bike.name} className="bike-image" />
//                     <div className="bike-overlay">
//                       <button className="btn btn-light">View Details</button>
//                     </div>
//                   </div>
//                   <div className="bike-content">
//                     <span className="bike-type">{bike.type}</span>
//                     <h4 className="bike-name">{bike.name}</h4>
//                     <div className="bike-footer">
//                       <span className="bike-price">{bike.price}</span>
//                       <button className="btn btn-primary btn-sm">Rent Now</button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Gallery Section */}
//       <section className="gallery-section py-5">
//         <div className="container">
//           <div className="text-center mb-5">
//             <h2 className="section-title">Experience the Journey</h2>
//             <p className="section-subtitle">Explore stunning routes and scenic adventures</p>
//           </div>
//           <div className="row g-4">
//             <div className="col-md-6">
//               <div className="gallery-item">
//                 <img src="https://img.freepik.com/premium-photo/cyclist-tunnel-with-light-his-helmet_853115-1083.jpg" alt="Cycling Adventure" />
//                 <div className="gallery-overlay">
//                   <h4>Urban Adventures</h4>
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-6">
//               <div className="gallery-item">
//                 <img src="https://www.shutterstock.com/shutterstock/videos/3618864667/thumb/8.jpg?ip=x480" alt="Mountain Trails" />
//                 <div className="gallery-overlay">
//                   <h4>Mountain Trails</h4>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section id="book" className="cta-section py-5">
//         <div className="container text-center">
//           <h2 className="cta-title mb-4">Ready to Start Your Adventure?</h2>
//           <p className="cta-subtitle mb-4">Join thousands of happy riders and experience the freedom of cycling</p>
//           <button className="btn btn-light btn-lg pulse-button">Book Your Ride Today</button>
//         </div>
//       </section>

//       {/* Contact Section */}
//       <section id="contact" className="contact-section py-5">
//         <div className="container">
//           <div className="row">
//             <div className="col-lg-6 mb-4">
//               <h2 className="section-title">Get In Touch</h2>
//               <p className="mb-4">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
//               <div className="contact-info">
//                 <div className="contact-item">
//                   <i className="icon">📍</i>
//                   <div>
//                     <h5>Location</h5>
//                     <p>123 Cycle Street, City Center</p>
//                   </div>
//                 </div>
//                 <div className="contact-item">
//                   <i className="icon">📧</i>
//                   <div>
//                     <h5>Email</h5>
//                     <p>hello@spincity.com</p>
//                   </div>
//                 </div>
//                 <div className="contact-item">
//                   <i className="icon">📞</i>
//                   <div>
//                     <h5>Phone</h5>
//                     <p>+1 (555) 123-4567</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="col-lg-6">
//               <div className="contact-form">
//                 <div className="mb-3">
//                   <input type="text" className="form-control" placeholder="Your Name" />
//                 </div>
//                 <div className="mb-3">
//                   <input type="email" className="form-control" placeholder="Your Email" />
//                 </div>
//                 <div className="mb-3">
//                   <textarea className="form-control" rows="5" placeholder="Your Message"></textarea>
//                 </div>
//                 <button onClick={() => alert('Message sent!')} className="btn btn-primary w-100">Send Message</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="footer py-4">
//         <div className="container text-center">
//           <p className="mb-0">&copy; 2026 SpinCity. All rights reserved. Ride Safe, Ride Smart.</p>
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default HomePage;

import React, { useState, useEffect } from "react";
import "../style/home.css";
import cycle from "../assets/video/v2.mp4";
import { Link } from "react-router-dom";
const HomePage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const bikes = [
    {
      name: "Urban Commuter",
      price: "₹50/hour",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbgq_69-6Y9yDjKH5s_B_2_MR7HHdDWlG7pQ&s",
      features: ["City rides", "Comfortable seat", "Basket included"],
    },
    {
      name: "Mountain Explorer",
      price: "₹80/hour",
      image:
        "https://bike.shimano.com/content/dam/one-website/common/stories/shimano-105-mechanical-magic/FullMediaBanner_Article-Banner_PC_v2.jpg",
      features: ["Off-road ready", "Suspension", "All-terrain"],
    },
    {
      name: "Speed Racer",
      price: "₹100/hour",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEM8wlCHJ-oKMvxMiL0I6CymsG9q-AXAIM6A&s",
      features: ["High speed", "Lightweight", "Racing design"],
    },
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      text: "SPINCity transformed my daily commute. Eco-friendly and affordable!",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      text: "Best cycling experience in the city. The bikes are well-maintained and booking is seamless.",
      rating: 5,
    },
    {
      name: "Amit Patel",
      text: "Incredible service! I use it every weekend for my fitness routine.",
      rating: 5,
    },
  ];

  return (
    <div className="homepage">
      {/* Navbar */}
      <nav
        className={`navbar navbar-expand-lg fixed-top ${
          scrolled ? "navbar-scrolled" : ""
        }`}
      >
        <div className="container">
          <a className="navbar-brand" href="#home">
            <div className="home-logo-container">
              <span className="home-logo-spin">SPIN</span>
              <span className="home-logo-city">  City</span>
              <div className="logo-tagline">
                Sustainable Personal Innovation Network
              </div>
            </div>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="#home">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#about">
                  About
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#bikes">
                  Bikes
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#how-it-works">
                  How It Works
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#testimonials">
                  Testimonials
                </a>
              </li>
              <li className="nav-item">
                <Link className="nav-link btn-custom" to="/signup">
                  Create Account
                </Link>
              </li>{" "}
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section" id="home">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <h1 className="hero-title animate-slide-up">
                  Ride Into A{" "}
                  <span className="text-highlight">Sustainable</span> Future
                </h1>
                <p className="hero-subtitle animate-slide-up delay-1">
                  Experience the freedom of cycling with SPINCity - Your
                  eco-friendly companion for urban mobility
                </p>
                <div className="hero-buttons animate-slide-up delay-2">
                 
                    <Link className="btn btn-primary btn-lg me-3" to="/signup">
                      Explore Bikes
                    </Link>
           
                  {/* <a href="#bikes" className="btn btn-primary btn-lg me-3">
                    Explore Bikes
                  </a> */}
                  <a
                    href="#how-it-works"
                    className="btn btn-outline-light btn-lg"
                  >
                    Learn More
                  </a>
                </div>
                <div className="home-hero-stats animate-fade-in delay-3">
                  <div className="stats-item">
                    <h3>10K+</h3>
                    <p>Happy Riders</p>
                  </div>
                  <div className="stats-item">
                    <h3>500+</h3>
                    <p>Bikes Available</p>
                  </div>
                  <div className="stats-item">
                    <h3>50+</h3>
                    <p>Locations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="mouse"></div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="about">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="about-image-wrapper">
                <img
                  src="https://img.freepik.com/premium-photo/cyclist-tunnel-with-light-his-helmet_853115-1083.jpg"
                  alt="Cycling"
                  className="about-image"
                />
                <div className="about-badge">
                  <h4>100%</h4>
                  <p>Eco-Friendly</p>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <h2 className="section-title">About SPINCity</h2>
              <p className="section-description">
                SPINCity is revolutionizing urban transportation through
                sustainable cycling solutions. We believe in creating a greener
                tomorrow by making cycling accessible, affordable, and enjoyable
                for everyone.
              </p>
              <div className="about-features">
                <div className="feature-item">
                  <div className="feature-icon">🌱</div>
                  <div>
                    <h5>Sustainable</h5>
                    <p>Zero emissions, maximum impact</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">💡</div>
                  <div>
                    <h5>Innovative</h5>
                    <p>Smart booking and tracking system</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🤝</div>
                  <div>
                    <h5>Community</h5>
                    <p>Building a network of eco-warriors</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bikes Section */}
      <section className="bikes-section" id="bikes">
        <div className="container">
          <h2 className="section-title text-center">Our Bike Collection</h2>
          <p className="section-subtitle text-center">
            Choose the perfect ride for your journey
          </p>
          <div className="row mt-5">
            {bikes.map((bike, index) => (
              <div className="col-lg-4 col-md-6 mb-4" key={index}>
                <div className="bike-card">
                  <div className="bike-image-wrapper">
                    <img
                      src={bike.image}
                      alt={bike.name}
                      className="bike-image"
                    />
                  <div className="bike-overlay">
  <Link to="/signup" className="btn btn-light">Book Now</Link>
</div>
                  </div>
                  <div className="bike-content">
                    <h4>{bike.name}</h4>
                    <p className="bike-price">{bike.price}</p>
                    <ul className="bike-features">
                      {bike.features.map((feature, idx) => (
                        <li key={idx}>✓ {feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section" id="how-it-works">
        <div className="container">
          <h2 className="section-title text-center">How It Works</h2>
          <p className="section-subtitle text-center">
            Get started in three simple steps
          </p>
          <div className="row mt-5">
            <div className="col-lg-4 mb-4">
              <div className="step-card">
                <div className="step-number">01</div>
                <h4>Choose Your Bike</h4>
                <p>
                  Browse our collection and select the perfect bike for your
                  needs
                </p>
              </div>
            </div>
            <div className="col-lg-4 mb-4">
              <div className="step-card">
                <div className="step-number">02</div>
                <h4>Book & Pay</h4>
                <p>Reserve your bike online with secure payment options</p>
              </div>
            </div>
            <div className="col-lg-4 mb-4">
              <div className="step-card">
                <div className="step-number">03</div>
                <h4>Ride & Enjoy</h4>
                <p>Pick up your bike and start your sustainable journey</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section" id="testimonials">
        <div className="container">
          <h2 className="section-title text-center">What Our Riders Say</h2>
          <div className="testimonial-carousel">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`testimonial-card ${
                  index === activeTestimonial ? "active" : ""
                }`}
              >
                <div className="stars">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <h5 className="testimonial-name">- {testimonial.name}</h5>
              </div>
            ))}
          </div>
          <div className="testimonial-indicators">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`indicator ${
                  index === activeTestimonial ? "active" : ""
                }`}
                onClick={() => setActiveTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" id="book">
        <div className="cta-overlay"></div>
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Journey?</h2>
            <p>
              Join thousands of riders who choose SPINCity for sustainable
              transportation
            </p>
           <Link to="/signup" className="btn btn-light btn-lg">
  Book Your Bike Now
</Link>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 mb-4">
              <div className="footer-logo">
                <span className="home-logo-spin">SPIN</span>
                <span className="logo-city">City</span>
              </div>
              <p className="footer-description">
                Sustainable Personal Innovation Network - Leading the way in
                eco-friendly urban mobility
              </p>
            </div>
            <div className="col-lg-2 col-md-6 mb-4">
              <h5>Quick Links</h5>
              <ul className="footer-links">
                <li>
                  <a href="#home">Home</a>
                </li>
                <li>
                  <a href="#about">About</a>
                </li>
                <li>
                  <a href="#bikes">Bikes</a>
                </li>
                <li>
                  <a href="#testimonials">Reviews</a>
                </li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-6 mb-4">
              <h5>Support</h5>
              <ul className="footer-links">
                <li>
                  <a href="#faq">FAQ</a>
                </li>
                <li>
                  <a href="#contact">Contact</a>
                </li>
                <li>
                  <a href="#terms">Terms</a>
                </li>
                <li>
                  <a href="#privacy">Privacy</a>
                </li>
              </ul>
            </div>
            <div className="col-lg-4 mb-4">
              <h5>Newsletter</h5>
              <p>Subscribe for updates and exclusive offers</p>
              <div className="newsletter-form">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="form-control"
                />
                <button className="btn btn-primary">Subscribe</button>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>
              &copy; 2026 SPINCity. All rights reserved. | Designed for a
              sustainable future
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

// import React, { useState, useEffect } from 'react';
// import '../style/home.css';

// const HomePage = () => {
//   const [scrolled, setScrolled] = useState(false);
//   const [activeTestimonial, setActiveTestimonial] = useState(0);

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 50);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setActiveTestimonial((prev) => (prev + 1) % 3);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   const bikes = [
//     {
//       name: "Urban Commuter",
//       price: "₹50/hour",
//       image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbgq_69-6Y9yDjKH5s_B_2_MR7HHdDWlG7pQ&s",
//       features: ["City rides", "Comfortable seat", "Basket included"]
//     },
//     {
//       name: "Mountain Explorer",
//       price: "₹80/hour",
//       image: "https://bike.shimano.com/content/dam/one-website/common/stories/shimano-105-mechanical-magic/FullMediaBanner_Article-Banner_PC_v2.jpg",
//       features: ["Off-road ready", "Suspension", "All-terrain"]
//     },
//     {
//       name: "Speed Racer",
//       price: "₹100/hour",
//       image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEM8wlCHJ-oKMvxMiL0I6CymsG9q-AXAIM6A&s",
//       features: ["High speed", "Lightweight", "Racing design"]
//     }
//   ];

//   const testimonials = [
//     {
//       name: "Rajesh Kumar",
//       text: "SPINCity transformed my daily commute. Eco-friendly and affordable!",
//       rating: 5
//     },
//     {
//       name: "Priya Sharma",
//       text: "Best cycling experience in the city. The bikes are well-maintained and booking is seamless.",
//       rating: 5
//     },
//     {
//       name: "Amit Patel",
//       text: "Incredible service! I use it every weekend for my fitness routine.",
//       rating: 5
//     }
//   ];

//   return (
//     <div className="homepage">
//       {/* Navbar */}
//       <nav className={`navbar navbar-expand-lg navbar-light fixed-top ${scrolled ? 'navbar-scrolled' : ''}`}>
//         <div className="container-fluid px-5">
//           <a className="navbar-brand" href="#home">
//             <div className="logo-wrapper">
//               <div className="logo-text">
//                 <span className="home-logo-spin">SPIN</span>
//                 <span className="logo-city">City</span>
//               </div>
//               <div className="logo-tagline">SUSTAINABLE PERSONAL INNOVATION NETWORK</div>
//             </div>
//           </a>
//           <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
//             <span className="navbar-toggler-icon"></span>
//           </button>
//           <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
//             <ul className="navbar-nav align-items-center">
//               <li className="nav-item"><a className="nav-link" href="#home">Home</a></li>
//               <li className="nav-item"><a className="nav-link" href="#about">About</a></li>
//               <li className="nav-item"><a className="nav-link" href="#bikes">Bikes</a></li>
//               <li className="nav-item"><a className="nav-link" href="#how-it-works">How It Works</a></li>
//               <li className="nav-item"><a className="nav-link" href="#testimonials">Testimonials</a></li>
//             </ul>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="hero-section" id="home">
//         <div className="hero-image-container">
//           <img
//             src="https://img.freepik.com/premium-photo/cyclist-tunnel-with-light-his-helmet_853115-1083.jpg"
//             alt="Cyclist"
//             className="hero-background-image"
//           />
//           <div className="hero-overlay"></div>
//         </div>

//         <div className="hero-content-wrapper">
//           <div className="container-fluid px-5">
//             <div className="row">
//               <div className="col-lg-7">
//                 <div className="hero-text-content">
//                   <h1 className="hero-main-title">
//                     Ride Into A<br/>
//                     <span className="hero-highlight">Sustainable</span><br/>
//                     Future
//                   </h1>

//                   <p className="hero-description">
//                     Experience the freedom of cycling with SPINCity - Your eco-friendly companion for urban mobility
//                   </p>

//                   <div className="hero-cta-buttons">
//                     <a href="#bikes" className="btn-explore">Explore Bikes</a>
//                     <a href="#how-it-works" className="btn-learn">Learn More</a>
//                   </div>

//                   <div className="home-hero-stats-container">
//                     <div className="stat-box">
//                       <h3 className="stat-number">10K+</h3>
//                       <p className="stat-label">Happy Riders</p>
//                     </div>
//                     <div className="stat-box">
//                       <h3 className="stat-number">500+</h3>
//                       <p className="stat-label">Bikes Available</p>
//                     </div>
//                     <div className="stat-box">
//                       <h3 className="stat-number">50+</h3>
//                       <p className="stat-label">Locations</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="scroll-down-indicator">
//           <div className="mouse-icon">
//             <div className="mouse-wheel"></div>
//           </div>
//         </div>
//       </section>

//       {/* About Section */}
//       <section className="about-section" id="about">
//         <div className="container-fluid px-5 py-5">
//           <div className="row align-items-center g-5">
//             <div className="col-lg-6">
//               <div className="about-image-block">
//                 <img
//                   src="https://media.istockphoto.com/id/1466459662/video/tracking-shot-cyclist-cycling-uphill-on-road-in-sunrise-mountains.jpg?b=1&s=640x640&k=20&c=2qD3p-tOwwEQdzcWTiwTB3RiKMLVVixxG5nUc3G6X1k="
//                   alt="Mountain Cycling"
//                   className="about-main-image"
//                 />
//                 <div className="eco-badge">
//                   <div className="badge-content">
//                     <h4>100%</h4>
//                     <p>Eco-Friendly</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="col-lg-6">
//               <div className="about-content">
//                 <h2 className="section-heading">About SPINCity</h2>
//                 <div className="heading-underline"></div>

//                 <p className="about-text">
//                   SPINCity is revolutionizing urban transportation through sustainable cycling solutions.
//                   We believe in creating a greener tomorrow by making cycling accessible, affordable, and enjoyable for everyone.
//                 </p>

//                 <div className="features-list">
//                   <div className="feature-box">
//                     <div className="feature-emoji">🌱</div>
//                     <div className="feature-text">
//                       <h5>Sustainable</h5>
//                       <p>Zero emissions, maximum impact</p>
//                     </div>
//                   </div>

//                   <div className="feature-box">
//                     <div className="feature-emoji">💡</div>
//                     <div className="feature-text">
//                       <h5>Innovative</h5>
//                       <p>Smart booking and tracking system</p>
//                     </div>
//                   </div>

//                   <div className="feature-box">
//                     <div className="feature-emoji">🤝</div>
//                     <div className="feature-text">
//                       <h5>Community</h5>
//                       <p>Building a network of eco-warriors</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Bikes Section */}
//       <section className="bikes-section" id="bikes">
//         <div className="container-fluid px-5 py-5">
//           <div className="text-center mb-5">
//             <h2 className="section-heading">Our Bike Collection</h2>
//             <div className="heading-underline mx-auto"></div>
//             <p className="section-subheading">Choose the perfect ride for your journey</p>
//           </div>

//           <div className="row g-4">
//             {bikes.map((bike, index) => (
//               <div className="col-lg-4 col-md-6" key={index}>
//                 <div className="bike-card-container">
//                   <div className="bike-image-section">
//                     <img src={bike.image} alt={bike.name} className="bike-img" />
//                     <div className="bike-hover-overlay">
//                       <button className="btn-book-bike">Book Now</button>
//                     </div>
//                   </div>
//                   <div className="bike-details">
//                     <h4 className="bike-name">{bike.name}</h4>
//                     <p className="bike-pricing">{bike.price}</p>
//                     <ul className="bike-feature-list">
//                       {bike.features.map((feature, idx) => (
//                         <li key={idx}>✓ {feature}</li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* How It Works Section */}
//       <section className="how-works-section" id="how-it-works">
//         <div className="container-fluid px-5 py-5">
//           <div className="text-center mb-5">
//             <h2 className="section-heading text-white">How It Works</h2>
//             <div className="heading-underline mx-auto bg-white"></div>
//             <p className="section-subheading text-white">Get started in three simple steps</p>
//           </div>

//           <div className="row g-4">
//             <div className="col-lg-4">
//               <div className="step-container">
//                 <div className="step-num">01</div>
//                 <h4 className="step-title">Choose Your Bike</h4>
//                 <p className="step-desc">Browse our collection and select the perfect bike for your needs</p>
//               </div>
//             </div>

//             <div className="col-lg-4">
//               <div className="step-container">
//                 <div className="step-num">02</div>
//                 <h4 className="step-title">Book & Pay</h4>
//                 <p className="step-desc">Reserve your bike online with secure payment options</p>
//               </div>
//             </div>

//             <div className="col-lg-4">
//               <div className="step-container">
//                 <div className="step-num">03</div>
//                 <h4 className="step-title">Ride & Enjoy</h4>
//                 <p className="step-desc">Pick up your bike and start your sustainable journey</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Testimonials Section */}
//       <section className="testimonials-section" id="testimonials">
//         <div className="container-fluid px-5 py-5">
//           <div className="text-center mb-5">
//             <h2 className="section-heading">What Our Riders Say</h2>
//             <div className="heading-underline mx-auto"></div>
//           </div>

//           <div className="testimonial-slider">
//             {testimonials.map((testimonial, index) => (
//               <div
//                 key={index}
//                 className={`testimonial-item ${index === activeTestimonial ? 'active-testimonial' : ''}`}
//               >
//                 <div className="rating-stars">
//                   {[...Array(testimonial.rating)].map((_, i) => (
//                     <span key={i} className="star">⭐</span>
//                   ))}
//                 </div>
//                 <p className="testimonial-quote">"{testimonial.text}"</p>
//                 <h5 className="testimonial-author">- {testimonial.name}</h5>
//               </div>
//             ))}
//           </div>

//           <div className="testimonial-dots">
//             {testimonials.map((_, index) => (
//               <button
//                 key={index}
//                 className={`dot ${index === activeTestimonial ? 'active-dot' : ''}`}
//                 onClick={() => setActiveTestimonial(index)}
//               />
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="cta-section" id="book">
//         <div className="cta-background">
//           <img
//             src="https://www.shutterstock.com/shutterstock/videos/3618864667/thumb/8.jpg?ip=x480"
//             alt="CTA Background"
//             className="cta-bg-image"
//           />
//           <div className="cta-overlay-gradient"></div>
//         </div>

//         <div className="cta-content-center">
//           <h2 className="cta-heading">Ready to Start Your Journey?</h2>
//           <p className="cta-subtext">Join thousands of riders who choose SPINCity for sustainable transportation</p>
//           <button className="btn-cta-main">Book Your Bike Now</button>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="footer-section">
//         <div className="container-fluid px-5 py-5">
//           <div className="row g-4">
//             <div className="col-lg-4">
//               <div className="footer-brand">
//                 <div className="footer-logo">
//                   <span className="home-logo-spin">SPIN</span>
//                   <span className="logo-city">City</span>
//                 </div>
//                 <p className="footer-desc">
//                   Sustainable Personal Innovation Network - Leading the way in eco-friendly urban mobility
//                 </p>
//               </div>
//             </div>

//             <div className="col-lg-2 col-md-6">
//               <h5 className="footer-heading">Quick Links</h5>
//               <ul className="footer-list">
//                 <li><a href="#home">Home</a></li>
//                 <li><a href="#about">About</a></li>
//                 <li><a href="#bikes">Bikes</a></li>
//                 <li><a href="#testimonials">Reviews</a></li>
//               </ul>
//             </div>

//             <div className="col-lg-2 col-md-6">
//               <h5 className="footer-heading">Support</h5>
//               <ul className="footer-list">
//                 <li><a href="#faq">FAQ</a></li>
//                 <li><a href="#contact">Contact</a></li>
//                 <li><a href="#terms">Terms</a></li>
//                 <li><a href="#privacy">Privacy</a></li>
//               </ul>
//             </div>

//             <div className="col-lg-4">
//               <h5 className="footer-heading">Newsletter</h5>
//               <p className="footer-newsletter-text">Subscribe for updates and exclusive offers</p>
//               <div className="newsletter-input-group">
//                 <input type="email" placeholder="Enter your email" className="newsletter-input" />
//                 <button className="newsletter-btn">Subscribe</button>
//               </div>
//             </div>
//           </div>

//           <div className="footer-bottom-bar">
//             <p>&copy; 2026 SPINCity. All rights reserved. | Designed for a sustainable future</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default HomePage;
