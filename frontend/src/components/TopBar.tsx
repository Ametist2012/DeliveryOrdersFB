import { useAuth } from "../auth/AuthContext";

type Section = "orders" | "admin";
type View = "list" | "create" | "detail";

interface TopBarProps {
  view: View;
  onNew: () => void;
  newLabel: string;
  countLabel: string;
  section: Section;
  onSectionChange: (section: Section) => void;
}

export default function TopBar({ view, onNew, newLabel, countLabel, section, onSectionChange }: TopBarProps) {
  const { email, role, logout } = useAuth();
  const isAdmin = role === "Admin";

  return (
    <div className="topbar">
      <div className="topbar-inner">
        <div className="topbar-left">
          <div className="topbar-brand">
            <div className="topbar-mark">⇄</div>
            <div>
              <div className="topbar-title">МАРШРУТ</div>
              <div className="topbar-subtitle">приёмка заказов</div>
            </div>
          </div>

          {isAdmin && (
            <div className="topbar-tabs">
              <button
                className={`topbar-tab${section === "orders" ? " topbar-tab--active" : ""}`}
                onClick={() => onSectionChange("orders")}
              >
                Заказы
              </button>
              <button
                className={`topbar-tab${section === "admin" ? " topbar-tab--active" : ""}`}
                onClick={() => onSectionChange("admin")}
              >
                Пользователи
              </button>
            </div>
          )}
        </div>

        <div className="topbar-right">
          {email && <span className="topbar-user">{email}</span>}
          <div className="topbar-count">{countLabel}</div>
          {view !== "create" && (
            <button className="btn-primary" onClick={onNew}>
              {newLabel}
            </button>
          )}
          <button className="topbar-logout" onClick={logout}>
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
}
