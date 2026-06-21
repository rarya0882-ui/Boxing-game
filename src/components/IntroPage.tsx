import { useState, useEffect, FormEvent } from "react";
import { audio } from "../utils/audio";
import { User, Tag, HelpCircle, Trophy, Volume2, VolumeX } from "lucide-react";
import { motion } from "motion/react";

interface IntroPageProps {
  onStartGame: (name: string, nim: string, classCode: string) => void;
}

export default function IntroPage({ onStartGame }: IntroPageProps) {
  const [name, setName] = useState("");
  const [nim, setNim] = useState("");
  const [classCode, setClassCode] = useState("");
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // Error validation
  const [errorMsg, setErrorMsg] = useState("");

  // Play opening tune on load
  useEffect(() => {
    audio.playBGM("opening");
    audio.setMute(isAudioMuted);
    return () => {
      audio.stopBGM();
    };
  }, [isAudioMuted]);

  const toggleSound = () => {
    setIsAudioMuted((prev) => {
      const next = !prev;
      audio.setMute(next);
      return next;
    });
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validating name: max 20 letters/numbers (or spaces)
    const cleanedName = name.trim();
    if (cleanedName.length === 0 || cleanedName.length > 20) {
      setErrorMsg("Name must be between 1 and 20 characters long.");
      audio.playSFX("buzzer");
      return;
    }

    // Validating NIM: must be exactly 10 digits
    const cleanedNim = nim.trim();
    if (!/^\d{10}$/.test(cleanedNim)) {
      setErrorMsg("NIM must be exactly a 10-digit number.");
      audio.playSFX("buzzer");
      return;
    }

    // Validating Class: max 16 letters/numbers (or spaces)
    const cleanedClass = classCode.trim();
    if (cleanedClass.length === 0 || cleanedClass.length > 16) {
      setErrorMsg("Class code must be between 1 and 16 characters long.");
      audio.playSFX("buzzer");
      return;
    }

    setErrorMsg("");
    audio.playSFX("bell");
    onStartGame(cleanedName, cleanedNim, cleanedClass);
  };

  return (
    <div id="intro-screen" className="w-full max-w-lg mx-auto bg-slate-900 border-4 border-amber-500 rounded-3xl p-6 shadow-2xl relative overflow-hidden text-center flex flex-col justify-between min-h-[500px]">
      {/* Visual background style details */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* sound controls */}
      <div className="flex justify-end z-10 mb-2">
        <button
          onClick={toggleSound}
          className="p-2 sm:p-2.5 rounded-full border border-slate-850 hover:bg-slate-800 transition-all text-slate-400 hover:text-white"
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* GAME VINTAGE POSTER ART */}
      <div className="z-10 select-none">
        <span className="text-[10px] font-mono tracking-widest text-amber-500 font-extrabold uppercase bg-amber-500/10 py-1.5 px-3 border border-amber-500/20 rounded-full">
          🥊 ACADEMIC RETRO BOXING 🥊
        </span>
        <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tight text-white mt-3 uppercase leading-none drop-shadow-md">
          Boxing Scholar
        </h1>
        <p className="text-xs text-slate-400 mt-2 font-mono italic max-w-sm mx-auto">
          "Master Paragraph structures, Adjectives clauses, and Comma rules to win the golden championship belt!"
        </p>
      </div>

      {/* REGISTRATION FORM */}
      <form onSubmit={handleFormSubmit} className="mt-6 mb-4 space-y-4 text-left z-10 max-w-sm mx-auto w-full">
        {/* Name input */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono text-slate-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" /> Character Name (20 chars max)
          </label>
          <input
            type="text"
            required
            maxLength={20}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
          />
        </div>

        {/* NIM input */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono text-slate-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" /> Student NIM (Exactly 10 digits)
          </label>
          <input
            type="text"
            required
            pattern="\d*"
            maxLength={10}
            value={nim}
            onChange={(e) => setNim(e.target.value.replace(/\D/g, ""))}
            placeholder="1234567890"
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
          />
        </div>

        {/* Class Input */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono text-slate-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5" /> Classroom Code (16 chars max)
          </label>
          <input
            type="text"
            required
            maxLength={16}
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
            placeholder="CLASS-3A"
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
          />
        </div>

        {errorMsg && (
          <p className="text-[10px] sm:text-xs text-red-400 font-mono text-center pt-1">
            ⚠ {errorMsg}
          </p>
        )}

        <button
          type="submit"
          className="w-full py-4.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-black text-sm uppercase tracking-widest rounded-xl transition-all hover:scale-[1.02] shadow-xl shadow-amber-500/10 border-2 border-transparent active:scale-[0.98] mt-2 block text-center"
        >
          Enter the Stadium
        </button>
      </form>

      {/* FOOTER ACADEMIC STAT */}
      <div className="border-t border-slate-850 pt-3 z-10">
        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block">
          Designed for academic curriculum review
        </span>
      </div>
    </div>
  );
}
