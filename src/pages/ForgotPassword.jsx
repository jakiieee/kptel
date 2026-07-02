import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/auth.css";
import { authService } from "../services/authService";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSendingLink, setIsSendingLink] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [resetError, setResetError] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  async function handleSendLink(e) {
    e.preventDefault();

    if (!email.trim()) {
      setEmailError("Email is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Enter a valid email address.");
      return;
    }

    setEmailError("");
    setIsSendingLink(true);
    try {
      await authService.sendResetLink({ email });
      setStep("reset");
    } catch (err) {
      setEmailError(err.message || "Failed to send reset link.");
    } finally {
      setIsSendingLink(false);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setResetError("Please fill in both password fields.");
      return;
    }
    if (password.length < 8) {
      setResetError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setResetError("Passwords do not match.");
      return;
    }

    setResetError("");
    setIsResetting(true);
    try {
      await authService.resetPassword({ email, password });
      setStep("done");
    } catch (err) {
      setResetError(err.message || "Failed to reset password.");
    } finally {
      setIsResetting(false);
    }
  }

  return (
    <div className="auth-layout page-enter">
      <div className="auth-left">
        <div className="auth-logo">
          <img src="/logoaplikasi.svg" alt="Telventory Systems" className="logo-img" />
          <div className="logo-text">
            <span className="logo-name">Telventory Systems</span>
            <span className="logo-sub">PT Tanjungenim Lestari Plup and Paper</span>
          </div>
        </div>
        <div className="auth-hero">
          <h1>Forgot your password?</h1>
          <p>No worries, we'll help you get back in</p>
        </div>
        <div className="auth-waves" />
      </div>

      <div className="auth-right">
        <div className="auth-card">
          {step === "email" && (
            <>
              <h2 className="auth-title">Forget Password</h2>
              <p className="auth-subtitle">
                Enter the email associated with your account and we'll send you a link to reset
                your password.
              </p>

              <form className="field-group" onSubmit={handleSendLink} noValidate>
                <div className="field-wrap">
                  <label className="field-label">Email</label>
                  <input
                    type="email"
                    className="field-input"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                  />
                  {emailError && <span className="field-error">{emailError}</span>}
                </div>

                <button type="submit" className="btn-primary" disabled={isSendingLink}>
                  {isSendingLink ? "Sending..." : "Send Reset Link"}
                </button>
              </form>

              <p className="auth-switch">
                Remembered your password?{" "}
                <Link to="/" className="switch-link">
                  Back to Sign In
                </Link>
              </p>
            </>
          )}

          {step === "reset" && (
            <>
              <h2 className="auth-title">Reset Password</h2>
              <p className="auth-subtitle">
                We sent a reset link to <strong>{email}</strong>. Enter your new password below.
              </p>

              <form className="field-group" onSubmit={handleResetPassword} noValidate>
                <div className="field-wrap">
                  <label className="field-label">New Password</label>
                  <div className="input-icon-wrap">
                    <input
                      type={showPass ? "text" : "password"}
                      className="field-input"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (resetError) setResetError("");
                      }}
                    />
                    <button
                      type="button"
                      className="toggle-pass"
                      onClick={() => setShowPass(!showPass)}
                    >
                      {showPass ? <FaEyeSlash color="#000" /> : <FaEye color="#000" />}
                    </button>
                  </div>
                </div>

                <div className="field-wrap">
                  <label className="field-label">Confirm Password</label>
                  <div className="input-icon-wrap">
                    <input
                      type={showConfirmPass ? "text" : "password"}
                      className="field-input"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (resetError) setResetError("");
                      }}
                    />
                    <button
                      type="button"
                      className="toggle-pass"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                    >
                      {showConfirmPass ? <FaEyeSlash color="#000" /> : <FaEye color="#000" />}
                    </button>
                  </div>
                </div>

                {resetError && <span className="field-error">{resetError}</span>}

                <button type="submit" className="btn-primary" disabled={isResetting}>
                  {isResetting ? "Resetting..." : "Reset Password"}
                </button>
              </form>

              <p className="auth-switch">
                Didn't get the email?{" "}
                <button
                  type="button"
                  className="switch-link link-button"
                  onClick={() => setStep("email")}
                >
                  Try another email
                </button>
              </p>
            </>
          )}

          {step === "done" && (
            <div className="auth-success">
              <div className="success-icon">✓</div>
              <h2 className="auth-title">Password Reset!</h2>
              <p className="auth-subtitle">
                Your password has been changed successfully. You can now sign in with your new
                password.
              </p>

              <button type="button" className="btn-primary" onClick={() => navigate("/")}>
                Back to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
