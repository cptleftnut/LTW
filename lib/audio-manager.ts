// lib/audio-manager.ts
// Audio management for sound effects and background music

export class AudioManager {
  private soundEnabled: boolean = true;
  private musicEnabled: boolean = true;
  private musicVolume: number = 0.5;
  private sfxVolume: number = 0.7;
  private audioContext: AudioContext | null = null;

  async initialize() {
    // Initialize audio context on first user interaction
    try {
      if (typeof window !== "undefined" && window.AudioContext) {
        this.audioContext = new window.AudioContext();
      }
    } catch (error) {
      console.warn("Audio context not available:", error);
    }
  }

  /**
   * Play a sound effect (using simple beep for now)
   */
  async playSfx(name: string) {
    if (!this.soundEnabled || !this.audioContext) return;

    try {
      const ctx = this.audioContext;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      // Different sounds for different events
      const frequencies: Record<string, number> = {
        "tower-place": 800,
        "tower-attack": 600,
        "creep-death": 400,
        "wave-complete": 1000,
        "game-over": 300,
      };

      const freq = frequencies[name] || 500;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(this.sfxVolume * 0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } catch (error) {
      console.warn(`Failed to play sound ${name}:`, error);
    }
  }

  /**
   * Play background music (placeholder)
   */
  async playMusic(name: string) {
    if (!this.musicEnabled) return;
    // Music playback would require audio files
    // For now, this is a placeholder
  }

  /**
   * Set sound effects enabled/disabled
   */
  setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  /**
   * Set music enabled/disabled
   */
  setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
  }

  /**
   * Set sound effects volume (0-1)
   */
  setSfxVolume(volume: number) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Set music volume (0-1)
   */
  setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
  }
}

// Singleton instance
export const audioManager = new AudioManager();
