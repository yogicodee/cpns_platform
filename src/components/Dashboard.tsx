import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Trophy, Target, Zap, ChevronRight, BarChart2 } from 'lucide-react';
import { UserStats } from '../types';
import { cn } from '../lib/utils';

interface DashboardProps {
  stats: UserStats;
  onStartTryout: (type: 'SIMULATION' | 'PRACTICE' | 'ADAPTIVE') => void;
}

export function Dashboard({ stats, onStartTryout }: DashboardProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header / Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          icon={<Zap className="text-yellow-500" />} 
          label="Streak Harian" 
          value={`${stats.streak} Hari`} 
          subValue="Konsistensi adalah kunci"
        />
        <StatCard 
          icon={<Trophy className="text-blue-500" />} 
          label="Level" 
          value={`Lvl ${stats.level}`} 
          subValue={`${stats.xp} XP terkumpul`}
        />
        <StatCard 
          icon={<Target className="text-red-500" />} 
          label="Tryout Selesai" 
          value={stats.totalTryouts.toString()} 
          subValue="Siap tempur!"
        />
        <StatCard 
          icon={<BarChart2 className="text-green-500" />} 
          label="Skor Rata-rata" 
          value="385" 
          subValue="Naik 12% dari minggu lalu"
        />
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ActionCard
          title="Simulasi CAT CPNS"
          description="Ujian lengkap 110 soal dalam 100 menit dengan sistem penilaian BKN terbaru."
          icon={<BookOpen className="w-8 h-8" />}
          color="bg-indigo-600"
          onClick={() => onStartTryout('SIMULATION')}
        />
        <ActionCard
          title="Latihan Adaptif (AI)"
          description="Soal yang menyesuaikan kemampuan kamu. Fokus pada materi yang belum kamu kuasai."
          icon={<Zap className="w-8 h-8" />}
          color="bg-amber-600"
          onClick={() => onStartTryout('ADAPTIVE')}
        />
        <ActionCard
          title="Mode Latihan Kilat"
          description="10 soal acak untuk asah otak setiap hari. Hanya butuh 5-10 menit."
          icon={<ChevronRight className="w-8 h-8" />}
          color="bg-emerald-600"
          onClick={() => onStartTryout('PRACTICE')}
        />
      </div>

      {/* Analysis Placeholder */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-8 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-5">
            <BarChart2 size={120} />
        </div>
        <div className="relative z-10">
            <h3 className="text-xl font-bold mb-4">Analisis Kelemahan</h3>
            <p className="text-zinc-600 mb-6 max-w-2xl">
                AI kami mendeteksi kamu masih lemah di bagian <strong>TIU - Logika Numerik</strong> dan <strong>TWK - Pilar Negara</strong>.
                Yuk, maksimalkan latihan di topik tersebut!
            </p>
            <div className="flex flex-wrap gap-4">
                {stats.weakTopics.map(topic => (
                    <span key={topic} className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium border border-red-100 italic font-serif">
                        # {topic}
                    </span>
                ))}
                {stats.strongTopics.map(topic => (
                    <span key={topic} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100 italic font-serif">
                        # {topic}
                    </span>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subValue }: { icon: React.ReactNode, label: string, value: string, subValue: string }) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-zinc-50 rounded-lg">{icon}</div>
        <span className="text-sm font-medium text-zinc-500 uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-2xl font-bold text-zinc-900 font-mono">{value}</div>
      <div className="text-xs text-zinc-400 mt-1">{subValue}</div>
    </motion.div>
  );
}

function ActionCard({ title, description, icon, color, onClick }: { title: string, description: string, icon: React.ReactNode, color: string, onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "flex flex-col text-left p-8 rounded-3xl transition-all shadow-lg text-white h-full",
        color
      )}
    >
      <div className="mb-6 p-3 bg-white/20 rounded-2xl w-fit">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-2 tracking-tight">{title}</h3>
      <p className="text-white/80 text-sm leading-relaxed mb-8 flex-grow">
        {description}
      </p>
      <div className="flex items-center text-sm font-bold uppercase tracking-widest group">
        Mulai Sekarang
        <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.button>
  );
}
