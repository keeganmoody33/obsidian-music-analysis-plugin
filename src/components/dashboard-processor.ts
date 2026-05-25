// MusicDashboardProcessor — Obsidian code-block renderer for `music-dashboard`
// Driven entirely by frontmatter (zero analysis at render time).
//
// CSS class hooks (for theming by user):
//  .mam-dashboard             — root container
//  .mam-dashboard-header      — top title bar
//  .mam-dashboard-meta        — BPM + key row
//  .mam-dashboard-section     — sub-surface wrapper
//  .mam-dashboard-section-label
//  .mam-dashboard-controls    — BPM + key reusable controls area
//  .mam-dashboard-timeline    — structure timeline container
//  .mam-dashboard-tuner       — tuner gauge container
//  .mam-dashboard-camelot     — Camelot wheel container

import { MarkdownPostProcessorContext } from "obsidian";
import { BpmControl, BpmControlState, BpmControlCallbacks } from "./bpm-control";
import { KeyControl, KeyControlState, KeyControlCallbacks } from "./key-control";
import { StructureTimeline, StructureSegment } from "./structure-timeline";
import { TunerNeedle } from "./tuner-needle";
import { CamelotWheel, keyNameToCamelot } from "./camelot-wheel";
import { injectFrontmatter, parseFrontmatter } from "../yaml-injector";

export interface DashboardFrontmatter {
  sourceFile: string;          // active file path
  tempo: number;
  raw_tempo?: number;
  alternate_tempo?: number;
  tempo_confirmed: boolean;
  key: string;
  key_confirmed: boolean;
  duration?: string;           // "2:34"
  audio_start_offset?: number; // bars to trim lead-in
  structure?: Array<{
    segment: string;
    bars: [number, number];
    time?: [string, string];
  }>;
}

export class MusicDashboardProcessor {
  private vaultActions: {
    readFile: (path: string) => Promise<string>;
    modifyFile: (path: string, content: string) => Promise<void>;
    getFileByPath: (path: string) => { path: string } | null;
  };

  constructor(vaultActions: MusicDashboardProcessor["vaultActions"]) {
    this.vaultActions = vaultActions;
  }

  async process(
    source: string,
    el: HTMLElement,
    ctx: MarkdownPostProcessorContext,
  ): Promise<void> {
    // source is ignored — the processor reads the parent note's frontmatter
    const container = el.createDiv({ cls: "mam-dashboard" });

    // Resolve the source file
    const filePath = ctx.sourcePath;

    // Read frontmatter from the vault
    let fm: DashboardFrontmatter;
    try {
      const raw = await this.vaultActions.readFile(filePath);
      fm = this.parseFrontmatter(raw, filePath);
    } catch {
      container.createEl("p", {
        cls: "mam-dashboard-empty",
        text: "No music analysis data found in this note. Run \u201cAnalyze audio\u201d first.",
      });
      return;
    }

    // ── Header ──
    const header = container.createDiv({ cls: "mam-dashboard-header" });
    header.createEl("h3", { text: fm.sourceFile.split("/").pop() || "Untitled" });
    if (fm.duration) {
      header.createSpan({ cls: "mam-dashboard-duration", text: fm.duration });
    }

    // ── Meta row (BPM + key, compact) ──
    const meta = container.createDiv({ cls: "mam-dashboard-meta" });
    const bpmEl = meta.createSpan({
      cls: fm.tempo_confirmed ? "mam-meta-confirmed" : "mam-meta-unconfirmed",
    });
    bpmEl.setText(`${fm.tempo} BPM`);
    if (fm.alternate_tempo) {
      bpmEl.setText(`${fm.tempo} BPM (or ${fm.alternate_tempo}?)`);
    }
    meta.createSpan({ text: " \u2022 " });
    const keyEl = meta.createSpan({
      cls: fm.key_confirmed ? "mam-meta-confirmed" : "mam-meta-unconfirmed",
    });
    keyEl.setText(fm.key);

    // ── Controls (reusable BPM + Key) ──
    const controlsSection = container.createDiv({ cls: "mam-dashboard-section" });
    controlsSection.createEl("h4", { cls: "mam-dashboard-section-label", text: "Controls" });
    const controlsArea = controlsSection.createDiv({ cls: "mam-dashboard-controls" });

    const isMinor = fm.key.endsWith("m");
    const baseKey = isMinor ? fm.key.slice(0, -1) : fm.key;

    const bpmState: BpmControlState = {
      bpm: fm.tempo,
      rawBpm: fm.raw_tempo ?? fm.tempo,
      alternateBpm: fm.alternate_tempo,
      confirmed: fm.tempo_confirmed,
    };
    const keyState: KeyControlState = {
      key: baseKey,
      scale: isMinor ? "minor" : "major",
      relativeKey: undefined,
      confirmed: fm.key_confirmed,
    };

    const saveToFm = async (partial: Record<string, unknown>) => {
      try {
        const raw = await this.vaultActions.readFile(filePath);
        const updated = injectFrontmatter(raw, partial as any);
        await this.vaultActions.modifyFile(filePath, updated);
      } catch (e) {
        // Silent fail — vault writes are best-effort in dashboard
        console.warn("[MAM] Dashboard save failed:", e);
      }
    };

    const bpmControl = new BpmControl(controlsArea, bpmState, {
      onChange: async (bpm) => {
        await saveToFm({ tempo: bpm, tempo_confirmed: true });
      },
      onConfirmed: async (confirmed) => {
        await saveToFm({ tempo_confirmed: confirmed });
      },
    });
    bpmControl.mount(controlsArea);

    const keyControl = new KeyControl(controlsArea, keyState, {
      onChange: async (key, scale) => {
        const display = scale === "minor" ? `${key}m` : key;
        await saveToFm({ key: display, key_confirmed: true });
      },
      onConfirmed: async (confirmed) => {
        await saveToFm({ key_confirmed: confirmed });
      },
    });
    keyControl.mount(controlsArea);

    // ── Structure timeline ──
    const timelineSection = container.createDiv({ cls: "mam-dashboard-section" });
    timelineSection.createEl("h4", { cls: "mam-dashboard-section-label", text: "Structure" });

    const segments: StructureSegment[] = (fm.structure || []).map((s) => ({
      id: s.segment,
      label: s.segment,
      startBar: s.bars[0],
      endBar: s.bars[1],
      color: this.colorForSegment(s.segment),
    }));

    const timeline = new StructureTimeline(
      timelineSection,
      segments,
      fm.tempo,
      fm.audio_start_offset ?? 0,
    );
    timeline.onOffsetChange = async (offset) => {
      await saveToFm({ audio_start_offset: offset });
    };
    timeline.mount();

    // ── Tuner needle ──
    const tunerSection = container.createDiv({ cls: "mam-dashboard-section" });
    tunerSection.createEl("h4", { cls: "mam-dashboard-section-label", text: "Tuner" });
    const tunerContainer = tunerSection.createDiv({ cls: "mam-dashboard-tuner" });
    const tuner = new TunerNeedle(tunerContainer, {
      key: baseKey,
      scale: isMinor ? "minor" : "major",
      confirmed: fm.key_confirmed,
    });
    tuner.mount();

    // ── Camelot wheel ──
    const camelotSection = container.createDiv({ cls: "mam-dashboard-section" });
    camelotSection.createEl("h4", { cls: "mam-dashboard-section-label", text: "Camelot" });
    const camelotContainer = camelotSection.createDiv({ cls: "mam-dashboard-camelot" });
    const camelot = new CamelotWheel(camelotContainer, {
      current: keyNameToCamelot(baseKey, isMinor ? "minor" : "major"),
      onKeyClick: (_camelotKey, dvQuery) => this.handleCamelotClick(dvQuery),
    });
    camelot.mount();
  }

  private parseFrontmatter(raw: string, sourcePath: string): DashboardFrontmatter {
    const fm = parseFrontmatter(raw);

    if (!fm.tempo && !fm.key) {
      throw new Error("No analysis data in frontmatter");
    }

    let structure: DashboardFrontmatter["structure"] = undefined;
    if (Array.isArray(fm.structure)) {
      structure = fm.structure as any;
    }

    return {
      sourceFile: sourcePath,
      tempo: Number(fm.tempo ?? 0),
      raw_tempo: fm.raw_tempo ? Number(fm.raw_tempo) : undefined,
      alternate_tempo: fm.alternate_tempo ? Number(fm.alternate_tempo) : undefined,
      tempo_confirmed: !!fm.tempo_confirmed,
      key: String(fm.key ?? ""),
      key_confirmed: !!fm.key_confirmed,
      duration: fm.duration ? String(fm.duration) : undefined,
      audio_start_offset: Number(fm.audio_start_offset ?? 0),
      structure,
    };
  }

  private colorForSegment(name: string): string {
    const colors: Record<string, string> = {
      Intro: "var(--color-accent)" ,
      Verse: "var(--interactive-accent)",
      Chorus: "var(--color-green)" ,
      Bridge: "var(--color-yellow)" ,
      "Pre-chorus": "var(--color-orange)" ,
      Hook: "var(--color-red)" ,
      Outro: "var(--color-purple)" ,
      Breakdown: "var(--color-cyan)" ,
    };
    return colors[name] || "var(--text-muted)";
  }

  private handleCamelotClick(dvQuery: string): void {
    navigator.clipboard?.writeText(dvQuery).catch(() => { /* no-op */ });
    console.log("[MAM] Camelot key clicked — Dataview query copied to clipboard");
  }
}
