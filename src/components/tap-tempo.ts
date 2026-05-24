// Tap-tempo controller — averages the last N inter-tap intervals.
// Used by BPMControl (modal + dashboard).

export interface TapTempoCallbacks {
  onBpmChange?: (bpm: number) => void;
  onTap?: () => void;
}

export class TapTempoController {
  private times: number[] = [];
  private maxTaps: number;

  constructor(opts: { maxTaps?: number } = {}) {
    this.maxTaps = opts.maxTaps ?? 8;
  }

  /** Call on every tap. Returns the current estimated BPM or null if not enough data. */
  tap(): number | null {
    const now = performance.now();
    this.times.push(now);

    if (this.times.length > this.maxTaps) {
      this.times.shift();
    }

    if (this.times.length < 2) return null;

    // Use the last up-to-(maxTaps-1) intervals
    const intervals: number[] = [];
    for (let i = 1; i < this.times.length; i++) {
      intervals.push(this.times[i] - this.times[i - 1]);
    }

    const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    if (avg <= 0) return null;

    const bpm = Math.round(60000 / avg);
    // Sanity clamp
    if (bpm < MIN_SANE || bpm > MAX_SANE) return null;
    return bpm;
  }

  reset(): void {
    this.times = [];
  }
}

const MIN_SANE = 60;
const MAX_SANE = 200;
