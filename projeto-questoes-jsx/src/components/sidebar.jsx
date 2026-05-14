// Apex Medicina — Sidebar: lista de questões em rascunho

/**
 * Question status:
 *   'blank'      — no content yet (initial state)
 *   'incomplete' — some content but missing required fields
 *   'ready'      — all required fields filled, ready for review
 */
function questionStatus(q, validate) {
  if (!window.ApexStorage.questionHasAnyContent(q)) return 'blank';
  const { summary } = validate(q);
  return summary.length === 0 ? 'ready' : 'incomplete';
}

const STATUS_META = {
  blank:      { label: 'Em branco',         color: '#94a3b8', bg: '#f1f5f9', short: 'Em branco' },
  incomplete: { label: 'Incompleta',        color: '#b45309', bg: '#fef3c7', short: 'Incompleta' },
  ready:      { label: 'Pronta p/ revisão', color: '#15803d', bg: '#dcfce7', short: 'Pronta' },
};

function questionTitle(q, index) {
  const e = q.enunciado?.trim();
  if (!e) return `Questão ${index + 1}`;
  // first 50 chars or first sentence
  const cut = e.length > 56 ? e.slice(0, 56) + '…' : e;
  return cut;
}

const SidebarQuestion = ({ q, index, active, status, onOpen, onDuplicate, onRemove }) => {
  const meta = STATUS_META[status];
  return (
    <button className={`apex-q-row ${active ? 'active' : ''}`} onClick={onOpen} type="button">
      <span className={`apex-status-dot ${status}`} title={meta.label}/>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontSize: 9.5, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase',
            color: active ? '#A43939' : '#94a3b8',
          }}>
            Q{String(index + 1).padStart(2, '0')}
          </span>
          <span style={{
            fontSize: 9.5, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase',
            color: meta.color, background: meta.bg,
            padding: '2px 7px', borderRadius: 9999,
          }}>
            {meta.short}
          </span>
        </div>
        <div style={{
          fontSize: 13, fontWeight: 600, color: active ? '#0f172a' : '#475569',
          lineHeight: 1.35,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>
          {questionTitle(q, index)}
        </div>
      </div>
      <div className="q-actions" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span className="apex-q-iconbtn" role="button" tabIndex={0}
          onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
          title="Duplicar">
          <Icon name="copy" size={13}/>
        </span>
        <span className="apex-q-iconbtn danger" role="button" tabIndex={0}
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          title="Excluir">
          <Icon name="trash" size={13}/>
        </span>
      </div>
    </button>
  );
};

const Sidebar = ({ questions, currentId, statuses, onSelect, onAdd, onDuplicate, onRemove, onReviewAll, autosaveStatus, autosaveAt }) => {
  const readyCount = Object.values(statuses).filter(s => s === 'ready').length;
  const incompleteCount = Object.values(statuses).filter(s => s === 'incomplete').length;

  const fmt = (t) => {
    if (!t) return 'agora há pouco';
    const s = Math.floor((Date.now() - t) / 1000);
    if (s < 5) return 'agora há pouco';
    if (s < 60) return `há ${s}s`;
    if (s < 3600) return `há ${Math.floor(s/60)} min`;
    return `há ${Math.floor(s/3600)} h`;
  };

  return (
    <aside className="apex-side">
      <div className="apex-side-card">
        <header style={{ paddingBottom: 6, borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#94a3b8' }}>
              Questões em rascunho
            </div>
            <div style={{
              fontSize: 11.5, fontWeight: 800, color: '#0f172a',
              background: '#f1f5f9', padding: '2px 8px', borderRadius: 9999,
            }}>
              {questions.length}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 11, color: '#64748b', fontWeight: 600 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span className="apex-status-dot ready"/> {readyCount} prontas
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span className="apex-status-dot incomplete"/> {incompleteCount} pendentes
            </span>
          </div>
        </header>

        <div className="apex-side-list apex-scroll">
          {questions.map((q, i) => (
            <SidebarQuestion
              key={q.id}
              q={q}
              index={i}
              active={q.id === currentId}
              status={statuses[q.id] || 'blank'}
              onOpen={() => onSelect(q.id)}
              onDuplicate={() => onDuplicate(q.id)}
              onRemove={() => onRemove(q.id)}
            />
          ))}
        </div>

        <button onClick={onAdd} className="apex-btn apex-btn-secondary"
          style={{ width: '100%', justifyContent: 'center', padding: '11px 14px', fontSize: 13 }}>
          <Icon name="plus" size={15}/>
          Adicionar outra questão
        </button>

        <button onClick={onReviewAll} className="apex-btn apex-btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '11px 14px', fontSize: 13 }}>
          <Icon name="eye" size={15}/>
          Revisar {questions.length > 1 ? 'todas' : 'questão'}
          {readyCount < questions.length && (
            <span style={{
              marginLeft: 4, fontSize: 10, fontWeight: 700, background: 'rgba(255,255,255,.2)',
              padding: '2px 6px', borderRadius: 9999, letterSpacing: '.04em',
            }}>{readyCount}/{questions.length}</span>
          )}
        </button>

        {/* Autosave indicator */}
        <div style={{
          marginTop: 4, padding: '8px 10px',
          borderTop: '1px solid #f1f5f9',
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 11, color: '#64748b', fontWeight: 600,
        }}>
          {autosaveStatus === 'saving' ? (
            <>
              <Spinner size={12} color="#A43939"/>
              <span>Salvando…</span>
            </>
          ) : (
            <>
              <Icon name="check" size={11} color="#16a34a" strokeWidth={3}/>
              <span style={{ color: '#475569' }}>Rascunho salvo · {fmt(autosaveAt)}</span>
            </>
          )}
        </div>
        <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500, padding: '0 10px 4px', lineHeight: 1.45 }}>
          Salvo neste navegador. Funciona mesmo sem internet.
        </div>
      </div>
    </aside>
  );
};

/* ────────────────────────────────────────────────────────────
   "Continuar rascunhos?" modal — shown on mount when storage has content
   ──────────────────────────────────────────────────────────── */
const ResumeDraftsModal = ({ open, draftInfo, onContinue, onDiscard }) => {
  if (!open) return null;
  const { count, lastSavedAt } = draftInfo;
  const fmt = (t) => {
    if (!t) return null;
    const d = new Date(t);
    return d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  };
  return (
    <div className="apex-modal-backdrop">
      <div className="apex-modal" style={{ maxWidth: 480 }}>
        <div style={{ padding: '32px 32px 24px', textAlign: 'center' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16, background: '#FCF4F4',
            border: '1px solid #F7E1E1', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 18px',
          }}>
            <Icon name="save" size={28} color="#A43939" strokeWidth={2}/>
          </div>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#A43939', marginBottom: 6 }}>
            Rascunho encontrado
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: '0 0 10px', letterSpacing: '-0.015em' }}>
            Continuar de onde parou?
          </h2>
          <p style={{ fontSize: 14.5, color: '#475569', margin: '0 0 18px', lineHeight: 1.6, fontWeight: 500 }}>
            Encontramos <strong>{count} {count === 1 ? 'questão' : 'questões'}</strong> em rascunho neste navegador.
            {lastSavedAt && <> Última edição em <strong>{fmt(lastSavedAt)}</strong>.</>}
          </p>
          <div style={{
            background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12,
            padding: '12px 14px', fontSize: 12.5, color: '#64748b', fontWeight: 500, marginBottom: 22, textAlign: 'left',
            display: 'flex', gap: 9, alignItems: 'flex-start',
          }}>
            <Icon name="info" size={14} color="#94a3b8" style={{ marginTop: 1, flexShrink: 0 }}/>
            <span>Rascunhos ficam salvos neste navegador. Se descartar, não será possível recuperar.</span>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={onDiscard} className="apex-btn apex-btn-danger">
              <Icon name="trash" size={14}/>
              Descartar rascunhos
            </button>
            <button onClick={onContinue} className="apex-btn apex-btn-primary">
              <Icon name="arrowright" size={14}/>
              Continuar rascunhos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, {
  questionStatus, STATUS_META, questionTitle,
  Sidebar, SidebarQuestion, ResumeDraftsModal,
});
