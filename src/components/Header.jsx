export function Header({ activeLeads }) {
  const today = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());

  return <>
    <header className="topbar">
      <a className="brand" href="#top" aria-label="Flowly CRM, главная"><span className="brand-mark">F</span><span>flowly</span></a>
      <div className="topbar-meta"><span className="status-dot" />Все изменения сохранены</div>
      <time className="today">{today}</time>
    </header>
    <section id="top" className="hero" aria-labelledby="page-title">
      <div><p className="kicker">Workspace / Продажи</p><h1 id="page-title">Лиды,<br /><em>которые не теряются.</em></h1><p className="hero-copy">Добавляйте обращения за секунды, ведите их по воронке и возвращайтесь к работе ровно с того же места.</p></div>
      <div className="hero-stat" aria-label="Количество лидов в работе"><span className="hero-stat-value">{activeLeads}</span><span>лидов в работе</span><div className="mini-bars" aria-hidden="true"><i /><i /><i /><i /></div></div>
    </section>
  </>;
}
