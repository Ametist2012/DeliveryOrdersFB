import { useEffect, useState, useCallback } from "react";
import TopBar from "./components/TopBar";
import OrderList from "./components/OrderList";
import OrderForm from "./components/OrderForm";
import OrderDetail from "./components/OrderDetail";
import { getOrders, type Order } from "./api/ordersApi";
import "./styles/theme.css";

type View = "list" | "create" | "detail";

export default function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [view, setView] = useState<View>("list");
  const [selected, setSelected] = useState<Order | null>(null);

  const loadOrders = useCallback(() => {
    setLoading(true);
    setLoadError(null);
    getOrders()
      .then((data) => setOrders(data))
      .catch((err: Error) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleCreated = (created: Order) => {
    // Кладём в список номер заказа от сервера.
    setOrders((prev) => [created, ...prev]);
    setView("list");
  };

  const openOrder = (order: Order) => {
    setSelected(order);
    setView("detail");
  };

  return (
    <div className="app-shell">
      <TopBar view={view} onNew={() => setView("create")} count={orders.length} />
      <div className="app-container">
        {view === "list" && (
          <OrderList orders={orders} loading={loading} error={loadError} onOpen={openOrder} onRetry={loadOrders} />
        )}
        {view === "create" && <OrderForm onCreated={handleCreated} onCancel={() => setView("list")} />}
        {view === "detail" && selected && <OrderDetail order={selected} onBack={() => setView("list")} />}
      </div>
    </div>
  );
}
