import { describe, it, expect } from "vitest";
import { injectFrontmatter, parseFrontmatter } from "../src/yaml-injector";

describe("YAML round-trip: full-schema note survives write-back", () => {
  const fullNote = `---
audio_source: "tracks/instrumentals/82bpm_C#m_beat.ogg"
tempo: 82
tempo_confirmed: false
raw_tempo: 81.71
alternate_tempo: 164
key: "C#m"
key_confirmed: false
duration: "1:55"
total_bars: 96
audio_start_offset: 0.0
structure:
  - segment: "Intro"
    bars: [1, 8]
    time: ["0:00", "0:23"]
  - segment: "Verse 1"
    bars: [9, 24]
    time: ["0:24", "1:10"]
artist: []
producer: []
---

# Beat Notes

Some prose content here.
`;

  it("round-trips full schema when no analysis keys are touched", () => {
    const result = injectFrontmatter(fullNote, {});

    expect(result).toContain("structure:");
    expect(result).toContain("segment:");       // Structure segments present
    expect(result).toContain("bars:");
    expect(result).toContain("time:");
    expect(result).toContain("tempo_confirmed: false");   // unquoted
    expect(result).not.toContain("tempo_confirmed: \"false\"");
    expect(result).toContain("key_confirmed: false");
    expect(result).toContain("key: \"C#m\"");   // quoted (always for safety)
    expect(result).toContain("# Beat Notes");   // body preserved
    expect(result).toContain("Some prose content here.");
  });

  it("round-trips partial confirm (offset slider) preserving structure", () => {
    const result = injectFrontmatter(fullNote, {
      audio_start_offset: 0.5,
    });

    const parsed = parseFrontmatter(result);
    expect(parsed.structure).toEqual([
      { segment: "Intro", bars: [1, 8], time: ["0:00", "0:23"] },
      { segment: "Verse 1", bars: [9, 24], time: ["0:24", "1:10"] },
    ]);
    expect(parsed.audio_start_offset).toBe(0.5);
    expect(parsed.tempo).toBe(82);
    expect(parsed.tempo_confirmed).toBe(false);
    expect(parsed.key_confirmed).toBe(false);
    expect(result).toContain("# Beat Notes");
  });

  it("round-trips partial confirm (key change) preserving structure", () => {
    const result = injectFrontmatter(fullNote, {
      key: "Cm",
      key_confirmed: true,
    });

    const parsed = parseFrontmatter(result);
    expect(parsed.key).toBe("Cm");
    expect(parsed.key_confirmed).toBe(true);
    expect(parsed.structure).toEqual([
      { segment: "Intro", bars: [1, 8], time: ["0:00", "0:23"] },
      { segment: "Verse 1", bars: [9, 24], time: ["0:24", "1:10"] },
    ]);
    expect(parsed.tempo_confirmed).toBe(false);   // untouched
  });

  it("round-trips partial confirm (tempo change) preserving all fields", () => {
    const result = injectFrontmatter(fullNote, {
      tempo: 84,
      tempo_confirmed: true,
    });

    const parsed = parseFrontmatter(result);
    expect(parsed.tempo).toBe(84);
    expect(parsed.tempo_confirmed).toBe(true);
    expect(parsed.raw_tempo).toBe(81.71);
    expect(parsed.alternate_tempo).toBe(164);
    expect(parsed.duration).toBe("1:55");
    expect(parsed.structure).toHaveLength(2);
    expect(result).toContain("# Beat Notes");
  });

  it("quotes strings with colons (# observed bug: time strings getting mangled)", () => {
    const noteWithColonTimes = `---
structure:
  - segment: "Hook"
    bars: [25, 32]
    time: ["1:35", "2:22"]
---
Body
`;
    const result = injectFrontmatter(noteWithColonTimes, {
      tempo_confirmed: true,
    });

    // Times contain colons — they MUST be quoted in the YAML output
    expect(result).toContain('"1:35"');
    expect(result).toContain('"2:22"');
    // Parse back and verify structure intact
    const parsed = parseFrontmatter(result);
    expect(parsed.structure).toEqual([
      { segment: "Hook", bars: [25, 32], time: ["1:35", "2:22"] },
    ]);
  });

  it("round-trips booleans as booleans (not strings)", () => {
    const result = injectFrontmatter(fullNote, {});
    const lines = result.split("\n");

    const confirmedLines = lines.filter((l) => l.includes("tempo_confirmed") || l.includes("key_confirmed"));
    for (const line of confirmedLines) {
      expect(line).toMatch(/: (true|false)$/);  // bare boolean
      expect(line).not.toContain('"true"');
      expect(line).not.toContain('"false"');
    }

    // Re-parse confirms the type
    const parsed = parseFrontmatter(result);
    expect(typeof parsed.tempo_confirmed).toBe("boolean");
    expect(typeof parsed.key_confirmed).toBe("boolean");
  });

  it("round-trips numbers as numbers (not strings)", () => {
    const result = injectFrontmatter(fullNote, {});
    const parsed = parseFrontmatter(result);
    expect(typeof parsed.tempo).toBe("number");
    expect(typeof parsed.raw_tempo).toBe("number");
    expect(typeof parsed.audio_start_offset).toBe("number");
    expect(typeof parsed.total_bars).toBe("number");
  });

  it("does not flatten structure array or create dangling keys", () => {
    const result = injectFrontmatter(fullNote, {
      tempo_confirmed: true,
    });

    // Exactly ONE structure: key
    const structureMatches = result.match(/^structure:/gm);
    expect(structureMatches).toHaveLength(1);

    // NO top-level "segment:" — those live inside structure
    const topLevelSegment = result.match(/^segment:/gm);
    expect(topLevelSegment).toBeNull();

    // Re-parsed structure must be intact
    const parsed = parseFrontmatter(result);
    expect(Array.isArray(parsed.structure)).toBe(true);
    expect(parsed.structure).toHaveLength(2);
    expect(parsed.structure[0]).toMatchObject({ segment: "Intro" });
    expect(parsed.structure[1]).toMatchObject({ segment: "Verse 1" });
  });

  it("preserves unknown keys (ADR-003 non-destructive)", () => {
    const noteWithExtras = `---
unknown_field: "preserve me"
tempo: 80
---
Body
`;
    const result = injectFrontmatter(noteWithExtras, {
      key: "Dm",
      key_confirmed: false,
    });

    const parsed = parseFrontmatter(result);
    expect(parsed.unknown_field).toBe("preserve me");
    expect(parsed.tempo).toBe(80);
    expect(parsed.key).toBe("Dm");
  });
});
