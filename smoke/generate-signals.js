// generate-signals.js — known-ground-truth synthetic audio
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "fixtures");
const SAMPLE_RATE = 44100;

function mkdirp(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}
mkdirp(OUT);

function saveF32(name, arr) {
  fs.writeFileSync(path.join(OUT, `${name}.f32`), Buffer.from(arr.buffer));
  console.log(`  ${name}: ${arr.length} samples (${(arr.length / SAMPLE_RATE).toFixed(1)}s)`);
}

// Kick = low sine + noise, Snare = broadband noise
function kick(startIdx, arr) {
  for (let j = 0; j < 200 && startIdx + j < arr.length; j++) {
    const t = j / SAMPLE_RATE;
    const env = Math.exp(-j / 30);
    arr[startIdx + j] += (Math.sin(2 * Math.PI * 80 * t) * 0.7 + (Math.random() * 2 - 1) * 0.3) * env;
  }
}

function snare(startIdx, arr) {
  for (let j = 0; j < 150 && startIdx + j < arr.length; j++) {
    const env = Math.exp(-j / 20);
    arr[startIdx + j] += (Math.random() * 2 - 1) * env;
  }
}

// Standard 4/4 drum pattern: kick on every beat, snare on 2 & 4
function hihat(startIdx, arr) {
  for (let j = 0; j < 40 && startIdx + j < arr.length; j++) {
    const env = Math.exp(-j / 8);
    arr[startIdx + j] += (Math.random() * 2 - 1) * env * 0.4;
  }
}

function makeDrumTrack(bpm, durationSec) {
  const samples = Math.round(durationSec * SAMPLE_RATE);
  const sig = new Float32Array(samples);
  const beatPeriod = (60 / bpm) * SAMPLE_RATE;

  // Beats & backbeat
  let beat = 0;
  while (true) {
    const pos = Math.round(beat * beatPeriod);
    if (pos >= samples) break;
    kick(pos, sig);
    if ((beat % 4) === 1 || (beat % 4) === 3) snare(pos, sig);
    beat++;
  }

  // Hi-hat every 16th note (dense transient grid)
  let sixteenth = 0;
  while (true) {
    const pos = Math.round(sixteenth * beatPeriod / 4);
    if (pos >= samples) break;
    hihat(pos, sig);
    sixteenth++;
  }

  return sig;
}

// ===== BPM signals =====
saveF32("drums_90", makeDrumTrack(90, 10));
saveF32("drums_140", makeDrumTrack(140, 10));
saveF32("drums_72", makeDrumTrack(72, 12));

function makeTonePulse(bpm, toneFreq, durationSec) {
  const samples = Math.round(durationSec * SAMPLE_RATE);
  const sig = new Float32Array(samples);
  const period = (60 / bpm) * SAMPLE_RATE;
  const pulseLen = Math.round(0.01 * SAMPLE_RATE); // 10ms tone burst
  for (let pos = 0; pos < samples; pos += period) {
    const start = Math.round(pos);
    for (let j = 0; j < pulseLen && start + j < samples; j++) {
      const env = Math.exp(-j / 5);
      sig[start + j] += Math.sin(2 * Math.PI * toneFreq * (j / SAMPLE_RATE)) * env;
    }
  }
  return sig;
}

saveF32("pulse_200", makeTonePulse(200, 880, 10));

// ===== Key signal: sustained C minor triad =====
function makeCMinor(durationSec) {
  const samples = Math.round(durationSec * SAMPLE_RATE);
  const sig = new Float32Array(samples);
  const freqs = [261.63, 311.13, 392.00]; // C4, Eb4, G4
  for (let i = 0; i < samples; i++) {
    const t = i / SAMPLE_RATE;
    const env = 0.5 + 0.5 * Math.sin((2 * Math.PI * t) / durationSec);
    let s = 0;
    for (const f of freqs) s += Math.sin(2 * Math.PI * f * t);
    sig[i] = (s / freqs.length) * env;
  }
  return sig;
}

saveF32("triad_cmin", makeCMinor(10));

// ===== DC garbage calibration =====
saveF32("dc_garbage", new Float32Array(SAMPLE_RATE * 2).fill(0.5));

console.log("\nAll fixtures written to smoke/fixtures/");
