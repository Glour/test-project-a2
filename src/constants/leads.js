export const STORAGE_KEY = 'flowly-crm-leads-v1';

export const STAGES = [
  'Новый лид',
  'Квалифицирован',
  'Назначена консультация',
  'Отказ',
];

export const INITIAL_FORM_STATE = {
  clientName: '',
  phone: '',
  source: 'Холодный',
  owner: 'Лидоруб',
  stage: 'Новый лид',
  specRequested: false,
};
