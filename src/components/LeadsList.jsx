function initials(name) { return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase(); }
function stageClass(stage) { return ({ 'Квалифицирован': 'stage-qualified', 'Назначена консультация': 'stage-appointment', 'Отказ': 'stage-rejected' })[stage] ?? ''; }

export function LeadsList({ leads, visibleLeads, stages, query, stageFilter, onQueryChange, onFilterChange, onStageChange, onDelete }) {
  return <section className="leads-section" aria-labelledby="leads-title">
    <div className="leads-header"><div className="section-label"><span className="section-number">03</span><h2 id="leads-title">База лидов <span>{leads.length}</span></h2></div>
      <div className="toolbar"><label className="search"><span aria-hidden="true">⌕</span><input type="search" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Поиск по имени или номеру" aria-label="Поиск по лидам" /></label><label className="filter"><span className="sr-only">Фильтр по этапу</span><select value={stageFilter} onChange={(event) => onFilterChange(event.target.value)} aria-label="Фильтр по этапу"><option value="all">Все этапы</option>{stages.map((stage) => <option value={stage} key={stage}>{stage === 'Назначена консультация' ? 'Консультация' : stage}</option>)}</select></label></div>
    </div>
    <div className="leads-list">
      {!visibleLeads.length ? <EmptyState hasLeads={Boolean(leads.length)} /> : visibleLeads.map((lead) => <LeadCard key={lead.id} lead={lead} stages={stages} onStageChange={onStageChange} onDelete={onDelete} />)}
    </div>
  </section>;
}

function EmptyState({ hasLeads }) { return <div className="empty-state"><strong>{hasLeads ? 'Ничего не найдено' : 'База лидов пока пуста'}</strong>{hasLeads ? 'Попробуйте изменить поисковый запрос или фильтр.' : 'Добавьте первого клиента через форму выше.'}</div>; }
function LeadCard({ lead, stages, onStageChange, onDelete }) { return <article className="lead-card"><div className="lead-identity"><span className="avatar">{initials(lead.clientName)}</span><div><h3 className="lead-name">{lead.clientName}</h3><p className="phone">{lead.phone}</p></div></div><div className="meta-pair"><small>Источник</small><span>{lead.source}</span></div><div className="meta-pair"><small>Ответственный</small><span>{lead.owner}</span>{lead.specRequested && <i className="spec-badge">ТЗ запрошено</i>}</div><select className={`stage-select ${stageClass(lead.stage)}`} value={lead.stage} onChange={(event) => onStageChange(lead.id, event.target.value)} aria-label={`Изменить этап сделки для ${lead.clientName}`}>{stages.map((stage) => <option key={stage}>{stage}</option>)}</select><div className="lead-actions"><button className="delete-button" type="button" onClick={() => onDelete(lead)} aria-label={`Удалить лида ${lead.clientName}`} title="Удалить лида">×</button></div></article>; }
