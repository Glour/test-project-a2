import { useMemo, useState } from 'react';
import { Header } from './components/Header.jsx';
import { LeadForm } from './components/LeadForm.jsx';
import { LeadsList } from './components/LeadsList.jsx';
import { Pipeline } from './components/Pipeline.jsx';
import { QuickStart } from './components/QuickStart.jsx';
import { Toast } from './components/Toast.jsx';
import { STAGES } from './constants/leads.js';
import { useLeads } from './hooks/useLeads.js';

export default function App() {
  const { leads, addLead, updateLeadStage, removeLead } = useLeads();
  const [query, setQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [toast, setToast] = useState('');

  const visibleLeads = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return leads.filter((lead) => {
      const matchesStage = stageFilter === 'all' || lead.stage === stageFilter;
      const matchesQuery = `${lead.clientName} ${lead.phone}`.toLowerCase().includes(normalizedQuery);
      return matchesStage && matchesQuery;
    });
  }, [leads, query, stageFilter]);

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2800);
  };

  const handleAddLead = (lead) => {
    addLead(lead);
    notify('Лид успешно добавлен в базу');
  };

  const handleStageChange = (id, stage) => {
    updateLeadStage(id, stage);
    notify('Этап сделки обновлён');
  };

  const handleDelete = (lead) => {
    if (!window.confirm(`Удалить лида «${lead.clientName}»?`)) return;
    removeLead(lead.id);
    notify('Лид удалён');
  };

  return (
    <main className="app-shell">
      <Header activeLeads={leads.filter((lead) => lead.stage !== 'Отказ').length} />
      <Pipeline leads={leads} stages={STAGES} />

      <section className="workspace-grid">
        <LeadForm stages={STAGES} onSubmit={handleAddLead} />
        <QuickStart />
      </section>

      <LeadsList
        leads={leads}
        visibleLeads={visibleLeads}
        stages={STAGES}
        query={query}
        stageFilter={stageFilter}
        onQueryChange={setQuery}
        onFilterChange={setStageFilter}
        onStageChange={handleStageChange}
        onDelete={handleDelete}
      />
      <Toast message={toast} />
    </main>
  );
}
