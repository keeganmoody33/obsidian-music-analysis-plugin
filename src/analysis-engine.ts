// analysis-engine.ts — Audio analysis pipeline using essentia.js
import { correctTempo } from "./tempo-correction";
import { formatKey, KeyResult } from "./key-formatter";
import { getExtractorAsync, EssentiaExtractorInstance } from "./essentia-factory";

export interface AnalysisResult {
  tempo: number;
  rawTempo: number;
  wasCorrected: boolean;
  alternateTempo?: number;
  key: string;
  scale: string;
  keyConfidence: number;
  relativeKey?: string;
  duration: number;
  analysisConfidence: number;
  tempoConfirmed: boolean;  // false until user explicitly confirms
  keyConfirmed: boolean;    // false until user explicitly confirms
  error?: string;
}

/**
 * Decode an ArrayBuffer of audio data to a mono Float32Array.
 * Uses Web Audio API offline context.
 */
export async function decodeToMonoFloat32(
  audioBuffer: ArrayBuffer,
  sampleRate = 44100,
): Promise<Float32Array> {
  const OfflineAudioContext =
    (globalThis as any).OfflineAudioContext || (globalThis as any).webkitOfflineAudioContext;

  if (!OfflineAudioContext) {
    throw new Error("OfflineAudioContext not available");
  }

  const ctx = new OfflineAudioContext(1, 1, sampleRate);
  const audioBuf = await ctx.decodeAudioData(audioBuffer.slice(0));

  const bufferedLen = audioBuf.length;
  const channels = audioBuf.numberOfChannels;
  const mono = new Float32Array(bufferedLen);

  // Mix down to mono
  for (let i = 0; i < bufferedLen; i++) {
    let sum = 0;
    for (let ch = 0; ch < channels; ch++) {
      sum += audioBuf.getChannelData(ch)[i];
    }
    mono[i] = sum / channels;
  }

  return mono;
}

/**
 * Run full analysis on decoded mono audio.
 * Requires essentia.js extractor (lazy-loaded in browser; mocked in Node tests).
 */
export async function analyzeAudio(
  monoAudio: Float32Array,
  sampleRate = 44100,
  extractorOverride?: EssentiaExtractorInstance,
): Promise<AnalysisResult> {
  try {
    const extractor = extractorOverride || (await getExtractorAsync());
    const duration = monoAudio.length / sampleRate;

    // --- Tempo ---
    const tempoResult = extractor.PercivalBpmEstimator(monoAudio);
    const rawTempo = tempoResult.bpm;
    const corrected = correctTempo(rawTempo);

    // --- Key ---
    // edma profile (electronic-tuned) per build spec requirement 3
    const keyResult = extractor.KeyExtractor(monoAudio, "edma");
    const formattedKey = formatKey(keyResult.key, keyResult.scale, keyResult.strength);

    // --- Confidence ---
    let analysisConfidence = keyResult.strength;
    if (corrected.wasCorrected) {
      analysisConfidence *= 0.85; // penalize octave correction
    }

    return {
      tempo: corrected.tempo,
      rawTempo: corrected.rawTempo,
      wasCorrected: corrected.wasCorrected,
      alternateTempo: corrected.alternateTempo,
      key: formattedKey.key,
      scale: formattedKey.scale,
      relativeKey: formattedKey.relativeKey,
      keyConfidence: formattedKey.confidence,
      duration: Math.round(duration * 100) / 100,
      analysisConfidence: Math.round(analysisConfidence * 100) / 100,
      tempoConfirmed: false,
      keyConfirmed: false,
    };
  } catch (err: any) {
    return {
      tempo: 0,
      rawTempo: 0,
      wasCorrected: false,
      key: "",
      scale: "",
      keyConfidence: 0,
      duration: 0,
      analysisConfidence: 0,
      tempoConfirmed: false,
      keyConfirmed: false,
      error: err?.message || String(err),
    };
  }
}
