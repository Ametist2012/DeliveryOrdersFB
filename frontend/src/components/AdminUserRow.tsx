import type { AdminUser } from "../api/adminApi";

interface AdminUserRowProps {
  user: AdminUser;
  onDelete: () => void;
  deleting: boolean;
}

export default function AdminUserRow({ user, onDelete, deleting }: AdminUserRowProps) {
  return (
    <div className="admin-row">
      <span className="admin-row-name">{user.name}</span>
      <span className="admin-row-email">{user.email}</span>
      <span className={`role-badge role-badge--${user.role.toLowerCase()}`}>{user.role}</span>
      <button className="admin-row-delete" onClick={onDelete} disabled={deleting}>
        {deleting ? "…" : "Удалить"}
      </button>
    </div>
  );
}
