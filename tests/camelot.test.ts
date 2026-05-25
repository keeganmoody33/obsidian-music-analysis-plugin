import { describe, it, expect } from "vitest";
import { keyNameToCamelot, getCompatibleKeys } from "../src/components/camelot-wheel";

describe("keyNameToCamelot mapping", () => {
  it("maps C# minor to 12A", () => {
    expect(keyNameToCamelot("C#", "minor")).toBe("12A");
    expect(keyNameToCamelot("C#m", "minor")).toBe("12A");
  });

  it("maps A minor to 8A", () => {
    expect(keyNameToCamelot("A", "minor")).toBe("8A");
    expect(keyNameToCamelot("Am", "minor")).toBe("8A");
  });

  it("maps C minor to 5A", () => {
    expect(keyNameToCamelot("C", "minor")).toBe("5A");
    expect(keyNameToCamelot("Cm", "minor")).toBe("5A");
  });

  it("maps E major to 12B", () => {
    expect(keyNameToCamelot("E", "major")).toBe("12B");
  });

  it("maps C major to 8B", () => {
    expect(keyNameToCamelot("C", "major")).toBe("8B");
  });

  it("does not mutilate flat keys (Db, Gb, Ab)", () => {
    expect(keyNameToCamelot("Db", "major")).toBe("3B");
    expect(keyNameToCamelot("Gb", "major")).toBe("2B");
    expect(keyNameToCamelot("Ab", "major")).toBe("4B");
    expect(keyNameToCamelot("Dbm", "minor")).toBe("12A");
    expect(keyNameToCamelot("Gbm", "minor")).toBe("11A");
    expect(keyNameToCamelot("Abm", "minor")).toBe("1A");
  });

  it("returns undefined for unknown keys", () => {
    expect(keyNameToCamelot("ZZ", "major")).toBeUndefined();
    expect(keyNameToCamelot("", "minor")).toBeUndefined();
  });
});

describe("getCompatibleKeys", () => {
  it("returns correct neighbors for 12A", () => {
    const compat = getCompatibleKeys("12A");
    expect(compat).toContain("12B"); // same nr, opposite letter
    expect(compat).toContain("11A"); // -1, same letter
    expect(compat).toContain("1A");  // +1, same letter (wrap)
    expect(compat).toContain("11B"); // -1, cross
    expect(compat).toContain("1B");  // +1, cross (wrap)
    expect(compat).toHaveLength(5);
  });
});
