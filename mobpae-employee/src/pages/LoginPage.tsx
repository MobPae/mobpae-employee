import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { isAuthenticated, setAuthUser, setToken } from "../services/auth";

export function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (loading) return;

    const currentEmail = email;
    const currentPassword = password;

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: currentEmail.trim(),
        password: currentPassword,
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
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0] ||
        "Invalid credentials. Please try again.";

      setEmail(currentEmail);
      setPassword(currentPassword);
      setError(Array.isArray(message) ? message[0] : message);
    } finally {
      setLoading(false);
    }
  }

  function handleDemoSocialLogin(provider: "Google" | "Apple") {
    setError(
      `${provider} login is added for demo UI only. Use email login for now.`
    );
  }

  return (
    <main className="fixed inset-0 overflow-hidden bg-[#f6f8fc] text-slate-950">
      <div className="mx-auto flex h-[100dvh] max-w-md flex-col overflow-hidden bg-[#f6f8fc]">
        <section className="relative h-[345px] shrink-0 overflow-hidden bg-[#061b3d] px-7 pt-[58px] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(37,99,235,0.35),transparent_32%)]" />
          <div className="absolute -bottom-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />

          <div className="relative flex flex-col items-center text-center">
            <div className="mb-4 flex h-[58px] w-[58px] items-center justify-center rounded-[18px] bg-blue-600 shadow-lg shadow-blue-950/30">
              <ShieldCheck size={31} />
            </div>

            <h1 className="text-[31px] font-black tracking-tight">MobPae</h1>

            <p className="mt-1 text-[12px] font-medium text-blue-100">
              Beating Your Month End Crunch
            </p>
          </div>
        </section>

        <section className="relative -mt-[118px] flex-1 overflow-hidden px-5 pb-3">
          <div className="rounded-[1.35rem] bg-white px-5 pb-5 pt-5 shadow-xl shadow-slate-200/80 ring-1 ring-slate-100">
            <h2 className="text-[22px] font-black tracking-tight">
              Welcome back!
            </h2>

            <p className="mt-1 text-[12px] font-medium text-slate-500">
              Login to your employee account
            </p>

            {error && (
              <div className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-[12px] font-semibold text-red-700">
                {error}
              </div>
            )}

            <form noValidate onSubmit={handleLogin} className="mt-4 space-y-3">
              <InputBox
                icon={<Mail size={17} />}
                value={email}
                onChange={(value) => {
                  setEmail(value);
                  setError("");
                }}
                type="email"
                placeholder="Email Address"
                autoComplete="email"
              />

              <div className="relative">
                <LockKeyhole
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  size={17}
                />

                <input
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Password"
                  className="h-[48px] w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-[13px] font-semibold outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-50"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              <div className="flex justify-center pt-0.5">
                <button
                  type="button"
                  onClick={() =>
                    setError("Forgot password flow will be added later.")
                  }
                  className="text-[12px] font-black text-[#06265a]"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-[14px] font-black text-white shadow-lg shadow-blue-600/25 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && <Loader2 className="animate-spin" size={17} />}
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>

            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-100" />
              <span className="text-[11px] font-medium text-slate-400">
                or continue with
              </span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <SocialButton
                label="Google"
                onClick={() => handleDemoSocialLogin("Google")}
              />

              <SocialButton
                label="Apple"
                onClick={() => handleDemoSocialLogin("Apple")}
              />
            </div>
          </div>

          <p className="mt-3 text-center text-[11px] font-medium leading-5 text-slate-400">
            Secure employee access powered by MobPae.
          </p>
        </section>
      </div>
    </main>
  );
}

function InputBox({
  icon,
  value,
  onChange,
  type,
  placeholder,
  autoComplete,
}: {
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  type: string;
  placeholder: string;
  autoComplete: string;
}) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
        {icon}
      </span>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="h-[48px] w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-[13px] font-semibold outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-50"
      />
    </div>
  );
}

function SocialButton({
  label,
  onClick,
}: {
  label: "Google" | "Apple";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[46px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-[13px] font-black text-slate-800 active:scale-[0.99]"
    >
      {label === "Google" ? (
        <span className="text-[18px] font-black text-red-500">G</span>
      ) : (
        <span className="text-[20px] leading-none"></span>
      )}

      {label}
    </button>
  );
}
