import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/auth.css";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!agree) {
      setError("You must agree to the processing of personal data.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await authService.register({ fullName, email, password });
      login(result);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to create account.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-layout register-layout page-enter">
      <div className="auth-right" style={{ borderRadius: "0 2rem 2rem 0" }}>
        <div className="auth-card">
          <h2 className="auth-title">Get Started</h2>

          <form className="field-group" onSubmit={handleSubmit} noValidate>
            <div className="field-wrap">
              <label className="field-label">Full Name</label>
              <input
                type="text"
                className="field-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="field-wrap">
              <label className="field-label">Email Address</label>
              <input
                type="email"
                className="field-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="field-wrap">
              <label className="field-label">Password</label>
              <div className="input-icon-wrap">
                <input
                  type={showPass ? "text" : "password"}
                  className="field-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {error && <span className="field-error">{error}</span>}

            <label className="checkbox-row">
              <input type="checkbox" checked={agree} onChange={() => setAgree(!agree)} />
              <span>I agree to the processing of personal data</span>
            </label>

            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="divider">
            <span>Or Sign Up With</span>
          </div>

          <div className="social-row">
            <button className="social-btn" type="button">
              <img src="logogoogle.svg" alt="Google" />
            </button>
            <button className="social-btn" type="button">
              <img src="logoapple.svg" alt="Apple" />
            </button>
            <button className="social-btn" type="button">
              <img src="logofb.svg" alt="Facebook" />
            </button>
            <button className="social-btn" type="button">
              <img src="logotwitter.svg" alt="Twitter" />
            </button>
          </div>

          <p className="auth-switch">
            Already Have An Account?{" "}
            <Link to="/" className="switch-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      <div className="auth-left">
        <div className="auth-logo logo-right">
          <div className="logo-text text-right">
            <span className="logo-name">Telventory Systems</span>
            <span className="logo-sub">PT Tanjungenim Lestari Plup and Paper</span>
          </div>
          <img src="/logoaplikasi.svg" alt="Telventory Systems" className="logo-img" />
        </div>
        <div className="auth-hero">
          <h1>Join The Team!</h1>
          <p>Enter your details to create an employee account</p>
        </div>
        <div className="auth-waves" />
      </div>
    </div>
  );
}
