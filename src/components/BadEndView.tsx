import { useEffect } from "react";
import { audio } from "../utils/audio";
import { Skull, RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import badEndImage from "../assets/images/bad_end_1782040909437.jpg";

interface BadEndViewProps {
  totalPoints: number;
  onRestart: () => void;
}

export default function BadEndView({ totalPoints, onRestart }: BadEndViewProps) {
  // Play bad end BGM on mount
  useEffect(() => {
    audio.playBGM("bad"); // Melancholic ending chords BGM
    return () => {
      audio.stopBGM();
    };
  }, []);

  const handleRestartClick = () => {
    audio.playSFX("bell");
    onRestart();
  };

  return (
    <div id="bad-end-screen" className="w-full max-w-md mx-auto bg-slate-950 border-2 border-red-950 rounded-3xl p-6 shadow-2xl relative text-center overflow-hidden flex flex-col gap-4">
      {/* Dim ambient spotlight highlight */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-red-950/20 to-transparent pointer-events-none" />
      
      {/* HEADER */}
      <div className="z-10 select-none">
        <span className="text-[9px] font-mono tracking-widest text-red-500 font-extrabold uppercase bg-red-950/40 py-1 px-3 border border-red-900/30 rounded-full">
          💀 GAME OVER 💀
        </span>
        <h1 className="text-3xl font-display font-black tracking-tight text-white mt-2.5 uppercase leading-none">
          Definitive Knockout
        </h1>
        <p className="text-xs text-rose-500 mt-1 font-mono uppercase tracking-wider">
          Your Career Has Ended
        </p>
      </div>

      {/* BOXER CHRONICLES SLIDESHOW VISUAL */}
      <div className="relative group rounded-2xl overflow-hidden border border-red-950 shadow-2xl bg-black">
        <img
          src={badEndImage}
          alt="Unconscious Boxer KO on ring canvas"
          referrerPolicy="no-referrer"
          className="w-full h-48 object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90 pointer-events-none" />
        <div className="absolute bottom-2.5 left-3 select-none">
          <span className="text-[9px] font-mono font-bold text-red-400 uppercase bg-black/80 px-2 py-0.5 rounded border border-red-900/40 flex items-center gap-1.5">
            <Skull className="w-3 h-3 text-red-500" /> STATUS: DOWN & OUT
          </span>
        </div>
      </div>

      {/* STATS DEBRIEF LOG */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-red-950/40 text-left font-sans space-y-2.5">
        <p className="text-slate-350 text-xs leading-relaxed italic text-center">
          "The crowd goes silent as the referee completes the count. Your training was admirable, but the ring is unforgiving."
        </p>
        
        <div className="flex justify-between items-center text-xs pt-2 border-t border-red-950/40 font-mono text-slate-400">
          <span>FINAL TOTAL SCORE:</span>
          <span className="text-rose-400 font-bold text-sm">{totalPoints} points</span>
        </div>
      </div>

      {/* DISPATCH ACTION */}
      <div className="z-10 mt-1">
        <button
          onClick={handleRestartClick}
          className="w-full py-3.5 bg-red-950 hover:bg-red-900 border border-red-700/40 text-rose-100 font-display font-black text-xs sm:text-sm tracking-widest uppercase rounded-xl transition-all hover:scale-[1.02] shadow-xl shadow-red-950/20 flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <RotateCcw className="w-4 h-4" /> Return to title screen
        </button>
      </div>
    </div>
  );
}
