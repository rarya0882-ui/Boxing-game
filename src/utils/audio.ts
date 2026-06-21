// Audio synthesis and MP3 playing system for the Boxing Scholar game.
// If the MP3 background music files are missing or blocked by browser policies,
// this system automatically falls back to an advanced Web Audio API retro synthesizer
// to play immersive arcade tunes and sound effects!

class AudioEngine {
  private ctx: AudioContext | null = null;
  private currentBgmSource: any = null;
  private bgmGainNode: GainNode | null = null;
  private currentMp3: HTMLAudioElement | null = null;
  private fallbackInterval: any = null;
  private activeSynthNodes: AudioNode[] = [];

  private sfxVolume = 0.5;
  private bgmVolume = 0.35;
  private isMuted = false;
  private currentSceneKey = "";

  constructor() {
    // Setup lazy audio context on user gesture
  }

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  resumeAudio() {
    this.initCtx();
    if (this.currentMp3 && this.currentMp3.paused && !this.isMuted) {
      this.currentMp3.play().catch(() => {});
    }
  }

  setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.currentMp3) {
      this.currentMp3.muted = muted;
    }
    if (this.bgmGainNode) {
      this.bgmGainNode.gain.value = muted ? 0 : this.bgmVolume;
    }
  }

  getMute(): boolean {
    return this.isMuted;
  }

  playBGM(scene: string) {
    if (this.currentSceneKey === scene) return;
    this.currentSceneKey = scene;
    this.stopBGM();
    this.initCtx();

    if (this.isMuted) return;

    // Map scenes to MP3 files as requested in the script
    const mp3Map: Record<string, string> = {
      opening: "opening.mp3",
      training: "training.mp3",
      Ftraining: "Ftraining.mp3",
      fight: "fight.mp3",
      final: "final.mp3",
      bad: "bad.mp3",
      continue: "continue.mp3",
      victory: "victory.mp3",
      ending: "ending.mp3",
    };

    const filename = mp3Map[scene];
    if (filename) {
      const audio = new Audio(`/${filename}`);
      audio.loop = true;
      audio.volume = this.bgmVolume;
      this.currentMp3 = audio;

      audio.play().catch((err) => {
        console.log(`Failed to play ${filename}, falling back to Web Audio Synth. Reason:`, err.message);
        this.playSynthBGM(scene);
      });
    } else {
      this.playSynthBGM(scene);
    }
  }

  stopBGM() {
    if (this.currentMp3) {
      this.currentMp3.pause();
      this.currentMp3 = null;
    }
    if (this.fallbackInterval) {
      clearInterval(this.fallbackInterval);
      this.fallbackInterval = null;
    }
    this.activeSynthNodes.forEach(node => {
      try {
        (node as any).stop();
      } catch (e) {}
    });
    this.activeSynthNodes = [];
    if (this.bgmGainNode) {
      this.bgmGainNode.disconnect();
      this.bgmGainNode = null;
    }
  }

  // Synthesizes cool retro arcade music on the fly!
  private playSynthBGM(scene: string) {
    this.initCtx();
    if (!this.ctx) return;

    this.bgmGainNode = this.ctx.createGain();
    this.bgmGainNode.gain.value = this.isMuted ? 0 : this.bgmVolume * 0.4; // keep synthesized music gentle
    this.bgmGainNode.connect(this.ctx.destination);

    let step = 0;
    let notes: number[] = [];
    let noteLength = 0.15; // in seconds

    // Define retro patterns based on the specified scenes
    if (scene === "opening") {
      // Heroic synth melody
      notes = [130, 164, 196, 261, 329, 392, 523, 392, 329, 261, 196, 164];
      noteLength = 0.25;
    } else if (scene === "training") {
      // Upbeat exercise arpeggios
      notes = [146, 220, 293, 369, 440, 369, 293, 220, 165, 247, 329, 415, 493, 415, 329, 247];
      noteLength = 0.16;
    } else if (scene === "Ftraining") {
      // Intense, fast-paced final training mission
      notes = [220, 261, 329, 392, 440, 392, 329, 261, 220, 261, 329, 392, 493, 392, 329, 261];
      noteLength = 0.12;
    } else if (scene === "fight") {
      // Combat tension bassline
      notes = [110, 110, 220, 110, 165, 110, 146, 130];
      noteLength = 0.18;
    } else if (scene === "final") {
      // Heavy metal boss fight
      notes = [82, 82, 164, 82, 196, 82, 146, 82, 130, 82, 110, 82, 98, 123, 147, 164];
      noteLength = 0.14;
    } else if (scene === "bad") {
      // Sad, slow descending pattern
      notes = [220, 207, 196, 185, 174, 164, 146, 130, 110];
      noteLength = 0.4;
    } else if (scene === "continue") {
      // Anxious ticking clock mood
      notes = [329, 110, 329, 110, 329, 110, 329, 110];
      noteLength = 0.25;
    } else if (scene === "victory") {
      // Upbeat victory fanfare
      notes = [261, 261, 261, 261, 329, 261, 392, 523];
      noteLength = 0.2;
    } else if (scene === "ending") {
      // Heavenly chords resolving
      notes = [329, 392, 523, 659, 783, 659, 523, 392];
      noteLength = 0.3;
    }

    if (notes.length === 0) return;

    const playStep = () => {
      if (!this.ctx || !this.bgmGainNode) return;
      if (this.ctx.state === "suspended") return;

      const note = notes[step % notes.length];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Configure oscillator
      if (scene === "fight" || scene === "final") {
        osc.type = "sawtooth"; // aggressive
      } else if (scene === "victory" || scene === "opening" || scene === "ending") {
        osc.type = "triangle"; // smooth/brass-like
      } else {
        osc.type = "sine"; // retro chip
      }

      osc.frequency.setValueAtTime(note, this.ctx.currentTime);
      
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + noteLength * 0.95);

      osc.connect(gain);
      gain.connect(this.bgmGainNode);

      osc.start();
      osc.stop(this.ctx.currentTime + noteLength);

      this.activeSynthNodes.push(osc);
      
      // Cleanup finished oscillator nodes
      if (this.activeSynthNodes.length > 20) {
        this.activeSynthNodes.shift();
      }

      step++;
    };

    // schedule initial
    playStep();
    this.fallbackInterval = setInterval(playStep, noteLength * 1000);
  }

  // Play Sound Effects
  playSFX(type: "punch" | "miss" | "ugh" | "buzzer" | "bell" | "whistle" | "victory") {
    this.initCtx();
    if (!this.ctx || this.isMuted) return;

    // Try playing MP3 first
    const sfxAudio = new Audio(`/sfx_${type}.mp3`);
    sfxAudio.volume = this.sfxVolume;
    sfxAudio.play().catch(() => {
      // Fallback synthesizer sound effect
      this.synthSFX(type);
    });
  }

  private synthSFX(type: string) {
    if (!this.ctx) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    const now = this.ctx.currentTime;

    if (type === "punch") {
      // Downward frequency sweep with distortion noise
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);
      gain.gain.setValueAtTime(this.sfxVolume * 0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === "miss") {
      // High-to-low swoosh
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.2);
      gain.gain.setValueAtTime(this.sfxVolume * 0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === "ugh") {
      // Heavy low impact grunt
      osc.type = "triangle";
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);
      gain.gain.setValueAtTime(this.sfxVolume * 0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === "buzzer") {
      // Harsh dual buzz
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(120, now);
      gain.gain.setValueAtTime(this.sfxVolume * 0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (type === "bell") {
      // High metal chime
      osc.type = "sine";
      osc.frequency.setValueAtTime(987, now); // B5
      gain.gain.setValueAtTime(this.sfxVolume * 0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      osc.start(now);
      osc.stop(now + 0.8);
    } else if (type === "whistle") {
      // High shrill warble
      osc.type = "sine";
      osc.frequency.setValueAtTime(2000, now);
      // Warble action
      osc.frequency.linearRampToValueAtTime(2100, now + 0.1);
      osc.frequency.linearRampToValueAtTime(1900, now + 0.2);
      osc.frequency.linearRampToValueAtTime(2000, now + 0.3);
      gain.gain.setValueAtTime(this.sfxVolume * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === "victory") {
      // Multi-tonal happy fanfare
      osc.type = "triangle";
      osc.frequency.setValueAtTime(523, now); // C5
      osc.frequency.setValueAtTime(659, now + 0.15); // E5
      osc.frequency.setValueAtTime(784, now + 0.3); // G5
      osc.frequency.setValueAtTime(1046, now + 0.45); // C6
      gain.gain.setValueAtTime(this.sfxVolume * 0.5, now);
      gain.gain.setValueAtTime(0.5, now + 0.45);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.95);
      osc.start(now);
      osc.stop(now + 0.95);
    }
  }
}

export const audio = new AudioEngine();
