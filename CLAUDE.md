# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start

**Development:**
```bash
npm install     # Install dependencies (Vite, React)
npm run dev     # Start dev server (http://localhost:5173 auto-opens)
```

**Build & Preview:**
```bash
npm run build   # Build for production (outputs to dist/)
npm run preview # Preview production build locally
```

## Architecture Overview

**Apex Professores** is a React + Vite application for creating and validating medical exam questions. The system follows a multi-phase workflow:

1. **Edit Phase**: Create/edit questions in a form with sidebar navigation
2. **Review Phase**: Batch review all questions before sending
3. **Sending Phase**: Submit questions to backend
4. **Success/Error Phase**: Display results or handle failures

### Core Data Flow

- **Questions State**: Array of question objects (id, type, enunciado, alternatives, classification, etc.)
- **Phase State**: Tracks current workflow phase (edit → review → sending → success/error)
- **Validation**: Silent validation (only shows errors when user attempts review/send)
- **Autosave**: localStorage-based persistence (`ApexStorage` in `storage.js`) syncs on every question change
- **External IDs**: Lazily generated for questions on review phase

### Key Files

**Components** (`src/components/`):
- `app.jsx`: Main App component — manages all state, phases, and question operations
- `form.jsx`: Form field components (TypeCard, EnunciadoCard, AlternativesCard, ClassificationCard, etc.)
- `sidebar.jsx`: Question navigator with status indicators (ready/draft/incomplete)
- `review.jsx`: Batch review screen and preview components
- `tutorial.jsx`: Help modal with guidance sections
- `icons.jsx`: Icon library (used throughout UI)

**Utilities** (`src/scripts/`):
- `storage.js`: localStorage wrapper (APEX_STORAGE_KEY = 'apex-autoral-drafts-v1')
- `data.js`: Datasets (CATEGORIES, ESPECIALIDADES, TEMAS, COMPETENCIAS, ORIGENS)

**Styles** (`src/styles/`):
- `styles.css`: Core component styles and layouts
- `tokens.css`: Design tokens (colors, spacing, typography)

### Question Structure

Each question object:
```javascript
{
  id: 'q_' + randomId,           // Auto-generated unique ID
  type: 'me5' | 'me4' | 'vf',    // Multiple choice (5/4 opts) or true/false
  enunciado: string,             // Question text
  image: File | null,            // Optional image blob
  imageCaption: string,          // Image caption (required if image exists)
  alternatives: [                // Array of answer options
    { id: 'A'|'B'|'C'|'D'|'E', text: string, justification: string, isCorrect: boolean },
    ...
  ],
  comentario: string,            // General comment/explanation
  categoria: string,             // Medical category code (CM, GO, PED, etc.)
  especialidade: string,         // Medical specialty
  tema: string,                  // Specific topic
  novoTema: boolean,             // User created new theme
  competencia: string,           // Competency classification
  competenciaOutro: string,      // Custom competency (if applicable)
  ano: string,                   // Year (defaults to current)
  origem: string,                // Question origin (Adaptada, Autoral, etc.)
  origemOutro: string,           // Custom origin
  createdAt: timestamp,          // Creation timestamp
}
```

### Validation Rules

Applied silently (only shown on review attempt):
- **Required**: enunciado, alternatives (text for non-VF), exactly one correct answer, comentario, categoria, especialidade, tema, competencia
- **Optional**: justifications, year, origin, image
- **Status Badges**: ready (all valid), incomplete (missing required), draft (no progress)

### Component Patterns

**Form Components** use controlled inputs:
- `value` + `onChange` props for state management
- `error` prop displays validation messages
- Styles use inline objects with `.apex-*` CSS classes for shared styling

**State Updates**:
- `updateCurrent(partial)`: Merges changes into current question
- `setQuestions(prev => ...)`: Immutable updates to question array
- Statuses/pending are memoized on question changes for performance

### Phase-Specific Logic

- **Edit**: Sidebar allows adding/duplicating/removing questions; footer shows current status
- **Review**: Grid view of all questions with inline editing; pending list if validation attempted
- **Sending**: Spinner state (hardcoded 2200ms delay)
- **Success**: Display sent question IDs; offer to continue with remaining drafts or start fresh
- **Error**: Retry button (can mock failure with `?fail=1` in URL)

## Development Notes

- **Blob URLs**: Image blob URLs from `<input type="file">` are stripped on autosave (don't persist across sessions)
- **Autosave Debounce**: 450ms delay before writing to localStorage
- **Scrolling**: Manual `window.scrollTo()` calls after phase transitions
- **No external APIs yet**: Backend integration (sending questions) is mocked in `doSend()`
- **TypeCard**: Switching question type (`vf` ↔ `me5`/`me4`) preserves text and justifications where compatible

## Design System

**Color Palette** (by category):
- Clínica Médica: #A43939 (red)
- Ginecologia: #7c3aed (purple)
- Pediatria: #16a34a (green)
- Cirurgia: #2563eb (blue)
- (See `data.js` for full palette)

**Token Colors**:
- Text: #0f172a (dark), #475569 (secondary), #64748b (tertiary)
- Backgrounds: white, #f1f5f9 (subtle), #FCF4F4 (soft category color)
- Borders: #ececea (light), #F7E1E1 (soft red)

## git Workflow

Default branch: main. Create feature branches as needed. Before pushing, ensure:
- Questions serialize/deserialize correctly (test autosave round-trip)
- No console errors in dev or build
- Sidebar status badges reflect validation state accurately
