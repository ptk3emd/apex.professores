// Apex Medicina — Criar questão autoral · main App (multi-question, autosave, tutorial)

import React, { useState, useCallback, useEffect } from 'react';

// Import all components
import { Icon, ApexLogo, Spinner } from './icons.jsx';
import { Label, FieldError, FormCard, HelperRow, TypeCard, EnunciadoCard, AlternativesCard, CommentCard, ClassificationCard, ActionsCard } from './form.jsx';
import { questionStatus, STATUS_META, questionTitle, Sidebar, SidebarQuestion, ResumeDraftsModal } from './sidebar.jsx';
import { SHEET_COLUMNS, buildSheetRow, truncate, StudentPreview, PendingList, QuestionReviewCard, BatchSheetPreview, BatchReviewScreen, SendingPanel, SuccessPanel, ErrorPanel } from './review.jsx';
import { TUTORIAL_SECTIONS, TutorialModal } from './tutorial.jsx';
import { CATEGORIES, ESPECIALIDADES, TEMAS, COMPETENCIAS, ORIGENS } from '../scripts/data.js';
import { ApexStorage, APEX_STORAGE_KEY } from '../scripts/storage.js';

const ALPHABET = ['A', 'B', 'C', 'D', 'E'];

function freshAlternatives(type) {
  if (type === 'vf') {
    return [
      { id: 'A', text: 'Verdadeiro', justification: '', isCorrect: false },
      { id: 'B', text: 'Falso',      justification: '', isCorrect: false },
    ];
  }
  const n = type === 'me4' ? 4 : 5;
  return ALPHABET.slice(0, n).map((L) => ({ id: L, text: '', justification: '', isCorrect: false }));
}

function newQuestion() {
  return {
    id: 'q_' + Math.random().toString(36).slice(2, 9),
    type: 'me5',
    enunciado: '',
    image: null,
    imageCaption: '',
    alternatives: freshAlternatives('me5'),
    comentario: '',
    categoria: '',
    especialidade: '',
    tema: '',
    novoTema: false,
    competencia: '',
    competenciaOutro: '',
    ano: '2026',
    origem: 'Adaptada',
    origemOutro: '',
    createdAt: Date.now(),
  };
}

function generateExternalId() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const stamp = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `AUT-${stamp}-${rand}`;
}

/* ────────────────────────────────────────────────────────────
   Validation (silent — only surfaces when user attempts to send/review)
   - Required: enunciado, alternativas (texto p/ ME), uma correta,
               categoria, especialidade, tema, competência, comentário
   - NÃO obrigatórios: justificativas, ano, origem, imagem
   ──────────────────────────────────────────────────────────── */
function validate(q) {
  const errors = {};
  const summary = [];
  const isVF = q.type === 'vf';

  if (!q.enunciado?.trim()) {
    errors.enunciado = 'Falta o enunciado.';
    summary.push('Falta o enunciado.');
  }
  if (!isVF) {
    q.alternatives.forEach((a) => {
      if (!a.text?.trim()) {
        errors[`alt_text_${a.id}`] = `Falta o texto da alternativa ${a.id}.`;
        summary.push(`Falta o texto da alternativa ${a.id}.`);
      }
    });
  }
  const corrects = q.alternatives.filter((a) => a.isCorrect).length;
  if (corrects === 0) {
    errors.correct = 'Ainda não tem alternativa correta marcada.';
    summary.push('Ainda não tem alternativa correta marcada.');
  } else if (corrects > 1) {
    errors.correct = 'Mais de uma alternativa marcada como correta.';
    summary.push('Mais de uma alternativa marcada como correta.');
  }
  if (!q.comentario?.trim()) {
    errors.comentario = 'Falta o comentário geral.';
    summary.push('Falta o comentário geral.');
  }
  if (!q.categoria)     { errors.categoria = 'Falta a categoria.';     summary.push('Falta a categoria.'); }
  if (!q.especialidade) { errors.especialidade = 'Falta a especialidade.'; summary.push('Falta a especialidade.'); }
  if (!q.tema)          { errors.tema = 'Falta o tema específico.';     summary.push('Falta o tema específico.'); }
  if (!q.competencia)   { errors.competencia = 'Falta a competência.';  summary.push('Falta a competência.'); }
  else if (q.competencia === 'Outro mais específico' && !q.competenciaOutro?.trim()) {
    errors.competenciaOutro = 'Descreva a competência específica.';
    summary.push('Descreva a competência específica.');
  }
  return { errors, summary };
}

/* ────────────────────────────────────────────────────────────
   Top header — page chrome
   ──────────────────────────────────────────────────────────── */
const TopBar = ({ phase, autosaveStatus, autosaveAt, questionCount, onHelp }) => {
  const fmt = (d) => {
    if (!d) return '—';
    const diff = Math.floor((Date.now() - d) / 1000);
    if (diff < 5) return 'agora';
    if (diff < 60) return `há ${diff}s`;
    if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
    return `há ${Math.floor(diff / 3600)} h`;
  };
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 40,
      background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(14px)',
      borderBottom: '1px solid #ececea',
    }}>
      <div className="apex-topbar-inner" style={{ maxWidth: 1280, margin: '0 auto', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <ApexLogo size={28}/>
          <div className="apex-topbar-breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748b', fontWeight: 500 }}>
            <span style={{ fontWeight: 700, color: '#0f172a' }}>Apex Med</span>
            <Icon name="chevronright" size={12} color="#cbd5e1"/>
            <span>Banco de questões</span>
            <Icon name="chevronright" size={12} color="#cbd5e1"/>
            <span style={{ color: '#0f172a', fontWeight: 600 }}>Criar questão autoral</span>
          </div>
        </div>
        <div className="apex-topbar-right" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Autosave indicator */}
          <span className="apex-toast">
            {autosaveStatus === 'saving' ? (
              <>
                <Spinner size={11} color="#A43939"/>
                <span>Salvando…</span>
              </>
            ) : (
              <>
                <span style={{ width: 6, height: 6, borderRadius: 9999, background: '#16a34a', display: 'inline-block' }}/>
                Rascunho salvo {fmt(autosaveAt)}
              </>
            )}
          </span>
          <button onClick={onHelp} className="apex-btn"
            style={{ padding: '8px 13px', fontSize: 13, background: '#FCF4F4', color: '#A43939', border: '1px solid #F7E1E1' }}>
            <Icon name="helpcircle" size={15}/>
            <span className="apex-topbar-help-text">Preciso de ajuda</span>
          </button>
          <div style={{
            width: 36, height: 36, borderRadius: 9999, background: '#A43939', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14,
          }}>DR</div>
        </div>
      </div>
    </header>
  );
};

/* ────────────────────────────────────────────────────────────
   Hero — title + 4-step indicator
   ──────────────────────────────────────────────────────────── */
const HeroSteps = ({ phase, sectionsValid }) => {
  const stepFor = () => {
    if (phase === 'edit') return sectionsValid.classification ? 2 : 1;
    if (phase === 'review') return 3;
    if (phase === 'sending' || phase === 'success' || phase === 'error') return 4;
    return 1;
  };
  const current = stepFor();
  const steps = [
    { n: 1, label: 'Criar' },
    { n: 2, label: 'Classificar' },
    { n: 3, label: 'Revisar' },
    { n: 4, label: 'Enviar' },
  ];
  return (
    <section className="apex-hero-section" style={{ padding: '32px 0 24px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ maxWidth: 720 }}>
          <div className="apex-hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px',
            background: '#FCF4F4', border: '1px solid #F7E1E1', borderRadius: 9999,
            fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#A43939', marginBottom: 14,
          }}>
            <Icon name="sparkles" size={12}/> Área do professor · Apex-CORE
          </div>
          <h1 className="apex-hero-h1" style={{ fontSize: 38, fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.025em', lineHeight: 1.1 }}>
            Nova questão de estudo
          </h1>
          <p className="apex-hero-desc" style={{ fontSize: 16, color: '#475569', margin: '10px 0 0', maxWidth: 620, lineHeight: 1.55, fontWeight: 500 }}>
            Cadastre questões completas com alternativas, justificativas e classificação pedagógica. Sua questão entra no banco de dados para revisão antes de ir ao banco oficial.
          </p>
        </div>
      </div>

      <div className="apex-steps-bar" style={{
        marginTop: 28, padding: '18px 22px',
        background: 'white', border: '1px solid #ececea', borderRadius: 16,
        display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: '0 1px 2px rgba(15,23,42,.03)',
      }}>
        {steps.map((s, i) => {
          const isCurrent = s.n === current;
          const isDone = s.n < current;
          return (
            <React.Fragment key={s.n}>
              <div className="apex-step-item" style={{ display: 'flex', alignItems: 'center', gap: 11, flex: 1, minWidth: 0 }}>
                <div className="apex-step-icon" style={{
                  flexShrink: 0, width: 34, height: 34, borderRadius: 10,
                  background: isDone ? '#16a34a' : isCurrent ? '#A43939' : '#f1f5f9',
                  color: isDone || isCurrent ? 'white' : '#94a3b8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, fontSize: 13.5,
                  transition: 'all .25s ease',
                  boxShadow: isCurrent ? '0 6px 14px -4px rgba(164,57,57,.4)' : 'none',
                }}>
                  {isDone ? <Icon name="check" size={15} strokeWidth={3}/> : s.n}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div className="apex-step-eyebrow" style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#94a3b8' }}>
                    Etapa 0{s.n}
                  </div>
                  <div className="apex-step-label" style={{ fontSize: 13.5, fontWeight: 700, color: isCurrent || isDone ? '#0f172a' : '#94a3b8', marginTop: 1 }}>
                    {s.label}
                  </div>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="apex-step-connector" style={{
                  flex: 0, width: 32, height: 2, borderRadius: 9999,
                  background: isDone ? '#16a34a' : '#e2e8f0',
                  transition: 'background .25s ease',
                }}/>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
};

/* ────────────────────────────────────────────────────────────
   Question form footer — pending + actions for current question
   ──────────────────────────────────────────────────────────── */
const QuestionFormFooter = ({ status, pending, attempted, onAdd, onReview }) => {
  const meta = window.STATUS_META[status];
  return (
    <section className="apex-card apex-enter apex-q-footer" style={{ padding: '20px 24px' }}>
      {attempted && pending.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <PendingList items={pending} questionLabel="Para enviar esta questão, ajuste"/>
        </div>
      )}
      <div className="apex-q-footer-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
        <div className="apex-footer-status" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className={`apex-status-dot ${status}`} style={{ width: 10, height: 10 }}/>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: meta.color, letterSpacing: '.04em', textTransform: 'uppercase' }}>
            {meta.label}
          </span>
          <span style={{ fontSize: 12.5, color: '#64748b', fontWeight: 500 }}>
            · seu trabalho fica salvo neste navegador automaticamente.
          </span>
        </div>
        <div className="apex-q-footer-buttons" style={{ display: 'flex', gap: 10 }}>
          <button onClick={onAdd} className="apex-btn apex-btn-secondary">
            <Icon name="plus" size={15}/>
            Adicionar outra questão
          </button>
          <button onClick={onReview} className="apex-btn apex-btn-primary">
            <Icon name="eye" size={15}/>
            Revisar todas
          </button>
        </div>
      </div>
    </section>
  );
};

/* ────────────────────────────────────────────────────────────
   Edit view — sidebar + form for current question
   ──────────────────────────────────────────────────────────── */
const EditView = ({
  questions, currentId, statuses, pending, attempted,
  autosaveStatus, autosaveAt,
  setCurrent, addQuestion, duplicateQuestion, removeQuestion,
  onReviewAll, updateCurrent, setType,
}) => {
  const current = questions.find(q => q.id === currentId) || questions[0];
  const errors = attempted ? (validate(current).errors) : {};
  const status = statuses[current.id];
  const pendingList = pending[current.id] || [];

  return (
    <div className="apex-edit-layout" style={{
      display: 'grid',
      gridTemplateColumns: '280px minmax(0, 1fr)',
      gap: 28,
      alignItems: 'flex-start',
    }}>
      <Sidebar
        questions={questions}
        currentId={current.id}
        statuses={statuses}
        onSelect={setCurrent}
        onAdd={addQuestion}
        onDuplicate={duplicateQuestion}
        onRemove={removeQuestion}
        onReviewAll={onReviewAll}
        autosaveStatus={autosaveStatus}
        autosaveAt={autosaveAt}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
        <TypeCard value={current.type} onChange={setType}/>
        <EnunciadoCard
          value={current.enunciado}
          onChange={(v) => updateCurrent({ enunciado: v })}
          image={current.image}
          onImage={(img) => updateCurrent({ image: img })}
          onRemoveImage={() => updateCurrent({ image: null, imageCaption: '' })}
          caption={current.imageCaption}
          onCaption={(v) => updateCurrent({ imageCaption: v })}
          error={errors.enunciado}
        />
        <AlternativesCard
          type={current.type}
          alternatives={current.alternatives}
          setAlternatives={(next) => updateCurrent({ alternatives: next })}
          errors={errors}
        />
        <CommentCard
          value={current.comentario}
          onChange={(v) => updateCurrent({ comentario: v })}
          error={errors.comentario}
        />
        <ClassificationCard
          data={current}
          set={(partial) => updateCurrent(partial)}
          errors={errors}
        />
        <QuestionFormFooter
          status={status}
          pending={pendingList}
          attempted={attempted}
          onAdd={addQuestion}
          onReview={onReviewAll}
        />
      </div>
    </div>
  );
};

/* ────────────────────────────────────────────────────────────
   App
   ──────────────────────────────────────────────────────────── */
export default function App() {
  const [phase, setPhase] = React.useState('edit'); // edit | review | sending | success | error
  const [questions, setQuestions] = React.useState([newQuestion()]);
  const [currentId, setCurrentId] = React.useState(null);
  const [attemptedReview, setAttemptedReview] = React.useState(false);
  const [autosaveStatus, setAutosaveStatus] = React.useState('idle'); // idle | saving | saved
  const [autosaveAt, setAutosaveAt] = React.useState(null);

  const [showResumeDialog, setShowResumeDialog] = React.useState(false);
  const [resumeInfo, setResumeInfo] = React.useState(null);
  const [showTutorial, setShowTutorial] = React.useState(false);

  const [generatedIds, setGeneratedIds] = React.useState({}); // qid → external id (lazily)
  const [sentIds, setSentIds] = React.useState([]);

  const initRef = React.useRef(false);

  /* ── On mount: try to resume drafts from localStorage ── */
  React.useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    const stored = window.ApexStorage.read();
    if (stored && window.ApexStorage.hasContent(stored)) {
      setResumeInfo({
        count: stored.questions.length,
        lastSavedAt: stored.savedAt,
      });
      setShowResumeDialog(true);
    } else {
      // Just initialize first question
      setCurrentId(questions[0].id);
    }
  }, []);

  const acceptResume = () => {
    const stored = window.ApexStorage.read();
    if (stored?.questions?.length) {
      setQuestions(stored.questions);
      setCurrentId(stored.currentId || stored.questions[0].id);
      setGeneratedIds(stored.generatedIds || {});
    }
    setShowResumeDialog(false);
  };
  const discardResume = () => {
    window.ApexStorage.clear();
    const fresh = newQuestion();
    setQuestions([fresh]);
    setCurrentId(fresh.id);
    setGeneratedIds({});
    setShowResumeDialog(false);
  };

  /* ── Autosave ── */
  React.useEffect(() => {
    if (showResumeDialog) return; // don't autosave while user hasn't decided
    if (!currentId) return;
    setAutosaveStatus('saving');
    const t = setTimeout(() => {
      const ok = window.ApexStorage.write({
        questions, currentId, generatedIds, savedAt: Date.now(),
      });
      if (ok) {
        setAutosaveStatus('saved');
        setAutosaveAt(Date.now());
      } else {
        setAutosaveStatus('saved'); // soft-fail in demo
      }
    }, 450);
    return () => clearTimeout(t);
  }, [questions, currentId, generatedIds, showResumeDialog]);

  /* ── Current question helpers ── */
  const updateCurrent = (partial) => {
    setQuestions(prev => prev.map(q => q.id === currentId ? { ...q, ...partial } : q));
  };

  const setCurrentType = (newType) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== currentId) return q;
      const oldAlts = q.alternatives;
      const newAlts = freshAlternatives(newType).map((a, i) => {
        const old = oldAlts[i];
        if (newType === 'vf') {
          return { ...a, justification: old?.justification || '' };
        }
        return old
          ? { ...a, text: old.text, justification: old.justification, isCorrect: old.isCorrect }
          : a;
      });
      return { ...q, type: newType, alternatives: newAlts };
    }));
  };

  /* ── Question collection actions ── */
  const addQuestion = () => {
    const q = newQuestion();
    setQuestions(prev => [...prev, q]);
    setCurrentId(q.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const duplicateQuestion = (id) => {
    const src = questions.find(q => q.id === id);
    if (!src) return;
    const dup = {
      ...JSON.parse(JSON.stringify(src)),
      id: 'q_' + Math.random().toString(36).slice(2, 9),
      createdAt: Date.now(),
    };
    const idx = questions.findIndex(q => q.id === id);
    setQuestions(prev => [
      ...prev.slice(0, idx + 1),
      dup,
      ...prev.slice(idx + 1),
    ]);
    setCurrentId(dup.id);
  };

  const removeQuestion = (id) => {
    if (questions.length === 1) {
      // Don't allow removing last — reset it instead
      const fresh = newQuestion();
      setQuestions([fresh]);
      setCurrentId(fresh.id);
      return;
    }
    const idx = questions.findIndex(q => q.id === id);
    const next = questions.filter(q => q.id !== id);
    setQuestions(next);
    if (currentId === id) {
      const newCurrent = next[Math.min(idx, next.length - 1)];
      setCurrentId(newCurrent.id);
    }
  };

  /* ── Statuses + pending lists (live) ── */
  const statuses = React.useMemo(() => {
    const out = {};
    questions.forEach(q => out[q.id] = window.questionStatus(q, validate));
    return out;
  }, [questions]);

  const pending = React.useMemo(() => {
    const out = {};
    questions.forEach(q => out[q.id] = validate(q).summary);
    return out;
  }, [questions]);

  /* ── Generate external ids for all on review ── */
  const ensureGeneratedIds = () => {
    setGeneratedIds(prev => {
      const out = { ...prev };
      questions.forEach(q => {
        if (!out[q.id]) out[q.id] = generateExternalId();
      });
      return out;
    });
  };

  /* ── Flow transitions ── */
  const onReviewAll = () => {
    setAttemptedReview(true);
    ensureGeneratedIds();
    setPhase('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onBackToEdit = (focusId) => {
    setPhase('edit');
    if (focusId) setCurrentId(focusId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* Send — either all or just completes */
  const [pendingSendIds, setPendingSendIds] = React.useState([]);

  const onSendAll = () => {
    const ids = questions.map(q => q.id);
    doSend(ids);
  };
  const onSendCompletesOnly = () => {
    const ids = questions.filter(q => statuses[q.id] === 'ready').map(q => q.id);
    doSend(ids);
  };
  const doSend = (ids) => {
    setPendingSendIds(ids);
    setPhase('sending');
    setTimeout(() => {
      const fail = new URLSearchParams(location.search).get('fail') === '1';
      if (fail) {
        setPhase('error');
      } else {
        const externals = ids.map(id => generatedIds[id]).filter(Boolean);
        setSentIds(externals);
        // Remove sent questions from the working set? No — keep in success
        // until user explicitly clears. But mark them so we know what to clear.
        setPhase('success');
      }
    }, 2200);
  };

  /* Success screen actions */
  const onClearSent = () => {
    // Remove sent questions from working set
    const next = questions.filter(q => !pendingSendIds.includes(q.id));
    setQuestions(next.length ? next : [newQuestion()]);
    setCurrentId((next[0] || newQuestion()).id);
    setSentIds([]);
    setPendingSendIds([]);
    setAttemptedReview(false);
    setPhase('edit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const onContinueDrafts = () => {
    const remaining = questions.filter(q => !pendingSendIds.includes(q.id));
    if (remaining.length) {
      setQuestions(remaining);
      setCurrentId(remaining[0].id);
    } else {
      const fresh = newQuestion();
      setQuestions([fresh]);
      setCurrentId(fresh.id);
    }
    setSentIds([]);
    setPendingSendIds([]);
    setAttemptedReview(false);
    setPhase('edit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const onNewQuestion = () => {
    const fresh = newQuestion();
    setQuestions([fresh]);
    setCurrentId(fresh.id);
    setSentIds([]);
    setPendingSendIds([]);
    setGeneratedIds({});
    setAttemptedReview(false);
    window.ApexStorage.clear();
    setPhase('edit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const onRetrySend = () => doSend(pendingSendIds);

  const sectionsValid = {
    classification: !!(questions[0] && questions[0].categoria && questions[0].especialidade && questions[0].tema && questions[0].competencia),
  };

  /* Render */
  let content;
  if (phase === 'edit') {
    content = currentId ? (
      <EditView
        questions={questions}
        currentId={currentId}
        statuses={statuses}
        pending={pending}
        attempted={attemptedReview}
        autosaveStatus={autosaveStatus}
        autosaveAt={autosaveAt}
        setCurrent={setCurrentId}
        addQuestion={addQuestion}
        duplicateQuestion={duplicateQuestion}
        removeQuestion={removeQuestion}
        onReviewAll={onReviewAll}
        updateCurrent={updateCurrent}
        setType={setCurrentType}
      />
    ) : null;
  } else if (phase === 'review') {
    content = (
      <BatchReviewScreen
        questions={questions}
        generatedIds={generatedIds}
        statuses={statuses}
        pending={pending}
        showPending={attemptedReview}
        onEdit={(id) => onBackToEdit(id)}
        onRemove={(id) => removeQuestion(id)}
        onBack={() => onBackToEdit(currentId)}
        onSendAll={onSendAll}
        onSendCompletesOnly={onSendCompletesOnly}
      />
    );
  } else if (phase === 'sending') {
    content = <SendingPanel count={pendingSendIds.length}/>;
  } else if (phase === 'success') {
    const remainingCount = questions.length - pendingSendIds.length;
    content = (
      <SuccessPanel
        sentIds={sentIds}
        remainingCount={remainingCount}
        onNew={onNewQuestion}
        onClearSent={onClearSent}
        onContinue={onContinueDrafts}
      />
    );
  } else if (phase === 'error') {
    content = <ErrorPanel onRetry={onRetrySend} onBack={() => setPhase('review')}/>;
  }

  return (
    <div className="apex-grad" style={{ minHeight: '100vh' }}>
      <TopBar
        phase={phase}
        autosaveStatus={autosaveStatus}
        autosaveAt={autosaveAt}
        questionCount={questions.length}
        onHelp={() => setShowTutorial(true)}
      />
      <main className="apex-main" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px 80px' }}>
        <HeroSteps phase={phase} sectionsValid={sectionsValid}/>
        {content}
      </main>

      <TutorialModal open={showTutorial} onClose={() => setShowTutorial(false)}/>
      <ResumeDraftsModal
        open={showResumeDialog}
        draftInfo={resumeInfo || { count: 0 }}
        onContinue={acceptResume}
        onDiscard={discardResume}
      />
    </div>
  );
}

