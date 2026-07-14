import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

type Mode = "login" | "register";

export default function AuthScreen() {
  const [mode, setMode] = useState<Mode>("login");
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div className="auth-shell">
      <div className="auth-brand">
        <div className="topbar-mark">⇄</div>
        <div>
          <div className="font-display auth-brand-title">МАРШРУТ</div>
          <div className="auth-brand-subtitle">приёмка заказов</div>
        </div>
      </div>

      {notice && <div className="status-banner status-banner--info">{notice}</div>}

      {mode === "login" ? (
        <LoginForm
          onSwitchToRegister={() => {
            setMode("register");
            setNotice(null);
          }}
        />
      ) : (
        <RegisterForm
          onRegistered={() => {
            setMode("login");
            setNotice("Аккаунт создан. Войдите с указанными данными.");
          }}
          onSwitchToLogin={() => {
            setMode("login");
            setNotice(null);
          }}
        />
      )}
    </div>
  );
}
