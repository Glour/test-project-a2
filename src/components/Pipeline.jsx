export function Pipeline({ leads, stages }) {
  return <section className="pipeline" aria-labelledby="pipeline-title">
    <div className="section-label"><span className="section-number">01</span><h2 id="pipeline-title">Воронка на сегодня</h2></div>
    <div className="stage-summary">
      {stages.map((stage) => <div className="stage-tile" key={stage}><b>{leads.filter((lead) => lead.stage === stage).length}</b><span>{stage}</span></div>)}
    </div>
  </section>;
}
