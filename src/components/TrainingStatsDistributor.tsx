import { useState } from "react";
import { PlayerStats } from "../types";
import { Dumbbell, Shield, Zap, RefreshCw } from "lucide-react";
import { motion } from "motion/react";

interface TrainingStatsDistributorProps {
  initialStats: PlayerStats;
  pointsToDistribute: number;
  onConfirm: (finalStats: PlayerStats) => void;
  activityTitle: string;
}

export default function TrainingStatsDistributor({
  initialStats,
  pointsToDistribute,
  onConfirm,
  activityTitle,
}: TrainingStatsDistributorProps) {
  const [powerAlloc, setPowerAlloc] = useState(0);
  const [staminaAlloc, setStaminaAlloc] = useState(0);
  const [speedAlloc, setSpeedAlloc] = useState(0);

  const spentPoints = powerAlloc + staminaAlloc + speedAlloc;
  const remainingPoints = pointsToDistribute - spentPoints;

  const handleAdd = (stat: "power" | "stamina" | "speed") => {
    if (remainingPoints <= 0) return;
    if (stat === "power") setPowerAlloc((p) => p + 1);
    if (stat === "stamina") setStaminaAlloc((s) => s + 1);
    if (stat === "speed") setSpeedAlloc((s) => s + 1);
  };

  const handleSub = (stat: "power" | "stamina" | "speed") => {
    if (stat === "power" && powerAlloc > 0) setPowerAlloc((p) => p - 1);
    if (stat === "stamina" && staminaAlloc > 0) setStaminaAlloc((s) => s - 1);
    if (stat === "speed" && speedAlloc > 0) setSpeedAlloc((s) => s - 1);
  };

  const handleReset = () => {
    setPowerAlloc(0);
    setStaminaAlloc(0);
    setSpeedAlloc(0);
  };

  const handleConfirm = () => {
    if (remainingPoints > 0) return; // Must spend all points of reward
    onConfirm({
      power: initialStats.power + powerAlloc,
      maxStamina: initialStats.maxStamina + staminaAlloc,
      stamina: initialStats.maxStamina + staminaAlloc, // Heal to full on training finish!
      speed: initialStats.speed + speedAlloc,
    });
  };

  return (
    <div id="stats-distributor" className="w-full max-w-xl mx-auto bg-slate-900 border-2 border-amber-500 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      {/* Visual background details */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl" />

      <div className="text-center mb-6">
        <span className="text-xs font-mono py-1 px-3 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30 font-bold tracking-wider uppercase">
          Training Complete
        </span>
        <h2 className="text-2xl font-display font-bold mt-2 text-white">
          Distribute Your Rewards
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-sans">
          You earned <span className="text-amber-400 font-bold">+{pointsToDistribute} stats points</span> from your correct answers in <span className="italic">{activityTitle}</span>.
        </p>
      </div>

      <div className="bg-slate-950 rounded-xl p-4 mb-6 border border-slate-800">
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-sm font-mono uppercase tracking-wider">
            Available Points
          </span>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-display font-extrabold text-amber-400">
              {remainingPoints}
            </span>
            <span className="text-xs text-slate-500">Left</span>
          </div>
        </div>

        {/* Progress bar to visual fill */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
          <div
            className="bg-amber-400 h-full transition-all duration-350"
            style={{ width: `${(spentPoints / pointsToDistribute) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {/* POWER ALLOCATION */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-amber-500/20 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-950 border border-red-500/40 flex items-center justify-center text-red-400 shadow-md">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-white text-sm">
                Power: {initialStats.power + powerAlloc}
              </div>
              <div className="text-xs text-slate-400">
                Deals {initialStats.power + powerAlloc} damage per hit to opponent
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSub("power")}
              disabled={powerAlloc === 0}
              className="w-8 h-8 rounded-md bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-xl font-bold font-mono"
            >
              -
            </button>
            <span className="w-8 text-center font-mono font-extrabold text-lg text-red-400">
              +{powerAlloc}
            </span>
            <button
              onClick={() => handleAdd("power")}
              disabled={remainingPoints === 0}
              className="w-8 h-8 rounded-md bg-red-600 hover:bg-red-500 border border-red-500 flex items-center justify-center text-white disabled:opacity-30 disabled:pointer-events-none text-xl font-bold font-mono"
            >
              +
            </button>
          </div>
        </div>

        {/* STAMINA ALLOCATION */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-amber-500/20 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-white text-sm">
                Stamina: {initialStats.maxStamina + staminaAlloc}
              </div>
              <div className="text-xs text-slate-400">
                Increases maximum life points by {staminaAlloc}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSub("stamina")}
              disabled={staminaAlloc === 0}
              className="w-8 h-8 rounded-md bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-xl font-bold font-mono"
            >
              -
            </button>
            <span className="w-8 text-center font-mono font-extrabold text-lg text-emerald-400">
              +{staminaAlloc}
            </span>
            <button
              onClick={() => handleAdd("stamina")}
              disabled={remainingPoints === 0}
              className="w-8 h-8 rounded-md bg-emerald-600 hover:bg-emerald-500 border border-emerald-500 flex items-center justify-center text-white disabled:opacity-30 disabled:pointer-events-none text-xl font-bold font-mono"
            >
              +
            </button>
          </div>
        </div>

        {/* SPEED ALLOCATION */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-amber-500/20 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-950 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-md">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-white text-sm">
                Speed: {initialStats.speed + speedAlloc}
              </div>
              <div className="text-xs text-slate-400">
                Increases answer time limit difference against opponents
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSub("speed")}
              disabled={speedAlloc === 0}
              className="w-8 h-8 rounded-md bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-xl font-bold font-mono"
            >
              -
            </button>
            <span className="w-8 text-center font-mono font-extrabold text-lg text-blue-400">
              +{speedAlloc}
            </span>
            <button
              onClick={() => handleAdd("speed")}
              disabled={remainingPoints === 0}
              className="w-8 h-8 rounded-md bg-blue-600 hover:bg-blue-500 border border-blue-500 flex items-center justify-center text-white disabled:opacity-30 disabled:pointer-events-none text-xl font-bold font-mono"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono font-bold tracking-wider hover:bg-slate-755 text-slate-300 flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Reset
        </button>

        <button
          onClick={handleConfirm}
          disabled={remainingPoints > 0}
          className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-black text-sm rounded-xl tracking-widest uppercase transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/20 disabled:bg-slate-850 disabled:text-slate-600 disabled:cursor-not-allowed disabled:border-slate-800 border-2 border-transparent hover:scale-[1.02] active:scale-[0.98]"
        >
          Confirm Distribution
        </button>
      </div>

      {remainingPoints > 0 && (
        <p className="text-center text-[10px] text-amber-500/80 font-mono mt-3">
          * You must fully spend all {remainingPoints} point{remainingPoints > 1 ? "s" : ""} to unlock your training upgrades!
        </p>
      )}
    </div>
  );
}
