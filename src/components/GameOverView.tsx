import { useEffect } from "react";
import { audio } from "../utils/audio";
import { CornerUpLeft, HelpCircle, ShieldAlert, Award } from "lucide-react";
import { motion } from "motion/react";
import continueImage from "../assets/images/continue_scene_1782040890555.jpg";

interface GameOverViewProps {
  totalPoints: number;
  onContinueSelected: () => void;
  onQuitSelected: () => void;
  opponentName: string;
}

export default function GameOverView({
  totalPoints,
  onContinueSelected,
  onQuitSelected,
  opponentName,
}: GameOverViewProps) {
  // Milia allows players to survive by either paying 10 points or sacrificing all their current points if they have less!
  const hasTenPoints = totalPoints >= 10;
  
  // Play continue / game over BGM on load
  useEffect(() => {
    audio.playBGM("continue"); // Tense clock ticking background
    return () => {
      audio.stopBGM();
    };
  }, []);

  return (
    <div id="milias-corner-gameover" className="w-full max-w-md mx-auto bg-slate-900 border-2 border-red-500 rounded-3xl p-6 shadow-2xl relative text-center overflow-hidden">
      {/* Red ambient light details */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-red-500/10 to-transparent pointer-events-none" />

      <h1 className="text-3xl font-display font-black text-amber-500 uppercase tracking-tight">
        Milia's Corner
      </h1>

      <div className="relative group rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950 my-4">
        <img
          src={continueImage}
          alt="Coach yelling in corner"
          referrerPolicy="no-referrer"
          className="w-full h-44 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 pointer-events-none" />
        <div className="absolute bottom-2 left-3 select-none">
          <span className="text-[10px] font-mono font-bold text-amber-400 bg-slate-950/80 px-2.5 py-0.5 rounded border border-amber-500/30 font-bold uppercase">
            CONTINUE SCENE
          </span>
        </div>
      </div>

      <div className="bg-slate-950 px-4 py-3 rounded-xl border border-slate-850 mb-5">
        <p className="text-slate-300 text-xs font-sans leading-relaxed">
          "Get up, champ! You were knocked down by <span className="text-red-400 font-bold">{opponentName}</span> because your stamina reached 0 HP."
        </p>
      </div>

      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 mb-5 text-left font-mono space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400">YOUR TOTAL SCORE:</span>
          <span className="text-white font-bold">{totalPoints} points</span>
        </div>
        <div className="flex justify-between items-center text-xs text-amber-400 pt-1 border-t border-slate-850">
          <span>REVIVE FEE:</span>
          <span className="font-extrabold">{hasTenPoints ? "10 points" : "Remaining points"}</span>
        </div>
      </div>

      <div className="space-y-3">
        {hasTenPoints ? (
          <p className="text-[10px] text-teal-400 font-mono">
            ★ You have enough points ({totalPoints}) to pay the 10-point rescue fee!
          </p>
        ) : (
          <p className="text-[10px] text-amber-500 font-mono">
            ⚠ Milia is generous: pay your remaining {totalPoints} point{totalPoints === 1 ? "" : "s"} to revive!
          </p>
        )}
        
        <button
          onClick={onContinueSelected}
          className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-black text-sm uppercase tracking-widest rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
        >
          <CornerUpLeft className="w-4 h-4" /> Revive and try again!
        </button>
        
        <button
          onClick={onQuitSelected}
          className="w-full py-2 bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-slate-200 text-xs font-mono rounded-xl transition-all"
        >
          Refuse help and Reset (New Game)
        </button>
      </div>
    </div>
  );
}
