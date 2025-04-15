import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ForgotPassword.css";

import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";

function ForgotPassword({ onClose = () => {} }) {
  const [searchInput, setSearchInput] = useState("");
  const [matchedAccounts, setMatchedAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResetOptions, setShowResetOptions] = useState(false);

  const handleSearchAccount = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:8080/search-account", {
        query: searchInput.trim(),
      });
      setMatchedAccounts(response.data.accounts);
      setStep(2);
      toast.success("Accounts matched. Please select yours.");
    } catch (err) {
      setError(err.response?.data?.message || "No matching account found.");
      toast.error(err.response?.data?.message || "No matching account found.");
    }
    setLoading(false);
  };

  const handleSendResetCode = async () => {
    if (!selectedAccount?.email) return;
    setLoading(true);
    setError("");
    try {
      await axios.post("http://localhost:8080/send-reset-code", {
        email: selectedAccount.email,
      });
      toast.success("Password reset code sent!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset code.");
      toast.error(err.response?.data?.message || "Failed to send reset code.");
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    if (!selectedAccount?.email) return;
    setLoading(true);
    setError("");
    try {
      await axios.post("http://localhost:8080/reset-password", {
        email: selectedAccount.email,
        code,
        new_password: newPassword,
      });
      toast.success("Password reset successful!");
      onClose();
    } catch (err) {
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
            <h2>Forgot Password</h2>
            <button className="close-button" onClick={onClose}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          {step === 1 && (
            <StepOne
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              handleSearchAccount={handleSearchAccount}
              loading={loading}
            />
          )}

          {step === 2 && (
            <StepTwo
              matchedAccounts={matchedAccounts}
              onSelect={(acc) => {
                setSelectedAccount(acc);
                setStep(3);
              }}
              onBack={() => setStep(1)}
            />
          )}

          {step === 3 && selectedAccount && (
            <StepThree
              selectedAccount={selectedAccount}
              code={code}
              newPassword={newPassword}
              setCode={setCode}
              setNewPassword={setNewPassword}
              handleResetPassword={handleResetPassword}
              handleSendResetCode={handleSendResetCode}
              showResetOptions={showResetOptions}
              setShowResetOptions={setShowResetOptions}
              loading={loading}
            />
          )}

          {error && (
            <div className="error-container">
              <i className="bi bi-exclamation-circle"></i>
              <p className="error-message">{error}</p>
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={5000} />
    </div>
  );
}

export default ForgotPassword;
