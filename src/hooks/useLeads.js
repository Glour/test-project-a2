import { useEffect, useState } from 'react';
import { STORAGE_KEY } from '../constants/leads.js';

function readLeads() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

export function useLeads() {
  const [leads, setLeads] = useState(readLeads);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  }, [leads]);

  const addLead = (lead) => setLeads((current) => [{ ...lead, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...current]);
  const updateLeadStage = (id, stage) => setLeads((current) => current.map((lead) => lead.id === id ? { ...lead, stage } : lead));
  const removeLead = (id) => setLeads((current) => current.filter((lead) => lead.id !== id));

  return { leads, addLead, updateLeadStage, removeLead };
}
