import { useState } from 'react';
import { INITIAL_FORM_STATE } from '../constants/leads.js';

function validate(values) {
  const errors = {};
  if (!values.clientName.trim()) errors.clientName = 'Укажите имя клиента';
  if (!values.phone.trim()) errors.phone = 'Укажите номер телефона';
  else if (values.phone.replace(/\D/g, '').length < 10) errors.phone = 'Введите номер полностью';
  return errors;
}

export function LeadForm({ stages, onSubmit }) {
  const [values, setValues] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const setValue = (event) => {
    const { name, value, checked, type } = event.target;
    setValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSubmit({ ...values, clientName: values.clientName.trim(), phone: values.phone.trim() });
    setValues(INITIAL_FORM_STATE);
  };
  const fieldClass = (name) => `field field-wide${errors[name] ? ' has-error' : ''}`;
  return <section className="lead-form-card" aria-labelledby="form-title">
    <div className="section-label"><span className="section-number">02</span><h2 id="form-title">Новый лид</h2></div>
    <p className="section-description">Поля со звёздочкой обязательны для заполнения.</p>
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <label className={fieldClass('clientName')}><span>Имя клиента <b>*</b></span><input name="clientName" value={values.clientName} onChange={setValue} placeholder="Например, Анна Петрова" autoComplete="name" maxLength="80" /><small className="field-error">{errors.clientName}</small></label>
        <label className={fieldClass('phone')}><span>Номер телефона <b>*</b></span><input name="phone" value={values.phone} onChange={setValue} type="tel" inputMode="tel" placeholder="+7 (999) 123-45-67" autoComplete="tel" maxLength="30" /><small className="field-error">{errors.phone}</small></label>
        <label className="field"><span>Источник</span><select name="source" value={values.source} onChange={setValue}><option>Холодный</option><option>Тёплый</option></select></label>
        <label className="field"><span>Ответственный</span><select name="owner" value={values.owner} onChange={setValue}><option>Лидоруб</option><option>МОП</option></select></label>
        <label className="field field-wide"><span>Этап сделки</span><select name="stage" value={values.stage} onChange={setValue}>{stages.map((stage) => <option key={stage}>{stage}</option>)}</select></label>
        <label className="spec-toggle"><span><strong>Запрошено ТЗ</strong><small>Отметим это в карточке лида</small></span><span className="switch"><input name="specRequested" checked={values.specRequested} onChange={setValue} type="checkbox" aria-label="Запрошено ТЗ" /><i aria-hidden="true" /></span></label>
      </div>
      <button className="primary-button" type="submit"><span>Сохранить</span><span aria-hidden="true">↗</span></button>
    </form>
  </section>;
}
