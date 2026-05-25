// CamelotWheel — interactive harmonic-mixing guide.
// Click any key → clipboard gets a Dataview query for that key.
//
// CSS class hooks (for theming by user):
//  .mam-camelot              — root container
//  .mam-camelot-wheel        — self-contained SVG
//  .mam-camelot-inner        — inner ring (minor)
//  .mam-camelot-key          — every key slot (group element)
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

const SHARP_TO_NAME: Record<string, string> = {
  C: "C", "C#": "Csharp", Db: "Db",
  D: "D", "D#": "Dsharp", Eb: "Eb",
  E: "E", F: "F", "F#": "Fsharp", Gb: "Gb",
  G: "G", "G#": "Gsharp", Ab: "Ab",
  A: "A", "A#": "Asharp", Bb: "Bb",
  B: "B",
};

/** Map a standard key name to Camelot notation.
 *  Input key can have a trailing "m" for minor (e.g. "C#m").
 *  Bare key names must match exactly (sharps with #, flats with b suffix).
 */
export function keyNameToCamelot(key: string, scale: string): CamelotKey | undefined {
  // Strip trailing "m" (minor marker) only; do NOT strip trailing "b" (flat sign).
  const raw = key.endsWith("m") && key.length > 1 ? key.slice(0, -1) : key;
  const name = SHARP_TO_NAME[raw];
  if (!name) return undefined;

  const isMinor = scale === "minor";
  if (isMinor) {
    const minorMap: Record<string, CamelotKey> = {
      Csharp: "12A", Db: "12A",
      Dsharp: "2A",  Eb: "2A",
      Fsharp: "11A", Gb: "11A",
      Gsharp: "1A",  Ab: "1A",
      Asharp: "3A",  Bb: "3A",
      F: "4A",
      C: "5A",
      G: "6A",
      D: "7A",
      A: "8A",
      E: "9A",
      B: "10A",
    };
    return minorMap[name];
  }
  const majorMap: Record<string, CamelotKey> = {
    B: "1B",
    Fsharp: "2B", Gb: "2B",
    Csharp: "3B", Db: "3B",
    Gsharp: "4B", Ab: "4B",
    Dsharp: "5B", Eb: "5B",
    Asharp: "6B", Bb: "6B",
    F: "7B",
    C: "8B",
    G: "9B",
    D: "10B",
    A: "11B",
    E: "12B",
  };
  return majorMap[name];
}

/** Convert Camelot back to a Dataview-friendly key name. */
export function camelotToKeyName(camelot: CamelotKey): { key: string; scale: string } | undefined {
  const map: Record<CamelotKey, { key: string; scale: string }> = {
    "1B": { key: "B", scale: "major" },
    "2B": { key: "F# / Gb", scale: "major" },
    "3B": { key: "C# / Db", scale: "major" },
    "4B": { key: "G# / Ab", scale: "major" },
    "5B": { key: "D# / Eb", scale: "major" },
    "6B": { key: "A# / Bb", scale: "major" },
    "7B": { key: "F", scale: "major" },
    "8B": { key: "C", scale: "major" },
    "9B": { key: "G", scale: "major" },
    "10B": { key: "D", scale: "major" },
    "11B": { key: "A", scale: "major" },
    "12B": { key: "E", scale: "major" },
    "1A": { key: "G# / Abm", scale: "minor" },
    "2A": { key: "D# / Ebm", scale: "minor" },
    "3A": { key: "A# / Bbm", scale: "minor" },
    "4A": { key: "Fm", scale: "minor" },
    "5A": { key: "Cm", scale: "minor" },
    "6A": { key: "Gm", scale: "minor" },
    "7A": { key: "Dm", scale: "minor" },
    "8A": { key: "Am", scale: "minor" },
    "9A": { key: "Em", scale: "minor" },
    "10A": { key: "Bm", scale: "minor" },
    "11A": { key: "F# / Gbm", scale: "minor" },
    "12A": { key: "C# / Dbm", scale: "minor" },
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

  // Same letter, ±1 number (with wrap)
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

/** Self-contained SVG rendering of the Camelot wheel.
 *  Nodes are positioned precisely via trig inside a fixed viewBox.
 *  The caller just needs a container (block or flex) to drop it in.
 */
export class CamelotWheel {
  private container: HTMLElement;
  private config: CamelotWheelConfig;

  constructor(parent: HTMLElement, config: CamelotWheelConfig) {
    this.config = config;
    this.container = parent.createDiv({ cls: "mam-camelot" });
  }

  mount(): void {
    this.container.empty();

    // SVG canvas — 260×260 viewBox gives clean coordinates.
    // The CSS consumer can set width/height on .mam-camelot
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 260 260");
    svg.setAttribute("class", "mam-camelot-wheel");
    this.container.appendChild(svg);

    const cx = 130;
    const cy = 130;
    const outerR = 100;
    const innerR = 60;

    // Draw all 12 positions around the clock
    for (let i = 0; i < 12; i++) {
      // Start at 12 o'clock and go clockwise
      const angle = i * 30 - 90; // degrees
      const angleRad = (angle * Math.PI) / 180;

      const majorKey = MAJOR_KEYS[i];
      const minorKey = MINOR_KEYS[i];

      // Major (outer ring)
      this.renderKey(svg, cx, cy, outerR, angleRad, majorKey, "major");
      // Minor (inner ring)
      this.renderKey(svg, cx, cy, innerR, angleRad, minorKey, "minor");
    }

    // Legend (HTML below SVG, not inside it)
    const legend = this.container.createDiv({ cls: "mam-camelot-legend" });
    legend.createSpan({ cls: "mam-camelot-current", text: "● current " });
    legend.createSpan({ cls: "mam-camelot-compatible", text: "◦ compatible " });
  }

  private renderKey(
    svg: SVGSVGElement,
    cx: number,
    cy: number,
    radius: number,
    angleRad: number,
    key: CamelotKey,
    type: "major" | "minor",
  ): void {
    const ns = "http://www.w3.org/2000/svg";

    const x = cx + radius * Math.cos(angleRad);
    const y = cy + radius * Math.sin(angleRad);

    const g = document.createElementNS(ns, "g");
    g.setAttribute("class", `mam-camelot-key mam-camelot-key-${type}`);
    g.setAttribute("data-camelot", key);

    // Highlighting
    const compatible = this.config.current ? getCompatibleKeys(this.config.current) : [];
    if (this.config.current === key) {
      g.classList.add("mam-camelot-current");
    } else if (compatible.includes(key)) {
      g.classList.add("mam-camelot-compatible");
    }

    // Text label (SVG text, centered on the circle point)
    const text = document.createElementNS(ns, "text");
    text.setAttribute("class", "mam-camelot-label");
    text.setAttribute("x", String(x));
    text.setAttribute("y", String(y));
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.textContent = key;

    g.appendChild(text);
    svg.appendChild(g);

    // Click handler
    g.addEventListener("click", () => {
      const match = camelotToKeyName(key);
      if (!match) return;
      // Prefer the sharp spelling for Dataview consistency
      const dvKey = match.key.split(" / ")[0];
      const dvQuery = `\`\`\`dataview\nLIST\nFROM #music\nWHERE key = "${dvKey}"\nSORT tempo ASC\n\`\`\``;
      this.config.onKeyClick(key, dvQuery);
    });
  }

  destroy(): void {
    this.container.remove();
  }
}
