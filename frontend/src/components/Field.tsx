const LABELS: Record<string, string> = {
  senderCity: "Город отправителя",
  senderAddress: "Адрес отправителя",
  receiverCity: "Город получателя",
  receiverAddress: "Адрес получателя",
  cargoWeight: "Вес груза, кг",
  cargoPickupDate: "Дата забора груза",
  name: "Имя",
  email: "Email",
  password: "Пароль",
};

interface FieldProps {
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  error?: string;
  type?: string;
  label?: string;
}

export default function Field({ name, value, onChange, error, type = "text", label }: FieldProps) {
  return (
    <label className="field">
      <span className="field-label">{label ?? LABELS[name] ?? name}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        step={type === "number" ? "any" : undefined}
        className={`field-input${error ? " field-input--error" : ""}`}
        aria-invalid={!!error}
      />
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}
