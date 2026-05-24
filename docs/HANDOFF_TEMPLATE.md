# Slice Handoff Template — Offline Music Analysis Plugin

**How to use:** At the end of a slice → fill in PART 1 → commit → paste this **whole doc** as the FIRST message in a **new thread** for the next slice.
Fresh Hector: read PART 1, then read the three source-of-truth files, *then* write code. Do **not** rely on prior chat history — it does not exist in this thread.

-----

## PART 1 — Fill in each slice

- **Repo:** `/Users/keeganmoody/code/obsidian-music...`  *(confirm exact path)*
- **Last known-good commit:** `[hash]` — `[message]`  ← roll back here if anything breaks
- **Slice just finished:** `[e.g. Slice 2: confirm-UX]` — green + committed
- **What shipped (files/components added):** `[e.g. tap-tempo.ts, bpm-control.ts, key-control.ts, confirm-modal.ts]`
- **New gotchas from last slice:** `[anything the next slice should know]`

**THIS slice:** `[e.g. Slice 3: dashboard render + structure timeline + tuner + Camelot]`

- **Goal (one line):** `[...]`
- **Acceptance criteria (definition of done):**
  - [ ] `[...]`
  - [ ] `[...]`
  - [ ] Build green, tests green, committed to git (report the hash)

-----

## PART 2 — Standing context *(stable — leave as-is)*

**Read these first — source of truth, since chat history is gone:**

- `CONTEXT.md` — vision, glossary, YAML schema
- `ARCHITECTURAL_DECISION_RECORDS.md` — all ADRs (the locked decisions)
- `BOARD_V1.md` — the 5-slice plan + dependencies

*(Make sure those three are saved in the repo so Hector can actually open them.)*

**Project in one line:** A fully offline Obsidian plugin that analyzes local instrumentals (tempo, key, manual structure) via local WASM, writes to note frontmatter non-destructively, and renders a studio dashboard. No network, no binaries.

**Locked decisions — do NOT re-litigate:**

- **Fully offline.** Zero network calls, zero bundled binaries. (ADR-022)
- **essentia.js runs in the Electron renderer (a browser context), NOT pure Node.** Mock essentia in Node unit tests; verify real essentia in the browser. Do not burn turns forcing it to run in Node.
- **Detection is a confirmable draft, never ground truth.** Write `key_confirmed: false` / `tempo_confirmed: false` on analysis. Never block the YAML write on confirmation — that preserves AFK drop-and-go.
- **The confidence/strength score is dead.** Never display it as accuracy (a wrong answer once scored higher than a correct one). Style by confirmed vs unconfirmed instead.
- **Tempo:** surface ½ and ×2 bidirectionally; never auto-“solve” half/double; derive alternates from the *displayed* tempo.
- **Structure is MANUAL entry** — no auto-detection. (ADR-024)
- **Dashboard renders via the `music-dashboard` code-block processor** — NOT by skinning the YAML frontmatter. (ADR-016)
- **Credits/license are manual fields.** (ADR-023)
- **UI is Obsidian-native:** `Modal` class + Obsidian CSS variables only (no hardcoded colors), namespaced `mam-` classes, WASM lazy-loaded on first analysis.

**Working rules — process discipline:**

- **ONE slice per thread.** This handoff carries state; chat history does not.
- **Commit to git at every green.** Never edit an uncommitted repo.
- **Rewrite whole files; do NOT patch-on-patch** — stacked patches mangle files (especially after a context compaction).
- **Report the REAL build/test status.** Never summarize as green if it isn’t.
- **Stop at the acceptance criteria.** No scope creep. Hit a V2-parking-lot item → flag it and move on, don’t build it.

**V2 parking lot — do NOT build:** online enrichment (AcoustID/MusicBrainz), stream ingestion (YouTube/yt-dlp), external library import (Serato etc.), auto-structure-detection, sub-bass high-pass key experiment.

**End-of-slice deliverable:** green build + green tests + git commit (report hash) + a filled-in PART 1 for the next slice.