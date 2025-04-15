import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import ForgotPassword from "./ForgotPassword";
import "./loginPopup.css";

function LoginPopup({ setShowLogin }) {
  const { setToken, setEmail } = useContext(StoreContext);
  const navigate = useNavigate();

  const [currState, setCurrState] = useState("Sign Up");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const [verificationPending, setVerificationPending] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [cooldown, setCooldown] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const emailDomains = ["@gmail.com", "@yahoo.com", "@outlook.com", "@hotmail.com"];



const sanitizeInput = (value) => {
  // Allow alphanumeric, @, ., _, -
  return value.replace(/[^a-zA-Z0-9@._-]/g, "");
};



const onChangeHandler = (e) => {
  const { name, value } = e.target;
  let sanitizedValue = sanitizeInput(value);

  if (name === "email") {
    if (!sanitizedValue.includes("@") && sanitizedValue.length > 2) {
      const partial = sanitizedValue;
      setEmailSuggestions(emailDomains.map((domain) => partial + domain));
    } else {
      setEmailSuggestions([]); // hide suggestions if "@" is typed
    }
  }

  setUserData((data) => ({ ...data, [name]: sanitizedValue }));
  setError("");
};


const handleEmailSuggestionClick = (suggestion) => {
  setUserData((data) => ({ ...data, email: suggestion }));
  setEmailSuggestions([]); // hide after selecting
};


  const handleSignup = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/signup",
        {
          first_name: userData.firstName,
          last_name: userData.lastName,
          email: userData.email,
          password: userData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setVerificationPending(true);
      toast.success("Signup successful! Please verify your email.");
      startCooldown();
    } catch (err) {
      setError(err.response?.data?.detail || "Signup failed.");
      toast.error(err.response?.data?.detail || "Signup failed.");
    }
  };

  const startCooldown = () => {
    setCooldown(true);
    setSecondsLeft(30);
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCooldown(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  

  const handleVerifyCode = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/verify-email",
        {
          email: userData.email,
          code: verificationCode,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Account verified! You can now log in.");
      setVerificationPending(false);
      setVerificationCode("");
      await handleLogin();
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed.");
      toast.error(err.response?.data?.message || "Verification failed.");
    }
  };

  const handleLogin = async () => {
    if (!userData.email || !userData.password) {
      toast.error("Please enter email and password");
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:8080/login', {
        email: userData.email,
        password: userData.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      toast.success(response.data.message || "Login successful!");
  
      localStorage.setItem("Token", response.data.token);  // this fixes the navbar
      localStorage.setItem("Email", userData.email);    
  
      setTimeout(() => {
        setShowLogin(false); // hide the popup *after* toast appears
        window.location.reload(); // or redirect with navigate if you prefer
      }, 500);
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
    }
  };
  
  

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (currState === "Sign Up") {
      await handleSignup();
    } else {
      await handleLogin();
    }

    setLoading(false);
  };

  return (
    <>
      {showForgotPassword ? (
        <ForgotPassword onClose={() => setShowForgotPassword(false)} />
      ) : (
        <div className="login-overlay">
          <div className="login">
            <form className="login-container" onSubmit={onSubmitHandler}>
              <div className="login-header">
                <h2>{currState}</h2>
                <i className="bi bi-x-lg close-icon" onClick={() => setShowLogin(false)}></i>
              </div>

              {!verificationPending ? (
                <>
                  <div className="login-inputs">
                    {currState === "Sign Up" && (
                      <>
                        <div className="input-group">
                          <i className="bi bi-person input-icon"></i>
                          <input
                            name="firstName"
                            onChange={onChangeHandler}
                            value={userData.firstName}
                            type="text"
                            placeholder="First name"
                            required
                          />
                        </div>
                        <div className="input-group">
                          <i className="bi bi-person input-icon"></i>
                          <input
                            name="lastName"
                            onChange={onChangeHandler}
                            value={userData.lastName}
                            type="text"
                            placeholder="Last name"
                            required
                          />
                        </div>
                      </>
                    )}
                        <div className="input-group" style={{ position: "relative" }}>
                          <i className="bi bi-envelope input-icon"></i>
                          <input
                            name="email"
                            onChange={onChangeHandler}
                            value={userData.email}
                            type="email"
                            placeholder="Enter your email"
                            required
                            pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                            title="Enter a valid email"
                          />
                          {emailSuggestions.length > 0 && (
                            <ul className="email-suggestions">
                              {emailSuggestions.map((suggestion, idx) => (
                                <li key={idx} onClick={() => handleEmailSuggestionClick(suggestion)}>
                                  {suggestion}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                    <div className="input-group">
                      <i className="bi bi-lock input-icon"></i>
                      <input
                          name="password"
                          onChange={onChangeHandler}
                          value={userData.password}
                          type={showPassword ? "text" : "password"}
                          placeholder={currState === "Sign Up" ? "Set your password" : "Your password"}
                          required
                          pattern="^[a-zA-Z0-9!@#$%^&*()_+=-]{6,}$"
                          title="Min 6 characters. Letters, numbers & symbols only."
                        />

                      <button
                        type="button"
                        className="show-password"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                      </button>
                    </div>
                  </div>

                  {error && <p className="error-message">{error}</p>}

                  <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? <div className="spinner"></div> : currState}
                  </button>

                  {currState === "Sign Up" && (
                    <div className="login-condition">
                      <input type="checkbox" required />
                      <p>By continuing, I agree to terms of use & privacy policy.</p>
                    </div>
                  )}

                  {currState === "Login" && (
                    <p className="forgot-password" onClick={() => setShowForgotPassword(true)}>
                      Forgot password?
                    </p>
                  )}

                  <p className="toggle-state">
                    {currState === "Sign Up"
                      ? "Already have an account?"
                      : "Create a new account?"}
                    <span onClick={() => setCurrState(currState === "Sign Up" ? "Login" : "Sign Up")}>
                      {currState === "Sign Up" ? "Login" : "Sign up"}
                    </span>
                  </p>
                </>
              ) : (
                <div className="verification-section">
                  <p>
                    Enter the verification code sent to <b>{userData.email}</b>
                  </p>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Verification code"
                    required
                  />
                  <button
                    type="button"
                    className="submit-button"
                    onClick={handleVerifyCode}
                    disabled={loading || verificationCode.length !== 6}
                  >
                    {loading ? <div className="spinner"></div> : "Verify"}
                  </button>

                  <button
                    type="button"
                    className="resend-code-button"
                    onClick={() => {
                      handleSignup(); // trigger resend
                      startCooldown(); // restart cooldown
                    }}
                    disabled={cooldown}
                  >
                    {cooldown ? `Resend Code (${secondsLeft}s)` : "Resend Code"}
                  </button>

                  {error && <p className="error-message">{error}</p>}
                </div>
              )}
            </form>
          </div>
        </div>
      )}

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
    </>
  );
}

export default LoginPopup;
