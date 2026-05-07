import { useState } from "react";
import "./AuthPage.css";
import LogoSrc from './Logo.svg';
import BgImage from './AuthPage_Background.png';

/* ── Icons ── */
const IconEye = ({ open }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
    {open ? (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </>
    ) : (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
      </>
    )}
  </svg>
);

const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

/* ── Background image — change this URL to update the panel photo ── */
const BG_IMAGE = BgImage;

/* ── FloatingField ── */
function FloatingField({ label, type = "text", value, onChange, icon, rightSlot }) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  return (
    <div className={`auth-field ${focused ? "focused" : ""} ${lifted ? "lifted" : ""}`}>
      <span className="auth-field-icon">{icon}</span>
      <div className="auth-field-inner">
        <label className="auth-field-label">{label}</label>
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="auth-field-input"
          autoComplete="off"
        />
      </div>
      {rightSlot && <span className="auth-field-right">{rightSlot}</span>}
    </div>
  );
}

/* ── AuthPage ── */
export default function AuthPage() {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "", confirm: ""
  });
  const set = (k) => (v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="auth-shell">
      {/* ── Right: Image Panel ── */}
      <div className="auth-image-panel">
        <img src={BG_IMAGE} alt="Scenic" className="auth-bg-img" />
      </div>

      {/* ── Left: Form Panel ── */}
      <div className="auth-form-panel">
        <div className="auth-form-inner">

          {/* Logo */}
          <div className="auth-logo-row">
            <img src={LogoSrc} width="32" height="32" alt="Pasyente+ logo" />
            <span className="auth-logo-name">PASYENTE+</span>
          </div>

          {/* Heading */}
          <div className="auth-heading-area">
            <p className="auth-eyebrow">
              {mode === "login" ? "WELCOME BACK" : "START FOR FREE"}
            </p>
            <h1 className="auth-title">
              {mode === "login" ? (
                <>Sign in to your<br />account<span className="auth-title-dot">.</span></>
              ) : (
                <>Create a new<br />account<span className="auth-title-dot">.</span></>
              )}
            </h1>
            <p className="auth-sub">
              {mode === "login" ? (
                <>Don't have an account?{" "}
                  <button className="auth-switch-link" onClick={() => setMode("signup")}>Sign Up</button>
                </>
              ) : (
                <>Already a member?{" "}
                  <button className="auth-switch-link" onClick={() => setMode("login")}>Log In</button>
                </>
              )}
            </p>
          </div>

          {/* Fields */}
          <div className="auth-fields">
            {mode === "signup" && (
              <div className="auth-row">
                <FloatingField
                  label="First name" value={form.firstName}
                  onChange={set("firstName")} icon={<IconUser />}
                />
                <FloatingField
                  label="Last name" value={form.lastName}
                  onChange={set("lastName")} icon={<IconUser />}
                />
              </div>
            )}

            <FloatingField
              label="Email" type="email" value={form.email}
              onChange={set("email")} icon={<IconMail />}
            />

            <FloatingField
              label="Password"
              type={showPw ? "text" : "password"}
              value={form.password}
              onChange={set("password")}
              icon={<IconLock />}
              rightSlot={
                <button className="auth-eye-btn" onClick={() => setShowPw(v => !v)}>
                  <IconEye open={showPw} />
                </button>
              }
            />

            {mode === "signup" && (
              <FloatingField
                label="Confirm password"
                type={showConfirm ? "text" : "password"}
                value={form.confirm}
                onChange={set("confirm")}
                icon={<IconLock />}
                rightSlot={
                  <button className="auth-eye-btn" onClick={() => setShowConfirm(v => !v)}>
                    <IconEye open={showConfirm} />
                  </button>
                }
              />
            )}

            {mode === "login" && (
              <div className="auth-forgot-row">
                <button className="auth-forgot-link">Forgot password?</button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="auth-actions">
            {mode === "login" ? (
              <>
                <button className="auth-btn-primary">
                  Sign in <IconArrow />
                </button>
              </>
            ) : (
              <>
                <button className="auth-btn-secondary" onClick={() => setMode("login")}>Log in instead</button>
                <button className="auth-btn-primary">
                  Create account <IconArrow />
                </button>
              </>
            )}
          </div>

          {/* Divider */}
          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          {/* Social */}
          <div className="auth-social-row" style={{ gridTemplateColumns: "1fr" }}>
            <button className="auth-social-btn">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}