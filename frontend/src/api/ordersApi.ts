import { API_ROOT, authHeader, buildValidationError, AuthExpiredError, type ProblemDetails } from "./http";

const ORDERS_URL = `${API_ROOT}/orders`;

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

// Ключи ValidationProblemDetails — имена свойств CreateOrderRequest (SenderCity, CargoWeight...),
const FIELD_MAP: Record<string, keyof CreateOrderPayload> = {
  sendercity: "senderCity",
  senderaddress: "senderAddress",
  receivercity: "receiverCity",
  receiveraddress: "receiverAddress",
  cargoweight: "cargoWeight",
  cargopickupdate: "cargoPickupDate",
};

export async function getOrders(token: string): Promise<Order[]> {
  const res = await fetch(ORDERS_URL, {
    headers: { Accept: "application/json", ...authHeader(token) },
  });
  if (res.status === 401) throw new AuthExpiredError("Сессия истекла, войдите снова");
  if (!res.ok) {
    throw new Error("Не удалось загрузить список заказов. Попробуйте обновить страницу.");
  }
  return res.json();
}

export async function createOrder(payload: CreateOrderPayload, token: string): Promise<Order> {
  const res = await fetch(ORDERS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...authHeader(token),
    },
    body: JSON.stringify(payload),
  });

  if (res.status === 401) throw new AuthExpiredError("Сессия истекла, войдите снова");

  if (res.status === 400) {
    const problem: ProblemDetails | null = await res.json().catch(() => null);
    throw buildValidationError(problem, FIELD_MAP);
  }

  if (!res.ok) throw new Error("Не удалось создать заказ. Попробуйте ещё раз.");

  return res.json();
}

export { ValidationError } from "./http";
