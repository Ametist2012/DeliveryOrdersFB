
interface RouteLineProps {
  from: string;
  to: string;
  size?: "lg" | "sm";
}

export default function RouteLine({ from, to, size = "lg" }: RouteLineProps) {
  const cityClass = `route-city route-city--${size}`;
  return (
    <div className="route-line">
      <span className={cityClass}>{from || "—"}</span>
      <span className="route-track">
        <span className="route-dot" />
      </span>
      <span className={cityClass}>{to || "—"}</span>
    </div>
  );
}
