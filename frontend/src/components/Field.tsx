const LABELS: Record<string, string> = {
  senderCity: "Город отправителя",
  senderAddress: "Адрес отправителя",
  receiverCity: "Город получателя",
  receiverAddress: "Адрес получателя",
  cargoWeight: "Вес груза, кг",
  cargoPickupDate: "Дата забора груза",
};

interface FieldProps {
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  error?: string;
  type?: string;
}

export default function Field({ name, value, onChange, error, type = "text" }: FieldProps) {
  return (
    <label className="field">
      <span className="field-label">{LABELS[name]}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        min={undefined}
        step={type === "number" ? "any" : undefined}
        className={`field-input${error ? " field-input--error" : ""}`}
        aria-invalid={!!error}
      />
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}
