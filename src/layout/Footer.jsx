import "../styles/Footer.css";
import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaWhatsapp, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Logo / Intro */}
          <div className="footer-section">
            <h4 className="footer-title">Majlish-E-Khidmat</h4>
            <p className="text-muted mb-md">
              Serving communities with compassion and transparency.
            </p>
            <p className="footer-tagline">Your small help makes the world better</p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h5 className="footer-subtitle">Quick Links</h5>
            <ul className="footer-links">
              <li><Link to="/user/register" className="footer-link">Register</Link></li>
              <li><Link to="/login" className="footer-link">Login</Link></li>
              <li><Link to="/donate" className="footer-link">Donate</Link></li>
              <li><Link to="/volunteer/register" className="footer-link">Volunteer</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h5 className="footer-subtitle">Contact</h5>
            <div className="contact-info">
              <p className="text-muted">
                Email: <a href="mailto:info@majlis.org" className="footer-link">info@majlis.org</a>
              </p>
              <p className="text-muted">
                Phone: <a href="tel:+919123188968" className="footer-link">+91 9123188968</a>
              </p>
            </div>

            {/* Social Links */}
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-link" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-link" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-link" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="https://wa.me/919123188968" target="_blank" rel="noreferrer" className="social-link" aria-label="WhatsApp">
                <FaWhatsapp />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-link" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

      {/* Copyright */}
      <div className="copyright">
        © {new Date().getFullYear()} Majlish-E-Khidmat. All rights reserved.
      </div>
      </div>
    </footer>
  );
}

export default Footer;
