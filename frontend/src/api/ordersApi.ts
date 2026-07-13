const BASE_URL = "/api/orders";

export interface Order {
  createdAt: string;
  orderNumber: string;
  senderCity: string;
  senderAddress: string;
  receiverCity: string;
  receiverAddress: string;
  cargoWeight: number;
  cargoPickupDate: string; // DateOnly -> "yyyy-MM-dd"
}

export interface CreateOrderPayload {
  senderCity: string;
  senderAddress: string;
  receiverCity: string;
  receiverAddress: string;
  cargoWeight: number;
  cargoPickupDate: string;
}

// Сопоставление "имя поля из ValidationProblemDetails" -> "имя поля в форме".
const FIELD_MAP: Record<string, keyof CreateOrderPayload> = {
  sendercity: "senderCity",
  senderaddress: "senderAddress",
  receivercity: "receiverCity",
  receiveraddress: "receiverAddress",
  cargoweight: "cargoWeight",
  cargopickupdate: "cargoPickupDate",
};

// Перевод сообщений ENG от Backend на Ru
const MESSAGE_TRANSLATIONS: Record<string, string> = {
  "The Sender's City field is required.": "Укажите город отправителя",
  "The Sender's City length must be between 2 and 30 characters":
    "Город отправителя — от 2 до 30 символов",
  "The Sender's Address field is required.": "Укажите адрес отправителя",
  "The Sender's Address length must be between 5 and 100 characters":
    "Адрес отправителя — от 5 до 100 символов",
  "The Receiver's City field is required.": "Укажите город получателя",
  "The Receiver's City length must be between 2 and 30 characters":
    "Город получателя — от 2 до 30 символов",
  "The Receiver's Address field is required.": "Укажите адрес получателя",
  "The Receiver's Address length must be between 5 and 100 characters":
    "Адрес получателя — от 5 до 100 символов",
  "The Cargo's weight must be between 0.01 and 100000 kg":
    "Вес груза — от 0.01 до 100 000 кг",
  "The Cargo's weight cannot have more than 2 decimal places":
    "Вес груза — не более 2 знаков после запятой",
  "The Cargo's pickup date cannot be in the past":
    "Дата забора груза не может быть в прошлом",
};

function translateMessage(message: string): string {
  return MESSAGE_TRANSLATIONS[message] ?? message;
}

interface ProblemDetails {
  title?: string;
  errors?: Record<string, string[]>;
}

function normalizeValidationErrors(
  problem: ProblemDetails | null
): Partial<Record<keyof CreateOrderPayload, string>> {
  if (!problem?.errors) return {};
  const result: Partial<Record<keyof CreateOrderPayload, string>> = {};
  Object.entries(problem.errors).forEach(([key, messages]) => {
    const mapped = FIELD_MAP[key.toLowerCase()];
    if (!mapped) return; // Если поле неизвестное, то выдаем так как есть (Eng)
    result[mapped] = translateMessage(Array.isArray(messages) ? messages[0] : String(messages));
  });
  return result;
}

export class ValidationError extends Error {
  fieldErrors: Partial<Record<keyof CreateOrderPayload, string>>;

  constructor(message: string, fieldErrors: Partial<Record<keyof CreateOrderPayload, string>>) {
    super(message);
    this.name = "ValidationError";
    this.fieldErrors = fieldErrors;
  }
}

export async function getOrders(): Promise<Order[]> {
  const res = await fetch(BASE_URL, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error("Не удалось загрузить список заказов. Попробуйте обновить страницу.");
  }
  return res.json();
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (res.status === 400) {
    const problem: ProblemDetails | null = await res.json().catch(() => null);
    throw new ValidationError(
      "Проверьте правильность заполнения формы",
      normalizeValidationErrors(problem)
    );
  }

  if (!res.ok) {
    throw new Error("Не удалось создать заказ. Попробуйте ещё раз.");
  }

  return res.json();
}
