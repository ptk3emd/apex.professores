// Apex Medicina — Criar questão autoral · datasets

export const CATEGORIES = [
  { code: "CM",   label: "Clínica Médica",            accent: "#A43939", soft: "#FCF4F4" },
  { code: "GO",   label: "Ginecologia e Obstetrícia", accent: "#7c3aed", soft: "#faf5ff" },
  { code: "PED",  label: "Pediatria",                 accent: "#16a34a", soft: "#f0fdf4" },
  { code: "CC",   label: "Cirurgia",                  accent: "#2563eb", soft: "#eff6ff" },
  { code: "SC",   label: "Saúde Coletiva",            accent: "#d97706", soft: "#fffbeb" },
  { code: "SM",   label: "Saúde Mental",              accent: "#0891b2", soft: "#ecfeff" },
  { code: "CB",   label: "Ciclo Básico",              accent: "#0284c7", soft: "#f0f9ff" },
  { code: "PREV", label: "Medicina Preventiva",       accent: "#65a30d", soft: "#f7fee7" },
];

// Especialidades por categoria (lista representativa)
export const ESPECIALIDADES = {
  CM:   ["Cardiologia", "Pneumologia", "Endocrinologia", "Gastroenterologia", "Nefrologia",
         "Hematologia", "Infectologia", "Reumatologia", "Neurologia", "Geriatria",
         "Dermatologia", "Oftalmologia", "Otorrinolaringologia"],
  GO:   ["Obstetrícia", "Ginecologia", "Mastologia", "Reprodução Humana"],
  PED:  ["Neonatologia", "Pediatria Geral", "Cardiopediatria", "Infectologia Pediátrica",
         "Adolescente", "Aleitamento Materno"],
  CC:   ["Cirurgia Geral", "Cirurgia Vascular", "Urologia", "Ortopedia", "Trauma",
         "Cirurgia do Aparelho Digestivo", "Anestesiologia"],
  SC:   ["Epidemiologia", "Bioestatística", "Vigilância em Saúde", "SUS — Princípios",
         "Atenção Primária", "Saúde do Trabalhador"],
  SM:   ["Transtornos de Humor", "Transtornos de Ansiedade", "Psicoses", "Dependências"],
  CB:   ["Anatomia", "Fisiologia", "Bioquímica", "Farmacologia", "Patologia", "Imunologia"],
  PREV: ["Medicina Preventiva", "Promoção de Saúde", "Imunizações", "Saúde da Família"],
};

// Lista representativa de temas específicos
// (placeholder — substituir pela lista oficial)
export const TEMAS = [
  "Infarto Agudo do Miocárdio com Supradesnivelamento de ST",
  "Síndrome Coronariana Aguda sem Supra de ST",
  "Insuficiência Cardíaca Descompensada",
  "Fibrilação Atrial — Manejo Agudo",
  "Hipertensão Arterial Sistêmica — Diagnóstico",
  "Crise Hipertensiva — Urgência vs Emergência",
  "Embolia Pulmonar Aguda",
  "Pneumonia Adquirida na Comunidade",
  "DPOC Exacerbada",
  "Asma Brônquica — Crise Aguda",
  "Tuberculose Pulmonar",
  "Diabetes Mellitus Tipo 2 — Diagnóstico",
  "Cetoacidose Diabética",
  "Estado Hiperglicêmico Hiperosmolar",
  "Hipotireoidismo Primário",
  "Tireotoxicose",
  "Insuficiência Adrenal Aguda",
  "Pancreatite Aguda",
  "Hepatite Viral Aguda",
  "Cirrose e suas Complicações",
  "Hemorragia Digestiva Alta",
  "Doença Inflamatória Intestinal",
  "Doença Renal Crônica",
  "Injúria Renal Aguda",
  "Distúrbios do Sódio — Hiponatremia",
  "Distúrbios do Potássio",
  "Anemia Ferropriva",
  "Anemia Falciforme",
  "Leucemias Agudas",
  "Sepse e Choque Séptico",
  "Meningite Bacteriana Aguda",
  "Dengue, Zika e Chikungunya",
  "HIV — Diagnóstico e Manejo Inicial",
  "Sífilis — Estágios e Tratamento",
  "Endocardite Infecciosa",
  "AVC Isquêmico Agudo",
  "AVC Hemorrágico",
  "Epilepsia e Estado de Mal Epiléptico",
  "Cefaleias Primárias",
  "Pré-eclâmpsia e Eclâmpsia",
  "Hemorragia Pós-parto",
  "Diabetes Gestacional",
  "Sangramento Uterino Anormal",
  "Câncer de Mama — Rastreio",
  "Câncer de Colo Uterino — Prevenção",
  "Sepse Neonatal",
  "Bronquiolite Viral Aguda",
  "Crupe Viral",
  "Calendário Vacinal da Criança",
  "Cólica do Lactente",
  "Apendicite Aguda",
  "Colecistite e Colelitíase",
  "Obstrução Intestinal",
  "Trauma Abdominal — ATLS",
  "Trauma Torácico — ATLS",
  "Choque Hipovolêmico",
  "Indicadores Epidemiológicos",
  "Sistema Único de Saúde — Princípios e Diretrizes",
  "Atenção Primária à Saúde",
  "Vigilância Epidemiológica",
  "Notificação Compulsória",
];

export const COMPETENCIAS = [
  "Diagnóstico",
  "Epidemiologia",
  "Fisiologia/Fisiopatologia/Anatomia",
  "Conduta",
  "Outro mais específico",
];

export const ORIGENS = [
  "Adaptada",
  "UNIFASE",
  "Outro",
];

// Keep window global for backward compatibility during migration
if (typeof window !== 'undefined') {
  Object.assign(window, { CATEGORIES, ESPECIALIDADES, TEMAS, COMPETENCIAS, ORIGENS });
}
