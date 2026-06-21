import { useState, useEffect, useRef } from "react";
import { PlayerStats, EnemyStats, ActivityQuestion } from "../types";
import { audio } from "../utils/audio";
import { Zap, Shield, Trophy, AlertTriangle, Play, RefreshCw, Volume2, VolumeX, ArrowRight, CornerUpLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import cMc from "../assets/images/c_mc_1782048487251.jpg";

interface BoxingRingProps {
  playerStats: PlayerStats;
  enemy: EnemyStats;
  questions: any[];
  activityNum: number;
  onFightFinish: (finalPlayerStats: PlayerStats, won: boolean, earnedPoints: number) => void;
  onGameOverTrigger: (neededPointsToContinue: number) => void;
  totalPoints: number;
}

export default function BoxingRing({
  playerStats,
  enemy,
  questions,
  activityNum,
  onFightFinish,
  onGameOverTrigger,
  totalPoints,
}: BoxingRingProps) {
  // Combat stats
  const [playerCurStamina, setPlayerCurStamina] = useState(playerStats.stamina);
  const [enemyCurStamina, setEnemyCurStamina] = useState(enemy.stamina);
  
  // Fight round tracking
  const [curRoundIdx, setCurRoundIdx] = useState(0);
  const [fightStatus, setFightStatus] = useState<"ready" | "fighting" | "round_won" | "failed">("ready");
  
  // Scoring
  const [fightScore, setFightScore] = useState(0);

  // Time limit details
  const timeLimit = Math.max(3, 5 + playerStats.speed - enemy.speed);
  const [timerSeconds, setTimerSeconds] = useState(timeLimit);
  const timerRef = useRef<any>(null);

  // Animations states
  const [playerAction, setPlayerAction] = useState<"idle" | "jab" | "hook" | "hit">("idle");
  const [enemyAction, setEnemyAction] = useState<"idle" | "jab" | "hook" | "hit">("idle");
  const [hitEffect, setHitEffect] = useState<"none" | "player" | "enemy">("none");
  const [damageNumber, setDamageNumber] = useState<{ val: number; target: "player" | "enemy" } | null>(null);
  const [roundMessage, setRoundMessage] = useState<string>("Ready to rumble!");

  // Activity 5 specific - Jumbled word state (stores indices of words from currentQuestion.jumbled to handle duplicate words)
  const [jumbledSelectionIndices, setJumbledSelectionIndices] = useState<number[]>([]);

  const currentQuestion = questions[curRoundIdx];

  // Set up scene audio on load
  useEffect(() => {
    if (enemy.key === "champion") {
      audio.playBGM("final"); // Final Boss scene
    } else {
      audio.playBGM("fight"); // Normal Fight scene
    }
    audio.playSFX("bell");

    return () => {
      audio.stopBGM();
    };
  }, [enemy.key]);

  // Reset timer to full capacity when round index or fight status changes to fighting
  useEffect(() => {
    if (fightStatus === "fighting") {
      setTimerSeconds(timeLimit);
    }
  }, [curRoundIdx, fightStatus]);

  // Active countdown timer when fighting
  useEffect(() => {
    if (fightStatus !== "fighting") {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    if (timerSeconds <= 0) {
      handleTimeout();
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setTimerSeconds((prev) => prev - 1);
    }, 1005);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timerSeconds, fightStatus]);

  // Handle Timeout
  const handleTimeout = () => {
    audio.playSFX("buzzer");
    setRoundMessage("TIME OUT! Opponent got a clean hit!");
    applyDamageToPlayer();
  };

  // Apply damage to player on mistake or timeout
  const applyDamageToPlayer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      clearInterval(timerRef.current);
    }

    setEnemyAction("hook");
    setPlayerAction("hit");
    setHitEffect("player");
    setDamageNumber({ val: enemy.power, target: "player" });
    audio.playSFX("ugh");

    // Deduct stamina
    const nextStamina = Math.max(0, playerCurStamina - enemy.power);
    setPlayerCurStamina(nextStamina);

    setTimeout(() => {
      setEnemyAction("idle");
      setPlayerAction("idle");
      setHitEffect("none");
      setDamageNumber(null);

      if (nextStamina <= 0) {
        setFightStatus("ready");
        onGameOverTrigger(10); // Milia's Corner Game Over trigger
      } else {
        advanceRound();
      }
    }, 1500);
  };

  // Apply damage to enemy on correct answer
  const applyDamageToEnemy = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      clearInterval(timerRef.current);
    }

    setPlayerAction("jab");
    setEnemyAction("hit");
    setHitEffect("enemy");
    setDamageNumber({ val: playerStats.power, target: "enemy" });
    audio.playSFX("punch");

    // Deduct stamina
    const nextEnemyStamina = Math.max(0, enemyCurStamina - playerStats.power);
    setEnemyCurStamina(nextEnemyStamina);
    setFightScore((prev) => prev + 1);

    setTimeout(() => {
      setPlayerAction("idle");
      setEnemyAction("idle");
      setHitEffect("none");
      setDamageNumber(null);

      if (nextEnemyStamina <= 0) {
        setFightStatus("round_won");
        audio.playSFX("victory");
      } else {
        advanceRound();
      }
    }, 1500);
  };

  // Step 6: Advance or wrap up
  const advanceRound = () => {
    if (curRoundIdx + 1 >= questions.length) {
      // Completed all 10 rounds
      if (enemyCurStamina > 0) {
        // Failed to deplete opponent stamina
        setRoundMessage(`OUT OF ROUNDS! ${enemy.name} is still standing!`);
        setFightStatus("failed");
        audio.playSFX("buzzer");
      } else {
        setFightStatus("round_won");
        audio.playSFX("victory");
      }
    } else {
      setCurRoundIdx((prev) => prev + 1);
      setJumbledSelectionIndices([]);
      setRoundMessage(`Round ${curRoundIdx + 2}: Answer quickly!`);
    }
  };

  // State trigger: True or False checking
  const handleAnswerCheck = (isCorrect: boolean) => {
    if (isCorrect) {
      setRoundMessage("CORRECT HIT!");
      applyDamageToEnemy();
    } else {
      setRoundMessage("MISSED! Countered by the opponent!");
      applyDamageToPlayer();
    }
  };

  // Specific handles for different activities question styles
  const handleMCQSubmit = (option: string) => {
    if (fightStatus !== "fighting") return;
    const isCorrect = option.toUpperCase() === currentQuestion.answer.toUpperCase();
    handleAnswerCheck(isCorrect);
  };

  // Activity 2: Topic, Supporting, Concluding (answer is "topic", "supporting", "concluding")
  const handleSentenceTypeSubmit = (type: string) => {
    if (fightStatus !== "fighting") return;
    const isCorrect = type.toLowerCase() === currentQuestion.answer.toLowerCase();
    handleAnswerCheck(isCorrect);
  };

  // Activity 5: Jumbled word ordering
  const handleJumbledWordClick = (wordIndex: number) => {
    if (jumbledSelectionIndices.includes(wordIndex)) {
      setJumbledSelectionIndices((prev) => prev.filter((idx) => idx !== wordIndex));
    } else {
      setJumbledSelectionIndices((prev) => [...prev, wordIndex]);
    }
  };

  const handleJumbledSubmit = () => {
    if (fightStatus !== "fighting") return;
    const constructed = jumbledSelectionIndices.map(idx => currentQuestion.jumbled[idx]).join(" ");
    const isCorrect = constructed.trim() === currentQuestion.correct.trim();
    handleAnswerCheck(isCorrect);
  };

  // Start the fight
  const handleStartFight = () => {
    setFightStatus("fighting");
    audio.playSFX("whistle");
    setRoundMessage("LET'S GO! Fight is on!");
  };

  // Finish Fight successfully
  const handleFinishFightSuccess = () => {
    onFightFinish(
      {
        ...playerStats,
        stamina: playerCurStamina, // carry forward stamina
      },
      true,
      fightScore // earns overall points to totalPoints
    );
  };

  // Finish battle after failing/loss
  const handleRetryFightState = () => {
    // restart from round 1
    onGameOverTrigger(10); // Trigger Milia's corner flow
  };

  // Helper variables for animation avatars
  const avatarColors = {
    rookie: "bg-gradient-to-tr from-yellow-700 via-amber-500 to-yellow-300",
    contender: "bg-gradient-to-tr from-emerald-700 via-teal-500 to-emerald-300",
    heavyweight: "bg-gradient-to-tr from-red-800 via-orange-600 to-red-400",
    champion: "bg-gradient-to-tr from-purple-800 via-fuchsia-600 to-purple-400 border-2 border-purple-400 shadow-lg shadow-purple-500/50",
  };

  return (
    <div id="boxing-game-frame" className="w-full flex flex-col items-center select-none gap-4">
      {/* Aspect Ratio Responsive Boxing Wrapper */}
      <div className="w-full max-w-2xl bg-slate-950 border-4 border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col">
        {/* TOP RING HEADER STATUS */}
        <div className="bg-slate-900 border-b-2 border-slate-800 px-4 py-3 flex items-center justify-between font-mono text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-200">STAGE FIGHT ACTIVIY #{activityNum}</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold text-slate-300">
            <div>
              SCORE: <span className="text-amber-400 font-extrabold">{fightScore}/10</span>
            </div>
            <div>
              TOTAL POINTS: <span className="text-blue-400 font-extrabold">{totalPoints}</span>
            </div>
          </div>
        </div>

        {/* VISUAL BOXING MATCH STAGE */}
        <div className="relative h-60 bg-gradient-to-b from-slate-900 via-indigo-950/40 to-slate-900 flex items-center justify-between px-8 overflow-hidden">
          {/* Grid canvas flooring lines */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

          {/* Rope indicators */}
          <div className="absolute left-0 right-0 top-12 h-0.5 bg-red-600 opacity-30 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
          <div className="absolute left-0 right-0 top-24 h-0.5 bg-blue-600 opacity-30 shadow-[0_0_8px_rgba(59,130,246,0.3)]" />
          <div className="absolute left-0 right-0 top-36 h-0.5 bg-slate-600 opacity-20" />

          {/* Floating Damage Numbers */}
          <AnimatePresence>
            {damageNumber && (
              <motion.div
                initial={{ opacity: 0, y: 80, scale: 0.5 }}
                animate={{ opacity: 1, y: 10, scale: 1.5 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ duration: 0.5 }}
                className={`absolute z-20 font-display font-black text-3xl tracking-wider ${
                  damageNumber.target === "player" ? "left-1/4 text-red-500" : "right-1/4 text-yellow-500"
                }`}
              >
                -{damageNumber.val} HP
              </motion.div>
            )}
          </AnimatePresence>

          {/* Flash impact sparkles */}
          {hitEffect !== "none" && (
            <div
              className={`absolute top-1/2 -translate-y-1/2 p-12 bg-amber-400/30 rounded-full blur-xl border-4 border-amber-300 animate-ping z-30 ${
                hitEffect === "player" ? "left-12 sm:left-24" : "right-12 sm:right-24"
              }`}
            />
          )}

          {/* LEFT: THE SCHOLAR (PLAYER CHAR) */}
          <div className="flex flex-col items-center gap-2 z-10 w-1/3">
            {/* Player Health HUD */}
            <div className="w-full">
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span className="text-emerald-400 font-bold uppercase tracking-wider">THE SCHOLAR</span>
                <span className="text-white font-bold">{playerCurStamina}/{playerStats.maxStamina}</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
                <motion.div
                  initial={{ width: `${(playerCurStamina / playerStats.maxStamina) * 100}%` }}
                  animate={{ width: `${(playerCurStamina / playerStats.maxStamina) * 100}%` }}
                  className="bg-emerald-500 h-full rounded-full shadow-[0_0_4px_#10b981]"
                />
              </div>
              <div className="flex gap-2 justify-center mt-1 text-[8px] font-mono text-slate-400">
                <span>POW: {playerStats.power}</span>
                <span>SPD: {playerStats.speed}</span>
              </div>
            </div>

            {/* Avatar drawing */}
            <motion.div
              animate={{
                x: playerAction === "jab" ? 60 : playerAction === "hit" ? -15 : 0,
                y: playerAction === "jab" ? -10 : 0,
                scale: playerAction === "hit" ? 0.9 : 1,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-800 border-2 border-emerald-500 relative flex flex-col items-center justify-center shadow-lg cursor-pointer ${
                playerAction === "hit" ? "ring-4 ring-red-500" : ""
              }`}
            >
              {/* Character Image Avatar with emoji fallback */}
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-950 border border-emerald-500/30 rounded-xl relative flex items-center justify-center overflow-hidden">
                <img
                  src={cMc}
                  alt="Player character"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain pointer-events-none select-none"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const fallbackSpan = e.currentTarget.nextElementSibling as HTMLSpanElement;
                    if (fallbackSpan) fallbackSpan.style.display = "block";
                  }}
                />
                <span className="text-3xl hidden">🥊</span>
                {playerAction === "jab" && (
                  <motion.div className="absolute right-1 top-1 text-lg z-10">⚡</motion.div>
                )}
              </div>
              {/* Stat glow tag */}
              <div className="absolute -bottom-2 bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-[8px] font-mono font-bold text-emerald-400 uppercase">
                PLAYER
              </div>
            </motion.div>
          </div>

          {/* VS GONG BADGE */}
          <div className="flex flex-col items-center text-center">
            <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">ROUND</span>
            <span className="text-3xl font-display font-black text-amber-500 mt-1">
              {curRoundIdx + 1}/10
            </span>
            <div className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center mt-2 bg-slate-900/50 shadow-inner">
              <span className="text-xs font-serif font-extrabold italic text-slate-400">vs</span>
            </div>
          </div>

          {/* RIGHT: OPPONENT (ENEMY CHAR) */}
          <div className="flex flex-col items-center gap-2 z-10 w-1/3 text-right">
            {/* Enemy Health HUD */}
            <div className="w-full">
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span className="text-red-400 font-bold uppercase tracking-wider">{enemy.name}</span>
                <span className="text-white font-bold">{enemyCurStamina}/{enemy.maxStamina}</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
                <motion.div
                  initial={{ width: `${(enemyCurStamina / enemy.maxStamina) * 100}%` }}
                  animate={{ width: `${(enemyCurStamina / enemy.maxStamina) * 100}%` }}
                  className="bg-red-500 h-full rounded-full shadow-[0_0_4px_#ef4444]"
                />
              </div>
              <div className="flex gap-2 justify-center mt-1 text-[8px] font-mono text-slate-400">
                <span>POW: {enemy.power}</span>
                <span>SPD: {enemy.speed}</span>
              </div>
            </div>

            {/* Opponent Avatar */}
            <motion.div
              animate={{
                x: enemyAction === "hook" ? -60 : enemyAction === "hit" ? 15 : 0,
                y: enemyAction === "hook" ? 10 : 0,
                scale: enemyAction === "hit" ? 0.9 : 1,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ${avatarColors[enemy.key]} border-2 border-slate-500 flex flex-col items-center justify-center relative shadow-lg ${
                enemyAction === "hit" ? "ring-4 ring-amber-400" : ""
              }`}
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-950/60 rounded-xl relative flex items-center justify-center overflow-hidden border border-white/10">
                <img
                  src={enemy.image}
                  alt={enemy.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain pointer-events-none select-none"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const fallbackSpan = e.currentTarget.nextElementSibling as HTMLSpanElement;
                    if (fallbackSpan) fallbackSpan.style.display = "block";
                  }}
                />
                <span className="text-3xl hidden">😈</span>
                {enemyAction === "hook" && (
                  <motion.div className="absolute left-1 top-1 text-lg z-10">☄️</motion.div>
                )}
              </div>
              <div className="absolute -bottom-2 bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-[8px] font-mono font-bold text-red-400 uppercase">
                {enemy.name.split(" ")[1] || enemy.name}
              </div>
            </motion.div>
          </div>
        </div>

        {/* TIMER BAR & ROUND NOTIFICATION MESSAGE */}
        <div className="bg-slate-900 border-y border-slate-800 px-4 py-3 flex flex-col items-center relative gap-1.5 shadow-md">
          {/* Countdown timer linear indicator */}
          {fightStatus === "fighting" && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
              <div
                className={`h-full transition-all duration-1000 ${
                  timerSeconds <= 2 ? "bg-red-500 animate-pulse" : "bg-cyan-500"
                }`}
                style={{ width: `${(timerSeconds / timeLimit) * 100}%` }}
              />
            </div>
          )}

          <div className="flex items-center justify-between w-full">
            <span className="text-[10px] font-mono uppercase bg-slate-950 px-2.5 py-1 rounded text-red-400 border border-red-500/20 font-bold">
              {fightStatus.toUpperCase()}
            </span>

            <span className="text-xs font-mono font-bold text-indigo-300">
              {roundMessage}
            </span>

            <span className="text-xs font-mono flex items-center gap-1">
              <Zap className={`w-3 h-3 ${timerSeconds <= 2 ? "text-red-500 animate-bounce" : "text-cyan-400"}`} />
              TIMER: <span className={`font-mono font-bold text-sm ${timerSeconds <= 2 ? "text-red-500 font-black" : "text-cyan-400"}`}>{timerSeconds}s</span>
            </span>
          </div>
        </div>

        {/* BOTTOM ACTIVE QUESTION CANVAS AREA */}
        <div className="p-5 bg-slate-950 min-h-60 flex flex-col justify-center items-center relative">
          <AnimatePresence mode="wait">
            {/* SCREEN 1: READY STATE (PULL THE LEVER IN ORDER TO START) */}
            {fightStatus === "ready" && (
              <motion.div
                key="state_ready"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center flex flex-col items-center gap-4 max-w-md"
              >
                <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Play className="w-8 h-8 fill-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-extrabold text-white">
                    Step Into the Ring
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 font-sans">
                    You are fighting <span className="text-red-400 font-bold">{enemy.name}</span>. The timer is locked at <span className="text-cyan-400 font-bold">{timeLimit} seconds</span> per question. Apply your academic skills to throw punches!
                  </p>
                </div>
                <button
                  onClick={handleStartFight}
                  className="px-8 py-3 bg-red-600 hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/20 text-white font-display font-black text-sm tracking-widest uppercase rounded-xl transition-all hover:scale-[1.02]"
                >
                  Fight Opponent
                </button>
              </motion.div>
            )}

            {/* SCREEN 2: FIGHTING ACTIVE GAMEPLAY */}
            {fightStatus === "fighting" && (
              <motion.div
                key="state_fighting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex flex-col gap-4"
              >
                {/* Question Card display */}
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-inner flex flex-col gap-2">
                  <span className="text-[9px] font-mono uppercase text-teal-400 tracking-wider">
                    Question Card {curRoundIdx + 1}
                  </span>
                  <p className="text-sm sm:text-base font-display leading-relaxed text-slate-100 italic font-medium">
                    "{currentQuestion.question || currentQuestion.topic}"
                  </p>
                </div>

                {/* ACTIVITY ACTION CONTROLS */}

                {/* TYPE A: TOPIC / SUPPORTING / CONCLUDING TYPE MATCH (ACTIVITY 2) */}
                {activityNum === 2 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                    <button
                      onClick={() => handleSentenceTypeSubmit("topic")}
                      className="py-3 px-4 bg-indigo-950/60 hover:bg-indigo-950 font-display font-bold text-sm text-indigo-200 border border-indigo-500/40 rounded-xl transition-all hover:-translate-y-0.5 active:translate-y-0 text-center"
                    >
                      Topic Sentence
                    </button>
                    <button
                      onClick={() => handleSentenceTypeSubmit("supporting")}
                      className="py-3 px-4 bg-teal-950/60 hover:bg-teal-950 font-display font-bold text-sm text-teal-200 border border-teal-500/40 rounded-xl transition-all hover:-translate-y-0.5 active:translate-y-0 text-center"
                    >
                      Supporting sentence
                    </button>
                    <button
                      onClick={() => handleSentenceTypeSubmit("concluding")}
                      className="py-3 px-4 bg-orange-950/60 hover:bg-orange-950 font-display font-bold text-sm text-orange-200 border border-orange-500/40 rounded-xl transition-all hover:-translate-y-0.5 active:translate-y-0 text-center"
                    >
                      Concluding sentence
                    </button>
                  </div>
                )}

                {/* TYPE B: JUMBLED WORD BLOCKS COMPILER (ACTIVITY 5) */}
                {activityNum === 5 && (
                  <div className="flex flex-col gap-4 w-full">
                    {/* Compiled output preview */}
                    <div className="bg-slate-950 border border-dashed border-slate-800 p-3 rounded-lg min-h-12 flex flex-wrap gap-1.5 items-center justify-center">
                      {jumbledSelectionIndices.length === 0 ? (
                        <span className="text-slate-500 text-xs font-mono italic">
                          Click blocks below to arrange complex sentence...
                        </span>
                      ) : (
                        jumbledSelectionIndices.map((wIdx, idx) => (
                          <span
                            key={idx}
                            onClick={() => handleJumbledWordClick(wIdx)}
                            className="bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded text-xs border border-emerald-500/20 font-bold hover:bg-red-500/20 hover:text-red-400 cursor-pointer transition-all hover:line-through shadow-sm"
                          >
                            {currentQuestion.jumbled[wIdx]}
                          </span>
                        ))
                      )}
                    </div>

                    {/* Available blocks to pick */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      {currentQuestion.jumbled.map((word: string, idx: number) => {
                        const isPicked = jumbledSelectionIndices.includes(idx);
                        return (
                          <button
                            key={idx}
                            disabled={isPicked}
                            onClick={() => handleJumbledWordClick(idx)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono border transition-all ${
                              isPicked
                                ? "bg-slate-900 text-slate-700 border-slate-800 pointer-events-none opacity-40 shadow-inner"
                                : "bg-slate-800 text-slate-100 border-slate-700 hover:bg-slate-755 cursor-pointer shadow-md hover:-translate-y-0.5 active:translate-y-0"
                            }`}
                          >
                            {word}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex gap-3 justify-end mt-2">
                      <button
                        onClick={() => setJumbledSelectionIndices([])}
                        className="px-4 py-2 bg-slate-900 border border-slate-805 hover:bg-slate-850 rounded-xl text-xs font-mono text-slate-400 hover:text-slate-200 transition-all"
                      >
                        Clear Draft
                      </button>
                      <button
                        onClick={handleJumbledSubmit}
                        disabled={jumbledSelectionIndices.length === 0}
                        className="px-6 py-2 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 border border-emerald-500/30 rounded-xl text-xs font-display font-extrabold uppercase transition-all tracking-wider disabled:opacity-30 disabled:pointer-events-none"
                      >
                        Throw Punch
                      </button>
                    </div>
                  </div>
                )}

                {/* TYPE C: MULTIPLE CHOICE OPTION CLICKS WITH 3 OPTIONS (ACTIVITY 8) */}
                {activityNum === 8 && (
                  <div className="flex flex-col gap-2.5 w-full">
                    {currentQuestion.options.map((option: string, idx: number) => {
                      const label = ["A", "B", "C"][idx];
                      return (
                        <button
                          key={idx}
                          onClick={() => handleMCQSubmit(label)}
                          className="w-full text-left p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-850 hover:border-amber-500/30 flex items-start gap-3 transition-all hover:scale-[1.005] group"
                        >
                          <span className="w-6 h-6 rounded-lg bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-xs font-mono font-bold text-indigo-400 group-hover:bg-amber-500 group-hover:text-slate-950 group-hover:border-transparent transition-all">
                            {label}
                          </span>
                          <span className="flex-1 text-xs text-slate-300 font-sans group-hover:text-white transition-all pt-0.5">
                            {option}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* TYPE D: TITLE MULTIPLE CHOICE OPTION SELECTION WITH 4 CHANNELS (ACTIVITY 10) */}
                {activityNum === 10 && (
                  <div className="flex flex-col gap-2.5 w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentQuestion.options.map((option: string, idx: number) => {
                        const label = ["A", "B", "C", "D"][idx];
                        return (
                          <button
                            key={idx}
                            onClick={() => handleMCQSubmit(label)}
                            className="text-left p-3.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-855 hover:border-purple-500/30 flex items-start gap-2.5 transition-all hover:scale-[1.01] group h-full"
                          >
                            <span className="w-5.5 h-5.5 rounded bg-purple-950 border border-purple-500/30 flex items-center justify-center text-[10px] font-mono font-bold text-purple-400 group-hover:bg-purple-500 group-hover:text-slate-950 group-hover:border-transparent transition-all">
                              {label}
                            </span>
                            <span className="flex-1 text-[11px] text-slate-300 font-sans group-hover:text-white transition-all pt-0.5 leading-relaxed">
                              {option}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* SCREEN 3: ROUND WON CONGRATULATIONS SCREEN */}
            {fightStatus === "round_won" && (
              <motion.div
                key="state_won"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center flex flex-col items-center gap-4 max-w-sm"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Trophy className="w-8 h-8 fill-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-extrabold text-white">
                    KO! Victory in stage {activityNum}!
                  </h3>
                  <p className="text-xs text-slate-400 mt-2">
                    Sensational! You have defeated <span className="text-amber-400 font-bold">{enemy.name}</span> in the academic ring. You scored <span className="text-emerald-400 font-extrabold">{fightScore}/10</span> hits!
                  </p>
                </div>
                <button
                  onClick={handleFinishFightSuccess}
                  className="w-full py-3 bg-emerald-500 text-slate-950 font-display font-black text-sm tracking-wider uppercase rounded-xl transition-all hover:bg-emerald-400 hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  Collect Loot & Continue <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* SCREEN 4: ROUND FAILED OUT OF TURN LIMIT RETRY */}
            {fightStatus === "failed" && (
              <motion.div
                key="state_failed"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center flex flex-col items-center gap-4 max-w-sm"
              >
                <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-extrabold text-red-400">
                    Defeated by Time limit
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 font-sans">
                    You ran out of rounds! <span className="text-red-400 font-bold">{enemy.name}</span> managed to withstand your punches. Your current score was <span className="text-amber-400 font-bold">{fightScore}/10</span> hits.
                  </p>
                </div>
                <button
                  onClick={handleRetryFightState}
                  className="w-full py-3 bg-red-650 hover:bg-red-500 text-white font-display font-bold text-sm rounded-xl tracking-wider uppercase transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" /> Go to corners
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
