import OrderRow from "./OrderRow";
import type { Order } from "../api/ordersApi";

interface OrderListProps {
  orders: Order[];
  loading: boolean;
  error: string | null;
  onOpen: (order: Order) => void;
  onRetry: () => void;
}

export default function OrderList({ orders, loading, error, onOpen, onRetry }: OrderListProps) {
  if (loading) {
    return <div className="status-banner--loading">Загружаем заказы…</div>;
  }

  if (error) {
    return (
      <div className="status-banner status-banner--error">
        {error}{" "}
        <button className="link-back" style={{ display: "inline", marginLeft: 8 }} onClick={onRetry}>
          Повторить
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-title">Пока нет заказов</div>
        <div className="empty-subtitle">Нажмите «Новый заказ», чтобы оформить первую доставку.</div>
      </div>
    );
  }

  return (
    <div className="file-list">
      <div className="file-list-head">
        <span>№ заказа</span>
        <span>Маршрут</span>
        <span>Вес</span>
        <span>Забор</span>
        <span aria-hidden="true" />
      </div>
      {orders.map((o) => (
        <OrderRow key={o.orderNumber} order={o} onClick={() => onOpen(o)} />
      ))}
    </div>
  );
}
