/**
 * YAML frontmatter injection utility.
 * Non-destructive: preserves existing frontmatter and body text.
 * ADR-003: Hybrid Asset Notes
 */

export interface AudioMetadata {
  audio_source?: string;
  key?: string;
  key_confirmed?: boolean;
  tempo?: number;
  tempo_confirmed?: boolean;
  raw_tempo?: number;
  alternate_tempo?: number;
  time_signature?: string;
  duration?: string;
  total_bars?: number;
  audio_start_offset?: number;
  analysis_confidence?: number; // DEPRECATED — do not display as trust metric
  structure?: Array<{
    segment: string;
    bars: [number, number];
    time: [string, string];
  }>;
  artist?: string[];
  producer?: string[];
  mixer?: string[];
  engineer?: string[];
  musicians?: string[];
  producer_instagram?: string[];
  source_url?: string;
  license_status?: string;
}

function serializeValue(val: unknown, indent = 0): string {
  const pad = "  ".repeat(indent);

  if (Array.isArray(val)) {
    if (val.length === 0) return "[]";
    // If array of objects (structure), emit indented object form
    if (val.every((v) => v !== null && typeof v === "object" && !Array.isArray(v))) {
      return (
        "\n" +
        val
          .map((item) => {
            const entries = Object.entries(item as Record<string, unknown>)
              .map(([k2, v2]) => `${pad}    ${k2}: ${serializeValue(v2, indent + 2)}`)
              .join("\n");
            return `${pad}  -\n${entries}`;
          })
          .join("\n")
      );
    }
    // Array of primitives
    return "\n" + val.map((v) => `${pad}  - ${serializeScalar(v)}`).join("\n");
  }

  if (typeof val === "object" && val !== null) {
    const entries = Object.entries(val as Record<string, unknown>)
      .map(([k2, v2]) => `${pad}  ${k2}: ${serializeValue(v2, indent + 1)}`);
    return "\n" + entries.join("\n");
  }

  return serializeScalar(val);
}

/** Quote a scalar if it contains YAML-special characters. */
function serializeScalar(val: unknown): string {
  if (val === null || val === undefined) return "";
  if (typeof val === "boolean") return String(val);
  if (typeof val === "number") return String(val);

  const str = String(val);
  // Must quote strings that contain :, #, newline, start with yaml indicators,
  // contain quotes, or look like booleans/numbers.
  const needsQuotes =
    str === "" ||
    str.includes(":") ||
    str.includes("#") ||
    str.includes("\n") ||
    str.includes('"') ||
    str.startsWith("-") ||
    str.startsWith("[") ||
    str.startsWith("{") ||
    str === "true" ||
    str === "false" ||
    str === "null" ||
    str === "~";

  if (needsQuotes) {
    // Double-quote with escaping
    return `"${str.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  }
  return str;
}

export function injectFrontmatter(
  content: string,
  metadata: AudioMetadata,
): string {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n?/;
  const match = frontmatterRegex.exec(content);

  let existing: Record<string, unknown> = {};
  let body = content;

  if (match) {
    // Parse existing YAML (naïve — sufficient for flat keys we control)
    const yamlBlock = match[1];
    for (const line of yamlBlock.split("\n")) {
      const idx = line.indexOf(":");
      if (idx > 0) {
        const key = line.slice(0, idx).trim();
        const val = line.slice(idx + 1).trim();
        if (val.startsWith("[") && val.endsWith("]")) {
          try {
            existing[key] = JSON.parse(val);
          } catch {
            existing[key] = val;
          }
        } else {
          existing[key] = val.replace(/^["']|["']$/g, "");
        }
      }
    }
    body = content.slice(match[0].length);
  }

  // Merge: metadata wins over existing for our keys
  const merged = { ...existing, ...metadata };

  // Build YAML
  const lines = Object.entries(merged)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}: ${serializeValue(v)}`);

  if (lines.length === 0) return content;

  const newFront = `---\n${lines.join("\n")}\n---\n`;
  return newFront + body;
}
