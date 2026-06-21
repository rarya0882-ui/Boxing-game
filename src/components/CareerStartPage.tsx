import { motion } from "motion/react";
import { BookOpen, ChevronRight, Award, Flame } from "lucide-react";
import { audio } from "../utils/audio";
import openingImage from "../assets/images/opening_lesson_plan_1782040373222.jpg";

interface CareerStartPageProps {
  playerName: string;
  onProceed: () => void;
}

export default function CareerStartPage({ playerName, onProceed }: CareerStartPageProps) {
  const handleProceedClick = () => {
    audio.playSFX("bell");
    onProceed();
  };

  return (
    <div id="career-start-screen" className="w-full max-w-2xl mx-auto bg-slate-900 border-4 border-amber-500 rounded-3xl p-6 shadow-2xl relative text-center overflow-hidden flex flex-col gap-5">
      {/* Cinematic ambient highlights */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />
      
      {/* HEADER TITLE */}
      <div className="z-10 select-none">
        <span className="text-[10px] font-mono tracking-widest text-amber-500 font-extrabold uppercase bg-amber-500/10 py-1.5 px-3 border border-amber-500/20 rounded-full">
          🥊 NEW STORY MODE UNLOCKED 🥊
        </span>
        <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-white mt-3 uppercase leading-none">
          Beginning of a New Career
        </h1>
        <p className="text-xs text-slate-400 mt-1.5 font-mono">
          Champion, your quest for the Golden Pen Heavyweight title starts here!
        </p>
      </div>

      {/* TRAINING LECTURER BOARD VISUAL */}
      <div className="relative group rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950">
        <img
          src={openingImage}
          alt="Coach Architect's Plan - Paragraph Sandwich"
          referrerPolicy="no-referrer"
          className="w-full max-h-[300px] object-cover transition-transform duration-500 group-hover:scale-[1.01]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 pointer-events-none" />
        <div className="absolute bottom-3 left-4 right-4 text-left">
          <span className="text-[9px] font-mono font-bold text-amber-400 uppercase bg-slate-950/80 px-2 py-0.5 rounded border border-amber-500/30">
            BOARD #1: The Paragraph Sandwich
          </span>
        </div>
      </div>

      {/* DETAILED NARRATIVE PANEL */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 z-10 text-left font-serif space-y-3">
        <div className="flex gap-2 items-center text-amber-500 font-sans font-bold text-xs uppercase tracking-wider border-b border-slate-850 pb-1.5">
          <BookOpen className="w-4 h-4 text-amber-500" />
          <span>COACH ARCHITECT SAYS:</span>
        </div>
        
        <p className="text-slate-200 text-xs sm:text-sm leading-relaxed italic">
          "Welcome to the camp, <span className="text-amber-400 font-sans font-black uppercase not-italic text-xs">{playerName}</span>! This is the start of a magnificent new academic career. But remember: a great boxing champion doesn't just hit hard with their fists—they hit smart with their mind. Before we let you enter the boxing ring with the rookies, we are going to start training for the lesson! You must learn the exact blueprint of paragraphs, master relative clauses, and perfect structural flow. Let's begin our first training drill!"
        </p>
      </div>

      {/* PROCEED ACTION */}
      <div className="z-10 pt-1">
        <button
          onClick={handleProceedClick}
          className="w-full py-4 bg-amber-500 hover:bg-amber-450 text-slate-950 font-display font-black text-xs sm:text-sm tracking-widest uppercase rounded-xl transition-all hover:scale-[1.02] shadow-xl shadow-amber-500/10 flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <Flame className="w-4 h-4 fill-slate-950" /> Start Lesson 1 Training <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
