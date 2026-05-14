// Apex Medicina — Autosave / persistence layer (localStorage)
// One key holds the whole working batch.

window.APEX_STORAGE_KEY = 'apex-autoral-drafts-v1';

window.ApexStorage = {
  read() {
    try {
      const raw = localStorage.getItem(window.APEX_STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      // Strip image blob URLs (they don't persist between sessions)
      if (data && Array.isArray(data.questions)) {
        data.questions = data.questions.map(q => ({
          ...q,
          // Strip File-derived blob URLs; only keep data URLs (none in this prototype)
          image: q.image && !q.image.url?.startsWith?.('blob:') ? q.image : null,
        }));
      }
      return data;
    } catch (e) {
      console.warn('[ApexStorage] failed to read', e);
      return null;
    }
  },
  write(data) {
    try {
      // Strip blob URLs (not serializable cross-session)
      const slim = {
        ...data,
        questions: (data.questions || []).map(q => ({
          ...q,
          image: q.image && !q.image.url?.startsWith?.('blob:') ? q.image : null,
        })),
      };
      localStorage.setItem(window.APEX_STORAGE_KEY, JSON.stringify(slim));
      return true;
    } catch (e) {
      console.warn('[ApexStorage] failed to write', e);
      return false;
    }
  },
  clear() {
    try { localStorage.removeItem(window.APEX_STORAGE_KEY); } catch {}
  },
  hasContent(data) {
    if (!data || !Array.isArray(data.questions) || data.questions.length === 0) return false;
    return data.questions.some(q => window.ApexStorage.questionHasAnyContent(q));
  },
  questionHasAnyContent(q) {
    if (!q) return false;
    if (q.enunciado?.trim()) return true;
    if (q.comentario?.trim()) return true;
    if (q.tema) return true;
    if (q.categoria) return true;
    if (q.especialidade) return true;
    if (q.competencia) return true;
    if (Array.isArray(q.alternatives) && q.alternatives.some(a => a.text?.trim() || a.justification?.trim() || a.isCorrect)) return true;
    return false;
  },
};
