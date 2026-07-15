import { useEffect, useState } from "react";
import TopBar from "./components/TopBar";
import OrdersSection from "./components/OrdersSection";
import AdminSection from "./components/AdminSection";
import AuthScreen from "./components/AuthScreen";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { usePath } from "./router/usePath";
import { navigate, replace } from "./router/router";
import "./styles/theme.css";

type Section = "orders" | "admin";
type View = "list" | "create" | "detail";

interface ParsedRoute {
  section: Section;
  view: View;
  orderNumber?: string;
}

function parsePath(path: string): ParsedRoute {
  const segments = path.split("/").filter(Boolean);

  if (segments[0] === "admin") {
    return { section: "admin", view: segments[1] === "new" ? "create" : "list" };
  }

  // По умолчанию (в т.ч. корень "/") — раздел заказов.
  if (segments[1] === "new") return { section: "orders", view: "create" };
  if (segments[1]) return { section: "orders", view: "detail", orderNumber: decodeURIComponent(segments[1]) };
  return { section: "orders", view: "list" };
}

function Shell() {
  const { role } = useAuth();
  const path = usePath();
  const route = parsePath(path);

  const [orderCount, setOrderCount] = useState(0);
  const [userCount, setUserCount] = useState(0);

  // "/" -> "/orders", каноничный адрес списка.
  useEffect(() => {
    if (path === "/") replace("/orders");
  }, [path]);

  // Обычный пользователь не должен попасть в "/admin/*" даже если наберёт URL руками —
  // вкладка скрыта в TopBar, это отдельная страховка на уровне маршрутизации.
  useEffect(() => {
    if (route.section === "admin" && role !== "Admin") replace("/orders");
  }, [route.section, role]);

  const isAdminSection = route.section === "admin" && role === "Admin";
  const newLabel = isAdminSection ? "+ Пользователь" : "+ Новый заказ";
  const countLabel = isAdminSection ? `Пользователей всего: ${userCount}` : `Заказов всего: ${orderCount}`;

  return (
    <div className="app-shell">
      <TopBar
        view={route.view}
        onNew={() => navigate(isAdminSection ? "/admin/new" : "/orders/new")}
        newLabel={newLabel}
        countLabel={countLabel}
        section={isAdminSection ? "admin" : "orders"}
        onSectionChange={(section) => navigate(section === "admin" ? "/admin" : "/orders")}
      />
      <div className="app-container">
        {isAdminSection ? (
          <AdminSection
            view={route.view === "create" ? "create" : "list"}
            onNavigateList={() => navigate("/admin")}
            onCountChange={setUserCount}
          />
        ) : (
          <OrdersSection
            view={route.view}
            orderNumber={route.orderNumber}
            onNavigateList={() => navigate("/orders")}
            onNavigateDetail={(orderNumber) => navigate(`/orders/${encodeURIComponent(orderNumber)}`)}
            onCountChange={setOrderCount}
          />
        )}
      </div>
    </div>
  );
}

function Gate() {
  const { token } = useAuth();
  return token ? <Shell /> : <AuthScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  );
}
