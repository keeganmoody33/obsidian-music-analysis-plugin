/**
 * Octave-corrects a raw BPM estimate into a sensible range (60–180).
 * Returns the corrected tempo, raw tempo, and whether correction was applied.
 */
export interface TempoCorrectionResult {
  tempo: number;
  rawTempo: number;
  wasCorrected: boolean;
}

const MIN_SANE = 60;
const MAX_SANE = 180;
const MUSICAL_MAX = 200;

export interface AltTempoResult {
  tempo: number;          // corrected/folded BPM in sane range
  rawTempo: number;       // original algorithm output
  wasCorrected: boolean;  // true if fold-to-range moved the value
  alternateTempo?: number; // plausible half/double for ambiguity UX
}

export function correctTempo(
  rawTempo: number,
  range: [number, number] = [MIN_SANE, MAX_SANE],
): AltTempoResult {
  let corrected = rawTempo;
  let wasCorrected = false;

  while (corrected > range[1]) {
    corrected /= 2;
    wasCorrected = true;
  }
  while (corrected < range[0] && corrected > 0) {
    corrected *= 2;
    wasCorrected = true;
  }

  if (corrected < range[0] && corrected > 0) {
    corrected *= 2;
    wasCorrected = true;
  }

  const rounded = Math.round(corrected);

  // BIDIRECTIONAL ambiguity: alternate is based on DISPLAYED tempo, not raw
  const doubled = rounded * 2;
  const halved = Math.round(rounded / 2);
  let alternateTempo;
  if (!wasCorrected) {
    if (doubled <= MUSICAL_MAX && doubled !== rounded) alternateTempo = doubled;
    else if (halved >= MIN_SANE && halved !== rounded) alternateTempo = halved;
  }

  return {
    tempo: rounded,
    rawTempo: Math.round(rawTempo * 100) / 100,
    wasCorrected,
    alternateTempo,
  };
}
