import React, { useState } from 'react';

const faqs = [
  { q: "How do I rent a cycle?",              a: "Download the app, find a nearby station, scan the QR code on the cycle and confirm your booking." },
  { q: "How do I return a cycle?",            a: "Ride to any SpinCity station, park the cycle in a dock and scan to end your ride." },
  { q: "What payment methods are accepted?",  a: "We accept UPI, credit/debit cards, net banking and SpinCity wallet balance." },
  { q: "What is the security deposit?",       a: "A refundable deposit is collected at the time of first booking. It is returned when you close your account." },
  { q: "What if the cycle is damaged?",       a: "Report it immediately using the Report Defect option in your dashboard. Our team will assist you." },
  { q: "How do I reset my password?",         a: "Click on Forgot Password on the login page and verify using your registered email and security questions." },
];

const FAQ = () => {
  const [open, setOpen] = useState(null);

  return (
    <section className="faq-section">
      <h2 className="faq-title">Frequently Asked Questions</h2>
      <p className="faq-subtitle">Everything you need to know about SpinCity</p>
      <div className="faq-list">
        {faqs.map((item, i) => (
          <div key={i} className={`faq-card ${open === i ? 'open' : ''}`}>
            <button className="faq-question" onClick={() => setOpen(open === i ? null : i)}>
              <span>{item.q}</span>
              <span className="faq-icon">{open === i ? '−' : '+'}</span>
            </button>
            {open === i && <p className="faq-answer">{item.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;