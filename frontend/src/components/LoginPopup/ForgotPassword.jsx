import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ForgotPassword.css";

function ForgotPassword({ onClose = () => {} }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");

  console.log("🔄 ForgotPassword component rendered");

  const handleSearchAccount = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("🔍 Sending search for:", email.trim());
      const response = await axios.post(
        "http://localhost:8080/search-account",
        {
          username_or_email: email.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("✅ Search response:", response.data);

      const { username, email: foundEmail } = response.data;
      setUsername(username);
      setUserEmail(foundEmail);
      setStep(2);

      toast.success("Account found! Please enter the verification code.");
    } catch (err) {
      console.error("❌ Search error:", err);
      setError(err.response?.data?.message || "Account not found.");
      toast.error(err.response?.data?.message || "Account not found.");
    }
    setLoading(false);
  };

  const handleSendResetCode = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("📨 Sending reset code to:", userEmail);
      const response = await axios.post(
        "http://localhost:8080/send-reset-code",
        {
          username: userEmail,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("✅ Reset code sent:", response.data);
      toast.success("Password reset code sent!");
    } catch (err) {
      console.error("❌ Send code error:", err);
      setError(err.response?.data?.message || "Failed to send reset code.");
      toast.error(err.response?.data?.message || "Failed to send reset code.");
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("🔐 Resetting password for:", userEmail);
      const response = await axios.post(
        "http://localhost:8080/reset-password",
        {
          email: userEmail,
          code,
          new_password: newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("✅ Password reset:", response.data);
      toast.success("Password reset successful!");
      onClose();
    } catch (err) {
      console.error("❌ Reset error:", err);
      setError(err.response?.data?.message || "Reset failed.");
      toast.error(err.response?.data?.message || "Reset failed.");
    }
    setLoading(false);
  };

  return (
    <div className="login-overlay">
      <div className="login">
        <div className="reset-container">
          <div className="login-header">
            <h2>{step === 1 ? "Forgot Password" : "Reset Password"}</h2>
            <button className="close-button" onClick={onClose}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          {step === 1 ? (
            <div className="form-group">
              <p className="instruction-text">
                Enter your username or email address and we'll send you a verification code.
              </p>
              <div className="input-group">
                <i className="bi bi-envelope input-icon"></i>
                <input
                  type="text"
                  placeholder="Username or Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="styled-input"
                />
              </div>
              <button
                className={`submit-button ${loading ? "loading" : ""}`}
                onClick={() => {
                  console.log("🔘 Search button clicked");
                  handleSearchAccount();
                }}
                disabled={loading || !email.trim()}
              >
                {loading ? <div className="spinner"></div> : "Search Account"}
              </button>
            </div>
          ) : (
            <div className="form-group">
              <div className="connected-info">
                <div className="info-item">
                  <i className="bi bi-person"></i>
                  <span>
                    Username: <strong>{username}</strong>
                  </span>
                </div>
                <div className="info-item">
                  <i className="bi bi-envelope"></i>
                  <span>
                    Email: <strong>{userEmail}</strong>
                  </span>
                </div>
              </div>

              <div className="input-group">
                <i className="bi bi-shield-lock input-icon"></i>
                <input
                  type="text"
                  placeholder="Enter Verification Code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  className="styled-input"
                />
              </div>

              <div className="input-group">
                <i className="bi bi-key input-icon"></i>
                <input
                  type="password"
                  placeholder="Enter New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="styled-input"
                />
              </div>

              <button
                className={`submit-button ${loading ? "loading" : ""}`}
                onClick={handleResetPassword}
                disabled={loading || !code.trim() || !newPassword.trim()}
              >
                {loading ? <div className="spinner"></div> : "Reset Password"}
              </button>

              <button
                className="submit-button"
                onClick={handleSendResetCode}
                disabled={loading}
              >
                {loading ? <div className="spinner"></div> : "Send Reset Code"}
              </button>
            </div>
          )}

          {error && (
            <div className="error-container">
              <i className="bi bi-exclamation-circle"></i>
              <p className="error-message">{error}</p>
            </div>
          )}
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeButton={true}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default ForgotPassword;
