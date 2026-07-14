// Общая инфраструктура запросов: разбор ValidationProblemDetails / Problem от ASP.NET,
// перевод сообщений на русский, заголовок авторизации. Используется и заказами, и auth.

export const API_ROOT = "/api";

export class ValidationError extends Error {
  fieldErrors: Record<string, string>;
  constructor(message: string, fieldErrors: Record<string, string>) {
    super(message);
    this.name = "ValidationError";
    this.fieldErrors = fieldErrors;
  }
}

// Бросается при 401 — токен просрочен/невалиден. 
export class AuthExpiredError extends Error {}

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

  "The Email field is required.": "Укажите email",
  "The Email format is invalid.": "Некорректный формат email",
  "The Password field is required.": "Укажите пароль",
  "The Password length must be between 6 and 26 characters.":
    "Пароль — от 6 до 26 символов",
  "The Password must contain at least one letter and one number.":
    "Пароль должен содержать хотя бы одну букву и одну цифру",
  "The Name field is required.": "Укажите имя",
  "The Name length must be between 6 and 13 characters.": "Имя — от 6 до 13 символов",
  "The Name can contain only latin letters and numbers.":
    "Имя может содержать только латинские буквы и цифры",
  "The Role field is required.": "Укажите роль",
  "The Role must be either 'User' or 'Admin'.": "Роль должна быть 'User' или 'Admin'",
  "The Role is case-sensitive. Allowed values are 'User' or 'Admin'.":
    "Роль чувствительна к регистру: 'User' или 'Admin'",

  "Invalid email or password.": "Неверный email или пароль",
  "A user with this email already exists.": "Пользователь с таким email уже существует",

  
};

export function translateMessage(message: string): string {
  return MESSAGE_TRANSLATIONS[message] ?? message;
}

export interface ProblemDetails {
  title?: string;
  detail?: string;
  errors?: Record<string, string[]>;
}

export function buildValidationError(
  problem: ProblemDetails | null,
  fieldMap: Record<string, string>
): ValidationError {
  const fieldErrors: Record<string, string> = {};
  const unmapped: string[] = [];
  Object.entries(problem?.errors ?? {}).forEach(([key, messages]) => {
    const mapped = fieldMap[key.toLowerCase()];
    const translated = translateMessage(Array.isArray(messages) ? messages[0] : String(messages));
    if (mapped) {
      fieldErrors[mapped] = translated;
    } else { unmapped.push(translated); }
  });
  const message = unmapped.length
    ? `Проверьте правильность заполнения формы. ${unmapped.join(" ")}`
    : "Проверьте правильность заполнения формы";
  return new ValidationError(message, fieldErrors);
}

// Разбирает 400-ответ, который может быть как ValidationProblemDetails (с errors —
// например, из OrdersController), так и обычным Problem(title, detail) без errors
// (например, "A user with this email already exists." из AuthController/AdminController).
export async function parseBadRequest(res: Response, fieldMap: Record<string, string>): Promise<Error> {
  const problem: ProblemDetails | null = await res.json().catch(() => null);
  if (problem?.errors) return buildValidationError(problem, fieldMap);
  return new Error(translateMessage(problem?.detail || problem?.title || "Запрос отклонён"));
}

export function authHeader(token: string | null): HeadersInit {
  return token ? { Authorization: `Bearer ${token}` } : {};
}
