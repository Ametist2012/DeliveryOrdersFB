

interface TopBarProps {
  view: "list" | "create" | "detail";
  onNew: () => void;
  count: number;
}

export default function TopBar({ view, onNew, count }: TopBarProps) {
  return (
    <div className="topbar">
      <div className="topbar-inner">
        <div className="topbar-brand">
          <div className="topbar-mark">⇄</div>
          <div>
            <div className="topbar-title">МАРШРУТ</div>
            <div className="topbar-subtitle">приёмка заказов</div>
          </div>
        </div>
        <div className="topbar-right">
          <div className="topbar-count">
            {count} {count === 1 ? "заказ" : "заказов"} в системе
          </div>
          {view !== "create" && (
            <button className="btn-primary" onClick={onNew}>
              + Новый заказ
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
