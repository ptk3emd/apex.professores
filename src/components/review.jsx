// Apex Medicina — Criar questão autoral · Review (batch) + Send states

import React from 'react';
import { Icon } from './icons.jsx';

/* ────────────────────────────────────────────────────────────
   Sheet column order (matches Google Sheets target)
   ──────────────────────────────────────────────────────────── */

export const SHEET_COLUMNS = [
  'id','categoria','especialidade','tema_especifico','competencias','ano','origem',
  'enunciado','a','b','c','d','e','correta',
  'comentario','justificativa_a','justificativa_b','justificativa_c','justificativa_d','justificativa_e',
];

export function buildSheetRow(q, generatedId) {
  const isVF = q.type === 'vf';
  const isME4 = q.type === 'me4';
  const altByLetter = (letter) => q.alternatives.find(a => a.id === letter);
  const altText = (letter) => {
    if (isVF) {
      if (letter === 'A') return 'Verdadeiro';
      if (letter === 'B') return 'Falso';
      return '';
    }
    if (isME4 && letter === 'E') return '';
    return altByLetter(letter)?.text || '';
  };
  const altJust = (letter) => {
    if (isVF) {
      if (letter === 'A') return altByLetter('A')?.justification || '';
      if (letter === 'B') return altByLetter('B')?.justification || '';
      return '';
    }
    if (isME4 && letter === 'E') return '';
    return altByLetter(letter)?.justification || '';
  };
  const correctLetter = q.alternatives.find(a => a.isCorrect)?.id || '';
  const competenciaText = q.competencia === 'Outro mais específico'
    ? (q.competenciaOutro?.trim() || 'Outro mais específico')
    : q.competencia;
  const origemText = q.origem === 'Outro'
    ? (q.origemOutro?.trim() || 'Outro')
    : q.origem;
  return {
    id: generatedId,
    categoria: q.categoria,
    especialidade: q.especialidade,
    tema_especifico: q.tema,
    competencias: competenciaText,
    ano: q.ano || '',
    origem: origemText || '',
    enunciado: q.enunciado,
    a: altText('A'),
    b: altText('B'),
    c: altText('C'),
    d: altText('D'),
    e: altText('E'),
    correta: correctLetter,
    comentario: q.comentario,
    justificativa_a: altJust('A'),
    justificativa_b: altJust('B'),
    justificativa_c: altJust('C'),
    justificativa_d: altJust('D'),
    justificativa_e: altJust('E'),
  };
}

export function truncate(str, n = 70) {
  if (!str) return '';
  return str.length > n ? str.slice(0, n - 1) + '…' : str;
}

/* ────────────────────────────────────────────────────────────
   Student preview (single question) — quiz-like
   ──────────────────────────────────────────────────────────── */

export const StudentPreview = ({ state, compact }) => {
  const isVF = state.type === 'vf';
  const isME4 = state.type === 'me4';
  const visibleAlts = isVF
    ? state.alternatives.slice(0, 2)
    : state.alternatives.slice(0, isME4 ? 4 : 5);

  const cat = window.CATEGORIES.find(c => c.code === state.categoria);
  return (
    <div style={{
      background:'#f6f5f4', borderRadius:14, padding: compact ? '20px 22px' : '26px 28px',
      border:'1px solid #ececea', position:'relative',
    }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14, gap:10, flexWrap:'wrap' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
          {cat && (
            <span style={{
              fontSize:10, fontWeight:700, color: cat.accent, background:cat.soft,
              border:`1px solid ${cat.accent}33`,
              padding:'4px 10px', borderRadius:9999, letterSpacing:'.08em', textTransform:'uppercase',
            }}>
              {cat.code} · {state.especialidade || '—'}
            </span>
          )}
          {state.tema && (
            <span style={{ fontSize:11, fontWeight:600, color:'#64748b' }}>
              {state.tema}
            </span>
          )}
        </div>
        <div style={{ fontSize:11, color:'#94a3b8', fontWeight:600 }}>
          {state.origem === 'Outro' ? (state.origemOutro?.trim() || 'Autoral') : (state.origem || 'Autoral')}
        </div>
      </div>

      <div style={{
        fontSize: compact ? 15 : 16, lineHeight:1.7, color:'#0f172a', whiteSpace:'pre-wrap',
        fontWeight:500, letterSpacing:'-0.005em',
      }}>
        {state.enunciado || <span style={{ color:'#94a3b8', fontStyle:'italic' }}>(Enunciado vazio)</span>}
      </div>

      {state.image && (
        <div style={{ marginTop:12 }}>
          <img src={state.image.url} alt={state.imageCaption || ''}
            style={{ maxWidth:'100%', borderRadius:10, border:'1px solid #ececea' }}/>
          {state.imageCaption && (
            <div style={{ fontSize:12, color:'#64748b', marginTop:6, fontStyle:'italic', textAlign:'center' }}>
              {state.imageCaption}
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop:18, display:'flex', flexDirection:'column', gap:8 }}>
        {visibleAlts.map(a => (
          <div key={a.id} style={{
            display:'flex', gap:12, alignItems:'flex-start',
            padding:'11px 14px',
            background:'white',
            borderRadius:11,
            border: a.isCorrect ? '1.5px solid #16a34a' : '1.5px solid #ececea',
            boxShadow: a.isCorrect ? '0 4px 14px -6px rgba(22,163,74,.3)' : 'none',
          }}>
            <div style={{
              flexShrink:0,
              width:26, height:26, borderRadius:9999,
              background: a.isCorrect ? '#16a34a' : '#f1f5f9',
              color: a.isCorrect ? 'white' : '#475569',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontWeight:900, fontSize:12,
            }}>
              {a.isCorrect ? <Icon name="check" size={13} strokeWidth={3}/> : a.id}
            </div>
            <div style={{ flex:1, fontSize: compact ? 13.5 : 14.5, color:'#0f172a', lineHeight:1.5, fontWeight:500, paddingTop:3 }}>
              {isVF ? a.text : (a.text || <span style={{ color:'#cbd5e1', fontStyle:'italic' }}>Texto vazio</span>)}
            </div>
            {a.isCorrect && (
              <span style={{
                fontSize:9, fontWeight:700, color:'#15803d',
                background:'#dcfce7', padding:'3px 8px', borderRadius:9999,
                letterSpacing:'.08em', textTransform:'uppercase', alignSelf:'center',
              }}>
                Gabarito
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ────────────────────────────────────────────────────────────
   Pending list — per-question issues
   ──────────────────────────────────────────────────────────── */

export const PendingList = ({ items, questionLabel }) => (
  <div style={{
    background:'#fffbeb', border:'1px solid #fde68a', borderRadius:12,
    padding:'12px 14px', display:'flex', gap:11, alignItems:'flex-start',
  }}>
    <Icon name="alerttri" size={16} color="#b45309" strokeWidth={2.2} style={{ marginTop:2, flexShrink:0 }}/>
    <div style={{ minWidth:0 }}>
      <div style={{ fontSize:12.5, fontWeight:700, color:'#78350f', marginBottom:4 }}>
        {questionLabel || 'Pendências'}:
      </div>
      <ul style={{ margin:0, paddingLeft:18, fontSize:12.5, color:'#92400e', lineHeight:1.6, fontWeight:500 }}>
        {items.map((e, i) => <li key={i}>{e}</li>)}
      </ul>
    </div>
  </div>
);

/* ────────────────────────────────────────────────────────────
   Compact per-question review card
   ──────────────────────────────────────────────────────────── */

export const QuestionReviewCard = ({ q, index, status, pending, generatedId, onEdit, onRemove, showPending }) => {
  const meta = STATUS_META[status];
  const cat = window.CATEGORIES.find(c => c.code === q.categoria);
  const hasJustifications = q.alternatives.some(a => a.justification?.trim());
  return (
    <article className="apex-card apex-enter" style={{ padding:'24px 28px' }}>
      {/* Header */}
      <header style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:14, marginBottom:18, flexWrap:'wrap' }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div style={{
            width:40, height:40, borderRadius:10,
            background: status === 'ready' ? '#dcfce7' : status === 'incomplete' ? '#fef3c7' : '#f1f5f9',
            color: status === 'ready' ? '#15803d' : status === 'incomplete' ? '#b45309' : '#64748b',
            border:`1.5px solid ${status === 'ready' ? '#bbf7d0' : status === 'incomplete' ? '#fde68a' : '#e2e8f0'}`,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontWeight:900, fontSize:13.5, letterSpacing:'.02em',
          }}>
            {String(index + 1).padStart(2, '0')}
          </div>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
              <span style={{ fontSize:10, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'#94a3b8' }}>
                Questão {String(index + 1).padStart(2, '0')}
              </span>
              <span style={{
                fontSize:10, fontWeight:700, letterSpacing:'.06em', textTransform:'uppercase',
                color: meta.color, background: meta.bg,
                padding:'3px 8px', borderRadius:9999,
              }}>
                {meta.label}
              </span>
              <span style={{ fontSize:10, fontWeight:600, color:'#94a3b8', fontFamily:'ui-monospace, monospace' }}>
                {generatedId}
              </span>
            </div>
            <h3 style={{ fontSize:16, fontWeight:700, color:'#0f172a', margin:0, letterSpacing:'-0.005em' }}>
              {q.tema || <span style={{ color:'#94a3b8' }}>Sem tema definido</span>}
            </h3>
            <div style={{ fontSize:12, color:'#64748b', marginTop:2, fontWeight:500 }}>
              {cat ? `${cat.code} · ${cat.label}` : '— sem categoria —'}
              {q.especialidade && <> · {q.especialidade}</>}
              {q.competencia && <> · {q.competencia === 'Outro mais específico' ? (q.competenciaOutro || 'Outro') : q.competencia}</>}
            </div>
          </div>
        </div>

        <div style={{ display:'flex', gap:8 }}>
          <button onClick={onEdit} className="apex-btn apex-btn-secondary" style={{ padding:'8px 12px', fontSize:12.5 }}>
            <Icon name="edit" size={13}/>
            Editar
          </button>
          <button onClick={onRemove} className="apex-btn apex-btn-danger" style={{ padding:'8px 12px', fontSize:12.5 }}>
            <Icon name="trash" size={13}/>
            Remover
          </button>
        </div>
      </header>

      {showPending && pending.length > 0 && (
        <div style={{ marginBottom:16 }}>
          <PendingList items={pending} questionLabel="Para enviar esta questão, ajuste"/>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1.1fr) minmax(0,1fr)', gap:18 }}>
        <div>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'#94a3b8', marginBottom:8 }}>
            Como o aluno verá
          </div>
          <StudentPreview state={q} compact/>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* Comentário */}
          <div style={{ background:'#fafaf8', border:'1px solid #ececea', borderRadius:12, padding:'14px 16px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:6 }}>
              <Icon name="sparkles" size={13} color="#A43939"/>
              <span style={{ fontSize:10, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'#475569' }}>Comentário geral</span>
            </div>
            <div style={{ fontSize:13, color:'#0f172a', lineHeight:1.6, fontWeight:500, whiteSpace:'pre-wrap' }}>
              {q.comentario || <span style={{ color:'#cbd5e1', fontStyle:'italic' }}>(vazio)</span>}
            </div>
          </div>

          {/* Justifications — only shown if any */}
          <div style={{ background:'#fafaf8', border:'1px solid #ececea', borderRadius:12, padding:'14px 16px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
              <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                <Icon name="bookopen" size={13} color="#A43939"/>
                <span style={{ fontSize:10, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'#475569' }}>Justificativas</span>
              </div>
              {!hasJustifications && (
                <span style={{ fontSize:9.5, fontWeight:700, color:'#94a3b8', letterSpacing:'.08em', textTransform:'uppercase' }}>
                  nenhuma preenchida
                </span>
              )}
            </div>
            {hasJustifications ? (
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                {q.alternatives.filter(a => a.justification?.trim()).map(a => (
                  <div key={a.id} style={{ display:'flex', gap:8, fontSize:12.5, lineHeight:1.55, color:'#0f172a' }}>
                    <span style={{
                      flexShrink:0, width:20, height:20, borderRadius:6,
                      background: a.isCorrect ? '#A43939' : 'white',
                      color: a.isCorrect ? 'white' : '#475569',
                      border: a.isCorrect ? 'none' : '1px solid #e2e8f0',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontWeight:900, fontSize:10,
                    }}>{a.id}</span>
                    <span style={{ flex:1, fontWeight:500 }}>{a.justification}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize:12.5, color:'#94a3b8', fontStyle:'italic' }}>
                Justificativas são opcionais — você pode preenchê-las depois.
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

/* ────────────────────────────────────────────────────────────
   Multi-row sheet preview
   ──────────────────────────────────────────────────────────── */

export const BatchSheetPreview = ({ rows, types }) => {
  const showCount = rows.length;
  return (
    <div className="apex-card" style={{ padding:'24px 26px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6, flexWrap:'wrap' }}>
        <div style={{ width:32, height:32, borderRadius:8, background:'#dcfce7', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Icon name="sheet" size={16} color="#15803d" strokeWidth={2.2}/>
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <h3 style={{ fontSize:15, fontWeight:700, color:'#0f172a', margin:0 }}>Prévia · {showCount} {showCount === 1 ? 'linha' : 'linhas'} para o Google Sheets</h3>
          <div style={{ fontSize:12, color:'#64748b', marginTop:2, fontWeight:500 }}>
            Cada questão vira uma linha na ordem exata das colunas.
          </div>
        </div>
        <span style={{
          fontSize:10, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase',
          color:'#A43939', background:'#FCF4F4', border:'1px solid #F7E1E1',
          padding:'5px 10px', borderRadius:9999,
        }}>
          {SHEET_COLUMNS.length} colunas
        </span>
      </div>

      <div className="apex-scroll" style={{ overflowX:'auto', marginTop:18, border:'1px solid #e2e8f0', borderRadius:12, maxHeight:280, overflowY:'auto' }}>
        <table className="apex-table" style={{ minWidth: 1700 }}>
          <thead style={{ position:'sticky', top:0 }}>
            <tr>
              {SHEET_COLUMNS.map(col => (
                <th key={col} style={{
                  width: ['enunciado','comentario'].includes(col) ? 220
                    : col.startsWith('justificativa_') ? 160
                    : col === 'correta' ? 70
                    : col === 'ano' ? 64
                    : ['a','b','c','d','e'].includes(col) ? 130
                    : col === 'id' ? 110
                    : 120,
                }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {SHEET_COLUMNS.map(col => {
                  const isCorrectCell = col === 'correta';
                  const isEmpty = (col === 'e' && (types[ri] === 'vf' || types[ri] === 'me4')) ||
                                  (['c','d'].includes(col) && types[ri] === 'vf');
                  return (
                    <td key={col} className={isCorrectCell ? 'correta-cell' : ''}
                      style={isEmpty ? { background:'#f8fafc', color:'#cbd5e1', fontStyle:'italic' } : {}}>
                      {isEmpty ? '— vazia —' : (truncate(String(row[col] ?? ''), 90) || <span style={{ color:'#cbd5e1' }}>—</span>)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop:12, fontSize:11.5, color:'#64748b', display:'flex', gap:14, flexWrap:'wrap' }}>
        <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
          <span style={{ width:12, height:12, background:'#fef3c7', border:'1px solid #fde68a', borderRadius:3 }}/> Coluna de gabarito
        </span>
        <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
          <span style={{ width:12, height:12, background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:3 }}/> Coluna vazia (formato não exige)
        </span>
      </div>
    </div>
  );
};

/* ────────────────────────────────────────────────────────────
   Batch Review Screen
   ──────────────────────────────────────────────────────────── */

export const BatchReviewScreen = ({ questions, generatedIds, statuses, pending, onEdit, onRemove, onBack, onSendAll, onSendCompletesOnly, showPending }) => {
  const completesIds = questions.filter(q => statuses[q.id] === 'ready').map(q => q.id);
  const completes = completesIds.length;
  const incompletes = questions.length - completes;
  const canSendAll = incompletes === 0;
  const rowsForSheet = questions.filter(q => statuses[q.id] === 'ready')
    .map(q => buildSheetRow(q, generatedIds[q.id]));
  const typesForSheet = questions.filter(q => statuses[q.id] === 'ready').map(q => q.type);

  return (
    <div className="apex-enter" style={{ display:'flex', flexDirection:'column', gap:20 }}>

      {/* Header */}
      <div className="apex-card" style={{ padding:'24px 30px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:18, flexWrap:'wrap' }}>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <button onClick={onBack} className="apex-btn apex-btn-secondary" style={{ padding:'10px 14px' }}>
              <Icon name="chevronleft" size={15}/> Voltar e editar
            </button>
            <div>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'#94a3b8' }}>
                Etapa 03 · Revisão em lote
              </div>
              <h2 style={{ fontSize:22, fontWeight:900, color:'#0f172a', margin:'4px 0 0', letterSpacing:'-0.01em' }}>
                Revisar antes de enviar
              </h2>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>
            <div style={{ display:'flex', gap:18 }}>
              <div>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'#94a3b8' }}>Prontas</div>
                <div style={{ fontSize:20, fontWeight:900, color:'#15803d', lineHeight:1.1, marginTop:2 }}>{completes}</div>
              </div>
              <div>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'#94a3b8' }}>Pendentes</div>
                <div style={{ fontSize:20, fontWeight:900, color: incompletes ? '#b45309' : '#94a3b8', lineHeight:1.1, marginTop:2 }}>{incompletes}</div>
              </div>
              <div>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'#94a3b8' }}>Total</div>
                <div style={{ fontSize:20, fontWeight:900, color:'#0f172a', lineHeight:1.1, marginTop:2 }}>{questions.length}</div>
              </div>
            </div>
            {canSendAll ? (
              <button onClick={onSendAll} className="apex-btn apex-btn-primary" style={{ padding:'12px 22px' }}>
                <Icon name="send" size={15}/>
                Enviar {questions.length > 1 ? `${questions.length} questões` : 'questão'}
              </button>
            ) : (
              <button onClick={onSendCompletesOnly} className="apex-btn apex-btn-primary"
                style={{ padding:'12px 22px' }}
                disabled={completes === 0}>
                <Icon name="send" size={15}/>
                Enviar {completes} {completes === 1 ? 'completa' : 'completas'}
              </button>
            )}
          </div>
        </div>

        {/* Pending banner — appears only when user tried to send */}
        {showPending && incompletes > 0 && (
          <div style={{
            marginTop:18, padding:'14px 18px',
            background:'#fffbeb', border:'1px solid #fde68a', borderRadius:12,
            display:'flex', gap:12, alignItems:'flex-start',
          }}>
            <Icon name="alerttri" size={18} color="#b45309" strokeWidth={2.2} style={{ marginTop:2, flexShrink:0 }}/>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:800, color:'#78350f', marginBottom:4 }}>
                {incompletes} {incompletes === 1 ? 'questão precisa' : 'questões precisam'} de ajustes antes do envio
              </div>
              <div style={{ fontSize:13, color:'#92400e', fontWeight:500, lineHeight:1.55 }}>
                Você pode <strong>enviar apenas as {completes} completas</strong> agora e completar as outras depois, ou voltar para preenchê-las.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Questions list */}
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        {questions.map((q, i) => (
          <QuestionReviewCard
            key={q.id}
            q={q}
            index={i}
            status={statuses[q.id]}
            pending={pending[q.id] || []}
            generatedId={generatedIds[q.id]}
            onEdit={() => onEdit(q.id)}
            onRemove={() => onRemove(q.id)}
            showPending={showPending}
          />
        ))}
      </div>

      {/* Sheet preview — only for completes */}
      {rowsForSheet.length > 0 && (
        <BatchSheetPreview rows={rowsForSheet} types={typesForSheet}/>
      )}

      {/* Footer actions */}
      <div className="apex-card" style={{
        padding:'22px 30px', display:'flex', alignItems:'center', justifyContent:'space-between',
        gap:14, flexWrap:'wrap', position:'sticky', bottom:16, zIndex:10,
        boxShadow:'0 14px 30px -10px rgba(15,23,42,.12), 0 4px 10px -4px rgba(15,23,42,.06)',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, color:'#64748b', fontSize:13, fontWeight:500 }}>
          <Icon name="info" size={16}/>
          <span>Após o envio, as questões entram na fila de revisão pedagógica antes do banco oficial.</span>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onBack} className="apex-btn apex-btn-secondary">
            <Icon name="edit" size={15}/> Voltar e editar
          </button>
          {canSendAll ? (
            <button onClick={onSendAll} className="apex-btn apex-btn-primary">
              <Icon name="send" size={15}/>
              Enviar {questions.length > 1 ? `${questions.length} questões` : 'questão'}
            </button>
          ) : (
            <button onClick={onSendCompletesOnly} className="apex-btn apex-btn-primary"
              disabled={completes === 0}>
              <Icon name="send" size={15}/>
              Enviar {completes} {completes === 1 ? 'completa' : 'completas'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ────────────────────────────────────────────────────────────
   Send states — sending, success (offer clear drafts), error
   ──────────────────────────────────────────────────────────── */

export const SendingPanel = ({ count }) => (
  <div className="apex-card apex-enter" style={{ padding:'56px 32px', textAlign:'center', maxWidth:560, margin:'40px auto' }}>
    <div style={{
      width:72, height:72, borderRadius:9999, background:'#FCF4F4',
      border:'1px solid #F7E1E1', display:'flex', alignItems:'center', justifyContent:'center',
      margin:'0 auto 22px',
    }}>
      <Spinner size={32} color="#A43939"/>
    </div>
    <h2 style={{ fontSize:22, fontWeight:900, color:'#0f172a', margin:'0 0 8px', letterSpacing:'-0.01em' }}>
      Enviando {count} {count === 1 ? 'questão' : 'questões'}…
    </h2>
    <p style={{ fontSize:14, color:'#64748b', margin:'0 0 24px', fontWeight:500, lineHeight:1.6 }}>
      Estamos gravando no Google Sheets e disparando a fila de revisão pedagógica.
    </p>
    <div style={{ display:'flex', flexDirection:'column', gap:8, fontSize:12.5, color:'#475569', fontWeight:500 }}>
      {[
        ['Validando estrutura das linhas', true],
        ['Autenticando no Google Sheets', true],
        [`Anexando ${count} ${count === 1 ? 'linha' : 'linhas'} à fila de revisão`, false],
      ].map(([label, done], i) => (
        <div key={i} style={{ display:'flex', alignItems:'center', gap:10, justifyContent:'center' }}>
          {done ? <Icon name="check" size={14} color="#16a34a" strokeWidth={3}/> : <Spinner size={14} color="#A43939"/>}
          <span style={{ color: done ? '#0f172a' : '#64748b' }}>{label}</span>
        </div>
      ))}
    </div>
  </div>
);

export const SuccessPanel = ({ sentIds, remainingCount, onNew, onClearSent, onContinue }) => {
  const count = sentIds.length;
  return (
    <div className="apex-card apex-enter" style={{ padding:'48px 32px', textAlign:'center', maxWidth:620, margin:'40px auto' }}>
      <div style={{
        width:84, height:84, borderRadius:9999, background:'#dcfce7',
        border:'1px solid #bbf7d0', display:'flex', alignItems:'center', justifyContent:'center',
        margin:'0 auto 22px',
        boxShadow:'0 8px 28px -10px rgba(22,163,74,.4)',
      }}>
        <Icon name="check" size={42} color="#15803d" strokeWidth={2.5}/>
      </div>
      <div style={{ fontSize:10.5, fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', color:'#15803d', marginBottom:6 }}>
        Sucesso · enviado para revisão
      </div>
      <h2 style={{ fontSize:24, fontWeight:900, color:'#0f172a', margin:'0 0 8px', letterSpacing:'-0.015em' }}>
        {count === 1 ? 'Questão enviada para revisão com sucesso.' : `${count} questões enviadas para revisão com sucesso.`}
      </h2>
      <p style={{ fontSize:14.5, color:'#64748b', margin:'0 auto 22px', fontWeight:500, lineHeight:1.6, maxWidth:480 }}>
        {count === 1 ? 'Sua contribuição agora' : 'Suas contribuições agora'} aguardam revisão pedagógica. Você receberá uma notificação quando forem publicadas no banco oficial.
      </p>

      <div style={{
        background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:12,
        padding:'12px 18px', marginBottom:24,
        display:'flex', flexWrap:'wrap', justifyContent:'center', alignItems:'center', gap:10,
      }}>
        <span style={{ fontSize:10, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'#94a3b8' }}>
          IDs enviados
        </span>
        {sentIds.slice(0, 4).map(id => (
          <span key={id} style={{
            fontFamily:'ui-monospace, monospace', fontSize:11.5, fontWeight:700, color:'#0f172a',
            background:'white', border:'1px solid #e2e8f0', padding:'3px 9px', borderRadius:6,
          }}>{id}</span>
        ))}
        {sentIds.length > 4 && (
          <span style={{ fontSize:11.5, color:'#64748b', fontWeight:600 }}>+ {sentIds.length - 4} outros</span>
        )}
      </div>

      {remainingCount > 0 && (
        <div style={{
          background:'#FCF4F4', border:'1px solid #F7E1E1', borderRadius:12,
          padding:'14px 18px', marginBottom:22, textAlign:'left',
          display:'flex', gap:11, alignItems:'flex-start', maxWidth:520, margin:'0 auto 22px',
        }}>
          <Icon name="info" size={16} color="#A43939" style={{ marginTop:2, flexShrink:0 }}/>
          <div style={{ fontSize:13, color:'#7f1d1d', fontWeight:600, lineHeight:1.55 }}>
            Você ainda tem <strong>{remainingCount}</strong> {remainingCount === 1 ? 'questão incompleta' : 'questões incompletas'} no rascunho. Elas continuam salvas neste navegador.
          </div>
        </div>
      )}

      <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
        {remainingCount > 0 ? (
          <button onClick={onContinue} className="apex-btn apex-btn-secondary">
            <Icon name="arrowright" size={15}/>
            Continuar editando rascunhos
          </button>
        ) : (
          <button onClick={onClearSent} className="apex-btn apex-btn-secondary">
            <Icon name="trash" size={15}/>
            Limpar rascunhos enviados
          </button>
        )}
        <button onClick={onNew} className="apex-btn apex-btn-primary">
          <Icon name="plus" size={15}/>
          Criar nova questão
        </button>
      </div>
    </div>
  );
};

export const ErrorPanel = ({ onRetry, onBack }) => (
  <div className="apex-card apex-enter" style={{ padding:'48px 32px', textAlign:'center', maxWidth:560, margin:'40px auto' }}>
    <div style={{
      width:80, height:80, borderRadius:9999, background:'#fef2f2',
      border:'1px solid #fecaca', display:'flex', alignItems:'center', justifyContent:'center',
      margin:'0 auto 22px',
    }}>
      <Icon name="alerttri" size={36} color="#dc2626" strokeWidth={2}/>
    </div>
    <div style={{ fontSize:10.5, fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', color:'#dc2626', marginBottom:6 }}>
      Erro · tente novamente
    </div>
    <h2 style={{ fontSize:22, fontWeight:900, color:'#0f172a', margin:'0 0 8px', letterSpacing:'-0.01em' }}>
      Não foi possível enviar para a planilha.
    </h2>
    <p style={{ fontSize:14, color:'#64748b', margin:'0 auto 26px', fontWeight:500, lineHeight:1.6, maxWidth:440 }}>
      Verifique sua conexão e tente novamente. Seus rascunhos continuam salvos neste navegador — nada foi perdido.
    </p>
    <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
      <button onClick={onBack} className="apex-btn apex-btn-secondary">
        <Icon name="chevronleft" size={15}/>
        Voltar à revisão
      </button>
      <button onClick={onRetry} className="apex-btn apex-btn-primary">
        <Icon name="refresh" size={15}/>
        Tentar novamente
      </button>
    </div>
  </div>
);

// Keep window global for backward compatibility
if (typeof window !== 'undefined') {
  Object.assign(window, {
    SHEET_COLUMNS, buildSheetRow, truncate,
    StudentPreview, PendingList, QuestionReviewCard, BatchSheetPreview,
    BatchReviewScreen, SendingPanel, SuccessPanel, ErrorPanel,
  });
}
