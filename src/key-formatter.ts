/**
 * Formats key output from essentia.js KeyExtractor.
 * Uses the `edma` profile for electronic music.
 * When confidence is low and torn between a key and its relative,
 * surfaces both (e.g. "Cm / Eb").
 */

export interface KeyResult {
  key: string;           // e.g. "Cm"
  scale: string;         // e.g. "minor" or "major"
  relativeKey?: string;  // e.g. "Eb"
  confidence: number;    // 0.0–1.0
}

// Mapping of relative keys: minor → relative major
const RELATIVE_MAP: Record<string, string> = {
  "Am": "C",   "Em": "G",   "Bm": "D",   "F#m": "A",
  "C#m": "E",  "G#m": "B",  "D#m": "F#", "A#m": "C#",
  "Dm": "F",   "Gm": "Bb",  "Cm": "Eb",  "Fm": "Ab",
};
// Invert for major → relative minor
const RELATIVE_MAP_INV: Record<string, string> = Object.fromEntries(
  Object.entries(RELATIVE_MAP).map(([k, v]) => [v, k]),
);

export function formatKey(
  key: string,
  scale: string,
  rawConfidence: number,
): KeyResult {
  let confidence = rawConfidence;
  const majorKey = key.replace("m", "");
  const isMinor = scale.toLowerCase() === "minor" || key.endsWith("m");

  // Determine if torn between relative keys
  let relativeKey: string | undefined;
  if (confidence < 0.5 && confidence > 0.2) {
    if (isMinor) {
      relativeKey = RELATIVE_MAP[key] || RELATIVE_MAP_INV[majorKey];
    } else {
      relativeKey = RELATIVE_MAP_INV[key] || RELATIVE_MAP[majorKey + "m"];
    }
  }

  // Penalize confidence if relative ambiguity is high
  if (relativeKey) {
    confidence *= 0.8;
  }

  return {
    key,
    scale,
    relativeKey,
    confidence: Math.round(confidence * 100) / 100,
  };
}
