# The Economy Machine
**"See How an Economy Works" · Social Science · Class 6 · NCERT Ch. 14 "Economic Activities Around Us"**

An offline-capable, single-page interactive simulation where Class 6 students watch goods and services move through an economy, change parts of the system, predict outcomes, and see consequences ripple through connected activities.

---

## Quick Start (Offline & Local)

### Option A: Run Without Node / Direct Static Host
The production build is in `dist/`. Because assets use relative paths (`./assets/...`) with zero external CDNs or web fonts, you can:
- Open `dist/index.html` directly in any modern browser (`file:///...`), or
- Place the `dist/` folder on any USB drive or school offline file share.

### Option B: Local Development Server
```bash
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

### Option C: Production Build
```bash
npm run build
```
Generates self-contained static assets in `dist/`.

---

## How to Edit Curriculum Content (Teacher & Admin Guide)

All curriculum content is separated into typed data files in `src/data/`. No teachable string is hardcoded in UI components:

1. **Economic Nodes (`src/data/nodes.ts`)**:
   - Change workers (`who`), actions (`doing`), or economic outputs (`good` / `service`).
   - Sector assignment: `primary` (nature), `secondary` (making), `tertiary` (services).

2. **Value Chains & Product Journeys (`src/data/products.ts`)**:
   - Modify the 5-stage journeys for Cotton Shirt, Fresh Milk, or Wooden Desk.
   - Captions are kept under 20 words for Class 6 reading comprehension.

3. **Disruption Scenarios (`src/data/scenarios.ts`)**:
   - Edit "What If?" scenarios (Transport Blockade, Cotton Drought, Factory Power Cut, Bank Closure).
   - Edit the 400ms staged ripple propagation orders and learning cards.

4. **Question Bank (`src/data/questions.ts`)**:
   - 42 questions spanning all 6 concepts and 7 formats.
   - Easily add new questions or modify answer keys and explanations.

---

## Accessibility & Classroom Features

- **Classroom Mode**: Tap the 👨‍🏫 icon in the header to enlarge fonts/targets to 1.25× and hide score indicators for smartboard use.
- **Synthesized Audio**: Toggle sound in the top right. Audio is synthesized live using the browser Web Audio API — zero audio files required. Default is muted.
- **Keyboard Navigation**: All interactions, including node selection and connecting broken links, can be operated via standard Tab and Enter/Space keys.
- **Teacher Dashboard**: Click "For Teachers" in the footer at any time to view session analytics, concept accuracy, and print/save a summary via `window.print()`.
