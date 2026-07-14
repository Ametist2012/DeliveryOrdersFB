import RouteLine from "./RouteLine";
import { formatDate } from "../utils/format";
import type { Order } from "../api/ordersApi";

export default function OrderDetail({ order, onBack }: { order: Order; onBack: () => void }) {
  return (
    <div>
      <button className="link-back" onClick={onBack}>
        ← К списку заказов
      </button>
      <div className="detail-card">
        <div className="detail-header">
          <div className="detail-stamp">ОФОРМЛЕН</div>
          <div className="detail-eyebrow">№ заказа</div>
          <div className="detail-number">{order.orderNumber}</div>
          <div className="detail-route">
            <RouteLine from={order.senderCity} to={order.receiverCity} size="lg" />
          </div>
        </div>

        <div className="detail-dashed" />
        <div className="detail-parties">
          <div>
            <div className="detail-party-label">Отправитель</div>
            <div className="detail-party-city">{order.senderCity}</div>
            <div className="detail-party-address">{order.senderAddress}</div>
          </div>
          <div>
            <div className="detail-party-label">Получатель</div>
            <div className="detail-party-city">{order.receiverCity}</div>
            <div className="detail-party-address">{order.receiverAddress}</div>
          </div>
        </div>

        <div className="detail-solid" />
        <div className="detail-facts">
          <div>
            <div className="detail-fact-label">Вес груза</div>
            <div className="detail-fact-value">{order.cargoWeight} кг</div>
          </div>
          <div>
            <div className="detail-fact-label">Дата забора груза</div>
            <div className="detail-fact-value">{formatDate(order.cargoPickupDate)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
