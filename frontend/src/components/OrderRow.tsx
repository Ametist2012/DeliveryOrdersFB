import { formatDate } from "../utils/format";
import type { Order } from "../api/ordersApi";

export default function OrderRow({ order, onClick }: { order: Order; onClick: () => void }) {
  return (
    <button className="file-row" onClick={onClick}>
      <span className="file-row-number">{order.orderNumber}</span>
      <span className="file-row-route">
        <span>{order.senderCity}</span>
        <span className="file-row-arrow">→</span>
        <span>{order.receiverCity}</span>
      </span>
      <span className="file-row-weight">{order.cargoWeight} кг</span>
      <span className="file-row-date">{formatDate(order.cargoPickupDate)}</span>
      <span className="file-row-chevron">›</span>
    </button>
  );
}
