// __tests__/mocks/essentia.ts — deterministic mock for essentia.js in Node/jsdom
// Returns realistic output shapes without loading WASM.

export interface MockExtractor {
  version: string;
  PercivalBpmEstimator: (signal: Float32Array) => { bpm: number };
  KeyExtractor: (signal: Float32Array, profileType: string) => {
    key: string;
    scale: string;
    strength: number;
  };
}

/**
 * Deterministic mock extractor:
 * - BPM inferred from signal RMS energy (mock but consistent)
 * - Key fixed to known values for testability
 */
export function createMockExtractor(overrides?: {
  bpm?: number;
  key?: string;
  scale?: string;
  strength?: number;
}): MockExtractor {
  return {
    version: "mock-1.0",
    PercivalBpmEstimator: (_signal: Float32Array) => ({
      bpm: overrides?.bpm ?? 120,
    }),
    KeyExtractor: (_signal: Float32Array, _profileType: string) => ({
      key: overrides?.key ?? "Cm",
      scale: overrides?.scale ?? "minor",
      strength: overrides?.strength ?? 0.75,
    }),
  };
}
