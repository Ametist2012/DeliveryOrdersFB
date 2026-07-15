import type { KeyboardEvent } from "react";
import { formatDate } from "../utils/format";
import type { Order } from "../api/ordersApi";

interface OrderRowProps {
  order: Order;
  onOpen: () => void;
  canDelete: boolean;
  onDelete: () => void;
  deleting: boolean;
}

export default function OrderRow({ order, onOpen, canDelete, onDelete, deleting }: OrderRowProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen();
    }
  };

  return (
    <div
      className="file-row"
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={handleKeyDown}
    >
      <span className="file-row-number">{order.orderNumber}</span>
      <span className="file-row-route">
        <span>{order.senderCity}</span>
        <span className="file-row-arrow">→</span>
        <span>{order.receiverCity}</span>
      </span>
      <span className="file-row-email">{order.emailUser}</span>
      <span className="file-row-weight">{order.cargoWeight} кг</span>
      <span className="file-row-date">{formatDate(order.cargoPickupDate)}</span>
      <span className="file-row-action">
        {canDelete && (
          <button
            className="admin-row-delete"
            disabled={deleting}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            {deleting ? "…" : "Удалить"}
          </button>
        )}
      </span>
      <span className="file-row-chevron">›</span>
    </div>
  );
}
