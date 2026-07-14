import { useEffect, useState, useCallback } from "react";
import OrderList from "./OrderList";
import OrderForm from "./OrderForm";
import OrderDetail from "./OrderDetail";
import { getOrders, type Order } from "../api/ordersApi";
import { AuthExpiredError } from "../api/http";
import { useAuth } from "../auth/AuthContext";

type View = "list" | "create" | "detail";

interface OrdersSectionProps {
  view: View;
  onViewChange: (view: View) => void;
  onCountChange: (count: number) => void;
}

export default function OrdersSection({ view, onViewChange, onCountChange }: OrdersSectionProps) {
  const { token, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Order | null>(null);

  const loadOrders = useCallback(() => {
    if (!token) return;
    setLoading(true);
    setLoadError(null);
    getOrders(token)
      .then((data) => {
        setOrders(data);
        onCountChange(data.length);
      })
      .catch((err) => {
        if (err instanceof AuthExpiredError) {
          logout();
          return;
        }
        setLoadError(err instanceof Error ? err.message : "Не удалось загрузить список заказов");
      })
      .finally(() => setLoading(false));
  }, [token, logout, onCountChange]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleCreated = (created: Order) => {
    setOrders((prev) => {
      const next = [created, ...prev];
      onCountChange(next.length);
      return next;
    });
    onViewChange("list");
  };

  const openOrder = (order: Order) => {
    setSelected(order);
    onViewChange("detail");
  };

  return (
    <>
      {view === "list" && (
        <OrderList orders={orders} loading={loading} error={loadError} onOpen={openOrder} onRetry={loadOrders} />
      )}
      {view === "create" && <OrderForm onCreated={handleCreated} onCancel={() => onViewChange("list")} />}
      {view === "detail" && selected && <OrderDetail order={selected} onBack={() => onViewChange("list")} />}
    </>
  );
}
