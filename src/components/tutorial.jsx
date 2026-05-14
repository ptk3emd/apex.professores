// Apex Medicina — Help / Tutorial modal

import React, { useState } from 'react';
import { Icon } from './icons.jsx';

export const TUTORIAL_SECTIONS = [
  {
    id: 'overview',
    title: 'Visão geral',
    icon: 'sparkles',
    intro: 'Aqui você cria suas próprias questões para o banco do Apex Med. Não precisa fazer tudo de uma vez — o sistema salva sozinho conforme você escreve.',
    steps: [
      { t: 'Crie uma ou várias questões.', d: 'Você pode escrever só uma ou montar várias antes de revisar.' },
      { t: 'O rascunho fica salvo neste navegador.', d: 'Pode fechar a aba e voltar depois — seu progresso continua aqui.' },
      { t: 'Revise tudo no final.', d: 'Quando estiver pronto, clique em "Revisar" para conferir e enviar para a planilha.' },
    ],
  },
  {
    id: 'tipo',
    title: 'Escolher o tipo de questão',
    icon: 'list',
    intro: 'Antes de escrever, decida o formato da questão.',
    steps: [
      { t: 'Múltipla escolha A–E', d: 'O formato mais comum em provas de residência. Cinco alternativas.' },
      { t: 'Múltipla escolha A–D', d: 'Versão mais curta, com quatro alternativas.' },
      { t: 'Verdadeiro ou falso', d: 'Só duas opções. Útil para revisões rápidas e conceitos diretos.' },
    ],
    tip: 'Pode trocar o tipo a qualquer momento — o conteúdo já escrito é preservado.',
  },
  {
    id: 'enunciado',
    title: 'Escrever o enunciado',
    icon: 'edit',
    intro: 'O enunciado é o caso clínico ou pergunta principal da questão.',
    steps: [
      { t: 'Escreva no campo grande de texto.', d: 'Pode digitar normalmente, como num documento de texto.' },
      { t: 'Inclua dados clínicos relevantes.', d: 'Idade, sexo, queixa, exame físico, exames complementares — tudo que o aluno precisa para responder.' },
      { t: 'Termine com o comando.', d: 'Frases como "Qual a conduta inicial?" ou "Qual o diagnóstico mais provável?".' },
    ],
  },
  {
    id: 'imagem',
    title: 'Adicionar uma imagem (opcional)',
    icon: 'image',
    intro: 'Se a questão precisar de imagem (ECG, raio-X, exame), você pode anexar uma.',
    steps: [
      { t: 'Clique em "Adicionar imagem".', d: 'Vai abrir o seletor de arquivos do seu computador.' },
      { t: 'Escolha um arquivo PNG ou JPG.', d: 'Até 5 MB.' },
      { t: 'Escreva uma legenda (opcional).', d: 'Ex: "ECG de 12 derivações na admissão".' },
      { t: 'Pode remover ou trocar a qualquer momento.', d: 'Use o botão "Remover" ou "Substituir imagem".' },
    ],
  },
  {
    id: 'gabarito',
    title: 'Marcar o gabarito',
    icon: 'check',
    intro: 'Você precisa indicar qual alternativa é a correta. Só uma.',
    steps: [
      { t: 'Escreva o texto de cada alternativa.', d: 'No campo dentro do bloco da letra (A, B, C…).' },
      { t: 'Clique em "Marcar como correta" na alternativa certa.', d: 'O bloco ficará destacado em vermelho-bordô — esse é o gabarito.' },
      { t: 'Pode trocar quantas vezes quiser.', d: 'Clicar em outra alternativa muda o gabarito automaticamente.' },
    ],
  },
  {
    id: 'justificativas',
    title: 'Justificativas (opcionais)',
    icon: 'helpcircle',
    intro: 'Cada alternativa tem um campo de justificativa — não é obrigatório, mas ajuda muito o aluno a aprender.',
    steps: [
      { t: 'Para a alternativa correta:', d: 'Explique por que essa é a resposta certa.' },
      { t: 'Para as incorretas:', d: 'Aponte o erro de raciocínio que leva a essa alternativa.' },
      { t: 'Pode deixar em branco se preferir.', d: 'A questão pode ser enviada sem justificativas — você completa depois se quiser.' },
    ],
    tip: 'Questões com justificativa em todas as alternativas têm melhor desempenho pedagógico.',
  },
  {
    id: 'comentario',
    title: 'Escrever o comentário geral',
    icon: 'sparkles',
    intro: 'É o "comentário do professor" da questão. Explica o raciocínio central.',
    steps: [
      { t: 'Foque no conceito principal.', d: 'Qual é a doença, o diagnóstico ou o princípio em jogo?' },
      { t: 'Explique o porquê do gabarito.', d: 'Por que essa conduta é a melhor naquele contexto.' },
      { t: 'Pode incluir referências, se quiser.', d: 'Mas não é obrigatório.' },
    ],
  },
  {
    id: 'classificacao',
    title: 'Classificar a questão',
    icon: 'layers',
    intro: 'Aqui você ajuda o sistema a entender de que assunto é a questão. Quanto melhor a classificação, melhor o sistema acerta as recomendações para os alunos.',
    steps: [
      { t: 'Categoria (Grande Área).', d: 'Ex: Clínica Médica, Pediatria, Cirurgia.' },
      { t: 'Especialidade.', d: 'Ex: Cardiologia, Endocrinologia. Aparece automaticamente conforme a categoria.' },
      { t: 'Tema específico.', d: 'O assunto exato — busque na lista. Se não encontrar, pode criar um novo tema; ele será revisado pela equipe pedagógica.' },
      { t: 'Competência.', d: 'O que a questão avalia: Diagnóstico, Conduta, Fisiopatologia, Epidemiologia, etc.' },
    ],
  },
  {
    id: 'multiplas',
    title: 'Criar várias questões em sequência',
    icon: 'stack',
    intro: 'Você pode escrever várias questões antes de revisar e enviar.',
    steps: [
      { t: 'No painel lateral, clique em "Adicionar outra questão".', d: 'Uma nova questão em branco aparece na lista.' },
      { t: 'Alterne entre questões clicando na lista lateral.', d: 'Os campos da questão selecionada aparecem na área principal.' },
      { t: 'Duplique uma questão semelhante.', d: 'Útil quando várias questões compartilham o mesmo caso clínico.' },
      { t: 'Apague o que não quiser.', d: 'Clique no ícone de lixeira ao lado da questão na lista.' },
    ],
    tip: 'Cada questão na lista mostra um status: incompleta (laranja) ou pronta para revisão (verde).',
  },
  {
    id: 'revisar',
    title: 'Revisar antes de enviar',
    icon: 'eye',
    intro: 'Antes do envio final, você vê todas as questões juntas para conferir.',
    steps: [
      { t: 'Clique em "Revisar todas".', d: 'Você verá a lista completa com como o aluno verá cada questão.' },
      { t: 'Edite ou remova diretamente da revisão.', d: 'Cada questão tem botões de "Editar" e "Remover".' },
      { t: 'Veja a prévia da planilha.', d: 'Mostra exatamente as colunas que serão enviadas para o Google Sheets.' },
      { t: 'Confira pendências, se houver.', d: 'Questões incompletas ficam marcadas — você pode completar ou enviar só as completas.' },
    ],
  },
  {
    id: 'enviar',
    title: 'Enviar para a planilha',
    icon: 'send',
    intro: 'Quando estiver tudo certo, envia tudo de uma vez para o Google Sheets.',
    steps: [
      { t: 'Clique em "Enviar todas para planilha".', d: 'Aparece uma tela mostrando o envio.' },
      { t: 'Aguarde a confirmação.', d: 'Em alguns segundos você verá a mensagem de sucesso.' },
      { t: 'A questão entra na fila de revisão pedagógica.', d: 'A equipe revisa e aprova antes de publicar no banco oficial.' },
      { t: 'Os rascunhos podem ser limpos.', d: 'Após o envio, o sistema pergunta se quer limpar os rascunhos enviados deste navegador.' },
    ],
  },
];

export const TutorialModal = ({ open, onClose }) => {
  const [activeId, setActiveId] = React.useState('overview');
  const contentRef = React.useRef(null);
  const sectionRefs = React.useRef({});

  React.useEffect(() => {
    if (open) {
      setActiveId('overview');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && open) onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const scrollTo = (id) => {
    setActiveId(id);
    const el = sectionRefs.current[id];
    if (el && contentRef.current) {
      contentRef.current.scrollTo({ top: el.offsetTop - 20, behavior: 'smooth' });
    }
  };

  return (
    <div className="apex-modal-backdrop apex-enter" onClick={onClose}>
      <div className="apex-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          padding: '24px 32px 18px',
          borderBottom: '1px solid #ececea',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12, background: '#FCF4F4',
              border: '1px solid #F7E1E1', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="helpcircle" size={22} color="#A43939" strokeWidth={2}/>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#A43939' }}>
                Guia · passo a passo
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: '3px 0 0', letterSpacing: '-0.015em' }}>
                Como criar uma questão autoral
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="apex-btn apex-btn-ghost"
            style={{ padding: '6px 10px', fontSize: 13 }}>
            <Icon name="x" size={16}/>
            Fechar
          </button>
        </div>

        {/* Body — sidebar + scrollable content */}
        <div style={{ display: 'flex', minHeight: 0, flex: 1 }}>
          {/* Sidebar TOC */}
          <nav className="apex-scroll" style={{
            width: 240, flexShrink: 0, borderRight: '1px solid #ececea',
            background: '#fafaf8', padding: '18px 14px', overflowY: 'auto',
          }}>
            <div style={{
              fontSize: 9.5, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase',
              color: '#94a3b8', padding: '4px 10px 10px',
            }}>
              Conteúdo
            </div>
            {TUTORIAL_SECTIONS.map((s, i) => {
              const active = activeId === s.id;
              return (
                <button key={s.id} onClick={() => scrollTo(s.id)}
                  style={{
                    width: '100%',
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '9px 11px', marginBottom: 2,
                    borderRadius: 9, border: 'none',
                    background: active ? 'white' : 'transparent',
                    color: active ? '#0f172a' : '#475569',
                    fontFamily: 'inherit', fontWeight: 600,
                    fontSize: 13, cursor: 'pointer', textAlign: 'left',
                    boxShadow: active ? '0 2px 6px rgba(15,23,42,.06), inset 3px 0 0 #A43939' : 'none',
                    transition: 'all .15s ease',
                  }}>
                  <span style={{
                    flexShrink: 0, width: 22, height: 22, borderRadius: 6,
                    background: active ? '#FCF4F4' : '#e2e8f0',
                    color: active ? '#A43939' : '#64748b',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 900,
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ flex: 1, lineHeight: 1.3 }}>{s.title}</span>
                </button>
              );
            })}
          </nav>

          {/* Content */}
          <div ref={contentRef} className="apex-scroll" style={{ flex: 1, overflowY: 'auto', padding: '12px 38px 60px' }}>
            {TUTORIAL_SECTIONS.map((s, i) => (
              <section key={s.id}
                ref={(el) => { sectionRefs.current[s.id] = el; }}
                style={{ paddingTop: 28, scrollMarginTop: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 9, background: '#FCF4F4',
                    border: '1px solid #F7E1E1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon name={s.icon} size={16} color="#A43939"/>
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#94a3b8' }}>
                    Passo {String(i + 1).padStart(2, '0')}
                  </div>
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: '6px 0 8px', letterSpacing: '-0.015em' }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: 15, color: '#475569', margin: '0 0 18px', lineHeight: 1.65, fontWeight: 500 }}>
                  {s.intro}
                </p>
                <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {s.steps.map((st, j) => (
                    <li key={j} style={{
                      display: 'flex', gap: 14,
                      background: 'white', padding: '14px 16px',
                      border: '1px solid #ececea', borderRadius: 12,
                    }}>
                      <div style={{
                        flexShrink: 0, width: 24, height: 24, borderRadius: 9999,
                        background: '#0f172a', color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 900, fontSize: 11.5,
                      }}>{j + 1}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14.5, fontWeight: 700, color: '#0f172a', marginBottom: 3, lineHeight: 1.35 }}>
                          {st.t}
                        </div>
                        <div style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.55, fontWeight: 500 }}>
                          {st.d}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
                {s.tip && (
                  <div style={{
                    marginTop: 14, padding: '13px 16px',
                    background: '#FCF4F4', border: '1px solid #F7E1E1', borderRadius: 12,
                    display: 'flex', gap: 11, alignItems: 'flex-start',
                  }}>
                    <Icon name="sparkles" size={16} color="#A43939" strokeWidth={2.2} style={{ marginTop: 2, flexShrink: 0 }}/>
                    <div style={{ fontSize: 13.5, color: '#7f1d1d', fontWeight: 600, lineHeight: 1.55 }}>
                      <strong style={{ fontWeight: 800 }}>Dica: </strong>{s.tip}
                    </div>
                  </div>
                )}
              </section>
            ))}

            {/* Footer */}
            <div style={{
              marginTop: 40, padding: '22px 24px',
              background: '#0f172a', borderRadius: 16, color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap',
            }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>Pronto para começar?</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,.7)', fontWeight: 500, lineHeight: 1.55 }}>
                  Feche este guia e comece pela escolha do tipo de questão.
                </div>
              </div>
              <button onClick={onClose} className="apex-btn"
                style={{ background: '#A43939', color: 'white', border: 'none' }}>
                Começar a criar
                <Icon name="arrowright" size={15}/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Keep window global for backward compatibility
if (typeof window !== 'undefined') {
  Object.assign(window, { TUTORIAL_SECTIONS, TutorialModal });
}
