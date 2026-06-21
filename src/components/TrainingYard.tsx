import { useState, useEffect } from "react";
import { audio } from "../utils/audio";
import { ArrowLeft, ArrowRight, Check, X, ShieldAlert, Award, Grid, RefreshCw, Layers } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import trainingScene from "../assets/images/training_scene_1782042092027.jpg";

interface TrainingYardProps {
  activityNum: number;
  activityTitle: string;
  questions: any[];
  onTrainingFinish: (scoreEarned: number) => void;
}

export default function TrainingYard({
  activityNum,
  activityTitle,
  questions,
  onTrainingFinish,
}: TrainingYardProps) {
  const [curQIdx, setCurQIdx] = useState<number>(() => {
    const saved = localStorage.getItem(`milia_act_${activityNum}_curQIdx`);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [score, setScore] = useState<number>(() => {
    const saved = localStorage.getItem(`milia_act_${activityNum}_score`);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isFinished, setIsFinished] = useState<boolean>(() => {
    const saved = localStorage.getItem(`milia_act_${activityNum}_isFinished`);
    return saved === "true";
  });
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; show: boolean } | null>(null);

  // Activity 6 State: Scrambled timeline sorting
  const [orderedSteps, setOrderedSteps] = useState<string[]>(() => {
    const qIdx = localStorage.getItem(`milia_act_${activityNum}_curQIdx`) || "0";
    const saved = localStorage.getItem(`milia_act_${activityNum}_q_${qIdx}_orderedSteps`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });
  
  // Activity 7 State: sorting two buckets
  const [bucketSelections, setBucketSelections] = useState<Record<string, "Needs Comma" | "No Comma" | "">>(() => {
    const saved = localStorage.getItem(`milia_act_${activityNum}_bucketSelections`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {};
  });

  // Activity 9 State: ordering 10 sentences
  const [noodleSentences, setNoodleSentences] = useState<string[]>(() => {
    const saved = localStorage.getItem(`milia_act_${activityNum}_noodleSentences`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  const [hasSubmittedNoodle, setHasSubmittedNoodle] = useState<boolean>(() => {
    const saved = localStorage.getItem(`milia_act_${activityNum}_hasSubmittedNoodle`);
    return saved === "true";
  });

  // Set up background training audio on mount
  useEffect(() => {
    if (activityNum === 9) {
      audio.playBGM("Ftraining"); // Final training gets Ftraining.mp3
    } else {
      audio.playBGM("training"); // Rest of training activities get training.mp3
    }
    return () => {
      audio.stopBGM();
    };
  }, [activityNum]);

  // Synchronize basic states to localStorage
  useEffect(() => {
    localStorage.setItem(`milia_act_${activityNum}_curQIdx`, String(curQIdx));
    localStorage.setItem(`milia_act_${activityNum}_score`, String(score));
    localStorage.setItem(`milia_act_${activityNum}_isFinished`, String(isFinished));
    localStorage.setItem(`milia_act_${activityNum}_hasSubmittedNoodle`, String(hasSubmittedNoodle));
  }, [activityNum, curQIdx, score, isFinished, hasSubmittedNoodle]);

  // Initializing complex activity states
  useEffect(() => {
    if (activityNum === 6 && questions[curQIdx]) {
      const saved = localStorage.getItem(`milia_act_${activityNum}_q_${curQIdx}_orderedSteps`);
      if (saved) {
        try {
          setOrderedSteps(JSON.parse(saved));
          return;
        } catch (e) {}
      }
      // Scramble the three steps
      const stepsCopy = [...questions[curQIdx].steps];
      // simplistic mock pseudo-scramble (reverse or shift) to ensure it's not pre-solved
      const scrambled = [...stepsCopy].reverse();
      setOrderedSteps(scrambled);
      localStorage.setItem(`milia_act_${activityNum}_q_${curQIdx}_orderedSteps`, JSON.stringify(scrambled));
    }
  }, [curQIdx, activityNum, questions]);

  // Save Activity 6 orderedSteps on change
  useEffect(() => {
    if (activityNum === 6 && orderedSteps.length > 0) {
      localStorage.setItem(`milia_act_${activityNum}_q_${curQIdx}_orderedSteps`, JSON.stringify(orderedSteps));
    }
  }, [orderedSteps, activityNum, curQIdx]);

  useEffect(() => {
    if (activityNum === 7) {
      const saved = localStorage.getItem(`milia_act_${activityNum}_bucketSelections`);
      if (saved) {
        try {
          setBucketSelections(JSON.parse(saved));
          return;
        } catch (e) {}
      }
      // Initialize buckets to empty strings
      const initial: Record<string, "Needs Comma" | "No Comma" | ""> = {};
      questions.forEach((q) => {
        initial[q.signal] = "";
      });
      setBucketSelections(initial);
      localStorage.setItem(`milia_act_${activityNum}_bucketSelections`, JSON.stringify(initial));
    }
  }, [activityNum, questions]);

  // Save Activity 7 selections on change
  useEffect(() => {
    if (activityNum === 7 && Object.keys(bucketSelections).length > 0) {
      localStorage.setItem(`milia_act_${activityNum}_bucketSelections`, JSON.stringify(bucketSelections));
    }
  }, [bucketSelections, activityNum]);

  useEffect(() => {
    if (activityNum === 9) {
      const saved = localStorage.getItem(`milia_act_${activityNum}_noodleSentences`);
      if (saved) {
        try {
          setNoodleSentences(JSON.parse(saved));
          return;
        } catch (e) {}
      }
      // Scramble outer sentences but lock the first one (Topic Sentence) at the top (index 0)
      const copy = [...questions];
      const topicSentence = copy[0];
      const supportAndConcluding = copy.slice(1);
      
      // Simple pseudo-scramble/reverse to make it non-sequential for the user to solve
      const scrambledOthers = supportAndConcluding.reverse();
      const scrambled = [topicSentence, ...scrambledOthers];
      
      setNoodleSentences(scrambled);
      localStorage.setItem(`milia_act_${activityNum}_noodleSentences`, JSON.stringify(scrambled));
    }
  }, [activityNum, questions]);

  // Save Activity 9 noodle sentences on change
  useEffect(() => {
    if (activityNum === 9 && noodleSentences.length > 0) {
      localStorage.setItem(`milia_act_${activityNum}_noodleSentences`, JSON.stringify(noodleSentences));
    }
  }, [noodleSentences, activityNum]);

  const handleStandardResponse = (userAnswer: any, correctAnswer: any) => {
    if (feedback?.show) return; // Prevent double clicking

    const isCorrect = String(userAnswer).toLowerCase() === String(correctAnswer).toLowerCase();
    
    // Play correct sfx
    if (isCorrect) {
      audio.playSFX("punch"); // True check trigger punchSound.play()
      setScore((prev) => prev + 1);
    } else {
      audio.playSFX("miss"); // False check trigger missSound.play()
    }

    setFeedback({ isCorrect, show: true });

    setTimeout(() => {
      setFeedback(null);
      if (curQIdx + 1 >= questions.length) {
        setIsFinished(true);
      } else {
        setCurQIdx((prev) => prev + 1);
      }
    }, 1200);
  };

  // Activity 6 Chronological order submit
  const handleTimelineStepSwap = (idx1: number, idx2: number) => {
    const copy = [...orderedSteps];
    const temp = copy[idx1];
    copy[idx1] = copy[idx2];
    copy[idx2] = temp;
    setOrderedSteps(copy);
  };

  const handleTimelineSubmit = () => {
    const currentQ = questions[curQIdx];
    // Compares sequence
    const isCorrect = orderedSteps.every((step, index) => step === currentQ.steps[index]);
    
    if (isCorrect) {
      audio.playSFX("punch");
      setScore((prev) => prev + 1);
    } else {
      audio.playSFX("miss");
    }

    setFeedback({ isCorrect, show: true });

    setTimeout(() => {
      setFeedback(null);
      if (curQIdx + 1 >= questions.length) {
        setIsFinished(true);
      } else {
        setCurQIdx((prev) => prev + 1);
      }
    }, 1400);
  };

  // Activity 7 Comma Bucket classification
  const handleBucketSelect = (signal: string, bucket: "Needs Comma" | "No Comma") => {
    // play soft switch sound
    audio.playSFX("miss"); // mini trigger
    setBucketSelections((prev) => ({
      ...prev,
      [signal]: bucket,
    }));
  };

  const handleBucketSubmit = () => {
    // ALL 10 MUST BE CORRECT. If even 1 is wrong, score becomes 0.
    let allCorrect = true;
    questions.forEach((q) => {
      if (bucketSelections[q.signal] !== q.category) {
        allCorrect = false;
      }
    });

    if (allCorrect) {
      audio.playSFX("punch");
      setScore(10); // Reward fully on 10/10
    } else {
      audio.playSFX("buzzer");
      setScore(0); // If even one wrong, earns 0 training/reward points
    }

    setFeedback({ isCorrect: allCorrect, show: true });
    setIsFinished(true);
  };

  // Activity 9 Sentence arrangement up/down arrows
  const handleNoodleSentenceMove = (index: number, direction: "up" | "down") => {
    if (hasSubmittedNoodle) return; // Locked once submitted/graded
    if (index === 0) return; // Locked topic sentence at the top
    if (direction === "up" && index === 1) return; // Cannot move above Topic Sentence at index 0
    if (direction === "down" && index === noodleSentences.length - 1) return;

    const copy = [...noodleSentences];
    const swapTarget = direction === "up" ? index - 1 : index + 1;
    const temp = copy[index];
    copy[index] = copy[swapTarget];
    copy[swapTarget] = temp;
    setNoodleSentences(copy);
  };

  const handleNoodleSubmit = () => {
    // Calculates how many sentences are in key position
    let matchesCount = 0;
    noodleSentences.forEach((sentence, index) => {
      if (sentence === questions[index]) {
        matchesCount++;
      }
    });

    if (matchesCount === 10) {
      audio.playSFX("punch");
    } else {
      audio.playSFX("miss");
    }

    setScore(matchesCount); // gets 1 score point per matching position
    setHasSubmittedNoodle(true);
    setFeedback({ isCorrect: matchesCount === 10, show: true });
    
    setTimeout(() => {
      setFeedback(null);
    }, 1500);
  };

  const handleNoodleContinue = () => {
    setIsFinished(true);
  };

  const handleTrainingYardExit = () => {
    onTrainingFinish(score);
  };

  const curQuestionObj = questions[curQIdx];

  return (
    <div id={`training-activity-${activityNum}`} className="w-full flex flex-col items-center select-none gap-4">
      <div className="w-full max-w-2xl bg-slate-900 border-2 border-indigo-500 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col">
        {/* Background highlight decals */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-4 z-0 h-40 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* HEADER INFORMATION CARD */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5 z-10">
          <div>
            <span className="text-[10px] font-mono uppercase bg-indigo-950 text-indigo-400 px-2.5 py-1 rounded border border-indigo-500/20 font-bold tracking-wider">
              Training Mission #{activityNum}
            </span>
            <h1 className="text-xl font-display font-black text-slate-100 mt-1 uppercase tracking-tight">
              {activityTitle}
            </h1>
          </div>
          <div className="text-right">
            <div className="text-xs font-mono text-slate-400">SESSION SCORE</div>
            <div className="text-2xl font-display font-black text-indigo-400">
               {score} <span className="text-xs text-slate-500">pts</span>
            </div>
          </div>
        </div>

        {/* Safe Zone Training Image */}
        <div className="relative group rounded-2xl overflow-hidden border border-slate-850 shadow-lg bg-slate-950 mb-5 max-h-36 z-10 select-none">
          <img
            src={trainingScene}
            alt="Coach Office Safe Zone"
            referrerPolicy="no-referrer"
            className="w-full h-36 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90 pointer-events-none" />
          <div className="absolute top-2 left-2 select-none">
            <span className="text-[9px] font-mono font-bold text-emerald-400 bg-slate-950/90 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1.5 uppercase">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
              SAFE PRACTICE CAMPSITE
            </span>
          </div>
          <div className="absolute bottom-2 left-3 text-left select-none leading-normal">
            <span className="text-[10px] font-mono font-bold text-emerald-300 block uppercase">
              No Health Hazard here
            </span>
            <span className="text-[9px] font-mono text-slate-400 block max-w-sm">
              Practice formulas freely. No stamina is lost in this safe zone!
            </span>
          </div>
        </div>

        {/* PREVIEW INTERACTIVE PORTFOLIO PANEL */}
        <div className="min-h-72 flex flex-col justify-center items-center z-10 w-full">
          <AnimatePresence mode="wait">
            {!isFinished ? (
              <motion.div
                key="training_active_flow"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full flex flex-col gap-5"
              >
                {/* 1. PROGRESS COUNTER */}
                {activityNum !== 9 && (
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Task progress:</span>
                    <span>
                      {curQIdx + 1} of {questions.length} tasks
                    </span>
                  </div>
                )}

                {/* Training activity 1: Scale dragging / Clicking sentences */}
                {activityNum === 1 && (
                  <div className="flex flex-col gap-5">
                    {/* Sentence View Card */}
                    <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl italic font-display text-base text-slate-200 text-center leading-relaxed font-semibold shadow-inner">
                      "{curQuestionObj.question}"
                    </div>

                    {/* Scale Option blocks */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        onClick={() => handleStandardResponse("Too general", curQuestionObj.answer)}
                        className="py-3 px-4 rounded-xl bg-slate-800 border border-slate-700/60 hover:bg-slate-750 text-xs font-display font-bold uppercase tracking-wider text-amber-400 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/5 transition-all text-center"
                      >
                        Wide Net <br />
                        <span className="text-[10px] text-slate-400 lowercase font-normal">(Too General)</span>
                      </button>

                      <button
                        onClick={() => handleStandardResponse("Just right", curQuestionObj.answer)}
                        className="py-3 px-4 rounded-xl bg-slate-800 border border-slate-700/60 hover:bg-slate-750 text-xs font-display font-medium uppercase tracking-wider text-emerald-400 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5 transition-all text-center"
                      >
                        🎯 Bullseye <br />
                        <span className="text-[10px] text-slate-400 lowercase font-normal">(Just Right)</span>
                      </button>

                      <button
                        onClick={() => handleStandardResponse("Too specific", curQuestionObj.answer)}
                        className="py-3 px-4 rounded-xl bg-slate-800 border border-slate-700/60 hover:bg-slate-750 text-xs font-display font-bold uppercase tracking-wider text-sky-400 hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-500/5 transition-all text-center"
                      >
                        Microscope <br />
                        <span className="text-[10px] text-slate-400 lowercase font-normal">(Too Specific)</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Training Activity 3: Adjective Clause Fill MCQ */}
                {activityNum === 3 && (
                  <div className="flex flex-col gap-4">
                    {/* Blank sentence */}
                    <div className="bg-slate-950 border border-slate-802 p-5 rounded-2xl font-display font-medium text-base text-slate-200 text-center leading-relaxed">
                      {curQuestionObj.question.split("________")[0]}
                      <span className="text-indigo-400 font-extrabold underline px-2 font-mono">
                        ______
                      </span>
                      {curQuestionObj.question.split("________")[1]}
                    </div>

                    {/* Options buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      {curQuestionObj.options.map((option: string, idx: number) => {
                        const optionLabel = ["A", "B", "C", "D"][idx];
                        return (
                          <button
                            key={idx}
                            onClick={() => handleStandardResponse(optionLabel, curQuestionObj.answer)}
                            className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700/70 hover:border-indigo-400/30 font-display font-bold text-sm text-slate-200 text-left flex items-center gap-3 transition-all hover:translate-x-0.5 active:translate-x-0 shadow-md"
                          >
                            <span className="w-6 h-6 rounded bg-indigo-950 flex items-center justify-center text-xs text-indigo-400 font-mono font-bold">
                              {optionLabel}
                            </span>
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Training Activity 4: Apostrophes Correct/Incorrect (True/False) */}
                {activityNum === 4 && (
                  <div className="flex flex-col gap-4">
                    {/* Sentence displaying testing */}
                    <div className="bg-slate-950 border border-slate-802 p-5 rounded-2xl font-display text-sm sm:text-base text-slate-200 text-center leading-relaxed font-semibold">
                      "{curQuestionObj.question}"
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleStandardResponse(true, curQuestionObj.answer)}
                        className="py-4 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-emerald-500/35 text-emerald-400 font-display font-extrabold text-sm uppercase tracking-widest transition-all hover:-translate-y-0.5"
                      >
                        ✓ True (Correct)
                      </button>
                      <button
                        onClick={() => handleStandardResponse(false, curQuestionObj.answer)}
                        className="py-4 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-red-500/35 text-red-400 font-display font-extrabold text-sm uppercase tracking-widest transition-all hover:-translate-y-0.5"
                      >
                        ✗ False (Incorrect)
                      </button>
                    </div>
                  </div>
                )}

                {/* Training Activity 6: Time-Order Chrono Bread Sorting */}
                {activityNum === 6 && (
                  <div className="flex flex-col gap-4">
                    {/* Locked bread components top and bottom */}
                    <div className="bg-amber-900/10 border border-amber-500/20 p-3 rounded-t-xl text-xs font-display text-slate-300 font-bold flex flex-col gap-1 shadow-inner">
                      <span className="text-[8px] font-mono text-amber-500 uppercase tracking-widest">
                        🥯 Topic Sentence (Locked Top Bread)
                      </span>
                      "{questions[curQIdx].top}"
                    </div>

                    {/* Sorted interactive items */}
                    <div className="flex flex-col gap-2.5 p-3 bg-slate-950 rounded-xl border border-slate-850">
                      {orderedSteps.map((step, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-lg bg-slate-850 border border-slate-700 text-xs font-mono font-medium text-slate-200 shadow-md"
                        >
                          <span className="text-slate-400">Step {idx + 1}: {step}</span>
                          <div className="flex gap-1">
                            <button
                              disabled={idx === 0}
                              onClick={() => handleTimelineStepSwap(idx, idx - 1)}
                              className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 select-none flex items-center justify-center font-bold text-xs disabled:opacity-20 disabled:pointer-events-none border border-slate-600"
                            >
                              ▲
                            </button>
                            <button
                              disabled={idx === orderedSteps.length - 1}
                              onClick={() => handleTimelineStepSwap(idx, idx + 1)}
                              className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 select-none flex items-center justify-center font-bold text-xs disabled:opacity-20 disabled:pointer-events-none border border-slate-600"
                            >
                              ▼
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-amber-900/10 border border-amber-500/20 p-3 rounded-b-xl text-xs font-display text-slate-300 font-bold flex flex-col gap-1 shadow-inner">
                      <span className="text-[8px] font-mono text-amber-500 uppercase tracking-widest">
                        🥯 Concluding Sentence (Locked Bottom Bread)
                      </span>
                      "{questions[curQIdx].bottom}"
                    </div>

                    <button
                      onClick={handleTimelineSubmit}
                      className="w-full py-3 mt-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-display font-extrabold text-xs uppercase tracking-widest transition-all hover:shadow-lg hover:shadow-indigo-500/10"
                    >
                      Bake Sandwich & Submit Order
                    </button>
                  </div>
                )}

                {/* Training Activity 7: One by One Comma Classification */}
                {activityNum === 7 && (
                  <div className="flex flex-col gap-5">
                    {/* Signal Display Card */}
                    <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col justify-center items-center text-center shadow-inner gap-1 min-h-32">
                      <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest">
                        Transition Signal
                      </span>
                      <span className="font-display font-black text-2xl text-slate-100">
                        "{questions[curQIdx].signal}"
                      </span>
                      {questions[curQIdx].info && (
                        <span className="text-xs text-slate-400 font-sans italic mt-1 bg-slate-900 border border-slate-850 px-3 py-1 rounded-full">
                          {questions[curQIdx].info}
                        </span>
                      )}
                    </div>

                    {/* Scale Option blocks */}
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => handleStandardResponse("Needs Comma", questions[curQIdx].category)}
                        className="py-4 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-amber-500/40 hover:shadow-lg text-xs font-display font-extrabold uppercase tracking-widest text-amber-405 transition-all text-center flex flex-col items-center justify-center gap-1.5"
                      >
                        <span className="text-xl">✍️</span>
                        <span>Needs Comma</span>
                      </button>

                      <button
                        onClick={() => handleStandardResponse("No Comma", questions[curQIdx].category)}
                        className="py-4 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-cyan-500/40 hover:shadow-lg text-xs font-display font-extrabold uppercase tracking-widest text-cyan-405 transition-all text-center flex flex-col items-center justify-center gap-1.5"
                      >
                        <span className="text-xl">🛡️</span>
                        <span>No Comma</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Training Activity 9: Drag and Drop/Reorder Noodle sentence blueprints */}
                {activityNum === 9 && (
                  <div className="flex flex-col gap-4">
                    <p className="text-xs text-indigo-300 font-mono mb-1">
                      {hasSubmittedNoodle 
                        ? "Review your paragraph arrangement. Correct matches are green, incorrect positions are marked in red." 
                        : "Arrange the 10 sentences to compose a perfect paragraph about cooking noodles. Use the Up/Down arrows to position them correctly."
                      }
                    </p>

                    <div className="space-y-1.5 overflow-y-auto max-h-96 pr-1">
                      {noodleSentences.map((sentence, idx) => {
                        const isCorrectPosition = sentence === questions[idx];
                        let itemClass = "bg-slate-950 border-slate-850 text-slate-200";
                        if (hasSubmittedNoodle) {
                          itemClass = isCorrectPosition 
                            ? "bg-emerald-950/45 border-emerald-500/40 text-emerald-100" 
                            : "bg-red-950/45 border-red-500/40 text-red-105";
                        }
                        
                        return (
                          <div
                            key={idx}
                            className={`flex items-center gap-3 p-2.5 border rounded-lg text-[10px] font-mono leading-relaxed select-none shadow transition-colors ${itemClass}`}
                          >
                            <span className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-[9px] ${
                              hasSubmittedNoodle 
                                ? (isCorrectPosition ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300")
                                : "bg-slate-800 text-slate-400"
                            }`}>
                              {idx + 1}
                            </span>
                            
                            <span className="flex-1 italic">
                              "{sentence}"
                              {idx === 0 && (
                                <span className="ml-2 not-italic text-[8px] bg-indigo-505/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/20">
                                  📌 Topic Sentence (Locked)
                                </span>
                              )}
                            </span>
                            
                            {!hasSubmittedNoodle && (
                              <div className="flex flex-shrink-0 gap-1">
                                <button
                                  disabled={idx === 0 || idx === 1} // Can't move top topic sentence, and second one can't go above top
                                  onClick={() => handleNoodleSentenceMove(idx, "up")}
                                  className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-20 flex items-center justify-center font-bold text-[8px]"
                                >
                                  ▲
                                </button>
                                <button
                                  disabled={idx === 0 || idx === noodleSentences.length - 1} // Topic can't move down, and final can't move down
                                  onClick={() => handleNoodleSentenceMove(idx, "down")}
                                  className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-20 flex items-center justify-center font-bold text-[8px]"
                                >
                                  ▼
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {hasSubmittedNoodle ? (
                      <button
                        onClick={handleNoodleContinue}
                        className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-display font-black text-xs uppercase tracking-widest rounded-xl transition-all hover:shadow-lg shadow-emerald-500/10"
                      >
                        Finish Session & Claim Stats points ({score}/10)
                      </button>
                    ) : (
                      <button
                        onClick={handleNoodleSubmit}
                        className="w-full py-3.5 bg-purple-650 hover:bg-purple-605 text-white font-display font-black text-xs uppercase tracking-widest rounded-xl transition-all hover:shadow-lg"
                      >
                        Analyze Paragraph Blueprint & Grade
                      </button>
                    )}
                  </div>
                )}

                {/* INTERACTION ANIMATIONS FEEDBACK HUD overlay */}
                <AnimatePresence>
                  {feedback?.show && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={`absolute inset-0 bg-slate-950/90 z-20 flex flex-col items-center justify-center gap-3 rounded-2xl ${
                        feedback.isCorrect ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      <div className="w-16 h-16 rounded-full border-2 flex items-center justify-center animate-bounce">
                        {feedback.isCorrect ? (
                          <Check className="w-10 h-10 stroke-[3]" />
                        ) : (
                          <X className="w-10 h-10 stroke-[3]" />
                        )}
                      </div>
                      <span className="font-display font-black text-lg sm:text-xl tracking-wider uppercase">
                        {feedback.isCorrect ? "CLEAN HIT! (+1 Point)" : "MISSED CLU!"}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              // FINISHED DISPLAY CARD
              <motion.div
                key="training_finished_card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center flex flex-col items-center gap-5 max-w-sm"
              >
                <div className="w-20 h-20 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 animate-pulse">
                  <Award className="w-10 h-10" />
                </div>

                <div>
                  <h3 className="text-2xl font-display font-extrabold text-slate-100">
                    Spars Complete
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 font-sans">
                    Fascinating! You scored <span className="font-mono text-indigo-400 font-extrabold text-lg">{score}/{questions.length}</span> correct answers. Your new points are ready to be allocated!
                  </p>
                </div>

                <button
                  onClick={handleTrainingYardExit}
                  className="w-full py-3.5 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-display font-black text-sm tracking-wider uppercase rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-indigo-500/20"
                >
                  Go to Upgrade distribution
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
