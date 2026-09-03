# Architectural and Pedagogical Decisions Log

### 1. Build Tool & Framework Selection (Vite vs. Next.js 14)
- **Context**: The master prompt states:
  *"React 18 + TypeScript (strict) + Tailwind. Vite, static build. If extending the existing ECONOMY_EXPLORER/ Next.js 14 app instead, say so in DECISIONS.md and match that stack rather than mixing both. Output: npm run build produces a fully static bundle that runs from a static host or file://."*
- **Decision**: Implemented with **Vite 6 + React 18 + TypeScript + Tailwind CSS** configured with `base: './'`.
- **Rationale**: Next.js 14 static exports (`output: 'export'`) rely on absolute path roots (`/_next/...`) which break when opened directly via the `file://` protocol without a running web server. Vite with relative asset paths guarantees 100% offline portability directly from a flash drive, school desktop, or static host with zero network dependencies.

### 2. Missing Local Source Text (`content/source/`)
- **Context**: Master prompt Section 2 mandates inspecting `content/source/`. If missing, build against the provisional whitelist, mark items `source: 'unverified'`, and produce `CONTENT_REVIEW.md`.
- **Decision**: No files existed in `content/source/`. All 10 nodes, 3 product journeys, 4 scenarios, and 42 questions were authored strictly adhering to NCERT Class 6 Ch. 14 concepts and tagged `source: 'unverified'` or `'everyday-example'`. `CONTENT_REVIEW.md` was created for teacher verification.

### 3. Machine-Checkable Reasoning & Scoring Formula
- **Context**: The application runs entirely client-side with zero backend and zero LLM calls. Free-text reasoning cannot be reliably scored without an AI or server.
- **Decision**: Implemented 3 written plausible explanations for "Why did this happen?" questions.
- **Scoring formula (100 pts total)**:
  - Exploration: 10 pts (all 3 sectors visited)
  - Prediction: 20 pts (correct pre-run prediction on first attempt)
  - Reasoning: 20 pts (correct explanation chosen)
  - Problem solving: 20 pts (Fix the Economy + Chain Builder challenges, deducting for wrong attempts)
  - Assessment: 30 pts (3 pts × 10 sampled questions)
- **Anti-random-clicking guard**: Predictions lock permanently before simulation runs; re-answering disabled once feedback is displayed; only first attempts score points. A student who changes their mind for the right reason is praised: *"You changed your mind for the right reason — that's how scientists work."*

### 4. Graph Validation Strategy for Chains and Repairs
- **Context**: Students can connect nodes or sequence chain cards. Real economic networks have parallel branches (e.g. dairy farm and cotton farm both feeding transport; transport feeding mill and dairy plant).
- **Decision**: Implemented a topological dependency validator (`graphValidator.ts`) instead of strict linear string matching. Any sequence or set of connections where every prerequisite dependency edge is satisfied is accepted as valid.

### 5. Synthesized Web Audio API (Zero Asset Files)
- **Context**: Master prompt Section 11 forbids audio files and requires Web Audio API synthesis with default OFF and audio context initiated on first user gesture.
- **Decision**: Built `utils/audio.ts` synthesizing sine and triangle wave frequencies with gentle envelope shaping for 6 distinct feedback events:
  - Click / Tap (`280 Hz`)
  - Machine Start (`220 -> 440 Hz`)
  - Product Move (`330 -> 550 Hz`)
  - Connection Made (`520 -> 660 Hz`)
  - Challenge Complete (`440 -> 554 -> 659 Hz` major chord)
  - Success Flourish (`523 -> 659 -> 783 -> 1046 Hz` celebration chime)
