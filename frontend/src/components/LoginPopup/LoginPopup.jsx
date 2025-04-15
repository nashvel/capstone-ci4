import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";  // Import Toastify
import "react-toastify/dist/ReactToastify.css";  // Import Toastify CSS
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
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const [verificationPending, setVerificationPending] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setUserData((data) => ({ ...data, [name]: value }));
    setError("");
  };

  const handleSignup = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/signup",
        {
          username: userData.name,
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
    } catch (err) {
      setError(err.response?.data?.detail || "Signup failed.");
      toast.error(err.response?.data?.detail || "Signup failed.");  
    }
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
            "Content-Type": "application/json", // Ensure JSON content type
          },
        }
      );
      
      // Log the response for debugging if necessary
      console.log(response.data);
  
      toast.success("Account verified! You can now log in.");
      setVerificationPending(false);
      setVerificationCode("");
      setCurrState("Login");
    } catch (err) {
      // Handle errors properly
      setError(err.response?.data?.message || "Verification failed.");
      toast.error(err.response?.data?.message || "Verification failed.");
    }
  };
   
  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/login", 
        {
          email: userData.email,
          password: userData.password,
        },
        {
          headers: {
            "Content-Type": "application/json", 
          },
        }
      );
  
      // If login is successful
      if (res.data.message === "Login successful") {
        // Assuming the response has username as well as the message
        setToken("mock_token_123"); // Set your token if needed
        setEmail(userData.email);
        
        // Store necessary data in localStorage
        localStorage.setItem("Token", "mock_token_123");
        localStorage.setItem("Email", userData.email);
        localStorage.setItem("Name", res.data.username);  // Store username from backend
  
        setShowLogin(false);  // Hide login form (if you're using a state for this)
        
        toast.success("Login successful!");  // Success toast
  
        // Navigate based on email or other condition
        if (userData.email === "client@gmail.com") {
          navigate("/access/client");
        } else {
          navigate("/");  // Redirect to home or default dashboard
        }
      } else {
        // Handle unsuccessful login attempt
        toast.error("Login failed! Please try again.");  // Error toast
      }
    } catch (err) {
      console.log(err);
      // Handle errors with a user-friendly message
      setError(err.response?.data?.message || "Login failed.");
      toast.error(err.response?.data?.message || "An error occurred during login.");
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
                      <div className="input-group">
                        <i className="bi bi-person input-icon"></i>
                        <input
                          name="name"
                          onChange={onChangeHandler}
                          value={userData.name}
                          type="text"
                          placeholder="Your name"
                          required
                        />
                      </div>
                    )}
                    <div className="input-group">
                      <i className="bi bi-envelope input-icon"></i>
                      <input
                        name="email"
                        onChange={onChangeHandler}
                        value={userData.email}
                        type="email"
                        placeholder="Enter Username or Email"
                        required
                      />
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
                    {currState === "Sign Up" ? "Already have an account?" : "Create a new account?"}
                    <span onClick={() => setCurrState(currState === "Sign Up" ? "Login" : "Sign Up")}>
                      {currState === "Sign Up" ? "Login" : "Sign up"}
                    </span>
                  </p>
                </>
              ) : (
                <div className="verification-section">
                  <p>Enter the verification code sent to <b>{userData.email}</b></p>
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
                    disabled={loading}
                  >
                    {loading ? <div className="spinner"></div> : "Verify"}
                  </button>
                  {error && <p className="error-message">{error}</p>}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
      
      {/* Toast Container for Notifications */}
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeButton={true} pauseOnFocusLoss={false} draggable pauseOnHover />
    </>
  );
}

export default LoginPopup;
