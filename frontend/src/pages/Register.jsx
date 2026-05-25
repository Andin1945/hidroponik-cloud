import { useState } from "react";
import { Eye, EyeOff, Leaf, Lock, Mail, User } from "lucide-react";
import { authAPI } from "../api/api";

function Register({ goLogin }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setSuccess(false);

    if (form.password.length < 6) {
      setMessage("Password minimal 6 karakter");
      setSuccess(false);
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.post("/register", form);

      setMessage(response.data.message || "Registrasi berhasil");
      setSuccess(true);

      setForm({
        name: "",
        email: "",
        password: "",
        role: "admin",
      });

      setTimeout(() => {
        goLogin();
      }, 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Registrasi gagal");
      setSuccess(false);
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

          <div className="auth-badge-text">Create HydroCloud Account</div>
        </div>

        <div className="auth-title-area">
          <h1>Register HydroCloud</h1>
          <p>Buat akun untuk mengelola data monitoring hidroponik.</p>
        </div>

        {message && (
          <div className={success ? "auth-alert success" : "auth-alert"}>
            {message}
          </div>
        )}

        <form onSubmit={handleRegister} className="auth-form">
          <label>
            Nama Lengkap
            <div className="auth-input">
              <User size={18} />
              <input
                type="text"
                name="name"
                placeholder="Masukkan nama lengkap"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>
          </label>

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
                placeholder="Minimal 6 karakter"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
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
                Mendaftarkan...
              </span>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <div className="auth-switch">
          Sudah punya akun?{" "}
          <button type="button" onClick={goLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;