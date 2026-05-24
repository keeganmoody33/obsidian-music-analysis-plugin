# Context: Music Analysis Obsidian Plugin

> **Source of truth.** This file + `ARCHITECTURAL_DECISION_RECORDS.md` + `BOARD_V1.md` are the canonical record. Code reflects these; if they disagree, the ADRs win. Keep them committed in `docs/` so any fresh agent thread can read them.

## Vision

A **100% offline** Obsidian plugin that treats audio as a first-class citizen in the vault. Drop a local instrumental → it extracts tempo, key, and (manually entered) arrangement via local WASM math, writes them into the note’s frontmatter without touching prose, and renders an interactive studio dashboard. Detection is a **fast first draft you confirm**, not ground truth. Credits are curated by hand, like a studio journal. No internet, no bundled binaries, ever.

- **License:** AGPL-3.0 (essentia.js is AGPL; for a local plugin this is GPL-equivalent — open-source obligation only).
- **Platforms:** Desktop + mobile capable (no native binaries → no desktop lock); heavy analysis gated on mobile. See ADR-025.

## Glossary

**Audio Asset** — a local audio file (WAV, MP3, OGG, AIFF…) inside the vault.

**Hybrid Asset Note** — a markdown note holding user prose alongside musical metadata in its frontmatter.

**Dynamic Studio Dashboard** — the interactive UI rendered from a `music-dashboard` code block (ADR-016): tuner needle, structure timeline, Camelot wheel, confirm controls. Reads frontmatter; the YAML stays the source of truth.

**Local Engine** — client-side WASM (essentia.js) running fully offline to extract tempo, key, duration. Runs in the Electron renderer (a browser context), not pure Node (ADR-029).

**Confirmable Draft** — the core stance on detection (ADR-027): tempo/key are written immediately as *unconfirmed suggestions* (`*_confirmed: false`), surfaced as provisional, and confirmed or corrected by the user. The producer is the final authority.

**Acoustic Cache Registry** — internal map of SHA-256 file hashes → analysis results, so the same file across multiple notes is never re-analyzed (Slice 4 / ADR-018).

**Semantic File Renaming Engine** — renames raw files on ingestion via Obsidian’s rename API (so links survive) to bake tempo/key/producer into the filename (ADR-019).

**Audio Start Offset** — timestamp skipped before the true downbeat, to align the bar grid (ADR-004).

**Manual Credit Curation** — credits/license are user-entered; the plugin scaffolds empty fields as a prompt and never guesses (ADR-023).

**Signal strength (deprecated as accuracy)** — essentia’s internal confidence number. Proven *not* to predict correctness on real music (a wrong answer once scored higher than a correct one), so it is **not** displayed as accuracy (ADR-026).

## Relationships

- A **Hybrid Asset Note** holds an **Audio Asset**’s metadata without disturbing prose.
- Multiple notes can link one shared **Audio Asset** via the **Cache Registry** — no duplication, no re-analysis.
- The **Studio Dashboard** reads frontmatter and writes back confirmed values; styling reflects confirmed vs unconfirmed state, never a confidence color.
- The **Renaming Engine** renames via Obsidian’s API so note links stay intact. (OS-level moves *outside* Obsidian are invisible to it and can break links.)

## Master YAML Schema (current)

```yaml
---
# --- Core Analysis (offline, automated -> unconfirmed until you confirm) ---
audio_source: "tracks/instrumentals/82bpm_C#m_beat.ogg"
tempo: 82
tempo_confirmed: false
raw_tempo: 81.71          # pre-rounding detector output
alternate_tempo: 164      # the x2/div2 ambiguity, derived from displayed tempo
key: "C#m"
key_confirmed: false
duration: "1:55"
total_bars: 96
audio_start_offset: 0.0

structure:                # MANUAL entry (ADR-024) - no auto-detection
  - segment: "Intro"
    bars: [1, 8]
    time: ["0:00", "0:23"]
  - segment: "Verse 1"
    bars: [9, 24]
    time: ["0:24", "1:10"]

# --- Credits (manual, ADR-023) ---
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

> `analysis_confidence` was removed (deprecated, ADR-026). Trust is expressed by the `*_confirmed` flags, not a score.