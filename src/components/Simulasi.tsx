import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Timer, Flag, Info, CheckCircle2 } from 'lucide-react';
import { Question, TryoutSession, UserAnswer } from '../types';
import { cn, formatTime } from '../lib/utils';

interface SimulasiProps {
  session: TryoutSession;
  onComplete: (answers: Record<string, UserAnswer>) => void;
}

export function Simulasi({ session, onComplete }: SimulasiProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, UserAnswer>>(session.answers);
  const [timeLeft, setTimeLeft] = useState(100 * 60); // 100 minutes for simulation
  const [markedQuestions, setMarkedQuestions] = useState<Set<string>>(new Set());
  const [startTime] = useState(Date.now());

  const currentQuestion = session.questions[currentIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          onComplete(answers);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [answers, onComplete]);

  const handleSelectOption = (optionId: string) => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const answer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedOptionId: optionId,
      timeSpent: timeSpent,
      isCorrect: currentQuestion.correctAnswerId 
        ? optionId === currentQuestion.correctAnswerId
        : undefined,
      score: currentQuestion.options.find(o => o.id === optionId)?.score
    };
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
  };

  const toggleMark = () => {
    setMarkedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(currentQuestion.id)) next.delete(currentQuestion.id);
      else next.add(currentQuestion.id);
      return next;
    });
  };

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden">
      {/* Side Navigation */}
      <div className="w-80 bg-white border-r border-zinc-200 flex flex-col">
        <div className="p-6 border-bottom border-zinc-100 bg-zinc-900 text-white">
          <div className="flex items-center gap-2 mb-2 group cursor-pointer" onClick={() => {}}>
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Kembali ke Menu</span>
          </div>
          <h2 className="text-lg font-bold">Navigasi Soal</h2>
        </div>
        
        <div className="flex-grow overflow-y-auto p-4 grid grid-cols-5 gap-2 content-start">
          {session.questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "h-10 w-10 text-xs font-bold rounded-lg flex items-center justify-center transition-all border-2",
                currentIndex === idx ? "border-zinc-900 bg-zinc-900 text-white" : 
                answers[q.id] ? "border-green-500 bg-green-50 text-green-700" :
                markedQuestions.has(q.id) ? "border-amber-400 bg-amber-50 text-amber-700" :
                "border-zinc-200 bg-white text-zinc-400 hover:border-zinc-300"
              )}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <div className="p-6 border-t border-zinc-100 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-zinc-400">
                <span>Terjawab:</span>
                <span className="text-zinc-900">{Object.keys(answers).length} / {session.questions.length}</span>
            </div>
            <button 
                onClick={() => onComplete(answers)}
                className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl shadow-lg shadow-green-200 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
                <CheckCircle2 size={18} />
                Selesai Ujian
            </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <div className="h-20 bg-white border-b border-zinc-200 px-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-xl border border-zinc-200 font-mono text-lg font-bold shadow-sm",
                timeLeft < 300 ? "text-red-600 border-red-200 bg-red-50 animate-pulse" : "text-zinc-900"
            )}>
              <Timer size={20} className="text-zinc-400" />
              {formatTime(timeLeft)}
            </div>
            <div className="h-8 w-px bg-zinc-200" />
            <div className="space-y-0.5">
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Kategori</div>
                <div className="text-sm font-bold text-zinc-700">{currentQuestion.category} - {currentQuestion.subCategory}</div>
            </div>
          </div>
          
          <button 
            onClick={toggleMark}
            className={cn(
                "px-4 py-2 rounded-xl border-2 font-bold text-sm flex items-center gap-2 transition-all",
                markedQuestions.has(currentQuestion.id) 
                    ? "border-amber-500 bg-amber-500 text-white shadow-lg shadow-amber-200" 
                    : "border-zinc-200 text-zinc-400 hover:border-zinc-300"
            )}
          >
            <Flag size={18} />
            Ragu-ragu
          </button>
        </div>

        {/* Question Area */}
        <div className="flex-grow overflow-y-auto p-12 bg-white">
          <div className="max-w-3xl mx-auto space-y-12">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex gap-4">
                <span className="text-4xl font-serif italic text-zinc-300 font-bold">Q{currentIndex + 1}.</span>
                <p className="text-xl leading-relaxed text-zinc-800 font-medium">
                  {currentQuestion.text}
                </p>
              </div>

              <div className="space-y-3 pl-12">
                {currentQuestion.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={cn(
                      "w-full text-left p-6 rounded-2xl border-2 transition-all flex items-center justify-between group",
                      answers[currentQuestion.id]?.selectedOptionId === opt.id
                        ? "border-zinc-900 bg-zinc-900 text-white shadow-xl shadow-zinc-200"
                        : "border-zinc-100 hover:border-zinc-300 bg-zinc-50"
                    )}
                  >
                    <span className="font-medium">{opt.text}</span>
                    <div className={cn(
                        "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all",
                        answers[currentQuestion.id]?.selectedOptionId === opt.id
                            ? "border-white bg-white/20"
                            : "border-zinc-200 group-hover:border-zinc-300"
                    )}>
                        {answers[currentQuestion.id]?.selectedOptionId === opt.id && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="h-24 bg-white border-t border-zinc-200 px-12 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(prev => prev - 1)}
            className="flex items-center gap-2 font-bold text-zinc-400 hover:text-zinc-900 disabled:opacity-20 transition-colors"
          >
            <ChevronLeft size={24} />
            Sebelumnya
          </button>
          
          <div className="flex gap-2">
            {session.questions.map((_, i) => (
                <div 
                    key={i} 
                    className={cn(
                        "h-1 rounded-full transition-all duration-500",
                        currentIndex === i ? "w-8 bg-zinc-900" : "w-2 bg-zinc-200"
                    )} 
                />
            ))}
          </div>

          <button
            onClick={() => {
              if (currentIndex < session.questions.length - 1) {
                setCurrentIndex(prev => prev + 1);
              } else {
                onComplete(answers);
              }
            }}
            className="px-8 py-4 bg-zinc-900 hover:bg-black text-white font-bold rounded-2xl flex items-center gap-3 transition-all active:scale-95 shadow-xl shadow-zinc-200"
          >
            {currentIndex === session.questions.length - 1 ? 'Selesai' : 'Berikutnya'}
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
