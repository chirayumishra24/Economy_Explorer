import React from 'react';
import { useEconomy } from './context/EconomyStore';
import { Header } from './components/shell/Header';
import { Footer } from './components/shell/Footer';
import { StartScreen } from './components/start/StartScreen';
import { ExploreMap } from './components/stops/Stop1Explore/ExploreMap';
import { ProductJourneyView } from './components/stops/Stop2FollowProduct/ProductJourneyView';
import { WhatIfLab } from './components/stops/Stop3WhatIf/WhatIfLab';
import { BrokenMachine } from './components/stops/Stop4FixEconomy/BrokenMachine';
import { ChainBuilder } from './components/stops/Stop5FinalChallenge/ChainBuilder';
import { AssessmentQuiz } from './components/stops/Stop6Assessment/AssessmentQuiz';
import { ResultsScreen } from './components/stops/Stop6Assessment/ResultsScreen';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { TeamArenaHub } from './components/team-activities/TeamArenaHub';
import { SectorSorterBattle } from './components/team-activities/SectorSorterBattle';
import { AmulFlowchartChallenge } from './components/team-activities/AmulFlowchartChallenge';

export const App: React.FC = () => {
  const { state, dispatch } = useEconomy();

  // Screen level routing (Start screen vs Teacher report vs Team Games vs Main Hub)
  if (state.screen === 'start') {
    return (
      <main className="w-full h-full">
        <StartScreen />
      </main>
    );
  }

  if (state.screen === 'teacher') {
    return (
      <main className="w-full h-full">
        <TeacherDashboard />
      </main>
    );
  }

  if (state.screen === 'team-games') {
    return (
      <main className="w-full h-full">
        <TeamArenaHub
          initialActivity={
            state.currentStop === 'sector-battle'
              ? 'sector-battle'
              : state.currentStop === 'amul-flowchart'
              ? 'amul-flowchart'
              : 'menu'
          }
          onBackToMain={() => dispatch({ type: 'NAVIGATE_STOP', stop: 'explore' })}
        />
      </main>
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-between overflow-hidden bg-background">
      {/* Persistent Shell Header */}
      <Header />

      {/* Main Canonical Stop Content with 250ms crossfade transition */}
      <main className="flex-1 w-full overflow-hidden relative transition-opacity duration-250 ease-in-out">
        {state.currentStop === 'explore' && <ExploreMap />}
        {state.currentStop === 'follow-product' && <ProductJourneyView />}
        {state.currentStop === 'what-if' && <WhatIfLab />}
        {state.currentStop === 'fix-economy' && <BrokenMachine />}
        {state.currentStop === 'final-challenge' && <ChainBuilder />}
        {state.currentStop === 'assessment' && <AssessmentQuiz />}
        {(state.currentStop === 'results' || state.currentStop === 'review') && <ResultsScreen />}
        {state.currentStop === 'sector-battle' && (
          <SectorSorterBattle
            onGoToAmulFlowchart={() => dispatch({ type: 'NAVIGATE_STOP', stop: 'amul-flowchart' })}
            onExit={() => dispatch({ type: 'NAVIGATE_STOP', stop: 'explore' })}
          />
        )}
        {state.currentStop === 'amul-flowchart' && (
          <AmulFlowchartChallenge
            onGoToSectorSorter={() => dispatch({ type: 'NAVIGATE_STOP', stop: 'sector-battle' })}
            onExit={() => dispatch({ type: 'NAVIGATE_STOP', stop: 'explore' })}
          />
        )}
      </main>

      {/* Persistent Shell Footer */}
      <Footer />
    </div>
  );
};
