import { useState } from "react";
import type { FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { isAuthenticated, setAuthUser, setToken } from "../services/auth";

export function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("employee1@example.com");
  const [password, setPassword] = useState("Password@123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      const payload = response.data?.data || response.data;
      const token = payload?.accessToken || payload?.token;
      const user = payload?.user;

      if (!token) {
        setError("Login successful but token missing.");
        return;
      }

      if (user?.role !== "EMPLOYEE") {
        setError("Please login with an employee account.");
        return;
      }

      setToken(token);
      setAuthUser(user || {});
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Login failed";

      setError(Array.isArray(message) ? message[0] : message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-soft p-4 text-dark">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-soft lg:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden bg-gradient-to-br from-slate-950 to-blue-950 p-10 text-white lg:block">
          <p className="text-2xl font-black">
            Mob<span className="text-blue-300">Pae</span>
          </p>

          <div className="mt-24">
            <p className="text-sm font-semibold text-blue-200">Employee App</p>
            <h1 className="mt-4 text-4xl font-black leading-tight">
              Access your salary advance limit anytime.
            </h1>
            <p className="mt-5 leading-7 text-slate-300">
              Login to view your available limit, request advance salary, and
              track repayment status.
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="p-6 md:p-10">
          <div>
            <p className="text-sm font-bold text-primary">Welcome back</p>
            <h2 className="mt-2 text-3xl font-black">Employee Login</h2>
            <p className="mt-2 text-sm text-slate-500">
              Use your employee account credentials to continue.
            </p>
          </div>

          {error && (
            <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <div className="mt-8 grid gap-5">
            <label>
              <span className="text-sm font-bold text-slate-700">Email</span>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                autoComplete="email"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </label>

            <label>
              <span className="text-sm font-bold text-slate-700">Password</span>
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                autoComplete="current-password"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-black text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && <Loader2 className="animate-spin" size={16} />}
              {loading ? "Signing in..." : "Login"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
