// ---------- ХРАНЕНИЕ ДАННЫХ ----------
// localStorage делает данные устойчивыми к обновлению страницы без сервера.
const STORAGE_KEY = 'flowly-crm-leads-v1';
const STAGES = ['Новый лид', 'Квалифицирован', 'Назначена консультация', 'Отказ'];
const form = document.querySelector('#lead-form');
const leadsList = document.querySelector('#leads-list');
const countElement = document.querySelector('#leads-count');
const totalElement = document.querySelector('#hero-total');
const summaryElement = document.querySelector('#stage-summary');
const searchInput = document.querySelector('#lead-search');
const filterSelect = document.querySelector('#stage-filter');
const toast = document.querySelector('#toast');
let toastTimer;

function getLeads() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; } }
function saveLeads(leads) { localStorage.setItem(STORAGE_KEY, JSON.stringify(leads)); }
function escapeHtml(value) { const element = document.createElement('span'); element.textContent = value; return element.innerHTML; }
function initials(name) { return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase(); }
function stageClass(stage) { return ({ 'Квалифицирован':'stage-qualified', 'Назначена консультация':'stage-appointment', 'Отказ':'stage-rejected' })[stage] || ''; }
function showToast(message) { clearTimeout(toastTimer); toast.textContent = message; toast.classList.add('show'); toastTimer = setTimeout(() => toast.classList.remove('show'), 2800); }

// ---------- ИНТЕРФЕЙС ----------
function renderSummary(leads) {
  summaryElement.innerHTML = STAGES.map((stage) => `<div class="stage-tile"><b>${leads.filter((lead) => lead.stage === stage).length}</b><span>${stage}</span></div>`).join('');
}
function renderLeads() {
  const leads = getLeads();
  const query = searchInput.value.trim().toLowerCase();
  const stage = filterSelect.value;
  const visibleLeads = leads.filter((lead) => (stage === 'all' || lead.stage === stage) && `${lead.clientName} ${lead.phone}`.toLowerCase().includes(query));
  countElement.textContent = leads.length;
  totalElement.textContent = leads.filter((lead) => lead.stage !== 'Отказ').length;
  renderSummary(leads);
  if (!visibleLeads.length) {
    leadsList.innerHTML = `<div class="empty-state"><strong>${leads.length ? 'Ничего не найдено' : 'База лидов пока пуста'}</strong>${leads.length ? 'Попробуйте изменить поисковый запрос или фильтр.' : 'Добавьте первого клиента через форму выше.'}</div>`;
    return;
  }
  leadsList.innerHTML = visibleLeads.map((lead) => `<article class="lead-card" data-id="${lead.id}">
    <div class="lead-identity"><span class="avatar">${escapeHtml(initials(lead.clientName))}</span><div><h3 class="lead-name">${escapeHtml(lead.clientName)}</h3><p class="phone">${escapeHtml(lead.phone)}</p></div></div>
    <div class="meta-pair"><small>Источник</small><span>${escapeHtml(lead.source)}</span></div>
    <div class="meta-pair"><small>Ответственный</small><span>${escapeHtml(lead.owner)}</span>${lead.specRequested ? '<i class="spec-badge">ТЗ запрошено</i>' : ''}</div>
    <select class="stage-select ${stageClass(lead.stage)}" aria-label="Изменить этап сделки для ${escapeHtml(lead.clientName)}">${STAGES.map((item) => `<option value="${item}" ${item === lead.stage ? 'selected' : ''}>${item}</option>`).join('')}</select>
    <div class="lead-actions"><button class="delete-button" type="button" aria-label="Удалить лида ${escapeHtml(lead.clientName)}" title="Удалить лида">×</button></div>
  </article>`).join('');
}

// ---------- ВАЛИДАЦИЯ И СОЗДАНИЕ ЛИДА ----------
function setFieldError(fieldName, message) { const input = form.elements[fieldName]; input.closest('.field').classList.toggle('has-error', Boolean(message)); document.querySelector(`[data-error-for="${fieldName}"]`).textContent = message; }
function validate(data) {
  const name = data.get('clientName').trim(); const phone = data.get('phone').trim();
  setFieldError('clientName', name ? '' : 'Укажите имя клиента');
  setFieldError('phone', !phone ? 'Укажите номер телефона' : phone.replace(/\D/g, '').length < 10 ? 'Введите номер полностью' : '');
  return Boolean(name && phone.replace(/\D/g, '').length >= 10);
}
form.addEventListener('submit', (event) => {
  event.preventDefault(); const data = new FormData(form);
  if (!validate(data)) { document.querySelector('#form-error').textContent = 'Проверьте обязательные поля.'; return; }
  const leads = getLeads();
  leads.unshift({ id: crypto.randomUUID(), clientName:data.get('clientName').trim(), phone:data.get('phone').trim(), source:data.get('source'), owner:data.get('owner'), stage:data.get('stage'), specRequested:data.get('specRequested') === 'on', createdAt:new Date().toISOString() });
  saveLeads(leads); form.reset(); document.querySelector('#form-error').textContent = ''; renderLeads(); showToast('Лид успешно добавлен в базу');
});
form.addEventListener('input', (event) => { if (['clientName','phone'].includes(event.target.name)) setFieldError(event.target.name, ''); });

// Дополнительное задание: этап можно изменить непосредственно в карточке.
leadsList.addEventListener('change', (event) => {
  if (!event.target.matches('.stage-select')) return;
  const id = event.target.closest('.lead-card').dataset.id;
  saveLeads(getLeads().map((lead) => lead.id === id ? { ...lead, stage:event.target.value } : lead)); renderLeads(); showToast('Этап сделки обновлён');
});
leadsList.addEventListener('click', (event) => {
  if (!event.target.matches('.delete-button')) return;
  const card = event.target.closest('.lead-card'); const lead = getLeads().find((item) => item.id === card.dataset.id);
  if (!window.confirm(`Удалить лида «${lead.clientName}»?`)) return;
  saveLeads(getLeads().filter((item) => item.id !== card.dataset.id)); renderLeads(); showToast('Лид удалён');
});
searchInput.addEventListener('input', renderLeads); filterSelect.addEventListener('change', renderLeads);
document.querySelector('#today').textContent = new Intl.DateTimeFormat('ru-RU', { day:'numeric', month:'long', year:'numeric' }).format(new Date());
renderLeads();
