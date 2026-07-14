import { API_ROOT, authHeader, parseBadRequest, AuthExpiredError, type ProblemDetails } from "./http";

const USERS_URL = `${API_ROOT}/admin/users`;

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: string;
}

const FIELD_MAP: Record<string, keyof CreateUserPayload> = {
  name: "name",
  email: "email",
  password: "password",
  role: "role",
};


function checkAuth(res: Response) {
  // 401 — токен истёк/невалиден (разлогиниваем).
  if (res.status === 401) throw new AuthExpiredError("Сессия истекла, войдите снова");
  // 403 — токен валиден, но роль не Admin (не разлогиниваем, показываем сообщение)
  if (res.status === 403) throw new Error("Недостаточно прав для этого действия.");
}

export async function listUsers(token: string): Promise<AdminUser[]> {
  const res = await fetch(USERS_URL, {
    headers: { Accept: "application/json", ...authHeader(token) },
  });
  checkAuth(res);
  if (!res.ok) throw new Error("Не удалось загрузить список пользователей.");
  return res.json();
}

export async function createUser(payload: CreateUserPayload, token: string): Promise<void> {
  const res = await fetch(USERS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...authHeader(token),
    },
    body: JSON.stringify(payload),
  });
  checkAuth(res);
  if (res.status === 400) throw await parseBadRequest(res, FIELD_MAP);
  if (!res.ok) throw new Error("Не удалось создать пользователя.");
}

export async function deleteUser(id: string, token: string): Promise<void> {
  const res = await fetch(`${USERS_URL}/${id}`, {
    method: "DELETE",
    headers: { Accept: "application/json", ...authHeader(token) },
  });
  checkAuth(res);
  if (!res.ok) {
    const problem: ProblemDetails | null = await res.json().catch(() => null);
    throw new Error(problem?.detail || "Не удалось удалить пользователя.");
  }
}
