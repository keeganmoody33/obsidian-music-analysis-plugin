# Architectural Decision Records (ADRs)

> **Current scope (read first):** V1 is a **100% offline** Obsidian plugin (desktop + mobile capable). It analyzes local audio (tempo, key, manual structure) via local WASM (essentia.js), writes results to note frontmatter non-destructively, and renders a studio dashboard. **No network, no bundled binaries, no external-library tracking.** Detection is a **confirmable draft, never ground truth** (ADR-027). Online enrichment and stream ingestion are deferred to V2.
> 
> **Plugin license: AGPL-3.0.**

**Status legend:** `Accepted` · `Revised` (intent stands, mechanism/scope changed) · `Withdrawn` (cut; kept for history)

-----

#### ADR-001: Scope Reduction (Core Vault Only) — `Accepted (Reinforced)`

Analyze/manage only media inside the active vault. No external file-system tracking.

#### ADR-002: Explicit Structure Schema — `Accepted`

Structure is a sequential array of uniform objects (`segment`, `bars`, `time`), not dynamic keys.

#### ADR-003: Non-Destructive Metadata Injection — `Accepted`

Ingest injects/appends frontmatter without modifying existing prose.

#### ADR-004: Downbeat Offset Tracking — `Accepted`

`audio_start_offset` trims lead-in; all time<->bar math applies it first.

#### ADR-005: User-Configurable Metadata Templates — `Accepted`

Core metrics merge into a user-defined YAML skeleton.

#### ADR-006: Dual-Domain Alignment (Bars + Time) — `Accepted`

Each structure segment stores both bar indices and timestamps.

#### ADR-007: Flat Role-Arrays for Dataview — `Accepted`

Credits are flat string arrays under explicit roles for fast native querying.

#### ADR-008: Two-Tier External Enrichment — `Withdrawn`

Network enrichment cut from V1 (ADR-022). AcoustID also whiffs on instrumentals. Re-evaluate in V2.

#### ADR-009: Flat Social-Handle Arrays — `Revised`

The flat-array *structure* stays (ideal for Dataview); population is now **manual**, not scraped (ADR-023).

#### ADR-010: Algorithmic License Tagging — `Withdrawn`

`license_status` is a manual field now (ADR-023).

#### ADR-011: Local vs. Online Execution Split — `Revised -> ADR-022`

No online tier in V1; runtime is offline-only.

#### ADR-012: Advanced Settings & Toggles — `Revised`

V1 settings: `auto_analyze_on_drop`, performance mode, default folder, rename-token pattern, manual “Re-analyze”. No online toggles.

#### ADR-013: Placeholder Scaffolding — `Accepted (Elevated)`

Empty credit fields (`mixer: []`, `license_status: ""`) are the **primary** manual-entry mechanism, not a fallback.

#### ADR-014: Explicit Error Notification — `Revised`

Rescoped to **analysis** failures (corrupt file, unsupported codec, decode/WASM error). No silent failures; Obsidian Notice with the reason.

#### ADR-015: Interactive Network Sync Control — `Withdrawn`

No network state to sync (ADR-022).

#### ADR-016: Custom Visual Render Layer — `Revised (mechanism corrected)`

Render the dashboard via a **`music-dashboard` code-block processor** that reads frontmatter — NOT by skinning the YAML region (that fights the framework). YAML stays the source of truth. Tuner/controls/timeline live in the rendered block. Styling reflects confirmed/unconfirmed state (ADR-026/027), never a confidence color.

#### ADR-017: Directory Isolation & Sub-Folder Routing — `Revised (simplified)`

Keep a `Default Instrumental Folder` + optional self-sorting subfolders driven by the **manual** `producer` tag vs the user’s identity handle.

#### ADR-018: Global Asset Registry & Caching — `Accepted (Central)` *(Slice 4)*

SHA-256 hash -> analysis map. Re-linking a known file loads metrics instantly, skipping WASM re-analysis.

#### ADR-019: Automated Semantic File Renaming — `Accepted` *(Slice 4)*

Tokenized rename (`[TEMPO]bpm_[KEY]_[PRODUCER] - [ORIGINAL].ext`) via Obsidian’s `fileManager.renameFile` so links survive. **OS-level moves outside Obsidian can still break links.**

#### ADR-020: Integrated Stream Ingestion (YouTube) — `Withdrawn`

Cut: needed a bundled downloader binary + carried ToS liability + pulled away from core (ADR-022).

#### ADR-021: Platform-Specific Binary Bundling — `Withdrawn`

The community plugin browser only ships `manifest.json`/`main.js`/`styles.css` — binaries can’t ride along. With stream/enrichment cut, no binaries are needed (ADR-022).

-----

### Offline-V1 decisions

#### ADR-022: Fully Offline V1 (Network Out of Scope) — `Accepted`

Zero network calls, zero bundled executables. All analysis runs on local WASM. Clean community review, no network disclosure, no ToS liability. Online enrichment is a clearly-scoped V2 add-on.

#### ADR-023: Manual Credit Curation — `Accepted`

Credits & licensing are user-entered. The plugin scaffolds empty fields (ADR-013) and never guesses. Preserves the studio-journal workflow; auto-population returns in V2.

#### ADR-024: Manual-First Structure Entry — `Accepted`

Arrangement structure is entered/edited manually in the dashboard. Auto-labeling Intro/Verse/Chorus is research-grade MIR essentia won’t deliver reliably. Confidence-scored auto-detection is a V2 candidate.

#### ADR-025: Cross-Platform Target (Mobile-Capable, Perf-Gated) — `Accepted`

No `child_process`, no native binaries -> not forced desktop-only. Target universal (`isDesktopOnly: false`), but gate heavy analysis behind a manual trigger on mobile pending on-device validation.

-----

### Accuracy-crisis decisions (the most important learnings)

> Real-beat testing on the user’s hip-hop corpus proved automated key/tempo is unreliable on sampled/808-heavy material, AND that essentia’s internal confidence does not predict correctness. These ADRs encode the response.

#### ADR-026: Confidence Score Deprecated — `Accepted`

- **Context:** On real beats, a *wrong* key answer scored strength 0.780 — higher than a known-*correct* triad at 0.766. The metric does not track correctness.
- **Decision:** Remove `analysis_confidence` from the schema and the UI. Never display strength as accuracy. Express trust via the `*_confirmed` flags (ADR-027) and confirmed/unconfirmed styling instead.
- **Consequences:** No false “green = correct” signal. Honest UI.

#### ADR-027: Detection Is a Confirmable Draft — `Accepted` *(core architectural stance)*

- **Context:** Automated tempo/key is often wrong on this corpus and we can’t make it reliably right. The producer already knows the answer.
- **Decision:** Treat detection as a fast first draft.
  - Write results immediately with `tempo_confirmed: false` / `key_confirmed: false`. **Never block the YAML write on confirmation** — this preserves AFK drop-and-go.
  - Surface unconfirmed values as visibly provisional.
  - Confirm/correct per-note or in bulk; flag flips to `true`. Dataview can filter confirmed vs unconfirmed.
  - Never auto-“solve” an ambiguity the engine can’t resolve — surface it and let the human pick.
- **Consequences:** Robust to any detector error; the human is the final authority. The plugin’s value is *speed* (“probably around here”), not perfect accuracy.

#### ADR-028: Bidirectional Tempo Ambiguity Surfacing — `Accepted`

- **Context:** Octave/half-double errors are the dominant tempo failure (e.g. 140 read as 70; 67 read as 123). Folding into a [60,180] window can’t catch a half/double that already lands in range.
- **Decision:** Surface **both** the detected tempo and its ÷2 and ×2 alternates (derived from the *displayed* value, kept consistent). Provide one-tap halve/double + **tap-tempo** (average last ~8 taps, BPM = 60000/avg_ms) + manual edit. Tap-tempo / manual override is the real ground-truth path.
- **Consequences:** Common corrections are one tap; the unsolvable cases fall back to the human cleanly.

#### ADR-029: Testing Architecture — Mock in Node, Real in Browser — `Accepted`

- **Context:** essentia.js is built for the browser. The plugin runs in Obsidian’s Electron renderer (a browser context), NOT pure Node. Forcing essentia to run under the Node test runner burns time for zero production value.
- **Decision:** Unit tests run in Node with essentia **mocked** (a stub matching its real output shape) to verify pipeline logic — octave correction, cache, confirm-flags, non-destructive YAML injection, error paths. A separate **browser/Chromium smoke test** loads *real* essentia (`.web.js`) and asserts known-ground-truth signals (click train at known BPM, triad at known key). A slice is not “done” on mocks alone.
- **Consequences:** Fast deterministic unit tests + one real check that the engine fires where it actually runs.

-----

### Process / working agreements

#### ADR-030: Engineering Working Agreements — `Accepted`

- **One slice per thread.** Each slice gets a fresh agent context; state is carried by committed files + a handoff doc (`HANDOFF_TEMPLATE.md`), never by chat history. Prevents context bloat / compaction-driven drift.
- **Commit to git at every green.** Never edit an uncommitted repo; each green slice is a labeled rollback point.
- **Rewrite whole files; do not patch-on-patch.** Stacked patches mangle files (especially after a compaction).
- **Report the REAL build/test status.** No green-washing; the human verifies against the repo (git diff + running it in Obsidian), not the agent’s summary.
- **Stop at the acceptance criteria.** No scope creep; flag V2-parking-lot items, don’t build them.

-----

### V2 parking lot (tracked, NOT in V1)

Online enrichment (AcoustID / MusicBrainz), stream ingestion (YouTube / yt-dlp), external library import (Serato etc.), confidence-scored auto-structure-detection, sub-bass high-pass key experiment (the one accuracy tweak worth trying — de-weight low end before chroma extraction so the 808 stops dragging the detected key flat).