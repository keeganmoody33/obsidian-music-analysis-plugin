// worker.ts — Web Worker for audio analysis (never blocks UI thread)
// Loaded by the plugin as a URL via URL.createObjectURL or bundled.

import { decodeToMonoFloat32, analyzeAudio } from "./analysis-engine";
import { EssentiaExtractorInstance } from "./essentia-factory";

// Type-only shim for postMessage in worker context
declare function postMessage(msg: WorkerResponse): void;

export interface WorkerRequest {
  id: string;
  type: "analyze";
  audioBuffer: ArrayBuffer;
  sampleRate?: number;
  hash?: string; // pre-computed SHA-256 (optional, for cache hit check)
}

export interface WorkerResponse {
  id: string;
  type: "analyze-result" | "error";
  result?: import("./analysis-engine").AnalysisResult;
  error?: string;
}

// --- Worker message handler ---
self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const { id, type, audioBuffer, sampleRate = 44100 } = event.data;

  if (type === "analyze") {
    try {
      const mono = await decodeToMonoFloat32(audioBuffer, sampleRate);
      const result = await analyzeAudio(mono, sampleRate);
      postMessage({ id, type: "analyze-result", result });
    } catch (err: any) {
      postMessage({ id, type: "error", error: err?.message || String(err) });
    }
  }
};
