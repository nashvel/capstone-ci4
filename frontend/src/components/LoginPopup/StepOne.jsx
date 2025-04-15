import React from "react";

function StepOne({ searchInput, setSearchInput, handleSearchAccount, loading }) {
  return (
    <div className="form-group">
      <p className="instruction-text">Enter your first name or email to search for your account.</p>
      <div className="input-group">
        <i className="bi bi-search input-icon"></i>
        <input
          type="text"
          placeholder="First name or email"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          required
          className="styled-input"
        />
      </div>
      <button
        className={`submit-button ${loading ? "loading" : ""}`}
        onClick={handleSearchAccount}
        disabled={loading || !searchInput.trim()}
      >
        {loading ? <div className="spinner"></div> : "Search Account"}
      </button>
    </div>
  );
}

export default StepOne;
