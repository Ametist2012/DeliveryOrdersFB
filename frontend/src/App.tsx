import { useState } from "react";
import TopBar from "./components/TopBar";
import OrdersSection from "./components/OrdersSection";
import AdminSection from "./components/AdminSection";
import AuthScreen from "./components/AuthScreen";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import "./styles/theme.css";

type Section = "orders" | "admin";
type View = "list" | "create" | "detail";

function Shell() {
  const { role } = useAuth();
  const [section, setSection] = useState<Section>("orders");

  const [orderView, setOrderView] = useState<View>("list");
  const [orderCount, setOrderCount] = useState(0);

  const [adminView, setAdminView] = useState<View>("list");
  const [userCount, setUserCount] = useState(0);

  // Обычный пользователь не должен попасть в раздел "Пользователи" даже если
  // section почему-то окажется "admin" — вкладка и так скрыта в TopBar, это доп. страховка.
  const effectiveSection: Section = role === "Admin" ? section : "orders";
  const isAdminSection = effectiveSection === "admin";

  const currentView = isAdminSection ? adminView : orderView;
  const newLabel = isAdminSection ? "+ Пользователь" : "+ Новый заказ";
  const countLabel = isAdminSection
    ? `Пользователей всего: ${userCount}`
    : `Заказов всего: ${orderCount}`;

  const handleNew = () => {
    if (isAdminSection) setAdminView("create");
    else setOrderView("create");
  };

  return (
    <div className="app-shell">
      <TopBar
        view={currentView}
        onNew={handleNew}
        newLabel={newLabel}
        countLabel={countLabel}
        section={effectiveSection}
        onSectionChange={setSection}
      />
      <div className="app-container">
        {isAdminSection ? (
          <AdminSection view={adminView} onViewChange={setAdminView} onCountChange={setUserCount} />
        ) : (
          <OrdersSection view={orderView} onViewChange={setOrderView} onCountChange={setOrderCount} />
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
