# V1 Board — Offline Music Analysis Plugin

Tracer-bullet vertical slices. 5 slices (collapsed from 7 after the offline-V1 scope cut). Status reflects current state.

**Cut from V1 (V2 parking lot):** stream ingestion (YouTube), external library import (Serato/etc.), online enrichment (AcoustID/MusicBrainz), auto-structure-detection.

-----

## ✅ Slice 1: Core Ingestion (Drop -> Analyze -> YAML) — DONE

Drop local audio -> WASM extracts tempo/key/duration -> non-destructive frontmatter, fully offline.

- [x] Drop -> `tempo`, `key`, `duration` written; `*_confirmed: false` (ADR-027)
- [x] Same file twice -> cache hit, no re-analysis
- [x] Analysis failure -> explicit Obsidian Notice (ADR-014)
- [x] Empty credit fields scaffolded (ADR-013/023)
- [x] Zero network calls (ADR-022)
- [x] Analysis in a Web Worker; WASM lazy-loaded on first analysis
- [x] Tempo octave-corrected; `raw_tempo` + `alternate_tempo` persisted (ADR-028); `edma` key profile
- [x] Tested: Node unit (essentia mocked) + browser smoke (real essentia, KGT signals) (ADR-029)

## ✅ Slice 2: Confirm-UX — DONE

*(Note: “Slice 2” became the confirm-first UX after the accuracy crisis. The ORIGINAL Slice 2 deliverables — dashboard render + structure timeline — were folded into Slice 3.)*

- [x] `tempo_confirmed`/`key_confirmed` flags; unconfirmed written immediately, AFK-safe (ADR-027)
- [x] `analysis_confidence` deprecated (ADR-026)
- [x] Reusable controls: `bpm-control` (halve/×2/tap-tempo/edit/confirm), `key-control` (±semitone/relative/major-minor/confirm) — mount in modal + dashboard
- [x] `confirm-modal` (Obsidian `Modal` subclass); on-demand, not auto-pop (preserves AFK)
- [x] Namespaced `mam-` CSS hooks; Obsidian CSS variables; clean hooks left for the CSS pass
- [x] Dataview confirmed/unconfirmed filter docs

## 🔨 Slice 3: Dashboard Render + Structure Timeline + Tuner + Camelot — IN PROGRESS

Stand up the `music-dashboard` code-block render and mount all visual components (folds in the owed Slice 2 dashboard).

- [ ] `music-dashboard` code-block processor renders from frontmatter (ADR-016)
- [ ] Structure timeline: MANUAL segments (ADR-024) -> colored bars; hover shows bar + time; `audio_start_offset` slider trims lead-in
- [ ] Tuner needle -> current key, styled by confirmed/unconfirmed (NOT confidence)
- [ ] Camelot wheel: highlight current + compatible keys; click key -> Dataview query
- [ ] Build + tests green; **committed to git**
- **Watch:** had build thrash (Set iteration, `keyToCamelot` mangling, signature mismatch). Verify the committed state is genuinely clean Slice 3, not a pre-thrash baseline.

## ⬜ Slice 4: Asset Registry + File Routing + Renaming — NEXT

- [ ] SHA-256 registry: one physical file, N notes, cached analysis loads instantly (ADR-018)
- [ ] Rename via Obsidian API -> `82bpm_C#m_Producer - Name.ext`, links preserved (ADR-019)
- [ ] Folder routing off the manual `producer` tag (ADR-017)
- [ ] Documented limit: OS-level moves outside Obsidian can break links

## ⬜ Slice 5: Settings + Dataview Templates + Ship — LAST

- [ ] Settings: `auto_analyze_on_drop`, performance mode, default folder, rename pattern, manual Re-analyze (ADR-012)
- [ ] Dataview query templates (by key, tempo, producer, unconfirmed, etc.)
- [ ] Analysis error banners (ADR-014)
- [ ] `manifest.json` correct; AGPL `LICENSE` present; PR to `obsidian-releases` (no binaries, no network -> clean automated review)

-----

## Dependency map

```
Slice 1 (done)
   |-- Slice 2 confirm-UX (done)
   |-- Slice 3 dashboard + timeline + tuner + Camelot (in progress)
   `-- Slice 4 registry + routing + renaming (next)
            `-- Slice 5 settings + Dataview + ship (last)
```

## Workflow (ADR-030)

One slice per fresh thread. Fill `HANDOFF_TEMPLATE.md` PART 1, commit, open a new thread, paste the template. Commit at every green. Rewrite files; don’t patch-on-patch. Report real status; verify against the repo.