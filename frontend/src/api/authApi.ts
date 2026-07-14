import { API_ROOT, parseBadRequest, translateMessage } from "./http";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

const LOGIN_FIELD_MAP: Record<string, string> = { email: "email", password: "password" };
const REGISTER_FIELD_MAP: Record<string, string> = { name: "name", email: "email", password: "password" };

export async function login(payload: LoginPayload): Promise<string> {
  const res = await fetch(`${API_ROOT}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });

  if (res.status === 400) throw await parseBadRequest(res, LOGIN_FIELD_MAP);

  if (res.status === 401) {
    const problem = await res.json().catch(() => null);
    throw new Error(translateMessage(problem?.detail || problem?.title || "Invalid email or password."));
  }

  if (!res.ok) throw new Error("Не удалось выполнить вход. Попробуйте ещё раз.");

  const data = await res.json();
  return data.token as string;
}

export async function register(payload: RegisterPayload): Promise<void> {
  const res = await fetch(`${API_ROOT}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });

  if (res.status === 400) throw await parseBadRequest(res, REGISTER_FIELD_MAP);
  if (!res.ok) throw new Error("Не удалось зарегистрироваться. Попробуйте ещё раз.");
}
