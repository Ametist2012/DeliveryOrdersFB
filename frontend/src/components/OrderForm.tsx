import React, { useState } from "react";
import Field from "./Field";
import { createOrder, ValidationError, type Order, type CreateOrderPayload } from "../api/ordersApi";

const emptyForm: Record<keyof CreateOrderPayload, string> = {
  senderCity: "",
  senderAddress: "",
  receiverCity: "",
  receiverAddress: "",
  cargoWeight: "",
  cargoPickupDate: "",
};

interface OrderFormProps {
  onCreated: (order: Order) => void;
  onCancel: () => void;
}

export default function OrderForm({ onCreated, onCancel }: OrderFormProps) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof CreateOrderPayload, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const update = (name: string, value: string) => {
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name as keyof CreateOrderPayload]) {
      setErrors((er) => ({ ...er, [name]: undefined }));
    }
  };

  // Проверка "поле не пустое" плюс дублирование бизнес-правил из OrderValidator.cs
  // (диапазон веса, число знаков после запятой, дата не в прошлом) — чтобы ошибка
  // была видна сразу, а не только после ответа сервера.
  const validateRequired = () => {
    const errs: Partial<Record<keyof CreateOrderPayload, string>> = {};
    (Object.keys(emptyForm) as (keyof CreateOrderPayload)[]).forEach((k) => {
      if (!String(form[k]).trim()) errs[k] = "Обязательное поле";
    });
    if (errs.cargoWeight) return errs;
    if (errs.cargoPickupDate) return errs;

    const weight = Number(form.cargoWeight.replace(",", "."));
    if (Number.isNaN(weight)) {
      errs.cargoWeight = "Введите число";
    } else if (weight < 0.01 || weight > 100000) {
      errs.cargoWeight = "Вес груза — от 0.01 до 100 000 кг";
    } else {
      const decimals = form.cargoWeight.replace(",", ".").split(".")[1]?.length ?? 0;
      if (decimals > 2) {
        errs.cargoWeight = "Вес груза — не более 2 знаков после запятой";
      }
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const pickupDate = new Date(form.cargoPickupDate + "T00:00:00");
    if (pickupDate < today) {
      errs.cargoPickupDate = "Дата забора груза не может быть в прошлом";
    }

    return errs;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clientErrors = validateRequired();
    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload: CreateOrderPayload = {
        ...form,
        cargoWeight: Number(form.cargoWeight.replace(",", ".")),
      };
      const created = await createOrder(payload);
      onCreated(created);
    } catch (err) {
      if (err instanceof ValidationError) {
        setErrors(err.fieldErrors);
        setSubmitError(err.message);
      } else {
        setSubmitError(err instanceof Error ? err.message : "Не удалось создать заказ");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-card">
      <div className="form-title">Новый заказ на доставку</div>
      <div className="form-subtitle">Все поля обязательны для заполнения.</div>

      <form onSubmit={submit}>
        <div className="form-grid-2">
          <div className="form-section">
            <div className="form-section-label">Отправитель</div>
            <Field name="senderCity" value={form.senderCity} onChange={update} error={errors.senderCity} />
            <Field name="senderAddress" value={form.senderAddress} onChange={update} error={errors.senderAddress} />
          </div>
          <div className="form-section">
            <div className="form-section-label">Получатель</div>
            <Field name="receiverCity" value={form.receiverCity} onChange={update} error={errors.receiverCity} />
            <Field name="receiverAddress" value={form.receiverAddress} onChange={update} error={errors.receiverAddress} />
          </div>
        </div>

        <div className="form-grid-2 form-divider">
          <Field name="cargoWeight" type="number" value={form.cargoWeight} onChange={update} error={errors.cargoWeight} />
          <Field name="cargoPickupDate" type="date" value={form.cargoPickupDate} onChange={update} error={errors.cargoPickupDate} />
        </div>

        {submitError && <div className="status-banner status-banner--error">{submitError}</div>}

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Оформляем…" : "Оформить заказ"}
          </button>
          <button type="button" className="btn-secondary" onClick={onCancel} disabled={submitting}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
