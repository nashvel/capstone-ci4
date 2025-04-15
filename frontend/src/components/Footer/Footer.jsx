import React from "react";
import "./footer.css";
import { assets } from "../../assets/assets";

function Footer() {
  return (
    <>
      <div className="footer" id="contact-us">
        <div className="footer-content">
          <div className="footer-content-left">
            <img src={assets.logo2} alt="logo" width={"290px"} />
            <p>
              <img
                src={assets.logo} 
                alt="mini-logo"
                style={{ width: "60px", verticalAlign: "middle", marginRight: "10px" }}
              />
              Order food online. We only deliver within the radius of 20km only.
            </p>
            <div className="footer-social-icons">
              <img src={assets.facebook_icon} alt="fb" />
              <img src={assets.linkedin_icon} alt="ln" />
              <img src={assets.twitter_icon} alt="tw" />
            </div>
          </div>

          <div className="footer-content-center">
            <h2>COMPANY</h2>
            <ul>
              <li>Home</li>
              <li>About Us</li>
              <li>Delivery</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          <div className="footer-content-right">
            <h2>GET IN TOUCH</h2>
            <ul>
              <li>+63 965 2241 368</li>
              <li>nash.backup21@gmail.com</li>
              <li>Tagoloan Community College</li>
            </ul>
          </div>

          {/* Payment Methods Section */}
          <div className="footer-content-payment">
            <h2>PAYMENT METHODS</h2>
            <div className="payment-method">
              <img src={assets.upi} alt="GCash" className="gcash-logo" />
            </div>
          </div>
        </div>

        <hr />
        <p className="footer-copyright">
          Copyright 2025 @ nacht - All Right Reserved.
        </p>
        <p>This project is purely for educational purposes only.</p>
      </div>
    </>
  );
}

export default Footer;
