import { useState, type FormEvent } from "react";
import Field from "./Field";
import { login } from "../api/authApi";
import { ValidationError } from "../api/http";
import { useAuth } from "../auth/AuthContext";

const emptyForm = { email: "", password: "" };
type FormKey = keyof typeof emptyForm;

export default function LoginForm({ onSwitchToRegister }: { onSwitchToRegister: () => void }) {
  const { login: setAuthToken } = useAuth();
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
    (Object.keys(emptyForm) as FormKey[]).forEach((k) => {
      if (!form[k].trim()) errs[k] = "Обязательное поле";
    });
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const token = await login(form);
      setAuthToken(token);
    } catch (err) {
      if (err instanceof ValidationError) {
        setErrors(err.fieldErrors as Partial<Record<FormKey, string>>);
        setSubmitError(err.message);
      } else {
        setSubmitError(err instanceof Error ? err.message : "Не удалось войти");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-card">
      <div className="form-title">Вход</div>
      <div className="form-subtitle">Введите email и пароль, чтобы продолжить.</div>
      <form onSubmit={submit}>
        <div className="form-section">
          <Field name="email" value={form.email} onChange={update} error={errors.email} />
          <Field name="password" type="password" value={form.password} onChange={update} error={errors.password} />
        </div>
        {submitError && <div className="status-banner status-banner--error">{submitError}</div>}
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Входим…" : "Войти"}
          </button>
        </div>
      </form>
      <div className="auth-switch">
        Нет аккаунта?{" "}
        <button type="button" className="auth-switch-link" onClick={onSwitchToRegister}>
          Зарегистрироваться
        </button>
      </div>
    </div>
  );
}
