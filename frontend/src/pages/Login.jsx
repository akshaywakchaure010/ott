import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo-full.png";
import "../styles/auth.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await login(form.email, form.password);
      const redirectTo = location.state?.from?.pathname;
      navigate(redirectTo || (user.role === "admin" ? "/admin" : "/"));
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't sign in. Check your details and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pp-auth-page">
      <div className="pp-auth-backdrop" />
      <div className="pp-auth-card">
        <img src={logo} alt="Pixel Play" className="pp-auth-logo" />
        <h1>Welcome back</h1>
        <p className="pp-auth-sub">Sign in to keep watching what you love.</p>

        {error && <div className="pp-auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@gmail.com"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              name="password"
              required
              minLength={6}
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </label>

          <button type="submit" className="pp-btn pp-btn-primary pp-auth-submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="pp-auth-footer">
          New to Pixel Play? <Link to="/register">Create an account</Link>
        </p>

        <p className="pp-auth-demo">
          Demo viewer: <code>akshay@gmail.com</code> / <code>Viewer@123</code>
          <br />
          Demo admin: <code>admin@gmail.com</code> / <code>Admin@12345</code>
        </p>
      </div>
    </div>
  );
};

export default Login;
