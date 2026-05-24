// CamelotWheel — interactive harmonic-mixing guide.
// Click any key → clipboard gets a Dataview query for that key.
//
// CSS class hooks (for theming by user):
//  .mam-camelot              — root container
//  .mam-camelot-wheel        — outer ring
//  .mam-camelot-inner        — inner ring (minor)
//  .mam-camelot-key          — every key slot
//  .mam-camelot-key-major    — outer-ring keys
//  .mam-camelot-key-minor    — inner-ring keys
//  .mam-camelot-current      — the currently detected/confirmed key
//  .mam-camelot-compatible   — harmonically compatible neighbors
//  .mam-camelot-label        — text inside each slot
//  .mam-camelot-legend       — bottom legend line

export type CamelotKey = string; // e.g. "1A", "8B"

const MAJOR_KEYS: CamelotKey[] = [
  "1B", "2B", "3B", "4B", "5B", "6B", "7B", "8B", "9B", "10B", "11B", "12B",
];
const MINOR_KEYS: CamelotKey[] = [
  "1A", "2A", "3A", "4A", "5A", "6A", "7A", "8A", "9A", "10A", "11A", "12A",
];

/** Map a standard key name to Camelot notation. */
export function keyNameToCamelot(key: string, scale: string): CamelotKey | undefined {
  const name = key.replace(/[mb]$/, "").replace("#", "sharp");
  const map: Record<string, Record<string, CamelotKey>> = {
    major: {
      B: "1B", "Gb": "2B", "Fsharp": "2B", Db: "3B", "Csharp": "3B",
      "Ab": "4B", "Gsharp": "4B", Eb: "5B", "Dsharp": "5B",
      Bb: "6B", "Asharp": "6B", F: "7B", C: "8B", G: "9B", D: "10B", A: "11B", E: "12B",
    },
    minor: {
      "Gsharp": "1A", "Ab": "1A", Eb: "2A", "Dsharp": "2A",
      Bb: "3A", "Asharp": "3A", F: "4A", C: "5A",
      G: "6A", D: "7A", A: "8A", E: "9A", B: "10A",
      "Fsharp": "11A", "Gb": "11A", "Csharp": "12A", Db: "12A",
    },
  };
  const s = scale === "minor" ? "minor" : "major";
  return map[s]?.[name] || map[s]?.[key] || undefined;
}

/** Convert Camelot back to a Dataview-friendly key name. */
export function camelotToKeyName(camelot: CamelotKey): { key: string; scale: string } | undefined {
  const map: Record<CamelotKey, { key: string; scale: string }> = {
    "1B": { key: "B", scale: "major" },
    "2B": { key: "F#", scale: "major" },
    "3B": { key: "C#", scale: "major" },
    "4B": { key: "G#", scale: "major" },
    "5B": { key: "D#", scale: "major" },
    "6B": { key: "A#", scale: "major" },
    "7B": { key: "F", scale: "major" },
    "8B": { key: "C", scale: "major" },
    "9B": { key: "G", scale: "major" },
    "10B": { key: "D", scale: "major" },
    "11B": { key: "A", scale: "major" },
    "12B": { key: "E", scale: "major" },
    "1A": { key: "G#m", scale: "minor" },
    "2A": { key: "D#m", scale: "minor" },
    "3A": { key: "A#m", scale: "minor" },
    "4A": { key: "Fm", scale: "minor" },
    "5A": { key: "Cm", scale: "minor" },
    "6A": { key: "Gm", scale: "minor" },
    "7A": { key: "Dm", scale: "minor" },
    "8A": { key: "Am", scale: "minor" },
    "9A": { key: "Em", scale: "minor" },
    "10A": { key: "Bm", scale: "minor" },
    "11A": { key: "F#m", scale: "minor" },
    "12A": { key: "C#m", scale: "minor" },
  };
  return map[camelot];
}

/** Return the set of harmonically compatible Camelot keys. */
export function getCompatibleKeys(current: CamelotKey): CamelotKey[] {
  const num = parseInt(current.slice(0, -1), 10); // "6A" → 6
  const letter = current.slice(-1); // "6A" → "A"
  const compatible: CamelotKey[] = [];

  // Same number, opposite letter (major ↔ minor relative)
  compatible.push(`${num}${letter === "A" ? "B" : "A"}` as CamelotKey);

  // Same letter, ±1 number
  const prev = num === 1 ? 12 : num - 1;
  const next = num === 12 ? 1 : num + 1;
  compatible.push(`${prev}${letter}` as CamelotKey, `${next}${letter}` as CamelotKey);

  // Cross-letter ±1 (energy boost/drop)
  compatible.push(`${prev}${letter === "A" ? "B" : "A"}` as CamelotKey);
  compatible.push(`${next}${letter === "A" ? "B" : "A"}` as CamelotKey);

  return compatible;
}

export interface CamelotWheelConfig {
  current: CamelotKey | undefined;
  onKeyClick: (camelot: CamelotKey, dvQuery: string) => void;
}

export class CamelotWheel {
  private container: HTMLElement;
  private config: CamelotWheelConfig;

  constructor(parent: HTMLElement, config: CamelotWheelConfig) {
    this.config = config;
    this.container = parent.createDiv({ cls: "mam-camelot" });
  }

  mount(): void {
    this.container.empty();

    const wheel = this.container.createDiv({ cls: "mam-camelot-wheel" });

    // Render all 12 positions around the clock
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * 360;
      const majorKey = MAJOR_KEYS[i];
      const minorKey = MINOR_KEYS[i];

      // Major (outer ring)
      this.renderKey(wheel, majorKey, angle, "major");
      // Minor (inner ring)
      this.renderKey(wheel, minorKey, angle, "minor");
    }

    // Legend
    const legend = this.container.createDiv({ cls: "mam-camelot-legend" });
    legend.createSpan({ cls: "mam-camelot-current", text: "● current " });
    legend.createSpan({ cls: "mam-camelot-compatible", text: "◦ compatible " });
  }

  private renderKey(
    wheel: HTMLElement,
    key: CamelotKey,
    angle: number,
    type: "major" | "minor",
  ): void {
    const slot = wheel.createDiv({ cls: `mam-camelot-key mam-camelot-key-${type}` });

    const radius = type === "major" ? 60 : 35;
    // Position via CSS transform; user stylesheet should set transform-origin: center
    slot.style.transform = `rotate(${angle}deg) translateY(-${radius}px)`;
    slot.setAttribute("data-camelot", key);

    // Highlighting
    const compatible = this.config.current ? getCompatibleKeys(this.config.current) : [];
    if (this.config.current === key) {
      slot.addClass("mam-camelot-current");
    } else if (compatible.includes(key)) {
      slot.addClass("mam-camelot-compatible");
    }

    slot.createSpan({ cls: "mam-camelot-label", text: key });

    slot.addEventListener("click", () => {
      const match = camelotToKeyName(key);
      if (!match) return;
      const dvQuery = `\`\`\`dataview\nLIST\nFROM #music\nWHERE key = "${match.key}"\nSORT tempo ASC\n\`\`\``;
      this.config.onKeyClick(key, dvQuery);
    });
  }

  destroy(): void {
    this.container.remove();
  }
}
