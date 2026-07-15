import OrderRow from "./OrderRow";
import Pager from "./Pager";
import type { Order, OrderSortField, SortDirection } from "../api/ordersApi";

interface SortableHeaderProps {
  field: OrderSortField;
  label: string;
  sortBy: OrderSortField;
  direction: SortDirection;
  onSortChange: (field: OrderSortField) => void;
}

function SortableHeader({ field, label, sortBy, direction, onSortChange }: SortableHeaderProps) {
  return (
    <button className="sort-header" onClick={() => onSortChange(field)}>
      {label}
      {sortBy === field && <span className="sort-arrow">{direction === "Asc" ? "▲" : "▼"}</span>}
    </button>
  );
}

interface OrderListProps {
  orders: Order[];
  loading: boolean;
  error: string | null;
  onOpen: (order: Order) => void;
  onRetry: () => void;
  sortBy: OrderSortField;
  direction: SortDirection;
  onSortChange: (field: OrderSortField) => void;
  canDelete: boolean;
  onDelete: (order: Order) => void;
  deletingNumber: string | null;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
}

export default function OrderList({
  orders,
  loading,
  error,
  onOpen,
  onRetry,
  sortBy,
  direction,
  onSortChange,
  canDelete,
  onDelete,
  deletingNumber,
  page,
  totalPages,
  hasNextPage,
  onPageChange,
  pageSize,
  onPageSizeChange,
}: OrderListProps) {
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
    <>
      <div className="file-list">
        <div className="file-list-head">
          <SortableHeader field="OrderNumber" label="№ заказа" sortBy={sortBy} direction={direction} onSortChange={onSortChange} />
          <SortableHeader field="SenderCity" label="Маршрут" sortBy={sortBy} direction={direction} onSortChange={onSortChange} />
          <span>Email</span>
          <SortableHeader field="CargoWeight" label="Вес" sortBy={sortBy} direction={direction} onSortChange={onSortChange} />
          <SortableHeader field="CargoPickupDate" label="Забор" sortBy={sortBy} direction={direction} onSortChange={onSortChange} />
          <span />
          <span />
        </div>
        {orders.map((o) => (
          <OrderRow
            key={o.orderNumber}
            order={o}
            onOpen={() => onOpen(o)}
            canDelete={canDelete}
            onDelete={() => onDelete(o)}
            deleting={deletingNumber === o.orderNumber}
          />
        ))}
      </div>

      <Pager
        page={page}
        totalPages={totalPages}
        hasNextPage={hasNextPage}
        onPageChange={onPageChange}
        pageSize={pageSize}
        onPageSizeChange={onPageSizeChange}
      />
    </>
  );
}
