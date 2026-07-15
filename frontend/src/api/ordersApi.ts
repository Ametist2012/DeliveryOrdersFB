import { API_ROOT, authHeader, buildValidationError, parseBadRequest, AuthExpiredError, type ProblemDetails } from "./http";

const ORDERS_URL = `${API_ROOT}/orders`;

export type OrderSortField =
  | "CreatedAt"
  | "OrderNumber"
  | "SenderCity"
  | "SenderAddress"
  | "ReceiverCity"
  | "ReceiverAddress"
  | "CargoWeight"
  | "CargoPickupDate";

export type SortDirection = "Asc" | "Desc";

export interface Order {
  createdAt: string;
  emailUser: string;
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

export interface OrderQueryParams {
  page: number;
  pageSize: number;
  sortBy: OrderSortField;
  direction: SortDirection;
}

export interface PagedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
}

const FIELD_MAP: Record<string, keyof CreateOrderPayload> = {
  sendercity: "senderCity",
  senderaddress: "senderAddress",
  receivercity: "receiverCity",
  receiveraddress: "receiverAddress",
  cargoweight: "cargoWeight",
  cargopickupdate: "cargoPickupDate",
};

export async function getOrders(params: OrderQueryParams, token: string): Promise<PagedResponse<Order>> {
  const query = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
    sortBy: params.sortBy,
    direction: params.direction,
  });

  const res = await fetch(`${ORDERS_URL}?${query.toString()}`, {
    headers: { Accept: "application/json", ...authHeader(token) },
  });

  if (res.status === 401) throw new AuthExpiredError("Сессия истекла, войдите снова");
  if (res.status === 400) {

    throw await parseBadRequest(res, {});
  }
  if (!res.ok) {
    throw new Error("Не удалось загрузить список заказов. Попробуйте обновить страницу.");
  }
  return res.json();
}

export class OrderNotFoundError extends Error {}

export async function getOrderByNumber(orderNumber: string, token: string): Promise<Order> {
  const res = await fetch(`${ORDERS_URL}/${encodeURIComponent(orderNumber)}`, {
    headers: { Accept: "application/json", ...authHeader(token) },
  });

  if (res.status === 401) throw new AuthExpiredError("Сессия истекла, войдите снова");
  if (res.status === 404) {
    throw new OrderNotFoundError(`Заказ ${orderNumber} не найден.`);
  }
  if (!res.ok) throw new Error("Не удалось загрузить заказ.");

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

export async function deleteOrder(orderNumber: string, token: string): Promise<void> {
  const res = await fetch(`${ORDERS_URL}/${encodeURIComponent(orderNumber)}`, {
    method: "DELETE",
    headers: { Accept: "application/json", ...authHeader(token) },
  });

  if (res.status === 401) throw new AuthExpiredError("Сессия истекла, войдите снова");
  if (res.status === 403) throw new Error("Недостаточно прав для этого действия.");

  if (!res.ok) {
    const problem: ProblemDetails | null = await res.json().catch(() => null);
    throw new Error(problem?.detail || "Не удалось удалить заказ.");
  }
}

export { ValidationError } from "./http";
