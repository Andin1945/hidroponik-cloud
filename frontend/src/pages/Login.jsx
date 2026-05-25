import { useState } from "react";
import { Eye, EyeOff, Leaf, Lock, Mail } from "lucide-react";
import { authAPI } from "../api/api";

function Login({ onLogin, goRegister }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await authAPI.post("/login", form);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      onLogin(response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Login gagal, periksa email dan password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-background-glow auth-glow-one"></div>
      <div className="auth-background-glow auth-glow-two"></div>

      <div className="auth-card">
        <div className="auth-top">
          <div className="auth-logo">
            <Leaf size={34} />
          </div>

          <div className="auth-badge-text">Smart Hydroponic System</div>
        </div>

        <div className="auth-title-area">
          <h1>Login HydroCloud</h1>
          <p>Masuk untuk memantau dan mengelola sistem hidroponik.</p>
        </div>

        {message && <div className="auth-alert">{message}</div>}

        <form onSubmit={handleLogin} className="auth-form">
          <label>
            Email
            <div className="auth-input">
              <Mail size={18} />
              <input
                type="email"
                name="email"
                placeholder="Masukkan email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
          </label>

          <label>
            Password
            <div className="auth-input">
              <Lock size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Masukkan password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? (
              <span className="button-loading">
                <span className="loader-dot"></span>
                Memproses...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="auth-switch">
          Belum punya akun?{" "}
          <button type="button" onClick={goRegister}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;