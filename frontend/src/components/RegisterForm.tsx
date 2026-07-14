import { useState, type FormEvent } from "react";
import Field from "./Field";
import { register } from "../api/authApi";
import { ValidationError } from "../api/http";

const emptyForm = { name: "", email: "", password: "" };
type FormKey = keyof typeof emptyForm;

interface RegisterFormProps {
  onRegistered: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterForm({ onRegistered, onSwitchToLogin }: RegisterFormProps) {
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
      await register(form);
      onRegistered();
    } catch (err) {
      if (err instanceof ValidationError) {
        setErrors(err.fieldErrors as Partial<Record<FormKey, string>>);
        setSubmitError(err.message);
      } else {
        setSubmitError(err instanceof Error ? err.message : "Не удалось зарегистрироваться");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-card">
      <div className="form-title">Регистрация</div>
      <div className="form-subtitle">
        Имя — латиница и цифры, 6–13 символов. Пароль — 6–26 символов, минимум одна буква и одна цифра.
      </div>
      <form onSubmit={submit}>
        <div className="form-section">
          <Field name="name" value={form.name} onChange={update} error={errors.name} />
          <Field name="email" value={form.email} onChange={update} error={errors.email} />
          <Field name="password" type="password" value={form.password} onChange={update} error={errors.password} />
        </div>
        {submitError && <div className="status-banner status-banner--error">{submitError}</div>}
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Регистрируем…" : "Зарегистрироваться"}
          </button>
        </div>
      </form>
      <div className="auth-switch">
        Уже есть аккаунт?{" "}
        <button type="button" className="auth-switch-link" onClick={onSwitchToLogin}>
          Войти
        </button>
      </div>
    </div>
  );
}
