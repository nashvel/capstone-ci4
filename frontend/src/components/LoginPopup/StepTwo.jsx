import React, { useState } from "react";

function StepTwo({ matchedAccounts, onSelect, onBack }) {
  const [revealedIndex, setRevealedIndex] = useState(null);

  const handleReveal = (index, account) => {
    setRevealedIndex(index);
    onSelect(account);
  };

  return (
    <div className="form-group">
      <p>Select your account from the list below:</p>
      {matchedAccounts.map((acc, index) => (
        <div
          key={index}
          className={`account-select ${revealedIndex === index ? "revealed" : ""}`}
          onClick={() => handleReveal(index, acc)}
          style={{ cursor: "pointer", padding: "0.5rem 0", display: "flex", alignItems: "center" }}
        >
          <i className="bi bi-person-circle" style={{ marginRight: "0.5rem" }}></i>
          <span>
            <strong>{acc.first_name} {acc.last_name}</strong>
            {revealedIndex === index ? ` - ${acc.email}` : ""}
          </span>
        </div>
      ))}

      <p
        className="link-like"
        onClick={onBack}
        style={{ cursor: "pointer", color: "#555", marginTop: "1rem", textAlign: "center" }}
      >
        ⬅ Back
      </p>
    </div>
  );
}

export default StepTwo;
