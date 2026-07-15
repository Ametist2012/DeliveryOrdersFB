export interface JwtClaims {
  exp?: number;
  [key: string]: unknown;
}

// JwtTokenService.cs создаёт токен через `new JwtSecurityToken(claims: ...)` напрямую,
// минуя стандартную маппинг-таблицу коротких имён claim'ов. Поэтому ClaimTypes.Role и
// ClaimTypes.Email попадают в токен под своими полными URI, а не как "role"/"email".
const ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
const EMAIL_CLAIM = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";

export function decodeJwt(token: string): JwtClaims | null {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function isExpired(claims: JwtClaims | null): boolean {
  if (!claims?.exp) return false;
  return Date.now() >= claims.exp * 1000;
}

export function getRole(claims: JwtClaims | null): string | null {
  if (!claims) return null;
  return (claims[ROLE_CLAIM] as string) ?? (claims.role as string) ?? null;
}

export function getEmail(claims: JwtClaims | null): string | null {
  if (!claims) return null;
  return (claims[EMAIL_CLAIM] as string) ?? (claims.email as string) ?? null;
}
