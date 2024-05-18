import React from "react";
import "./Footer.css";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <div className="footer-body">
      <footer className="footer">
        <div className="footer-container">
          <div className="row">
            <div className="footer-col">
              <h4>Contact Us</h4>
              <ul>
                <li>
                  <b>Mail: </b>Ratnajashwanth64@gmail.com
                </li>
                <li>
                  <b>Contact: </b>9392972552
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Social Media</h4>
              <div className="social-links">
                <a href="#">
                  <FaFacebook />
                </a>
                <a href="#">
                  <FaInstagram />
                </a>
                <a href="#">
                  <FaLinkedin />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
