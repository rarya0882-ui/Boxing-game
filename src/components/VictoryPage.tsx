import { useEffect } from "react";
import { audio } from "../utils/audio";
import { Trophy, Clock, BadgeCheck, FileText, User, MapPin } from "lucide-react";
import { motion } from "motion/react";
import victoryImage from "../assets/images/victory_scene_1782043674035.jpg";

interface VictoryPageProps {
  name: string;
  nim: string;
  classCode: string;
  totalPoints: number;
  durationSeconds: number;
  onRestart: () => void;
}

export default function VictoryPage({
  name,
  nim,
  classCode,
  totalPoints,
  durationSeconds,
  onRestart,
}: VictoryPageProps) {

  // Track BGM based on scores
  useEffect(() => {
    audio.playBGM("victory"); // Final Win scene
    return () => {
      audio.stopBGM();
    };
  }, []);

  // Format elapsed duration
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div id="victory-screen" className="w-full max-w-xl mx-auto bg-slate-900 border-4 border-amber-500 rounded-3xl p-6 shadow-2xl relative text-center overflow-hidden flex flex-col gap-5">
      {/* Golden spotlight ambient effect */}
      <div className="absolute top-0 left-0 right-0 h-2/3 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* WINNER TITLE */}
      <div className="z-10 animate-fade-in">
        <span className="text-[10px] font-mono tracking-widest text-amber-400 font-extrabold uppercase bg-amber-500/20 py-1.5 px-4 border border-amber-500/30 rounded-full">
          🏆 GRAND CHAMPION UNLOCKED 🏆
        </span>
        <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tight text-white mt-4 uppercase leading-none">
          VICTORY!
        </h1>
        <p className="text-xs text-slate-400 mt-2 font-mono">
          You have cleared the 12-Step Academy Path and conquered the Review Champion!
        </p>
      </div>

      {/* GLORIOUS VICTORY IMAGE */}
      <div className="relative group rounded-2xl overflow-hidden border border-amber-500/35 shadow-2xl bg-slate-950 z-10 select-none">
        <img
          src={victoryImage}
          alt="Champion Belt Ceremony"
          referrerPolicy="no-referrer"
          className="w-full h-48 sm:h-56 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-85 pointer-events-none" />
        <div className="absolute bottom-3 left-4 right-4 text-left">
          <p className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-widest bg-slate-950/80 px-2 py-0.5 rounded border border-amber-500/20 inline-block mb-1">
            🥊 Status: Undefeated Champion of Writing 🥊
          </p>
          <p className="text-xs sm:text-sm text-yellow-100 font-sans font-medium drop-shadow-md">
            You have made it through everything and won the glory! The ultimate Golden Pen Heavyweight Champion!
          </p>
        </div>
      </div>

      {/* STUDENT CREDENTIALS / BADGE CARD */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 z-10 text-left font-mono space-y-3 relative">
        <div className="absolute top-4 right-4 text-amber-500 opacity-20">
          <Trophy className="w-16 h-16" />
        </div>

        <h3 className="text-amber-500 font-display font-bold text-xs uppercase tracking-widest pb-1 border-b border-slate-850">
          Official Class Certificate
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-500" />
            <span className="text-slate-400">CHAMPION:</span>
            <span className="text-white font-bold">{name}</span>
          </div>

          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-500" />
            <span className="text-slate-400">STUDENT NIM:</span>
            <span className="text-white font-bold">{nim}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-500" />
            <span className="text-slate-400">CLASSROOM Code:</span>
            <span className="text-white font-bold uppercase">{classCode}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <span className="text-slate-400">DURATION TIME:</span>
            <span className="text-white font-bold">{formatTime(durationSeconds ?? 0)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-3 rounded-xl mt-3">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
            TOTAL SCORE RATIO:
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-display font-black text-amber-400">
              {totalPoints}
            </span>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>
        </div>
      </div>

      {/* CELEBRATION MASTER PANEL */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }}
        className="bg-gradient-to-tr from-yellow-500/10 via-amber-500/20 to-orange-500/10 border-2 border-amber-400 p-5 rounded-2xl z-10 text-center relative shadow-lg shadow-amber-500/10 animate-fade-in"
      >
        {/* Animated sparkles background */}
        <div className="absolute top-2 right-2 animate-ping text-amber-400 text-sm">✦</div>
        <div className="absolute bottom-2 left-2 animate-pulse text-amber-400 text-sm">✦</div>

        <div className="flex items-center justify-center gap-2 text-amber-400 font-display font-black text-sm uppercase tracking-widest mb-2">
          <BadgeCheck className="w-5 h-5" /> Ultimate academic crown
        </div>

        <h4 className="text-white font-sans font-medium text-xs leading-relaxed italic">
          "By earning {totalPoints} scores, you have proven exceptional mastery of academic writing. You have received the legendary Title of 'Golden Pen Heavyweight' from the Dean's Boxing Council!"
        </h4>
      </motion.div>

      {/* RESTART APP */}
      <button
        onClick={onRestart}
        className="w-full py-4 bg-slate-100 hover:bg-white text-slate-905 font-display font-black text-sm tracking-widest uppercase rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] shadow-xl"
      >
        Play Again (New Game)
      </button>
    </div>
  );
}
