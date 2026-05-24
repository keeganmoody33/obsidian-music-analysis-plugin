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
  analysis_confidence?: number;  // DEPRECATED — do not display as trust metric
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

function serializeValue(val: unknown): string {
  if (Array.isArray(val)) {
    if (val.length === 0) return "[]";
    return "\n" + val.map((v) => `  - "${String(v).replace(/"/g, '\\"')}"`).join("\n");
  }
  if (typeof val === "string") {
    if (val === "" || val.includes(":") || val.includes("\n")) {
      return `"${val.replace(/"/g, '\\"')}"`;
    }
    return val;
  }
  if (typeof val === "number") return String(val);
  return JSON.stringify(val);
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
