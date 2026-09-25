# Two-Team Classroom Activities: Sector Sorter Battle & Amul Flowchart Challenge

> **For Claude / Developer:** Implementation plan for adding two fun, gamified 2-team classroom activities for NCERT Class 6 Social Science.

**Goal:** Create two gamified, interactive, drag-and-drop classroom activities for 2 teams:
1. **Sector Showdown (3-Column Sector Sorter)**: Teams take turns categorizing illustrated economic activity cards into Primary, Secondary, or Tertiary columns.
2. **The Great Amul Flowchart Race**: Teams arrange the stages of the Amul cooperative milk journey into an interconnected flowchart with simulated milk pipeline animation.

**Architecture:**
- **Data Layer**: Clean, strongly-typed scenario & card definitions with rich SVG scene illustrations, child-friendly descriptions, NCERT Class 6 explanations, and sector/flowchart metadata.
- **Game Engine & State**: Team state machine (Team Alpha vs Team Beta), turn switcher, timer, score counter, streak multiplier, drag-and-drop handlers (HTML5 Drag + Touch/Click fallback for classroom smartboards), and Web Audio API sound effects.
- **Visuals & UI**: High-energy game UI with bright sector color accents, badges, bouncy cards, glowing drop zones, flowchart pipe connectors with animated milk droplets, and victory podium celebration with confetti.
- **Routing & Navigation**: Integrated into the Header navigation, Teacher Jump menu, Start Screen "🎮 Team Arena" mode, and App screen router.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Lucide Icons, Web Audio API Synthesizer, Canvas Confetti.

---

### Task 1: Data Models & Asset Data
**Files:**
- Modify: `src/types/economy.ts`
- Create: `src/data/teamActivitiesData.ts`
- Create: `src/components/illustrations/ActivityScenes.tsx`

**Details:**
1. Define TypeScript interfaces:
   - `SectorCard`: `id`, `title`, `description`, `sector` ('primary' | 'secondary' | 'tertiary'), `icon`, `illustrationKey`, `hint`, `funFact`.
   - `AmulStageCard`: `id`, `stepNumber`, `title`, `description`, `sector`, `illustrationKey`, `rationale`.
   - `TeamState`: `name`, `score`, `streak`, `avatar`, `color`.
2. Author 12 rich sector cards (4 primary, 4 secondary, 4 tertiary) with Class 6 NCERT relatable Indian contexts:
   - Primary: Farmer harvesting wheat, Dairy farmer milking cow, Fisherman catching fish in river, Forester tapping rubber/collecting timber.
   - Secondary: Potter baking earthen pots, Textile mill weaver spinning cotton yarn, Baker baking wheat into bread, Sugar mill crushing sugarcane into jaggery/sugar.
   - Tertiary: Truck driver transporting goods on highway, Bank teller managing savings account, Doctor examining student at school clinic, Shopkeeper selling groceries at village bazaar.
3. Author the 6 canonical Amul Flowchart steps:
   - Step 1: Milk Harvesting by Village Farmers
   - Step 2: Village Cooperative Collection & Fat Testing
   - Step 3: Insulated Refrigerated Milk Tanker Transport
   - Step 4: Amul Anand Dairy Processing (Pasteurization, Butter & Cheese)
   - Step 5: Cold Storage Distribution & Amul Milk Parlours
   - Step 6: Happy School Students & Families Drinking Fresh Milk
4. Build `ActivityScenes.tsx` containing beautiful, responsive, vectorized SVG scene illustrations for each card so the app remains 100% offline, crystal clear on 4K smartboards, and zero asset download dependent.

---

### Task 2: Sound & Confetti Enhancements
**Files:**
- Modify: `src/utils/audio.ts` (add buzzer sound, team turn chime, whoosh sound)
- Create: `src/utils/confetti.ts` (lightweight canvas-based victory particle confetti)

**Details:**
- Add `playBuzzer()`, `playTurnSwitch()`, `playFanfare()`, and `playWhoosh()` to `SoundEngine`.
- Implement zero-dependency canvas confetti for instant visual joy when a team wins or completes the flowchart!

---

### Task 3: Activity 1 — 3-Column Sector Sorter Battle
**Files:**
- Create: `src/components/team-activities/SectorSorterBattle.tsx`
- Create: `src/components/team-activities/SectorDropColumn.tsx`
- Create: `src/components/team-activities/TeamScoreHeader.tsx`

**Features:**
- **2-Team Turn Indicator**: Prominent glowing banner showing whose turn it is ("Team 1's Turn" / "Team 2's Turn") with customizable team names.
- **Card Dock**: Shows current card to be classified with full illustration, "What is happening here?" description, and audio cue.
- **3 Vibrant Columns**:
  - 🌾 Primary Sector (Nature / Extraction)
  - 🏭 Secondary Sector (Making / Manufacturing)
  - 🚚 Tertiary Sector (Services / Support)
- **Interactive Drag & Drop**:
  - Drag the card and drop it directly onto the target column.
  - Smartboard / Touch click-to-place fallback: click card, then tap any column!
- **Feedback & Game Logic**:
  - Correct placement: +10 points, celebratory chime, green glow, "+10!" particle effect, card locks into column history.
  - Incorrect placement: soft buzzer, gentle clue explaining why it belongs to the correct sector, turn passes to opposing team to steal!
- **End Game Victory Screen**:
  - Final score comparison, winner trophy, confetti blast, breakdown of cards classified, rematch option.

---

### Task 4: Activity 2 — Amul Case Study Flowchart Challenge
**Files:**
- Create: `src/components/team-activities/AmulFlowchartChallenge.tsx`
- Create: `src/components/team-activities/FlowchartStepSlot.tsx`
- Create: `src/components/team-activities/MilkPipelineConnector.tsx`

**Features:**
- **Cooperative / Competitive Team Modes**:
  - *Option 1*: Team Relay (Team 1 places odd steps, Team 2 places even steps).
  - *Option 2*: Team 1 Round vs Team 2 Round (Both teams test their economic logic independently, competing for highest accuracy & fastest flow time).
- **Interactive Flowchart Board**:
  - 6 horizontal / zig-zag flowchart nodes with numbered badges (Step 1 -> Step 6).
  - Animated SVG connecting pipes with directional arrows.
- **Drag & Drop Reordering**:
  - Drag scenario cards into the flowchart slots.
  - Swap / replace cards dynamically.
- **"Run Milk Flow" Simulation Button**:
  - Simulates the milk journey from cow to child!
  - Animated white & gold milk stream flows through the connecting pipeline.
  - If a step is misplaced, the pipeline turns red at the blockage with teacher-friendly diagnostic feedback (e.g., "Wait! You cannot distribute milk to retail booths before pasteurizing it at the central dairy plant!").
  - On complete success: sparkling celebration flourish, confetti, Amul cooperative story badge ("Certified White Revolution Junior Economist").

---

### Task 5: Team Arena Hub & Seamless App Integration
**Files:**
- Create: `src/components/team-activities/TeamArenaHub.tsx`
- Modify: `src/types/economy.ts` (add `'sector-battle' | 'amul-flowchart'` or screen modes)
- Modify: `src/context/EconomyStore.tsx` (handle team game actions & navigation)
- Modify: `src/components/shell/Header.tsx` (add Team Games launcher button and jump links)
- Modify: `src/components/start/StartScreen.tsx` (add prominent "🎮 Team Games (2 Teams)" button)
- Modify: `src/App.tsx` (route to team game activities)

**Features:**
- Seamless switching between Solo Exploration and Classroom 2-Team Game Arena.
- Dedicated Team Setup screen (choose team names: e.g. "Milk Tigers" vs "Grain Champions", pick team colors and mascot avatars).
- Accessible anytime via the top navigation bar and teacher jump dropdown.

---

### Task 6: Testing & Quality Assurance
**Steps:**
1. Run `npm run build` to verify strict TypeScript compilation and Vite static bundling.
2. Test keyboard navigation and ARIA labels.
3. Test Drag and Drop + Touch click-to-slot behavior.
4. Verify Web Audio synthesis and offline zero-network execution.
