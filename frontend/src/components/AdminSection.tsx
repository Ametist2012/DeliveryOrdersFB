import { useCallback, useEffect, useState } from "react";
import AdminUserRow from "./AdminUserRow";
import AdminUserForm from "./AdminUserForm";
import { listUsers, deleteUser, type AdminUser } from "../api/adminApi";
import { AuthExpiredError } from "../api/http";
import { useAuth } from "../auth/AuthContext";

type View = "list" | "create";

interface AdminSectionProps {
  view: View;
  onViewChange: (view: View) => void;
  onCountChange: (count: number) => void;
}

export default function AdminSection({ view, onViewChange, onCountChange }: AdminSectionProps) {
  const { token, logout } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!token) return;
    setLoading(true);
    setLoadError(null);
    listUsers(token)
      .then((data) => {
        setUsers(data);
        onCountChange(data.length);
      })
      .catch((err) => {
        if (err instanceof AuthExpiredError) {
          logout();
          return;
        }
        setLoadError(err instanceof Error ? err.message : "Не удалось загрузить список пользователей");
      })
      .finally(() => setLoading(false));
  }, [token, logout, onCountChange]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (user: AdminUser) => {
    if (!token) return;
    if (!window.confirm(`Удалить пользователя «${user.name}» (${user.email})?`)) return;

    setDeletingId(user.id);
    setActionError(null);
    try {
      await deleteUser(user.id, token);
      setUsers((prev) => {
        const next = prev.filter((u) => u.id !== user.id);
        onCountChange(next.length);
        return next;
      });
    } catch (err) {
      if (err instanceof AuthExpiredError) {
        logout();
        return;
      }
      setActionError(err instanceof Error ? err.message : "Не удалось удалить пользователя");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreated = () => {
    onViewChange("list");
    load();
  };

  return (
    <>
      {view === "create" && <AdminUserForm onCreated={handleCreated} onCancel={() => onViewChange("list")} />}

      {view === "list" && (
        <>
          {actionError && <div className="status-banner status-banner--error">{actionError}</div>}

          {loading && <div className="status-banner--loading">Загружаем пользователей…</div>}

          {!loading && loadError && (
            <div className="status-banner status-banner--error">
              {loadError}{" "}
              <button className="link-back" style={{ display: "inline", marginLeft: 8 }} onClick={load}>
                Повторить
              </button>
            </div>
          )}

          {!loading && !loadError && users.length === 0 && (
            <div className="empty-state">
              <div className="empty-title">Пользователей нет</div>
            </div>
          )}

          {!loading && !loadError && users.length > 0 && (
            <div className="admin-list">
              <div className="admin-list-head">
                <span>Имя</span>
                <span>Email</span>
                <span>Роль</span>
                <span />
              </div>
              {users.map((u) => (
                <AdminUserRow
                  key={u.id}
                  user={u}
                  onDelete={() => handleDelete(u)}
                  deleting={deletingId === u.id}
                />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
