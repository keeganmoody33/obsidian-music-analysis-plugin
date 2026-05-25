/**
 * YAML frontmatter injection utility.
 * Non-destructive: preserves existing frontmatter and body text.
 * ADR-003: Hybrid Asset Notes
 */

import { parse as parseYaml } from "yaml";

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

/** Serialize any value to YAML string. */
function serializeValue(val: unknown, indent = 0): string {
  if (val === null || val === undefined) return "";
  if (typeof val === "boolean") return String(val);
  if (typeof val === "number") return String(val);

  if (Array.isArray(val)) {
    if (val.length === 0) return "[]";

    // Array of objects: block form (structure segments)
    if (val.every((v) => v !== null && typeof v === "object" && !Array.isArray(v))) {
      const pad = "  ".repeat(indent);
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

    // Primitive array: compact inline form
    const items = val.map((v) => serializeScalar(v));
    return `[${items.join(", ")}]`;
  }

  if (typeof val === "object") {
    const pad = "  ".repeat(indent);
    const entries = Object.entries(val as Record<string, unknown>)
      .map(([k2, v2]) => `${pad}  ${k2}: ${serializeValue(v2, indent + 1)}`);
    return "\n" + entries.join("\n");
  }

  return serializeScalar(val);
}

/** Quote a scalar if it contains YAML-special characters. */
function serializeScalar(val: unknown): string {
  if (val === null || val === undefined) return "";
  if (typeof val === "boolean" || typeof val === "number") return String(val);

  const str = String(val);

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
    return `"${str.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  }
  return str;
}

const FRONTMATTER_DELIMITER = /^---\s*\n([\s\S]*?)\n---\s*\n?/;

export function injectFrontmatter(
  content: string,
  metadata: AudioMetadata,
): string {
  const match = FRONTMATTER_DELIMITER.exec(content);

  let existing: Record<string, unknown> = {};
  let body = content;

  if (match) {
    const yamlBlock = match[1];
    try {
      existing = parseYaml(yamlBlock) as Record<string, unknown> || {};
    } catch {
      existing = {};
    }
    body = content.slice(match[0].length);
  }

  // Merge: metadata wins over existing for our keys
  const merged = cleanUndefined({ ...existing, ...metadata });

  const lines = Object.entries(merged)
    .map(([k, v]) => `${k}: ${serializeValue(v)}`);

  if (lines.length === 0) return content;

  const newFront = `---\n${lines.join("\n")}\n---\n`;
  return newFront + body;
}

/** Strip undefined values so they don't serialize. */
function cleanUndefined(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) out[k] = v;
  }
  return out;
}

/** Parse frontmatter from raw note content used by dashboard-processor. */
export function parseFrontmatter(raw: string): Record<string, unknown> {
  const match = FRONTMATTER_DELIMITER.exec(raw);
  if (!match) return {};
  try {
    return parseYaml(match[1]) as Record<string, unknown> || {};
  } catch {
    return {};
  }
}
