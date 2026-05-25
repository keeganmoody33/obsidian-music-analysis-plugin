// main.ts — Obsidian plugin entry point (Slice 2: confirm-first UX)
import { Plugin, Notice, TFile, TAbstractFile, MarkdownView, Menu } from "obsidian";
import { sha256 } from "./sha256";
import { injectFrontmatter } from "./yaml-injector";
import { AnalysisResult } from "./analysis-engine";
import { AnalysisConfirmModal } from "./components/confirm-modal";
import { BpmControlState } from "./components/bpm-control";
import { KeyControlState } from "./components/key-control";
import { MusicDashboardProcessor } from "./components/dashboard-processor";

interface AnalysisCacheEntry {
  hash: string;
  result: AnalysisResult;
  timestamp: number;
}

// In-memory cache for current session (vault-bound)
const analysisCache = new Map<string, AnalysisCacheEntry>();

export default class MusicAnalysisPlugin extends Plugin {
  private worker: Worker | null = null;

  async onload() {
    console.log("[MusicAnalysis] Slice 3 loaded");

    this.addCommand({
      id: "analyze-audio",
      name: "Analyze audio (tempo, key, duration)",
      callback: () => this.runAnalysis(),
    });

    this.addCommand({
      id: "confirm-analysis",
      name: "Confirm analysis (open correction modal)",
      callback: () => this.openConfirmModal(),
    });

    // Register `music-dashboard` code-block renderer
    const dashboardProcessor = new MusicDashboardProcessor({
      readFile: async (path: string) => {
        const f = this.app.vault.getFileByPath(path);
        if (!f) throw new Error("File not found: " + path);
        return await this.app.vault.read(f);
      },
      modifyFile: async (path: string, content: string) => {
        const f = this.app.vault.getFileByPath(path);
        if (!f) throw new Error("File not found: " + path);
        await this.app.vault.modify(f, content);
      },
      getFileByPath: (path: string) => {
        const f = this.app.vault.getFileByPath(path);
        return f ? { path: f.path } : null;
      },
    });

    this.registerMarkdownCodeBlockProcessor(
      "music-dashboard",
      (source, el, ctx) => dashboardProcessor.process(source, el, ctx)
    );

    // Right-click on audio files in file explorer → "Analyze audio"
    this.registerEvent(
      this.app.workspace.on(
        "file-menu",
        (menu: Menu, file: TAbstractFile) => {
          if (!(file instanceof TFile)) return;
          if (!this.isAudioFile(file)) return;

          menu.addItem((item) =>
            item
              .setTitle("Analyze audio")
              .setIcon("music")
              .onClick(() => this.runAnalysisForFile(file))
          );
        }
      )
    );
  }

  onunload() {
    this.worker?.terminate();
    this.worker = null;
  }

  private async runAnalysis() {
    const file = this.app.workspace.getActiveFile();
    if (!file || !this.isAudioFile(file)) {
      new Notice("Select an audio file (mp3/wav/flac)");
      return;
    }
    await this.runAnalysisForFile(file);
  }

  /**
   * Core analysis for a specific audio file.
   * Creates / updates the companion .md note and opens it.
   */
  private async runAnalysisForFile(file: TFile) {
    try {
      const arrayBuf = await this.app.vault.readBinary(file);
      const hash = await sha256(arrayBuf);

      const notePath = `${file.path}.md`;
      const cachedNoteFile = this.app.vault.getAbstractFileByPath(notePath);
      const cacheKey = cachedNoteFile ? notePath : file.path;

      const cached = analysisCache.get(cacheKey);
      if (cached && cached.hash === hash) {
        new Notice(`Cache hit: ${cached.result.tempo} BPM, ${cached.result.key}`);
        await this.writeNote(notePath, cached.result, file.name);
        await this.openNote(notePath);
        return;
      }

      new Notice("Analyzing audio...");

      const result = await this.analyzeInWorker(arrayBuf, file.name);
      if (result.error) {
        new Notice(`Analysis failed: ${result.error}`);
        return;
      }

      analysisCache.set(cacheKey, { hash, result, timestamp: Date.now() });

      new Notice(
        `Done: ${result.tempo} BPM${result.alternateTempo ? " (or " + result.alternateTempo + "?)" : ""}, ${result.key}`
      );
      await this.writeNote(notePath, result, file.name);
      await this.openNote(notePath);
    } catch (err: any) {
      const message = err?.message || String(err);
      console.error("[MusicAnalysis] runAnalysisForFile error:", err);
      new Notice(`Analysis error: ${message}`);
    }
  }

  private async openNote(notePath: string) {
    const noteFile = this.app.vault.getFileByPath(notePath);
    if (!noteFile) {
      console.warn("[MAM] Could not open note — file not found:", notePath);
      return;
    }
    const leaf = this.app.workspace.getLeaf();
    await leaf.openFile(noteFile);
  }

  /**
   * Open the confirm modal for the currently open analysis note.
   * Parses existing frontmatter and lets the user edit tempo/key.
   */
  private openConfirmModal() {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view) {
      new Notice("Open an analysis note first");
      return;
    }

    const file = view.file;
    if (!file) {
      new Notice("No file open");
      return;
    }

    const cache = this.app.metadataCache.getFileCache(file);
    const fm = cache?.frontmatter || {};

    if (!fm.tempo && !fm.key) {
      new Notice("No analysis data found in this note");
      return;
    }

    const bpmState: BpmControlState = {
      bpm: fm.tempo ?? 0,
      rawBpm: fm.raw_tempo ?? fm.tempo ?? 0,
      alternateBpm: fm.alternate_tempo,
      confirmed: fm.tempo_confirmed ?? false,
    };

    const keyParts = String(fm.key || "").split(" / ");
    const keyName = keyParts[0] || "";
    const isMinor = keyName.endsWith("m");
    const baseKey = isMinor ? keyName.slice(0, -1) : keyName;

    const keyState: KeyControlState = {
      key: baseKey,
      scale: isMinor ? "minor" : "major",
      relativeKey: keyParts[1],
      confirmed: fm.key_confirmed ?? false,
    };

    new AnalysisConfirmModal(
      this.app,
      {
        fileName: file.basename,
        bpm: bpmState,
        key: keyState,
      },
      {
        onSave: async (data) => {
          const keyDisplay = data.key.scale === "minor"
            ? `${data.key.key}m`
            : data.key.key;

          const updated = injectFrontmatter(await this.app.vault.read(file), {
            tempo: data.bpm.bpm,
            raw_tempo: data.bpm.rawBpm,
            alternate_tempo: data.bpm.alternateBpm,
            tempo_confirmed: data.bpm.confirmed,
            key: keyDisplay,
            key_confirmed: data.key.confirmed,
          });

          await this.app.vault.modify(file, updated);
          new Notice("Analysis updated");
        },
      }
    ).open();
  }

  private isAudioFile(file: TFile): boolean {
    return /^(mp3|wav|flac|aif|ogg|m4a)$/i.test(file.extension);
  }

  private async analyzeInWorker(
    audioBuffer: ArrayBuffer,
    fileName: string,
  ): Promise<AnalysisResult> {
    if (!this.worker) {
      // Read bundled worker source and instantiate from a blob URL.
      // Obsidian's renderer blocks `new Worker(filePath)` because the
      // app://<hash>/ path is cross-origin from app://obsidian.md.
      // A blob: URL is same-origin, bypassing the SecurityError.
      const workerPath = `${this.manifest.dir}/dist/worker.js`;
      const workerSource = await this.app.vault.adapter.read(workerPath);
      const blob = new Blob([workerSource], { type: "application/javascript" });
      const blobUrl = URL.createObjectURL(blob);
      try {
        this.worker = new Worker(blobUrl);
      } finally {
        // Revoke immediately — the Worker keeps an internal reference.
        URL.revokeObjectURL(blobUrl);
      }
    }

    return new Promise((resolve, reject) => {
      const id = `${fileName}-${Date.now()}`;
      const handler = (e: MessageEvent) => {
        if (e.data.id !== id) return;
        this.worker!.removeEventListener("message", handler);
        if (e.data.type === "error") reject(new Error(e.data.error));
        else resolve(e.data.result);
      };
      this.worker!.addEventListener("message", handler);
      this.worker!.postMessage({ id, type: "analyze", audioBuffer });
    });
  }

  private async writeNote(path: string, result: AnalysisResult, sourceFile: string) {
    const durationStr = this.formatDuration(result.duration);
    const keyDisplay = result.relativeKey ? `${result.key} / ${result.relativeKey}` : result.key;

    // Body: auto-inject music-dashboard code block so the dashboard renders immediately
    const body = "\n```music-dashboard\n```\n";

    const content = injectFrontmatter(body, {
      audio_source: sourceFile,
      key: keyDisplay,
      key_confirmed: false,
      tempo: result.tempo,
      raw_tempo: result.rawTempo,
      alternate_tempo: result.alternateTempo,
      tempo_confirmed: false,
      duration: durationStr,
    });

    const existing = this.app.vault.getFileByPath(path);
    if (existing) {
      await this.app.vault.modify(existing, content);
    } else {
      await this.app.vault.create(path, content);
    }
  }

  private formatDuration(sec: number): string {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }
}

// Side-note: expose for type-checking in tests
export { MusicAnalysisPlugin };
