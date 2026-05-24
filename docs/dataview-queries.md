---
title: Music Analysis Dashboard — Dataview Queries
---

# Confirmed vs Unconfirmed Filter Patterns

Use these queries in Dataview code blocks to surface analysis states across your vault.

---

## Unconfirmed tracks (needs your ears)

```dataview
TABLE tempo, key, duration
FROM ""
WHERE audio_source
WHERE key_confirmed = false OR tempo_confirmed = false
SORT tempo DESC
```

## Confirmed tracks only (reliable catalog)

```dataview
TABLE tempo, key, duration
FROM ""
WHERE audio_source
WHERE key_confirmed = true AND tempo_confirmed = true
SORT key ASC
```

## BPM ranges (confirmed only)

```dataview
TABLE tempo, key, duration
FROM ""
WHERE audio_source AND tempo_confirmed = true
WHERE tempo >= 120 AND tempo <= 140
SORT tempo ASC
```

## Key grouping (confirmed only)

```dataview
TABLE tempo, duration
FROM ""
WHERE audio_source AND key_confirmed = true
WHERE key = "Gm" OR key = "G minor"
SORT tempo ASC
```

## Everything (provisional flag visible)

```dataview
TABLE tempo, tempo_confirmed, key, key_confirmed, duration
FROM ""
WHERE audio_source
SORT file.ctime DESC
```

---

## Inline music-dashboard block (future)

Planned for Slice 3/4 — a custom code block renderer that embeds
BpmControl + KeyControl directly in a note for inline editing:

```music-dashboard
table
from ""
where audio_source
```

The block will render:
- ⚠️ or ✅ icon per confirmation flag
- Click to open the confirm modal
- Halve/double inline for tempo
- Inline key badge with ±semitone arrows

---

## CSS Class Hooks for Theming

Style these selectors in your Obsidian CSS snippets:

```css
/* Unconfirmed items get a subtle pulse or border */
.bpm-unconfirmed, .key-unconfirmed {
  /* your style: e.g., dotted underline, orange accent */
}

/* Confirmed: clean, muted */
.bpm-confirmed, .key-confirmed {
  /* your style: solid, green or neutral checkmark */
}

/* Tap-tempo button flash */
.bpm-btn-tap-active {
  /* brief highlight on tap */
}

/* Modal sections */
.mam-confirm-modal { /* modal root */ }
.mam-modal-header { /* title area */ }
.mam-modal-body { /* controls */ }
.mam-modal-section-label { /* "Tempo" / "Key" labels */ }
.mam-btn-save { /* Save button */ }
```

All controls already reference Obsidian CSS variables internally:
- `--interactive-accent` — buttons, toggles
- `--background-primary` — modal bg
- `--background-secondary` — section bg
- `--text-normal` — primary text
- `--text-muted` — raw tempo, relative key
- `--text-accent` — alternate tempo suggestion

No hardcoded colors anywhere.
