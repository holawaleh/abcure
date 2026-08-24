import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../api/errors";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(username, password);
      navigate("/admin");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm p-8 w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-brand-dark mb-1">AB Cure</h1>
        <p className="text-sm text-gray-500 mb-6">Sign in to manage the shop</p>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>
        )}

        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full px-3 py-2 rounded-lg border border-gray-200 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 pr-16 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-brand font-medium"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-brand-dark text-white py-2.5 rounded-lg font-medium hover:bg-brand transition-colors disabled:opacity-50"
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}

export default Login;
