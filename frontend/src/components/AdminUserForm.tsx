import { useState, type FormEvent } from "react";
import Field from "./Field";
import { createUser } from "../api/adminApi";
import { ValidationError, AuthExpiredError } from "../api/http";
import { useAuth } from "../auth/AuthContext";

const emptyForm = { name: "", email: "", password: "", role: "User" };
type FormKey = keyof typeof emptyForm;

interface AdminUserFormProps {
  onCreated: () => void;
  onCancel: () => void;
}

export default function AdminUserForm({ onCreated, onCancel }: AdminUserFormProps) {
  const { token, logout } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<FormKey, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const update = (name: string, value: string) => {
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name as FormKey]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: Partial<Record<FormKey, string>> = {};
    (["name", "email", "password"] as FormKey[]).forEach((k) => {
      if (!form[k].trim()) errs[k] = "Обязательное поле";
    });
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      await createUser(form, token!);
      onCreated();
    } catch (err) {
      if (err instanceof AuthExpiredError) {
        logout();
        return;
      }
      if (err instanceof ValidationError) {
        setErrors(err.fieldErrors as Partial<Record<FormKey, string>>);
        setSubmitError(err.message);
      } else {
        setSubmitError(err instanceof Error ? err.message : "Не удалось создать пользователя");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-card">
      <div className="form-title">Новый пользователь</div>
      <div className="form-subtitle">
        Имя — латиница и цифры, 6–13 символов. Пароль — 6–26 символов, буква и цифра. Роль — строго «User» или «Admin».
      </div>
      <form onSubmit={submit}>
        <div className="form-section">
          <Field name="name" value={form.name} onChange={update} error={errors.name} />
          <Field name="email" value={form.email} onChange={update} error={errors.email} />
          <Field name="password" type="password" value={form.password} onChange={update} error={errors.password} />
          <label className="field">
            <span className="field-label">Роль</span>
            <select
              value={form.role}
              onChange={(e) => update("role", e.target.value)}
              className={`field-input${errors.role ? " field-input--error" : ""}`}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
            {errors.role && <span className="field-error">{errors.role}</span>}
          </label>
        </div>
        {submitError && <div className="status-banner status-banner--error">{submitError}</div>}
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Создаём…" : "Создать пользователя"}
          </button>
          <button type="button" className="btn-secondary" onClick={onCancel} disabled={submitting}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
