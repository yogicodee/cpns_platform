/**
 * Main Application Component
 * 
 * This file orchestrates the different states of the Lyria Rhythm game.
 * It handles the transitions between the main menu, the song library, 
 * the generation loading screen, the active gameplay, and the results screen.
 * 
 * Use Cases:
 * - Start a new game (quick or full duration).
 * - Select a pre-generated song from the library.
 * - View game results and restart.
 */

import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Simulasi } from './components/Simulasi';
import { ResultView } from './components/ResultView';
import { UserStats, TryoutSession, UserAnswer } from './types';
import { SAMPLE_QUESTIONS } from './questions';
import { generateQuestions } from './services/aiService';
import { Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type AppState = 'DASHBOARD' | 'LOADING' | 'TRYOUT' | 'RESULT';

export default function App() {
  const [appState, setAppState] = useState<AppState>('DASHBOARD');
  const [stats, setStats] = useState<UserStats>({
    xp: 1250,
    level: 5,
    streak: 3,
    totalTryouts: 12,
    avgScore: { TWK: 75, TIU: 80, TKP: 85 },
    weakTopics: ['Pancasila', 'Logika Numerik'],
    strongTopics: ['Integritas', 'Wicara'],
  });
  const [currentSession, setCurrentSession] = useState<TryoutSession | null>(null);

  const startTryout = async (type: 'SIMULATION' | 'PRACTICE' | 'ADAPTIVE') => {
    setAppState('LOADING');
    
    let questions = [...SAMPLE_QUESTIONS];
    
    if (type === 'ADAPTIVE') {
        const aiQuestions = await generateQuestions('TIU', 5); // Example: adaptive for TIU
        if (aiQuestions.length > 0) questions = aiQuestions;
    } else if (type === 'SIMULATION') {
        // In real app, we would fetch 110 questions. For MVP, we use sample + some generated
        questions = [...SAMPLE_QUESTIONS, ...SAMPLE_QUESTIONS, ...SAMPLE_QUESTIONS]; 
    }

    const session: TryoutSession = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      startTime: Date.now(),
      questions: questions,
      answers: {},
      status: 'IN_PROGRESS',
    };

    setCurrentSession(session);
    setAppState('TRYOUT');
  };

  const completeTryout = (answers: Record<string, UserAnswer>) => {
    if (!currentSession) return;
    
    const updatedSession: TryoutSession = {
      ...currentSession,
      answers,
      status: 'COMPLETED',
      endTime: Date.now(),
    };
    
    setCurrentSession(updatedSession);
    
    // Update stats logic (pseudo)
    setStats(prev => ({
        ...prev,
        totalTryouts: prev.totalTryouts + 1,
        xp: prev.xp + 100,
        level: Math.floor((prev.xp + 100) / 500) + 1
    }));

    setAppState('RESULT');
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans selection:bg-indigo-100">
      <AnimatePresence mode="wait">
        {appState === 'DASHBOARD' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <nav className="h-20 bg-white border-b border-zinc-200 px-8 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
                        <Brain size={18} className="text-white" />
                    </div>
                    <span className="text-xl font-black tracking-tighter text-zinc-900">CPNS MASTER <span className="text-indigo-600">AI</span></span>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Peringkat</div>
                        <div className="text-xs font-bold text-zinc-900">Top 5% Nasional</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                        YU
                    </div>
                </div>
            </nav>
            <Dashboard stats={stats} onStartTryout={startTryout} />
          </motion.div>
        )}

        {appState === 'LOADING' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen flex flex-col items-center justify-center space-y-6"
          >
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                className="w-16 h-16 border-4 border-zinc-200 border-t-zinc-900 rounded-full"
            />
            <div className="text-center space-y-2">
                <h3 className="text-lg font-bold uppercase tracking-widest">Menyiapkan Ruang Ujian</h3>
                <p className="text-sm text-zinc-400">AI sedang memformulasikan soal ujian terbaik untukmu...</p>
            </div>
          </motion.div>
        )}

        {appState === 'TRYOUT' && currentSession && (
          <motion.div
            key="tryout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Simulasi session={currentSession} onComplete={completeTryout} />
          </motion.div>
        )}

        {appState === 'RESULT' && currentSession && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ResultView 
                session={currentSession} 
                onBackToMenu={() => setAppState('DASHBOARD')}
                onRestart={() => startTryout(currentSession.type)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

