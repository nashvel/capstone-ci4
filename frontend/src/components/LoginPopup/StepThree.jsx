import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function StepThree({
  selectedAccount,
  code,
  newPassword,
  setCode,
  setNewPassword,
  showResetOptions,
  setShowResetOptions,
}) {
  const [method, setMethod] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasSentCode, setHasSentCode] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [verifyCodeError, setVerifyCodeError] = useState("");

  const obfuscateEmail = (email) => {
    const [name, domain] = email.split("@");
    return `${name[0]}${"*".repeat(name.length - 2)}${name[name.length - 1]}@${domain}`;
  };

  const handleSendCode = async () => {
    try {
      await axios.post("http://localhost:8080/send-reset-code", {
        email: selectedAccount.email,
      });
      toast.success("Verification code sent to your email.");
      setHasSentCode(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send verification code.");
    }
  };

const handleVerifyCode = async () => {
  setVerifyingCode(true);
  setVerifyCodeError("");
  try {
    const res = await axios.post("http://localhost:8080/verify-reset-code", {
      email: selectedAccount.email,
      code: code
    });
    toast.success("Code verified successfully");
    setIsCodeVerified(true);
  } catch (err) {
    const msg = err.response?.data?.message || "Verification failed";
    toast.error(msg);
    setVerifyCodeError(msg);
  }
  setVerifyingCode(false);
};


  const handleVerifyPassword = async () => {
    setVerifying(true);
    setVerifyError("");
    try {
      const res = await axios.post("http://localhost:8080/verify-password", {
        email: selectedAccount.email,
        password: currentPassword,
      });
      if (res.data.success) {
        toast.success("Password verified!");
        setIsVerified(true);
      } else {
        setVerifyError("Incorrect password.");
      }
    } catch {
      setVerifyError("Password verification failed.");
    }
    setVerifying(false);
  };

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/updatePasswordDirectly", {
        email: selectedAccount.email,
        new_password: newPassword,
      });
      if (res.data.message === "Password updated successfully") {
        toast.success("Password reset successfully!");
        setCode("");
        setNewPassword("");
      } else {
        toast.error("Failed to reset password.");
      }
    } catch {
      toast.error("Error resetting password.");
    }
    setLoading(false);
  };

  const handleSkipLogin = async () => {
    try {
      const res = await axios.post("http://localhost:8080/skipLogin", {
        email: selectedAccount.email,
      });
      if (res.data.success) {
        toast.success(res.data.message || "Login successful!");
        localStorage.setItem("Token", res.data.token);
        localStorage.setItem("Email", selectedAccount.email);
        setTimeout(() => {
          setShowResetOptions(false);
          window.location.reload();
        }, 500);
      } else {
        toast.error(res.data.message || "Login failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="form-group">
      {method === null && (
        <>
          <p className="instruction-text">
            Send a verification code to <strong>{obfuscateEmail(selectedAccount.email)}</strong>
          </p>

          <button className="submit-button" onClick={() => {
            handleSendCode();
            setMethod("code");
            setShowResetOptions(true);
          }}>
            {hasSentCode ? "Resend Verification Code" : "Send Verification Code"}
          </button>

          <p className="link-like" onClick={() => setMethod("password")} style={{ textAlign: "center", marginTop: "1rem" }}>
            Enter Password Instead
          </p>
        </>
      )}

      {method === "code" && (
        <>
          <div className="input-group">
            <i className="bi bi-shield-lock input-icon"></i>
            <input
              type="text"
              placeholder="Enter Verification Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="styled-input"
            />
          </div>

          {!isCodeVerified ? (
            <>
              <button
                className="submit-button"
                onClick={handleVerifyCode}
                disabled={verifyingCode || !code}
              >
                {verifyingCode ? <div className="spinner" /> : "Verify Code"}
              </button>
            </>
          ) : (
            <>
              <div className="input-group">
                <i className="bi bi-key input-icon"></i>
                <input
                  type="password"
                  placeholder="Enter New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="styled-input"
                />
              </div>

              <button
                className="submit-button"
                onClick={handleResetPassword}
                disabled={loading || !newPassword}
              >
                {loading ? <div className="spinner" /> : "Reset Password"}
              </button>

              <p
                className="link-like"
                style={{
                  textAlign: "center",
                  marginTop: "1rem",
                  cursor: "pointer",
                  color: "#555",
                  display: "block",
                  width: "100%",
                }}
                onClick={handleSkipLogin}
              >
                Skip for now
              </p>
            </>
          )}
        </>
      )}
      {method === "password" && !isVerified && (
        <>
          <div className="input-group">
            <i className="bi bi-lock input-icon"></i>
            <input
              type="password"
              placeholder="Enter Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="styled-input"
            />
          </div>
          {verifyError && <p className="error-message">{verifyError}</p>}
          <button
            className="submit-button"
            onClick={handleVerifyPassword}
            disabled={verifying || !currentPassword}
          >
            {verifying ? <div className="spinner"></div> : "Verify Password"}
          </button>
        </>
      )}

      {method === "password" && isVerified && (
        <>
          <div className="input-group">
            <i className="bi bi-key input-icon"></i>
            <input
              type="password"
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="styled-input"
            />
          </div>

          <button
            className="submit-button"
            onClick={handleResetPassword}
            disabled={loading || !newPassword}
          >
            {loading ? <div className="spinner"></div> : "Reset Password"}
          </button>

          <p className="link-like" onClick={handleSkipLogin} style={{ textAlign: "center", marginTop: "1rem" }}>
            Skip for now
          </p>
        </>
      )}

      {method && (
        <p
          className="link-like"
          onClick={() => {
            setMethod(null);
            setCurrentPassword("");
            setIsVerified(false);
            setVerifyError("");
            setCode("");
            setNewPassword("");
          }}
        >
          ⬅ Back
        </p>
      )}
    </div>
  );
}

export default StepThree;
