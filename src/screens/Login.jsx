import { useState } from "react";
import { useAuth } from "../lib/AuthContext";

const INVITE_CODE = import.meta.env.VITE_INVITE_CODE;

export default function Login() {
  const { signInWithPassword, signUp } = useAuth();
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function switchMode(next) {
    setMode(next);
    setError("");
    setInfo("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");

    if (mode === "signup" && inviteCode.trim() !== INVITE_CODE) {
      setError("Invalid invite code");
      return;
    }

    setSubmitting(true);

    if (mode === "signup") {
      const { data, error } = await signUp(email, password);
      setSubmitting(false);
      if (error) {
        setError(error.message);
      } else if (!data.session) {
        setInfo("Account created — check your email to confirm, then sign in.");
        setMode("signin");
      }
    } else {
      const { error } = await signInWithPassword(email, password);
      setSubmitting(false);
      if (error) setError(error.message);
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-bg px-6"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-surface border border-border">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d="M6.5 7v10M17.5 7v10M3 9.5v5M21 9.5v5M6.5 12h11"
                stroke="#5AB4FF"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-body">
            Lifemaxx
          </h1>
          <p className="text-[13px] text-muted">
            {mode === "signin" ? "Sign in to continue" : "Create your account"}
          </p>
        </div>

        <div className="mb-6 flex rounded-btn border border-border bg-surface p-1">
          <button
            type="button"
            onClick={() => switchMode("signin")}
            className="flex-1 rounded-[8px] py-2 text-[13px] font-medium transition-colors duration-200"
            style={{
              background: mode === "signin" ? "#5AB4FF" : "transparent",
              color: mode === "signin" ? "#0d0d12" : "#6e7a8a",
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchMode("signup")}
            className="flex-1 rounded-[8px] py-2 text-[13px] font-medium transition-colors duration-200"
            style={{
              background: mode === "signup" ? "#5AB4FF" : "transparent",
              color: mode === "signup" ? "#0d0d12" : "#6e7a8a",
            }}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wide text-muted">
              Email
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-btn border border-border bg-surface px-4 py-3 text-[15px] text-body outline-none transition-colors duration-200 focus:border-accent"
              placeholder="you@example.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wide text-muted">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-btn border border-border bg-surface px-4 py-3 text-[15px] text-body outline-none transition-colors duration-200 focus:border-accent"
              placeholder="••••••••"
            />
          </div>

          {mode === "signup" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium uppercase tracking-wide text-muted">
                Invite Code
              </label>
              <input
                type="text"
                required
                autoComplete="off"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="rounded-btn border border-border bg-surface px-4 py-3 text-[15px] text-body outline-none transition-colors duration-200 focus:border-accent"
                placeholder="Ask Abel for the code"
              />
            </div>
          )}

          {error && (
            <p className="text-[13px] text-[#ff6b6b]" role="alert">
              {error}
            </p>
          )}
          {info && (
            <p className="text-[13px]" style={{ color: "#34d399" }} role="status">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-3 rounded-btn bg-accent py-3.5 text-[15px] font-medium text-[#0d0d12] transition-colors duration-200 hover:bg-accent-hover disabled:opacity-50"
          >
            {submitting
              ? mode === "signin"
                ? "Signing in…"
                : "Creating account…"
              : mode === "signin"
                ? "Sign In"
                : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
