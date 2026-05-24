// types/essentia.d.ts — Minimal declarations for essentia.js ES modules

declare module "essentia.js/dist/essentia.js-extractor.es.js" {
  export default class EssentiaExtractor {
    constructor(wasm: any, debug?: boolean);
    version: string;
    PercivalBpmEstimator(signal: Float32Array): { bpm: number };
    KeyExtractor(
      signal: Float32Array,
      profileType: string,
    ): { key: string; scale: string; strength: number };
  }
}

declare module "essentia.js/dist/essentia-wasm.es.js" {
  const EssentiaWASM: any;
  export { EssentiaWASM }; // named export (not default) from the ES build
}

declare module "essentia.js/dist/essentia-wasm.web.js" {
  const EssentiaWASM: { (): Promise<any> };
  export default EssentiaWASM;
}

// Also cover the UMD builds if referenced in old code
declare module "essentia.js/dist/essentia-wasm.umd.js" {
  const EssentiaWASM: { new (): any };
  export = EssentiaWASM;
}

declare module "essentia.js/dist/essentia.js-extractor.umd.js" {
  const EssentiaExtractor: { new (wasm: any, debug?: boolean): any };
  export = EssentiaExtractor;
}
