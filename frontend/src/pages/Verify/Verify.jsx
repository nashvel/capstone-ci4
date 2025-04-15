import React, { useEffect } from "react";
import "./verify.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

function Verify() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");

  useEffect(() => {
    toast.info("Verifying payment...");

    setTimeout(() => {
      if (success === "true") {
        toast.success("Payment verified successfully!");
        navigate("/myorders");
      } else {
        toast.error("Payment verification failed.");
        navigate("/");
      }
    }, 2000);
  }, [navigate, success]);

  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  );
}

export default Verify;
