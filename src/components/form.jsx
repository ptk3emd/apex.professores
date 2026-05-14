// Apex Medicina — Criar questão autoral · Form (edit) view

import React from 'react';
import { Icon } from './icons.jsx';

/* ────────────────────────────────────────────────────────────
   Field-level primitives
   ──────────────────────────────────────────────────────────── */

export const Label = ({ children, required, hint }) => (
  <div className="apex-label">
    <span>{children}</span>
    {required && <span className="req">*</span>}
    {hint && <span style={{ color:'#94a3b8', fontWeight:500, textTransform:'none', letterSpacing:0, marginLeft:4 }}>{hint}</span>}
  </div>
);

export const HelperRow = ({ children, icon }) => (
  <div style={{ display:'flex', alignItems:'flex-start', gap:8, fontSize:13, color:'#64748b', lineHeight:1.55, marginTop:-2, marginBottom:14 }}>
    {icon && <span style={{ marginTop:2, flexShrink:0, color:'#94a3b8' }}><Icon name={icon} size={15} /></span>}
    <span>{children}</span>
  </div>
);

export const FieldError = ({ message }) =>
  message ? (
    <div className="apex-helper">
      <Icon name="alertcircle" size={13} strokeWidth={2.2} />
      <span>{message}</span>
    </div>
  ) : null;

/* ────────────────────────────────────────────────────────────
   Card shell — numbered, titled
   ──────────────────────────────────────────────────────────── */

export const FormCard = ({ index, title, eyebrow, subtitle, badge, children, error }) => (
  <section className="apex-card apex-enter apex-form-card" style={{ padding:'28px 32px 32px', position:'relative' }}>
    <header className="apex-form-card-header" style={{ display:'flex', alignItems:'flex-start', gap:16, marginBottom:22 }}>
      <div className="apex-form-card-num" style={{
        flexShrink:0,
        width:36, height:36,
        borderRadius:10,
        background: error ? '#fef2f2' : '#FCF4F4',
        color: error ? '#dc2626' : '#A43939',
        border:`1.5px solid ${error ? '#fecaca' : '#F7E1E1'}`,
        display:'flex', alignItems:'center', justifyContent:'center',
        fontWeight:900, fontSize:14, letterSpacing:'0.02em',
      }}>
        {String(index).padStart(2,'0')}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        {eyebrow && (
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#94a3b8', marginBottom:4 }}>
            {eyebrow}
          </div>
        )}
        <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
          <h2 style={{ fontSize:20, fontWeight:700, color:'#0f172a', letterSpacing:'-0.01em', lineHeight:1.25, margin:0 }}>
            {title}
          </h2>
          {badge}
        </div>
        {subtitle && (
          <p style={{ fontSize:13.5, color:'#64748b', margin:'6px 0 0', fontWeight:500, lineHeight:1.5 }}>{subtitle}</p>
        )}
      </div>
    </header>
    <div>{children}</div>
  </section>
);

/* ────────────────────────────────────────────────────────────
   Card 1 — Tipo de questão
   ──────────────────────────────────────────────────────────── */

export const TypeCard = ({ value, onChange, error }) => {
  const options = [
    { id:'me5', title:'Múltipla escolha A–E', sub:'5 alternativas. Formato padrão de provas de residência.', count:5 },
    { id:'me4', title:'Múltipla escolha A–D', sub:'4 alternativas. Comum em provas mais curtas.',           count:4 },
    { id:'vf',  title:'Verdadeiro ou falso',  sub:'2 opções: Verdadeiro / Falso. Útil para revisões rápidas.', count:2 },
  ];
  return (
    <FormCard index={1} eyebrow="Formato" title="Tipo de questão"
      subtitle="Escolha o formato. Isso ajusta automaticamente o número de alternativas.">
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:12 }}>
        {options.map(o => {
          const active = value === o.id;
          return (
            <button key={o.id} type="button" onClick={() => onChange(o.id)}
              className={`apex-sel-card ${active ? 'active' : ''}`}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                <div style={{
                  display:'flex', alignItems:'center', gap:5,
                  background: active ? 'white' : '#f1f5f9',
                  border: active ? '1px solid #F7E1E1' : '1px solid transparent',
                  color: active ? '#A43939' : '#64748b',
                  padding:'4px 10px', borderRadius:9999,
                  fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase',
                }}>
                  {o.count} {o.count === 2 ? 'opções' : 'alternativas'}
                </div>
                <div style={{
                  width:20, height:20, borderRadius:9999,
                  border: active ? '6px solid #A43939' : '1.5px solid #cbd5e1',
                  background:'white', transition:'all .18s ease',
                }} />
              </div>
              <div style={{ fontWeight:700, color:'#0f172a', fontSize:15, lineHeight:1.3, marginBottom:6 }}>
                {o.title}
              </div>
              <div style={{ fontSize:12.5, color:'#64748b', lineHeight:1.5, fontWeight:500 }}>{o.sub}</div>
            </button>
          );
        })}
      </div>
      <FieldError message={error} />
    </FormCard>
  );
};

/* ────────────────────────────────────────────────────────────
   Card 2 — Enunciado
   ──────────────────────────────────────────────────────────── */

export const EnunciadoCard = ({ value, onChange, image, onImage, onRemoveImage, caption, onCaption, error }) => {
  const fileRef = React.useRef(null);
  const onPick = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    onImage({ url, name: f.name });
  };
  return (
    <FormCard index={2} eyebrow="Conteúdo" title="Enunciado"
      subtitle="Escreva o caso clínico, comando da questão e informações necessárias para resposta.">
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Ex.: Paciente do sexo masculino, 62 anos, hipertenso e diabético, chega ao pronto-socorro com queixa de dor precordial em aperto, irradiando para mandíbula, iniciada há 40 minutos. Refere sudorese e náuseas..."
        className={`apex-textarea ${error ? 'invalid' : ''}`}
        style={{ minHeight:170 }}
      />
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:10, gap:14, flexWrap:'wrap' }}>
        <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPick} />
          <button type="button" className="apex-btn apex-btn-secondary" onClick={() => fileRef.current?.click()}
            style={{ padding:'9px 14px', fontSize:13 }}>
            <Icon name="image" size={15} strokeWidth={2}/>
            <span>{image ? 'Substituir imagem' : 'Adicionar imagem'}</span>
          </button>
          <span style={{ fontSize:12, color:'#94a3b8', fontWeight:500 }}>
            Imagem é opcional · PNG ou JPG até 5 MB
          </span>
        </div>
        <div style={{ fontSize:12, color:'#94a3b8', fontWeight:600, letterSpacing:'0.02em' }}>
          {value.length.toLocaleString('pt-BR')} caracteres
        </div>
      </div>

      <FieldError message={error} />

      {image && (
        <div className="apex-enter" style={{
          marginTop:18, padding:14,
          background:'#f8fafc', borderRadius:14,
          border:'1px solid #e2e8f0',
          display:'flex', gap:14, alignItems:'flex-start',
        }}>
          <img src={image.url} alt={image.name} style={{
            width:140, height:104, objectFit:'cover',
            borderRadius:10, border:'1px solid #e2e8f0', flexShrink:0,
          }} />
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, fontWeight:700, color:'#0f172a' }}>
                <Icon name="image" size={13} color="#A43939"/>
                <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:280 }}>
                  {image.name}
                </span>
              </div>
              <button type="button" onClick={onRemoveImage} className="apex-btn-ghost apex-btn"
                style={{ padding:'4px 8px', fontSize:12, color:'#dc2626' }}>
                <Icon name="trash" size={13} /> Remover
              </button>
            </div>
            <input
              type="text"
              value={caption}
              onChange={e => onCaption(e.target.value)}
              placeholder="Legenda ou descrição da imagem (opcional) — ex: ECG de 12 derivações"
              className="apex-input"
              style={{ fontSize:13, padding:'9px 12px' }}
            />
          </div>
        </div>
      )}
    </FormCard>
  );
};

/* ────────────────────────────────────────────────────────────
   Card 3 — Alternativas e justificativas
   ──────────────────────────────────────────────────────────── */

const AlternativeBlock = ({ alt, type, onChange, onMarkCorrect, errorText, errorJust, isVF }) => {
  const correct = alt.isCorrect;
  // VF: label fixed ("Verdadeiro"/"Falso")
  const showTextField = !isVF;
  const justPlaceholder = correct
    ? "Por que essa alternativa está correta? Explique o raciocínio que confirma este gabarito."
    : "Por que essa alternativa está incorreta? Aponte o equívoco ou conceito errôneo.";
  return (
    <div style={{
      padding:'18px 18px 18px 22px',
      borderRadius:14,
      background: correct ? '#FCF4F4' : '#fafaf8',
      border:`1.5px solid ${correct ? '#A43939' : '#ececea'}`,
      transition:'all .2s ease',
      position:'relative',
      boxShadow: correct ? 'inset 3px 0 0 #A43939, 0 4px 12px -6px rgba(164,57,57,.2)' : 'inset 3px 0 0 #e2e8f0',
    }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14, gap:10, flexWrap:'wrap' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{
            width:36, height:36, borderRadius:10,
            background: correct ? '#A43939' : 'white',
            color: correct ? 'white' : '#475569',
            border: correct ? 'none' : '1.5px solid #cbd5e1',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontWeight:900, fontSize:16,
            transition:'all .2s ease',
          }}>
            {alt.id}
          </div>
          {isVF && (
            <div style={{ fontSize:16, fontWeight:700, color:'#0f172a' }}>
              {alt.text}
            </div>
          )}
        </div>
        <button type="button" onClick={onMarkCorrect}
          className="apex-btn"
          style={{
            padding:'7px 13px',
            fontSize:12.5,
            background: correct ? '#A43939' : 'white',
            color: correct ? 'white' : '#475569',
            border: correct ? '1.5px solid #A43939' : '1.5px solid #e2e8f0',
            boxShadow: correct ? '0 4px 10px -4px rgba(164,57,57,.5)' : 'none',
          }}>
          <Icon name={correct ? 'check' : 'plus'} size={13} strokeWidth={2.5}/>
          {correct ? 'Gabarito' : 'Marcar como correta'}
        </button>
      </div>

      {showTextField && (
        <>
          <textarea
            value={alt.text}
            onChange={e => onChange({ ...alt, text: e.target.value })}
            placeholder={`Texto da alternativa ${alt.id}`}
            className={`apex-textarea ${errorText ? 'invalid' : ''}`}
            style={{ minHeight:62, marginBottom:10, fontSize:14.5 }}
          />
          <FieldError message={errorText} />
        </>
      )}

      <div className="apex-label" style={{ marginTop:isVF ? 0 : 12, marginBottom:6, display:'flex', alignItems:'center', gap:6 }}>
        <span>Justificativa</span>
        {correct && (
          <span style={{ color:'#A43939', letterSpacing:0, fontSize:9 }}>· DA CORRETA</span>
        )}
        <span style={{
          color:'#94a3b8', fontSize:9, fontWeight:600, letterSpacing:'.05em',
          textTransform:'uppercase', padding:'2px 7px', background:'#f1f5f9', borderRadius:9999,
        }}>opcional</span>
      </div>
      <textarea
        value={alt.justification}
        onChange={e => onChange({ ...alt, justification: e.target.value })}
        placeholder={justPlaceholder}
        className={`apex-textarea ${errorJust ? 'invalid' : ''}`}
        style={{ minHeight:78, fontSize:14, background:'white' }}
      />
      <FieldError message={errorJust} />
    </div>
  );
};

export const AlternativesCard = ({ type, alternatives, setAlternatives, errors }) => {
  const isVF = type === 'vf';
  const correctCount = alternatives.filter(a => a.isCorrect).length;
  const updateOne = (idx, next) =>
    setAlternatives(alternatives.map((a, i) => i === idx ? next : a));
  const markCorrect = (idx) =>
    setAlternatives(alternatives.map((a, i) => ({ ...a, isCorrect: i === idx })));

  return (
    <FormCard index={3} eyebrow="Resposta" title="Alternativas e justificativas"
      subtitle="Preencha o texto das alternativas e marque o gabarito. Justificativas são opcionais — escreva quando puder, ajudam o aluno a aprender."
      badge={
        <span style={{
          fontSize:11, fontWeight:700, color: correctCount ? '#15803d' : '#94a3b8',
          background: correctCount ? '#dcfce7' : '#f1f5f9',
          padding:'3px 10px', borderRadius:9999, letterSpacing:'.02em',
          display:'inline-flex', alignItems:'center', gap:5,
        }}>
          {correctCount ? <Icon name="check" size={11} strokeWidth={3}/> : <Icon name="alertcircle" size={11}/>}
          {correctCount ? 'Gabarito definido' : 'Sem gabarito'}
        </span>
      }>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {alternatives.map((a, i) => (
          <AlternativeBlock
            key={a.id}
            alt={a}
            type={type}
            isVF={isVF}
            onChange={(next) => updateOne(i, next)}
            onMarkCorrect={() => markCorrect(i)}
            errorText={errors?.[`alt_text_${a.id}`]}
            errorJust={errors?.[`alt_just_${a.id}`]}
          />
        ))}
      </div>
      <FieldError message={errors?.correct} />
    </FormCard>
  );
};

/* ────────────────────────────────────────────────────────────
   Card 4 — Comentário geral
   ──────────────────────────────────────────────────────────── */

export const CommentCard = ({ value, onChange, error }) => (
  <FormCard index={4} eyebrow="Pedagogia" title="Comentário geral"
    subtitle="Explique o raciocínio da questão, o conceito central e o motivo do gabarito. É o ponto de partida da revisão do aluno.">
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Ex.: Esta questão aborda o reconhecimento eletrocardiográfico do IAM com supra de ST. O paciente apresenta dor anginosa típica com fatores de risco; a conduta imediata segue o protocolo de reperfusão precoce..."
      className={`apex-textarea ${error ? 'invalid' : ''}`}
      style={{ minHeight:130 }}
    />
    <FieldError message={error}/>
  </FormCard>
);

/* ────────────────────────────────────────────────────────────
   Combobox — Tema específico (searchable, create new)
   ──────────────────────────────────────────────────────────── */

const TemaCombobox = ({ value, onChange, isNew, setIsNew, error }) => {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState('');
  const wrapRef = React.useRef(null);
  const inputRef = React.useRef(null);
  React.useEffect(() => {
    const onDocClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const filtered = window.TEMAS.filter(t => t.toLowerCase().includes(q.toLowerCase())).slice(0, 30);
  const exactMatch = window.TEMAS.some(t => t.toLowerCase() === q.toLowerCase());
  const showCreate = q.trim().length >= 3 && !exactMatch;

  const select = (t) => {
    onChange(t);
    setIsNew(false);
    setQ('');
    setOpen(false);
  };
  const createNew = () => {
    onChange(q.trim());
    setIsNew(true);
    setQ('');
    setOpen(false);
  };

  return (
    <div className="apex-combo" ref={wrapRef}>
      {value ? (
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between', gap:10,
          border:`1.5px solid ${isNew ? '#A43939' : '#e2e8f0'}`,
          background: isNew ? '#FCF4F4' : 'white',
          borderRadius:12, padding:'10px 14px',
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, minWidth:0, flex:1 }}>
            <Icon name="tag" size={15} color={isNew ? '#A43939' : '#94a3b8'}/>
            <span style={{ fontSize:14, fontWeight:600, color:'#0f172a', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {value}
            </span>
            {isNew && (
              <span style={{
                fontSize:9.5, fontWeight:700, color:'#A43939', background:'white',
                border:'1px solid #F7E1E1', padding:'3px 8px', borderRadius:9999,
                letterSpacing:'.1em', textTransform:'uppercase',
              }}>
                Novo tema · revisão
              </span>
            )}
          </div>
          <button type="button" className="apex-btn-ghost apex-btn"
            onClick={() => { onChange(''); setIsNew(false); setTimeout(() => inputRef.current?.focus(), 0); }}
            style={{ padding:'4px 8px', fontSize:12 }}>
            <Icon name="x" size={14}/> Trocar
          </button>
        </div>
      ) : (
        <div style={{ position:'relative' }}>
          <Icon name="search" size={15} color="#94a3b8" style={{ position:'absolute', top:'50%', left:14, transform:'translateY(-50%)', pointerEvents:'none' }}/>
          <input
            ref={inputRef}
            type="text"
            value={q}
            onChange={e => { setQ(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder="Busque ou selecione um tema específico"
            className={`apex-input ${error ? 'invalid' : ''}`}
            style={{ paddingLeft:38 }}
          />
        </div>
      )}

      {open && !value && (
        <div className="apex-combo-list apex-scroll">
          {filtered.length === 0 && !showCreate && (
            <div style={{ padding:'14px 12px', color:'#94a3b8', fontSize:13 }}>
              Nenhum tema encontrado. Digite pelo menos 3 caracteres para criar novo.
            </div>
          )}
          {filtered.map(t => (
            <div key={t} className="apex-combo-item" onClick={() => select(t)}>
              <Icon name="tag" size={12} color="#94a3b8"/>
              <span>{t}</span>
            </div>
          ))}
          {showCreate && (
            <div className="apex-combo-item create" onClick={createNew}>
              <Icon name="plus" size={13}/>
              <span>Criar novo tema: <strong>"{q.trim()}"</strong></span>
              <span style={{ marginLeft:'auto', fontSize:10, color:'#94a3b8', fontWeight:600, textTransform:'uppercase', letterSpacing:'.08em' }}>
                irá para revisão
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ────────────────────────────────────────────────────────────
   Card 5 — Classificação pedagógica
   ──────────────────────────────────────────────────────────── */

export const ClassificationCard = ({ data, set, errors }) => {
  const especialidades = data.categoria ? (window.ESPECIALIDADES[data.categoria] || []) : [];
  return (
    <FormCard index={5} eyebrow="Metadados" title="Classificação pedagógica"
      subtitle="Esses campos alimentam o Apex-CORE (Grande Área → Especialidade → Tema → Competência).">
      <div className="apex-classification-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>

        {/* Categoria */}
        <div>
          <Label required>Grande Área (Categoria)</Label>
          <select className={`apex-select ${errors?.categoria ? 'invalid' : ''}`} value={data.categoria}
            onChange={e => set({ categoria: e.target.value, especialidade: '' })}>
            <option value="">— Selecione a categoria —</option>
            {window.CATEGORIES.map(c => (
              <option key={c.code} value={c.code}>{c.code} — {c.label}</option>
            ))}
          </select>
          <FieldError message={errors?.categoria}/>
        </div>

        {/* Especialidade */}
        <div>
          <Label required>Especialidade</Label>
          <select className={`apex-select ${errors?.especialidade ? 'invalid' : ''}`} value={data.especialidade}
            disabled={!data.categoria}
            onChange={e => set({ especialidade: e.target.value })}>
            <option value="">{data.categoria ? '— Selecione a especialidade —' : 'Escolha a categoria primeiro'}</option>
            {especialidades.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
          <FieldError message={errors?.especialidade}/>
        </div>

        {/* Tema — spans 2 cols */}
        <div style={{ gridColumn:'span 2' }}>
          <Label required>Tema específico</Label>
          <TemaCombobox
            value={data.tema}
            onChange={(t) => set({ tema: t })}
            isNew={data.novoTema}
            setIsNew={(v) => set({ novoTema: v })}
            error={errors?.tema}
          />
          <FieldError message={errors?.tema}/>
          {!data.tema && (
            <div style={{ fontSize:12, color:'#94a3b8', marginTop:6, fontWeight:500 }}>
              Sugira temas a partir da lista oficial. Você pode criar um novo — ele será marcado para revisão.
            </div>
          )}
        </div>

        {/* Competência — spans 2 cols */}
        <div style={{ gridColumn:'span 2' }}>
          <Label required>Competência</Label>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {window.COMPETENCIAS.map(c => {
              const active = data.competencia === c;
              return (
                <button key={c} type="button"
                  className={`apex-chip ${active ? 'active' : ''}`}
                  onClick={() => set({ competencia: c })}>
                  {active && <Icon name="check" size={12} strokeWidth={3}/>}
                  {c}
                </button>
              );
            })}
          </div>
          <FieldError message={errors?.competencia}/>
          {data.competencia === 'Outro mais específico' && (
            <div className="apex-enter" style={{ marginTop:10 }}>
              <input
                type="text"
                value={data.competenciaOutro}
                onChange={e => set({ competenciaOutro: e.target.value })}
                placeholder="Descreva a competência específica avaliada"
                className={`apex-input ${errors?.competenciaOutro ? 'invalid' : ''}`}
              />
              <FieldError message={errors?.competenciaOutro}/>
            </div>
          )}
        </div>

        {/* Ano */}
        <div>
          <Label hint="(opcional)">Ano</Label>
          <input type="number" min={2000} max={2030}
            value={data.ano}
            onChange={e => set({ ano: e.target.value })}
            className="apex-input"
            placeholder="2026"
          />
        </div>

        {/* Origem */}
        <div>
          <Label hint="(opcional)">Origem</Label>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom: data.origem === 'Outro' ? 10 : 0 }}>
            {window.ORIGENS.map(o => {
              const active = data.origem === o;
              return (
                <button key={o} type="button"
                  className={`apex-chip ${active ? 'active' : ''}`}
                  onClick={() => set({ origem: o, ...(o !== 'Outro' ? { origemOutro: '' } : {}) })}>
                  {active && <Icon name="check" size={12} strokeWidth={3}/>}
                  {o}
                </button>
              );
            })}
          </div>
          {data.origem === 'Outro' && (
            <div className="apex-enter">
              <input
                type="text"
                value={data.origemOutro || ''}
                onChange={e => set({ origemOutro: e.target.value })}
                placeholder="Seu nome"
                className="apex-input"
              />
            </div>
          )}
        </div>

      </div>
    </FormCard>
  );
};

/* ────────────────────────────────────────────────────────────
   Card 6 — Ações finais
   ──────────────────────────────────────────────────────────── */

export const ActionsCard = ({ onSaveDraft, onReview, draftSaved, errorList }) => {
  const hasErrors = errorList && errorList.length > 0;
  return (
    <section className="apex-card apex-enter apex-actions-card" style={{ padding:'24px 32px', position:'sticky', bottom:16, zIndex:10,
      boxShadow:'0 -2px 0 white, 0 14px 30px -10px rgba(15,23,42,.12), 0 4px 10px -4px rgba(15,23,42,.06)' }}>
      {hasErrors && (
        <div style={{
          marginBottom:16, padding:'12px 14px',
          background:'#fef2f2', border:'1px solid #fecaca', borderRadius:12,
          display:'flex', gap:10, alignItems:'flex-start',
        }}>
          <Icon name="alerttri" size={16} color="#dc2626" strokeWidth={2.2} style={{ marginTop:2, flexShrink:0 }}/>
          <div style={{ minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:700, color:'#7f1d1d', marginBottom:4 }}>
              Para revisar, complete {errorList.length} {errorList.length === 1 ? 'item' : 'itens'}:
            </div>
            <ul style={{ margin:0, paddingLeft:18, fontSize:12.5, color:'#991b1b', lineHeight:1.65 }}>
              {errorList.slice(0,4).map((e, i) => <li key={i}>{e}</li>)}
              {errorList.length > 4 && (
                <li style={{ listStyle:'none', marginTop:2, color:'#64748b', fontStyle:'italic' }}>+ {errorList.length - 4} outros…</li>
              )}
            </ul>
          </div>
        </div>
      )}
      <div className="apex-footer-actions-wrap" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:14, flexWrap:'wrap' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, color:'#64748b', fontSize:12.5, fontWeight:500 }}>
          <Icon name="info" size={14}/>
          <span>Você poderá revisar a questão antes de enviar para a planilha.</span>
        </div>
        <div className="apex-footer-actions" style={{ display:'flex', gap:10, alignItems:'center' }}>
          {draftSaved && (
            <span style={{ fontSize:11, color:'#16a34a', fontWeight:700, display:'inline-flex', alignItems:'center', gap:5 }}>
              <Icon name="check" size={12} strokeWidth={3}/> Rascunho salvo
            </span>
          )}
          <button type="button" onClick={onSaveDraft} className="apex-btn apex-btn-secondary">
            <Icon name="save" size={15}/>
            Salvar rascunho
          </button>
          <button type="button" onClick={onReview} className="apex-btn apex-btn-primary">
            Revisar questão
            <Icon name="arrowright" size={15}/>
          </button>
        </div>
      </div>
    </section>
  );
};

// Keep window global for backward compatibility
if (typeof window !== 'undefined') {
  Object.assign(window, {
    Label, FieldError, FormCard, HelperRow,
    TypeCard, EnunciadoCard, AlternativesCard, CommentCard,
    ClassificationCard, ActionsCard,
  });
}
