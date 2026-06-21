import { useState, useEffect } from "react";
import { PlayerStats, EnemyStats } from "./types";
import {
  enemies,
  activity1Questions,
  activity2Questions,
  activity3Questions,
  activity4Questions,
  activity5Questions,
  activity6Questions,
  activity7Questions,
  activity8Questions,
  activity9Questions,
  activity10Questions
} from "./data";
import IntroPage from "./components/IntroPage";
import CareerStartPage from "./components/CareerStartPage";
import TrainingYard from "./components/TrainingYard";
import TrainingStatsDistributor from "./components/TrainingStatsDistributor";
import BoxingRing from "./components/BoxingRing";
import GameOverView from "./components/GameOverView";
import BadEndView from "./components/BadEndView";
import VictoryPage from "./components/VictoryPage";
import { audio } from "./utils/audio";
import { Dumbbell, Shield, Zap, Flame, Award, ChevronRight, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import arenaImage from "./assets/images/arena_scene_1782042109966.jpg";

export default function App() {
  const [gameState, setGameState] = useState<
    "intro" | "careerStart" | "training" | "allocating" | "fighting" | "miliaCorner" | "victory" | "interstitial" | "badEnd"
  >(() => {
    const saved = localStorage.getItem("milia_gameState");
    return (saved as any) || "intro";
  });

  // User credentials
  const [name, setName] = useState(() => localStorage.getItem("milia_name") || "");
  const [nim, setNim] = useState(() => localStorage.getItem("milia_nim") || "");
  const [classCode, setClassCode] = useState(() => localStorage.getItem("milia_classCode") || "");

  // Timeline trackers
  const [startTime, setStartTime] = useState(() => {
    const saved = localStorage.getItem("milia_startTime");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [endTime, setEndTime] = useState(() => {
    const saved = localStorage.getItem("milia_endTime");
    return saved ? parseInt(saved, 10) : 0;
  });

  // Stats
  const [stepNum, setStepNum] = useState(() => {
    const saved = localStorage.getItem("milia_stepNum");
    return saved ? parseInt(saved, 10) : 0;
  }); // 0 corresponds to Intro Form. Steps 1-10 are Activities. Step 11 is Victory.
  const [totalPoints, setTotalPoints] = useState(() => {
    const saved = localStorage.getItem("milia_totalPoints");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [playerStats, setPlayerStats] = useState<PlayerStats>(() => {
    const saved = localStorage.getItem("milia_playerStats");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      power: 5,
      maxStamina: 10,
      stamina: 10,
      speed: 20
    };
  });

  // Intermediate state for point distribution after training
  const [trainingScoreEarned, setTrainingScoreEarned] = useState(() => {
    const saved = localStorage.getItem("milia_trainingScoreEarned");
    return saved ? parseInt(saved, 10) : 0;
  });

  // Keep state synchronized with localStorage to prevent random mid-game iframe resets
  useEffect(() => {
    localStorage.setItem("milia_gameState", gameState);
    localStorage.setItem("milia_name", name);
    localStorage.setItem("milia_nim", nim);
    localStorage.setItem("milia_classCode", classCode);
    localStorage.setItem("milia_startTime", String(startTime));
    localStorage.setItem("milia_endTime", String(endTime));
    localStorage.setItem("milia_stepNum", String(stepNum));
    localStorage.setItem("milia_totalPoints", String(totalPoints));
    localStorage.setItem("milia_playerStats", JSON.stringify(playerStats));
    localStorage.setItem("milia_trainingScoreEarned", String(trainingScoreEarned));
  }, [gameState, name, nim, classCode, startTime, endTime, stepNum, totalPoints, playerStats, trainingScoreEarned]);

  // Initialize intro music on mount & trigger lazy audio context on user gesture to solve modern browser autoplay blocks
  useEffect(() => {
    if (gameState === "intro") {
      audio.playBGM("opening");
    }

    const handleUserGesture = () => {
      audio.resumeAudio();
    };

    window.addEventListener("click", handleUserGesture);
    window.addEventListener("touchstart", handleUserGesture);
    window.addEventListener("keydown", handleUserGesture);

    return () => {
      window.removeEventListener("click", handleUserGesture);
      window.removeEventListener("touchstart", handleUserGesture);
      window.removeEventListener("keydown", handleUserGesture);
    };
  }, [gameState]);

  // Handle game start registration
  const handleStartGame = (regName: string, regNim: string, regClass: string) => {
    setName(regName);
    setNim(regNim);
    setClassCode(regClass);
    setStartTime(Date.now());
    
    // Proceed to custom Career Start Page
    setStepNum(1);
    setGameState("careerStart");
  };

  // Callback: Training finished
  const handleTrainingFinish = (score: number) => {
    setTrainingScoreEarned(score);
    setTotalPoints((prev) => prev + score); // Add correct answers to overall score

    if (score > 0) {
      setGameState("allocating");
    } else {
      // If scored 0 points (e.g. Activity 7 fail), skip allocating
      setGameState("interstitial");
    }
  };

  // Callback: Confirm Allocation
  const handleConfirmStatsAllocation = (finalStats: PlayerStats) => {
    setPlayerStats(finalStats);
    setGameState("interstitial");
  };

  // Callback: Fight finished
  const handleFightFinish = (finalPlayerStats: PlayerStats, won: boolean, hitsScore: number) => {
    if (won) {
      setPlayerStats(finalPlayerStats);
      setTotalPoints((prev) => prev + hitsScore); // Add hit count points as score

      if (stepNum === 10) {
        // Just beat the final boss! Show victory screen
        setEndTime(Date.now());
        setGameState("victory");
      } else {
        setGameState("interstitial");
      }
    }
  };

  const handleGameOverTrigger = () => {
    setGameState("miliaCorner");
  };

  // Milia's revival logic (The sacrifice)
  const handleRevival = () => {
    const cost = Math.min(10, totalPoints);
    setTotalPoints((prev) => Math.max(0, prev - cost));
    setPlayerStats((prev) => ({
      ...prev,
      stamina: prev.maxStamina // Restore physical stamina back to full!
    }));
    audio.playSFX("bell");
    setGameState("fighting"); // Sent directly back to the active combat card (restarts current fight from Round 1)
  };

  // Hard Reset to start menu
  const handleHardQuitAndReset = () => {
    localStorage.clear();
    setGameState("intro");
    setName("");
    setNim("");
    setClassCode("");
    setStartTime(0);
    setEndTime(0);
    setStepNum(0);
    setTotalPoints(0);
    setPlayerStats({
      power: 5,
      maxStamina: 10,
      stamina: 10,
      speed: 20
    });
    setTrainingScoreEarned(0);
  };

  // Continue to the next step along the 12-step path
  const handleProceedNextStep = () => {
    const nextStep = stepNum + 1;
    setStepNum(nextStep);

    if (nextStep === 2) {
      // Activity #2: Fight rookie
      setGameState("fighting");
    } else if (nextStep === 3) {
      // Activity #3: Training
      setGameState("training");
    } else if (nextStep === 4) {
      // Activity #4: Training
      setGameState("training");
    } else if (nextStep === 5) {
      // Activity #5: Fight contender
      setGameState("fighting");
    } else if (nextStep === 6) {
      // Activity #6: Training
      setGameState("training");
    } else if (nextStep === 7) {
      // Activity #7: Training
      setGameState("training");
    } else if (nextStep === 8) {
      // Activity #8: Fight heavyweight
      setGameState("fighting");
    } else if (nextStep === 9) {
      // Activity #9: Final Training
      setGameState("training");
    } else if (nextStep === 10) {
      // Activity #10: Fight Champion (Final boss!)
      setGameState("fighting");
    }
  };

  // Calculate elapsed time formatted
  const elapsedSeconds = Math.floor((endTime - startTime) / 1000);

  // Return specific training configuration data
  const getTrainingConfig = () => {
    switch (stepNum) {
      case 1:
        return {
          title: "Sentence Scale Drill",
          questions: activity1Questions
        };
      case 3:
        return {
          title: "Adjective Clause Fill",
          questions: activity3Questions
        };
      case 4:
        return {
          title: "Apostrophe Correction Guide",
          questions: activity4Questions
        };
      case 6:
        return {
          title: "Chronological Sandwich Order",
          questions: activity6Questions
        };
      case 7:
        return {
          title: "Comma Transition Buckets",
          questions: activity7Questions
        };
      case 9:
        return {
          title: "Paragraph Blueprint Bake",
          questions: activity9Questions
        };
      default:
        return {
          title: "Special exercise",
          questions: []
        };
    }
  };

  // Return opponent data
  const getOpponentConfig = () => {
    if (stepNum === 2) return { enemy: enemies.rookie, qs: activity2Questions };
    if (stepNum === 5) return { enemy: enemies.contender, qs: activity5Questions };
    if (stepNum === 8) return { enemy: enemies.heavyweight, qs: activity8Questions };
    if (stepNum === 10) return { enemy: enemies.champion, qs: activity10Questions };
    return { enemy: enemies.rookie, qs: [] };
  };

  const opponentObj = getOpponentConfig();
  const trainingConfig = getTrainingConfig();

  // Next Step text preview helper
  const getNextStepDescription = () => {
    if (stepNum === 1) return "Fight 1: Street Rookie (Sentence Types)";
    if (stepNum === 2) return "Training 2: Adjective Clauses";
    if (stepNum === 3) return "Training 3: Apostrophe checking";
    if (stepNum === 4) return "Fight 2: Campus Contender (Complex Sentences)";
    if (stepNum === 5) return "Training 4: Chronological sandwich drill";
    if (stepNum === 6) return "Training 5: Transition buckets Comma classifier";
    if (stepNum === 7) return "Fight 3: Amateur Heavyweight (Specific evidence details)";
    if (stepNum === 8) return "Training 6: Noodle paragraph blueprint";
    if (stepNum === 9) return "Title Fight: Review Champion (Final academic exam)";
    return "";
  };

  return (
    <div id="game-app-container" className="min-h-screen w-full bg-slate-950 font-sans text-slate-100 flex items-center justify-center p-3 sm:p-6 select-none relative">
      {/* Absolute floating atmospheric backdrop grids */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/20 via-slate-950 to-slate-950 pointer-events-none" />

      <AnimatePresence mode="wait">
        {gameState === "intro" && (
          <motion.div
            key="view_intro"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="w-full max-w-lg z-10"
          >
            <IntroPage onStartGame={handleStartGame} />
          </motion.div>
        )}

        {gameState === "careerStart" && (
          <motion.div
            key="view_careerStart"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-2xl z-10"
          >
            <CareerStartPage playerName={name} onProceed={() => setGameState("training")} />
          </motion.div>
        )}

        {gameState === "training" && (
          <motion.div
            key={`view_training_${stepNum}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="w-full max-w-2xl z-10"
          >
            <TrainingYard
              activityNum={stepNum}
              activityTitle={trainingConfig.title}
              questions={trainingConfig.questions}
              onTrainingFinish={handleTrainingFinish}
            />
          </motion.div>
        )}

        {gameState === "allocating" && (
          <motion.div
            key="view_allocating"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-xl z-10"
          >
            <TrainingStatsDistributor
              initialStats={playerStats}
              pointsToDistribute={trainingScoreEarned}
              onConfirm={handleConfirmStatsAllocation}
              activityTitle={trainingConfig.title}
            />
          </motion.div>
        )}

        {gameState === "fighting" && (
          <motion.div
            key={`view_fighting_${stepNum}`}
            initial={{ opacity: 0, scale: 1.01 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            className="w-full max-w-2xl z-10"
          >
            <BoxingRing
              playerStats={playerStats}
              enemy={opponentObj.enemy}
              questions={opponentObj.qs}
              activityNum={stepNum}
              onFightFinish={handleFightFinish}
              onGameOverTrigger={handleGameOverTrigger}
              totalPoints={totalPoints}
            />
          </motion.div>
        )}

        {gameState === "miliaCorner" && (
          <motion.div
            key="view_milia"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-md z-10"
          >
            <GameOverView
              totalPoints={totalPoints}
              opponentName={opponentObj.enemy.name}
              onContinueSelected={handleRevival}
              onQuitSelected={() => setGameState("badEnd")}
            />
          </motion.div>
        )}

        {gameState === "badEnd" && (
          <motion.div
            key="view_bad_end"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-md z-10"
          >
            <BadEndView
              totalPoints={totalPoints}
              onRestart={handleHardQuitAndReset}
            />
          </motion.div>
        )}

        {gameState === "victory" && (
          <motion.div
            key="view_victory"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-xl z-10"
          >
            <VictoryPage
              name={name}
              nim={nim}
              classCode={classCode}
              totalPoints={totalPoints}
              durationSeconds={elapsedSeconds}
              onRestart={handleHardQuitAndReset}
            />
          </motion.div>
        )}

        {gameState === "interstitial" && (
          <motion.div
            key="view_interstitial"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full max-w-md mx-auto bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 shadow-2xl relative text-center overflow-hidden z-10"
          >
            {/* Soft highlight backing */}
            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />

            <div className="w-16 h-16 bg-slate-950 mx-auto rounded-full flex items-center justify-center text-indigo-400 border border-slate-800 shadow-inner mb-4">
              <Award className="w-8 h-8" />
            </div>

            <span className="text-[9px] font-mono tracking-widest text-indigo-400 font-extrabold uppercase bg-indigo-500/10 py-1 px-3 border border-indigo-500/20 rounded-full">
              INTERSTITIAL GATEWAY
            </span>

            <h2 className="text-xl sm:text-2xl font-display font-black text-white mt-3 uppercase">
              Step {stepNum} Complete
            </h2>

            {/* STATS HUD OVERFLOW CARD */}
            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-850 mt-5 mb-6 text-left space-y-3 font-mono">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest block font-bold">
                Your Champion Status
              </span>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-850 text-center flex flex-col items-center">
                  <Dumbbell className="w-4 h-4 text-red-400 mb-1" />
                  <span className="text-[10px] text-slate-400">POWER</span>
                  <span className="text-sm font-bold text-white">{playerStats.power}</span>
                </div>
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-850 text-center flex flex-col items-center">
                  <Shield className="w-4 h-4 text-emerald-400 mb-1" />
                  <span className="text-[10px] text-slate-400">STAMINA</span>
                  <span className="text-sm font-bold text-white">
                    {playerStats.stamina}/{playerStats.maxStamina}
                  </span>
                </div>
                <div className="p-2 bg-slate-905 rounded-lg border border-slate-850 text-center flex flex-col items-center">
                  <Zap className="w-4 h-4 text-blue-400 mb-1" />
                  <span className="text-[10px] text-slate-400">SPEED</span>
                  <span className="text-sm font-bold text-white">{playerStats.speed}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-850 mt-2 text-slate-300">
                <span>TOTAL SCORE BALANCE:</span>
                <span className="text-amber-400 font-extrabold text-sm">{totalPoints} points</span>
              </div>
            </div>

            {((stepNum + 1) === 2 || (stepNum + 1) === 5 || (stepNum + 1) === 8 || (stepNum + 1) === 10) && (
              <div className="relative group rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950 mb-4 select-none">
                <img
                  src={arenaImage}
                  alt="Fight Arena Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90 pointer-events-none" />
                <div className="absolute top-2 left-2 select-none">
                  <span className="text-[9px] font-mono font-bold text-red-400 bg-slate-950/90 px-2 py-0.5 rounded border border-red-500/30 flex items-center gap-1 uppercase">
                    <span className="w-1 h-1 bg-red-400 rounded-full animate-ping" />
                    BATTLEGROUND UP NEXT
                  </span>
                </div>
                <div className="absolute bottom-2 left-3 right-3 text-left leading-tight select-none">
                  <span className="text-[9px] font-mono font-bold block uppercase text-amber-400">
                    FOCUS FOR THE FIGHT
                  </span>
                  <span className="text-[8px] font-mono text-slate-400 block">
                    Get ready! In the arena, incorrect statements cost Stamina. Secure your guard!
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest block font-bold">
                Up next along path:
              </span>
              <p className="text-xs sm:text-sm text-slate-300 font-sans italic font-medium">
                "{getNextStepDescription()}"
              </p>

              <button
                onClick={handleProceedNextStep}
                className="w-full py-3.5 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-display font-black text-xs sm:text-sm tracking-wider uppercase rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
              >
                Enter next gate <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
