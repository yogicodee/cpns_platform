import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, Home, Brain, ChevronDown, CheckCircle2, XCircle } from 'lucide-react';
import { TryoutSession, UserAnswer, Category } from '../types';
import { cn } from '../lib/utils';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import ReactMarkdown from 'react-markdown';
import { analyzePerformance } from '../services/aiService';

interface ResultViewProps {
  session: TryoutSession;
  onRestart: () => void;
  onBackToMenu: () => void;
}

export function ResultView({ session, onRestart, onBackToMenu }: ResultViewProps) {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'DISCUSSION' | 'AI'>('OVERVIEW');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Calculate scores
  const results = Object.values(session.answers);
  const correctCount = results.filter(a => a.isCorrect).length;
  const totalScore = results.reduce((acc, a) => acc + (a.score || (a.isCorrect ? 5 : 0)), 0);

  const categoryScores = results.reduce((acc, a) => {
    const q = session.questions.find(q => q.id === a.questionId);
    if (!q) return acc;
    if (!acc[q.category]) acc[q.category] = { score: 0, total: 0 };
    acc[q.category].score += a.score || (a.isCorrect ? 5 : 0);
    acc[q.category].total += 5; // Assumed max per question
    return acc;
  }, {} as Record<Category, { score: number, total: number }>);

  const chartData = Object.entries(categoryScores).map(([cat, val]) => ({
    subject: cat,
    score: (val.score / val.total) * 100,
  }));

  useEffect(() => {
    if (activeTab === 'AI' && !aiAnalysis) {
      setLoadingAi(true);
      analyzePerformance({ totalScore, correctCount, categoryScores })
        .then(setAiAnalysis)
        .finally(() => setLoadingAi(false));
    }
  }, [activeTab, totalScore, correctCount, categoryScores, aiAnalysis]);

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      {/* Result Hero */}
      <div className="bg-zinc-900 text-white pt-20 pb-40 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 blur-3xl bg-indigo-600 rounded-full -top-40 -left-40 w-96 h-96" />
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block p-4 bg-white/10 rounded-3xl mb-6 backdrop-blur-md"
          >
            <Trophy className="w-12 h-12 text-amber-400" />
          </motion.div>
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Hasil Simulasi Kamu</h1>
          <div className="flex justify-center gap-12 items-end">
            <div className="text-center">
              <div className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-1">Skor Total</div>
              <div className="text-6xl font-black font-mono">{totalScore}</div>
            </div>
            <div className="h-16 w-px bg-white/10" />
            <div className="text-center">
              <div className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-1">Akurasi</div>
              <div className="text-4xl font-bold font-mono">{Math.round((correctCount / session.questions.length) * 100)}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="max-w-5xl mx-auto px-4 -mt-24 relative z-20">
        <div className="bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-zinc-100 p-2">
            {[
              { id: 'OVERVIEW', label: 'Ringkasan', icon: <Trophy size={18} /> },
              { id: 'DISCUSSION', label: 'Pembahasan', icon: <ChevronDown size={18} /> },
              { id: 'AI', label: 'Analisis AI', icon: <Brain size={18} /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex-grow flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm transition-all",
                  activeTab === tab.id ? "bg-zinc-900 text-white shadow-lg" : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {activeTab === 'OVERVIEW' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
                >
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                        <PolarGrid stroke="#e4e4e7" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 12, fontWeight: 700 }} />
                        <Radar
                          name="Score"
                          dataKey="score"
                          stroke="#4f46e5"
                          fill="#4f46e5"
                          fillOpacity={0.5}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold">Passing Grade Status</h3>
                    <div className="space-y-4">
                      {Object.entries(categoryScores).map(([cat, val]) => (
                        <div key={cat} className="space-y-1">
                          <div className="flex justify-between text-sm font-bold">
                            <span className="text-zinc-500 uppercase tracking-wider">{cat}</span>
                            <span>{val.score} / {val.total}</span>
                          </div>
                          <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(val.score / val.total) * 100}%` }}
                              className="h-full bg-zinc-900"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'DISCUSSION' && (
                <motion.div
                  key="discussion"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {session.questions.map((q, idx) => {
                    const ans = session.answers[q.id];
                    const isCorrect = ans?.isCorrect || (ans?.score && ans.score === 5);
                    return (
                      <div key={q.id} className="p-6 rounded-2xl border border-zinc-100 bg-zinc-50 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-4">
                            <span className="font-bold text-zinc-300"># {idx + 1}</span>
                            <h4 className="font-bold text-zinc-800">{q.text}</h4>
                          </div>
                          {isCorrect ? <CheckCircle2 className="text-green-500" /> : <XCircle className="text-red-500" />}
                        </div>
                        <div className="pl-10 space-y-2">
                          <p className="text-sm text-zinc-500 italic">Pilihan kamu: <span className={isCorrect ? "text-green-600 font-bold" : "text-red-600 font-bold"}>{q.options.find(o => o.id === ans?.selectedOptionId)?.text || 'Tidak dijawab'}</span></p>
                          <div className="p-4 bg-white rounded-xl border border-zinc-200 text-sm leading-relaxed">
                            <span className="font-bold text-zinc-900 block mb-1 underline decoration-zinc-200 underline-offset-4">Pembahasan:</span>
                            {q.explanation}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}

              {activeTab === 'AI' && (
                <motion.div
                  key="ai"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="prose prose-zinc max-w-none"
                >
                  {loadingAi ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      >
                        <Brain size={40} className="text-zinc-300" />
                      </motion.div>
                      <p className="font-bold text-zinc-400 uppercase tracking-widest text-xs">AI sedang menganalisis performamu...</p>
                    </div>
                  ) : (
                    <div className="markdown-body">
                      <ReactMarkdown>{aiAnalysis || 'Gagal memuat analisis AI.'}</ReactMarkdown>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Global Actions */}
        <div className="mt-12 flex justify-center gap-6">
          <button
            onClick={onBackToMenu}
            className="px-10 py-4 border-2 border-zinc-200 hover:border-zinc-900 font-bold rounded-2xl transition-all flex items-center gap-2 group"
          >
            <Home size={20} className="text-zinc-400 group-hover:text-zinc-900" />
            Kembali ke Menu
          </button>
          <button
            onClick={onRestart}
            className="px-10 py-4 bg-zinc-900 hover:bg-black text-white font-bold rounded-2xl transition-all shadow-xl shadow-zinc-200 flex items-center gap-2"
          >
            <RefreshCw size={20} />
            Coba Lagi
          </button>
        </div>
      </div>
    </div>
  );
}
