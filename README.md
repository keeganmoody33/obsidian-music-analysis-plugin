# Music Analysis — Obsidian Plugin

A **100% offline** Obsidian plugin that treats audio as a first-class citizen in your vault. Drop a local audio file into your vault, run analysis, and get tempo, key, and duration extracted via local WebAssembly — no network, no binaries, no cloud.

Detection is a **fast first draft you confirm**, not ground truth. The producer is the final authority.

---

## Features

- **Offline analysis** — all processing runs locally via [essentia.js](https://essentia.upf.edu/essentiajs) WASM; zero network calls
- **Tempo detection** — BPM with half/double alternate surfaced automatically (e.g. 140 and 70 shown together)
- **Key detection** — chromatic key + relative key using the EDMA profile, tuned for electronic music
- **Duration** — formatted playback length written to frontmatter
- **Non-destructive frontmatter injection** — analysis data is written to YAML without touching note prose
- **Confirmable draft workflow** — values are written as `tempo_confirmed: false` / `key_confirmed: false` until you explicitly confirm them
- **Interactive studio dashboard** — rendered from a `music-dashboard` code block: BPM control, key selector, structure timeline, tuner needle, and Camelot wheel
- **SHA-256 cache** — same audio file across multiple notes is never re-analyzed in the same session
- **Desktop + mobile capable** — no native binaries; heavy analysis is triggered manually

---

## Installation

### From the community plugin browser (when published)

1. Open **Settings → Community Plugins → Browse**
2. Search for **Music Analysis**
3. Install and enable

### Manual install

1. Download the latest release assets: `main.js`, `manifest.json`, `styles.css`, `worker.js`, `essentia-wasm.web.wasm`
2. Copy them into your vault at `.obsidian/plugins/obsidian-music-analysis/`
3. Reload Obsidian and enable the plugin under **Settings → Community Plugins**

---

## Usage

### Analyze an audio file

**Method 1 — Command palette**

1. Open or select an audio file (MP3, WAV, FLAC, OGG, AIFF, M4A) in your vault
2. Open the command palette (`Ctrl/Cmd + P`) and run **Analyze audio (tempo, key, duration)**

**Method 2 — Right-click context menu**

Right-click any audio file in the file explorer and choose **Analyze audio**.

The plugin creates (or updates) a companion Markdown note at `<audio-file-path>.md` with analysis results in frontmatter and a `music-dashboard` code block.

### Confirm or correct analysis

Run **Confirm analysis (open correction modal)** from the command palette while the analysis note is open. A modal lets you:

- Edit the BPM directly or tap-tempo with the Tap button
- Halve or double the tempo with one click
- Select the key and scale (major / minor)
- Mark values as confirmed (flips `tempo_confirmed` / `key_confirmed` to `true`)

Corrections can also be made inline from the **music-dashboard** rendered block inside the note.

---

## Frontmatter Schema

Every analysis note gets a YAML frontmatter block:

```yaml
---
audio_source: "tracks/instrumentals/82bpm_C#m_beat.ogg"
tempo: 82
tempo_confirmed: false
raw_tempo: 81.71          # pre-rounding detector output
alternate_tempo: 164      # ×2 / ÷2 ambiguity, derived from displayed tempo
key: "C#m"
key_confirmed: false
duration: "1:55"
total_bars: 96
audio_start_offset: 0.0

structure:                # manual entry — no auto-detection
  - segment: "Intro"
    bars: [1, 8]
    time: ["0:00", "0:23"]
  - segment: "Verse 1"
    bars: [9, 24]
    time: ["0:24", "1:10"]

# Credits — manual entry
artist: []
producer: []
mixer: []
engineer: []
musicians: []
producer_instagram: []
source_url: ""
license_status: ""        # e.g. "Lease" / "Exclusive" / "Personal Use"
---
```

`tempo_confirmed` and `key_confirmed` start as `false`. Set them to `true` via the confirm modal or the dashboard controls once you've verified the values by ear.

---

## Studio Dashboard

Add a `music-dashboard` code block to any analysis note to render the interactive dashboard:

````markdown
```music-dashboard
```
````

The block renders:

| Section | Description |
|---|---|
| **Header** | File name and duration |
| **Meta row** | BPM and key with confirmed / unconfirmed styling |
| **Controls** | BPM control (edit, halve/double, tap-tempo, confirm) + Key selector (semitone arrows, confirm) |
| **Structure timeline** | Visual bar-grid with segment labels; drag audio start offset |
| **Tuner needle** | Chromatic tuner gauge for the detected key |
| **Camelot wheel** | Interactive wheel — click a neighbour to copy a Dataview filter query |

---

## Dataview Queries

Use the [Dataview](https://github.com/blacksmithgu/obsidian-dataview) plugin to query your music catalog.

**Tracks that still need your ears:**

```dataview
TABLE tempo, key, duration
FROM ""
WHERE audio_source
WHERE key_confirmed = false OR tempo_confirmed = false
SORT tempo DESC
```

**Confirmed tracks only:**

```dataview
TABLE tempo, key, duration
FROM ""
WHERE audio_source
WHERE key_confirmed = true AND tempo_confirmed = true
SORT key ASC
```

**BPM range (confirmed):**

```dataview
TABLE tempo, key, duration
FROM ""
WHERE audio_source AND tempo_confirmed = true
WHERE tempo >= 120 AND tempo <= 140
SORT tempo ASC
```

**Key grouping (confirmed):**

```dataview
TABLE tempo, duration
FROM ""
WHERE audio_source AND key_confirmed = true
WHERE key = "Gm"
SORT tempo ASC
```

---

## Theming

All components use Obsidian CSS variables — no hardcoded colors. Override these CSS class hooks in an Obsidian CSS snippet:

```css
/* Unconfirmed values */
.mam-meta-unconfirmed { border-bottom: 1px dashed var(--text-accent); }

/* Confirmed values */
.mam-meta-confirmed { color: var(--color-green); }

/* Dashboard regions */
.mam-dashboard { }
.mam-dashboard-header { }
.mam-dashboard-meta { }
.mam-dashboard-controls { }
.mam-dashboard-timeline { }
.mam-dashboard-tuner { }
.mam-dashboard-camelot { }
```

---

## Supported Formats

MP3 · WAV · FLAC · OGG · AIFF · M4A

---

## Development

### Prerequisites

- Node.js ≥ 18
- npm

### Setup

```bash
npm install
```

### Build

```bash
npm run build
```

### Watch mode (for development in Obsidian)

```bash
npm run dev
```

### Tests

```bash
npm test
```

Unit tests run in Node with essentia mocked (fast, deterministic). A separate Playwright smoke test runs real essentia in a Chromium context to verify the analysis pipeline against known ground-truth signals.

---

## Design Philosophy

- **Detection is a draft, not ground truth.** Automated tempo/key on sampled and 808-heavy material is unreliable. The plugin writes results immediately as unconfirmed and surfaces them as provisional — the producer confirms by ear.
- **No confidence scores.** essentia's internal strength metric does not predict correctness on real music (a wrong answer can score higher than a correct one). Trust is expressed only via `*_confirmed` flags.
- **Fully offline.** No network calls, no bundled executables, no external tracking. All analysis runs in local WASM.
- **Non-destructive.** Frontmatter is injected/updated without touching existing note prose.

---

## License

[AGPL-3.0](LICENSE) — essentia.js is AGPL-licensed; for a local plugin this is effectively GPL-equivalent with open-source obligation only.
