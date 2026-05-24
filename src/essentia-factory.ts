// essentia-factory.ts — lazy-loads essentia WASM + extractor
// Browser-only: instantiates in Web Worker (never on main thread).

import EssentiaExtractor from "essentia.js/dist/essentia.js-extractor.es.js";
import { EssentiaWASM } from "essentia.js/dist/essentia-wasm.es.js";

let _extractor: InstanceType<typeof EssentiaExtractor> | null = null;

export interface EssentiaExtractorInstance {
  version: string;
  PercivalBpmEstimator: (signal: Float32Array) => { bpm: number };
  KeyExtractor: (signal: Float32Array, profileType: string) => {
    key: string;
    scale: string;
    strength: number;
  };
}

export async function getExtractorAsync(): Promise<EssentiaExtractorInstance> {
  if (_extractor) return _extractor;
  // EssentiaWASM is the initialized Emscripten module (not a factory)
  _extractor = new EssentiaExtractor(EssentiaWASM, false) as unknown as EssentiaExtractorInstance;
  return _extractor;
}

export function resetExtractor(): void {
  _extractor = null;
}
