"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  MusicAnalysisPlugin: () => MusicAnalysisPlugin,
  default: () => MusicAnalysisPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian2 = require("obsidian");

// src/sha256.ts
async function sha256(buffer) {
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// src/yaml-injector.ts
function serializeValue(val) {
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
function injectFrontmatter(content, metadata) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n?/;
  const match = frontmatterRegex.exec(content);
  let existing = {};
  let body = content;
  if (match) {
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
  const merged = { ...existing, ...metadata };
  const lines = Object.entries(merged).filter(([, v]) => v !== void 0).map(([k, v]) => `${k}: ${serializeValue(v)}`);
  if (lines.length === 0) return content;
  const newFront = `---
${lines.join("\n")}
---
`;
  return newFront + body;
}

// src/components/confirm-modal.ts
var import_obsidian = require("obsidian");

// src/components/tap-tempo.ts
var TapTempoController = class {
  constructor(opts = {}) {
    this.times = [];
    this.maxTaps = opts.maxTaps ?? 8;
  }
  /** Call on every tap. Returns the current estimated BPM or null if not enough data. */
  tap() {
    const now = performance.now();
    this.times.push(now);
    if (this.times.length > this.maxTaps) {
      this.times.shift();
    }
    if (this.times.length < 2) return null;
    const intervals = [];
    for (let i = 1; i < this.times.length; i++) {
      intervals.push(this.times[i] - this.times[i - 1]);
    }
    const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    if (avg <= 0) return null;
    const bpm = Math.round(6e4 / avg);
    if (bpm < MIN_SANE || bpm > MAX_SANE) return null;
    return bpm;
  }
  reset() {
    this.times = [];
  }
};
var MIN_SANE = 60;
var MAX_SANE = 200;

// src/components/bpm-control.ts
var BpmControl = class {
  constructor(parent, initial, callbacks = {}) {
    this.state = { ...initial };
    this.callbacks = callbacks;
    this.tapController = new TapTempoController({ maxTaps: 8 });
    this.container = this.build(parent);
  }
  build(parent) {
    const root = parent.createDiv({ cls: "bpm-control" });
    const valueRow = root.createDiv({ cls: "bpm-value-row" });
    this.renderValue(valueRow);
    if (this.state.alternateBpm) {
      const alt = root.createDiv({ cls: "bpm-alternate-row" });
      const altBtn = alt.createEl("button", {
        cls: "bpm-alternate",
        text: `or ${this.state.alternateBpm}?`
      });
      altBtn.addEventListener("click", () => this.acceptAlternate());
    }
    const actions = root.createDiv({ cls: "bpm-actions" });
    const btnHalve = actions.createEl("button", { cls: "bpm-btn-halve", text: "\xBD" });
    btnHalve.addEventListener("click", () => this.setBpm(Math.round(this.state.bpm / 2)));
    const btnDouble = actions.createEl("button", { cls: "bpm-btn-double", text: "\xD72" });
    btnDouble.addEventListener("click", () => this.setBpm(this.state.bpm * 2));
    const btnTap = actions.createEl("button", { cls: "bpm-btn-tap", text: "Tap tempo" });
    btnTap.addEventListener("click", () => this.onTap(btnTap));
    const confirmRow = root.createDiv({ cls: "bpm-confirm-row" });
    const confirmCb = confirmRow.createEl("input", { type: "checkbox" });
    confirmCb.checked = this.state.confirmed;
    confirmCb.addEventListener("change", () => {
      this.state.confirmed = confirmCb.checked;
      this.refreshConfirmedState(root);
      this.callbacks.onConfirmed?.(this.state.confirmed);
    });
    confirmRow.createSpan({ text: " Tempo confirmed" });
    this.refreshConfirmedState(root);
    return root;
  }
  renderValue(container) {
    container.empty();
    const display = container.createSpan({ cls: "bpm-value", text: String(this.state.bpm) });
    display.addEventListener("click", () => this.startInlineEdit(display));
    container.createSpan({ cls: "bpm-raw", text: ` (raw ${this.state.rawBpm})` });
  }
  startInlineEdit(el) {
    const input = document.createElement("input");
    input.type = "number";
    input.value = String(this.state.bpm);
    input.className = "bpm-input";
    input.min = "40";
    input.max = "300";
    el.replaceWith(input);
    input.focus();
    input.select();
    const commit = () => {
      const val = parseInt(input.value, 10);
      if (!isNaN(val) && val >= 40 && val <= 300) {
        this.setBpm(val);
      }
      this.refreshValue();
    };
    input.addEventListener("blur", commit);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") commit();
      if (e.key === "Escape") this.refreshValue();
    });
  }
  refreshValue() {
    const row = this.container.querySelector(".bpm-value-row");
    if (row) this.renderValue(row);
  }
  setBpm(bpm) {
    this.state.bpm = bpm;
    const doubled = bpm * 2;
    const halved = Math.round(bpm / 2);
    if (doubled <= 200 && doubled !== bpm) {
      this.state.alternateBpm = doubled;
    } else if (halved >= 60 && halved !== bpm) {
      this.state.alternateBpm = halved;
    } else {
      this.state.alternateBpm = void 0;
    }
    this.refreshValue();
    this.refreshAlternate();
    this.callbacks.onChange?.(this.state.bpm);
  }
  acceptAlternate() {
    if (this.state.alternateBpm) {
      this.setBpm(this.state.alternateBpm);
    }
  }
  refreshAlternate() {
    const existing = this.container.querySelector(".bpm-alternate-row");
    if (existing) existing.remove();
    if (this.state.alternateBpm) {
      const actions = this.container.querySelector(".bpm-actions");
      const alt = this.container.createDiv({ cls: "bpm-alternate-row" });
      if (actions) this.container.insertBefore(alt, actions);
      else this.container.appendChild(alt);
      const btn = alt.createEl("button", {
        cls: "bpm-alternate",
        text: `or ${this.state.alternateBpm}?`
      });
      btn.addEventListener("click", () => this.acceptAlternate());
    }
  }
  onTap(btn) {
    const bpm = this.tapController.tap();
    btn.classList.add("bpm-btn-tap-active");
    clearTimeout(this.tapFlashTimeout);
    this.tapFlashTimeout = setTimeout(() => btn.classList.remove("bpm-btn-tap-active"), 150);
    if (bpm !== null) {
      this.setBpm(bpm);
    }
  }
  refreshConfirmedState(root) {
    root.classList.toggle("bpm-confirmed", this.state.confirmed);
    root.classList.toggle("bpm-unconfirmed", !this.state.confirmed);
  }
  getState() {
    return { ...this.state };
  }
  mount(parent) {
    parent.appendChild(this.container);
  }
  destroy() {
    this.container.remove();
    clearTimeout(this.tapFlashTimeout);
  }
};

// src/components/key-control.ts
var CHROMATIC = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
var RELATIVE_MAJOR = {
  Am: "C",
  Em: "G",
  Bm: "D",
  "F#m": "A",
  "C#m": "E",
  "G#m": "B",
  "D#m": "F#",
  "A#m": "C#",
  Dm: "F",
  Gm: "Bb",
  Cm: "Eb",
  Fm: "Ab"
};
var RELATIVE_MINOR = Object.fromEntries(
  Object.entries(RELATIVE_MAJOR).map(([k, v]) => [v, k])
);
var KeyControl = class {
  constructor(parent, initial, callbacks = {}) {
    this.state = { ...initial };
    this.callbacks = callbacks;
    this.container = this.build(parent);
  }
  build(parent) {
    const root = parent.createDiv({ cls: "key-control" });
    const valueRow = root.createDiv({ cls: "key-value-row" });
    this.renderValue(valueRow);
    this.renderRelative(root);
    const actions = root.createDiv({ cls: "key-actions" });
    const btnDown = actions.createEl("button", { cls: "key-btn-semitone-down", text: "\u266D" });
    btnDown.addEventListener("click", () => this.shiftSemitone(-1));
    const btnUp = actions.createEl("button", { cls: "key-btn-semitone-up", text: "\u266F" });
    btnUp.addEventListener("click", () => this.shiftSemitone(1));
    const btnMode = actions.createEl("button", {
      cls: "key-btn-mode-toggle",
      text: this.state.scale === "minor" ? "major" : "minor"
    });
    btnMode.addEventListener("click", () => this.toggleMode());
    const btnRelative = actions.createEl("button", {
      cls: "key-btn-relative",
      text: "Relative"
    });
    btnRelative.addEventListener("click", () => this.jumpToRelative());
    const confirmRow = root.createDiv({ cls: "key-confirm-row" });
    const confirmCb = confirmRow.createEl("input", { type: "checkbox" });
    confirmCb.checked = this.state.confirmed;
    confirmCb.addEventListener("change", () => {
      this.state.confirmed = confirmCb.checked;
      this.refreshConfirmedState(root);
      this.callbacks.onConfirmed?.(this.state.confirmed);
    });
    confirmRow.createSpan({ text: " Key confirmed" });
    this.refreshConfirmedState(root);
    return root;
  }
  renderValue(container) {
    container.empty();
    const displayKey = this.formatKeyDisplay(this.state.key, this.state.scale);
    const el = container.createSpan({ cls: "key-value", text: displayKey });
    el.addEventListener("click", () => this.startInlineEdit(el));
  }
  renderRelative(root) {
    const existing = root.querySelector(".key-relative-row");
    if (existing) existing.remove();
    const relative = this.computeRelative();
    if (!relative) return;
    const row = root.createDiv({ cls: "key-relative-row" });
    const actions = root.querySelector(".key-actions");
    if (actions) root.insertBefore(row, actions);
    else root.appendChild(row);
    row.createSpan({ cls: "key-relative", text: `Relative: ${relative}` });
  }
  formatKeyDisplay(key, scale) {
    return scale === "minor" ? `${key}m` : key;
  }
  parseKeyDisplay(display) {
    if (display.endsWith("m")) {
      return { key: display.slice(0, -1), scale: "minor" };
    }
    return { key: display, scale: "major" };
  }
  startInlineEdit(el) {
    const input = document.createElement("input");
    input.value = this.formatKeyDisplay(this.state.key, this.state.scale);
    input.className = "key-input";
    el.replaceWith(input);
    input.focus();
    input.select();
    const commit = () => {
      const parsed = this.parseKeyDisplay(input.value.trim());
      if (CHROMATIC.includes(parsed.key)) {
        this.state.key = parsed.key;
        this.state.scale = parsed.scale;
        this.refresh();
        this.callbacks.onChange?.(this.state.key, this.state.scale);
      }
    };
    input.addEventListener("blur", commit);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        commit();
        input.blur();
      }
      if (e.key === "Escape") this.refresh();
    });
  }
  shiftSemitone(delta) {
    const idx = CHROMATIC.indexOf(this.state.key);
    if (idx === -1) return;
    const newIdx = (idx + delta + 12) % 12;
    this.state.key = CHROMATIC[newIdx];
    this.refresh();
    this.callbacks.onChange?.(this.state.key, this.state.scale);
  }
  toggleMode() {
    this.state.scale = this.state.scale === "minor" ? "major" : "minor";
    this.refresh();
    this.callbacks.onChange?.(this.state.key, this.state.scale);
  }
  jumpToRelative() {
    const relative = this.computeRelative(true);
    if (relative) {
      const parsed = this.parseKeyDisplay(relative);
      this.state.key = parsed.key;
      this.state.scale = parsed.scale;
      this.refresh();
      this.callbacks.onChange?.(this.state.key, this.state.scale);
    }
  }
  computeRelative(forJump = false) {
    const display = this.formatKeyDisplay(this.state.key, this.state.scale);
    if (this.state.scale === "minor") {
      const rel = RELATIVE_MAJOR[display];
      return rel || void 0;
    } else {
      const rel = RELATIVE_MINOR[display];
      return rel || void 0;
    }
  }
  refresh() {
    const valRow = this.container.querySelector(".key-value-row");
    if (valRow) this.renderValue(valRow);
    this.renderRelative(this.container);
    const modeBtn = this.container.querySelector(".key-btn-mode-toggle");
    if (modeBtn) modeBtn.textContent = this.state.scale === "minor" ? "major" : "minor";
  }
  refreshConfirmedState(root) {
    root.classList.toggle("key-confirmed", this.state.confirmed);
    root.classList.toggle("key-unconfirmed", !this.state.confirmed);
  }
  getState() {
    return { ...this.state };
  }
  mount(parent) {
    parent.appendChild(this.container);
  }
  destroy() {
    this.container.remove();
  }
};

// src/components/confirm-modal.ts
var AnalysisConfirmModal = class extends import_obsidian.Modal {
  constructor(app, data, callbacks) {
    super(app);
    this.data = data;
    this.callbacks = callbacks;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.addClass("mam-confirm-modal");
    const header = contentEl.createDiv({ cls: "mam-modal-header" });
    header.createEl("h2", { text: `Confirm analysis: ${this.data.fileName}` });
    header.createEl("p", {
      text: "Tap or edit values below. Mark confirmed only when they match your ears.",
      cls: "setting-item-description"
    });
    const body = contentEl.createDiv({ cls: "mam-modal-body" });
    const bpmSection = body.createDiv({ cls: "mam-modal-section" });
    bpmSection.createEl("h3", { cls: "mam-modal-section-label", text: "Tempo" });
    this.bpmControl = new BpmControl(bpmSection, this.data.bpm, {
      onChange: (bpm) => {
      },
      onConfirmed: () => {
      }
    });
    const keySection = body.createDiv({ cls: "mam-modal-section" });
    keySection.createEl("h3", { cls: "mam-modal-section-label", text: "Key" });
    this.keyControl = new KeyControl(keySection, this.data.key, {
      onChange: (key, scale) => {
      }
    });
    const footer = contentEl.createDiv({ cls: "mam-modal-footer" });
    const btnSave = footer.createEl("button", { cls: "mam-btn-save mod-cta", text: "Save" });
    btnSave.addEventListener("click", () => {
      if (this.bpmControl && this.keyControl) {
        this.callbacks.onSave({
          bpm: this.bpmControl.getState(),
          key: this.keyControl.getState()
        });
      }
      this.close();
    });
    const btnCancel = footer.createEl("button", { cls: "mam-btn-cancel", text: "Cancel" });
    btnCancel.addEventListener("click", () => {
      this.callbacks.onCancel?.();
      this.close();
    });
  }
  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
};

// src/components/structure-timeline.ts
var StructureTimeline = class {
  constructor(parent, segments, bpm, offsetBars = 0) {
    this.trackEl = null;
    this.tooltipEl = null;
    this.container = parent.createDiv({ cls: "mam-timeline" });
    this.segments = segments;
    this.bpm = bpm;
    this.offsetBars = offsetBars;
  }
  mount() {
    this.container.empty();
    if (this.segments.length === 0) {
      this.container.createDiv({
        cls: "mam-timeline-empty",
        text: "No structure defined. Add segments to frontmatter: structure: [...]"
      });
      this.buildOffsetRow();
      return;
    }
    const totalBars = Math.max(...this.segments.map((s) => s.endBar));
    const effectiveTotal = totalBars + this.offsetBars;
    this.trackEl = this.container.createDiv({ cls: "mam-timeline-track" });
    this.segments.forEach((seg) => {
      const leftPct = (seg.startBar + this.offsetBars) / effectiveTotal * 100;
      const widthPct = (seg.endBar - seg.startBar) / effectiveTotal * 100;
      const bar = this.trackEl.createDiv({ cls: "mam-timeline-segment" });
      bar.style.left = `${leftPct}%`;
      bar.style.width = `${widthPct}%`;
      bar.style.backgroundColor = seg.color;
      bar.style.setProperty("--mam-segment-color", seg.color);
      bar.createSpan({
        cls: "mam-timeline-segment-label",
        text: seg.label
      });
      bar.addEventListener("mouseenter", () => this.showTooltip(seg, bar));
      bar.addEventListener("mouseleave", () => this.hideTooltip());
    });
    this.buildOffsetRow();
  }
  buildOffsetRow() {
    const row = this.container.createDiv({ cls: "mam-timeline-offset-row" });
    row.createSpan({
      cls: "mam-timeline-offset-label",
      text: `Trim lead-in: ${this.offsetBars} bar${this.offsetBars === 1 ? "" : "s"}`
    });
    const slider = row.createEl("input", { type: "range" });
    slider.className = "mam-timeline-slider";
    slider.min = "0";
    slider.max = String(Math.ceil(this.offsetBars + 4));
    slider.value = String(this.offsetBars);
    slider.step = "1";
    slider.addEventListener("input", () => {
      const val = parseInt(slider.value, 10);
      this.offsetBars = val;
      const label = row.querySelector(".mam-timeline-offset-label");
      if (label) {
        label.textContent = `Trim lead-in: ${val} bar${val === 1 ? "" : "s"}`;
      }
      this.onOffsetChange?.(val);
      this.mount();
    });
  }
  showTooltip(seg, anchor) {
    if (!this.trackEl) return;
    this.tooltipEl = this.trackEl.createDiv({ cls: "mam-timeline-tooltip" });
    const beatLen = 60 / this.bpm;
    const startTime = seg.startBar * 4 * beatLen;
    const startStr = this.formatTime(startTime);
    const endTime = seg.endBar * 4 * beatLen;
    const endStr = this.formatTime(endTime);
    this.tooltipEl.innerHTML = `
      <strong>${seg.label}</strong><br/>
      Bars ${seg.startBar} \u2013 ${seg.endBar}<br/>
      ${startStr} \u2013 ${endStr}
    `;
    const trackRect = this.trackEl.getBoundingClientRect();
    const barRect = anchor.getBoundingClientRect();
    const left = barRect.left - trackRect.left + barRect.width / 2 - 60;
    const top = -40;
    this.tooltipEl.style.left = `${left}px`;
    this.tooltipEl.style.top = `${top}px`;
  }
  hideTooltip() {
    if (this.tooltipEl) {
      this.tooltipEl.remove();
      this.tooltipEl = null;
    }
  }
  formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.floor(sec % 1 * 100);
    return `${m}:${s.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
  }
  destroy() {
    this.container.remove();
  }
};

// src/components/tuner-needle.ts
var CHROMATIC_ORDER = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B"
];
var TunerNeedle = class {
  constructor(parent, initial) {
    this.needleEl = null;
    this.state = { ...initial };
    this.container = parent.createDiv({ cls: "mam-tuner" });
  }
  mount() {
    this.container.empty();
    const dial = this.container.createDiv({ cls: "mam-tuner-dial" });
    CHROMATIC_ORDER.forEach((note, i) => {
      const angle = i / 12 * 360;
      const tick = dial.createDiv({ cls: "mam-tuner-tick" });
      tick.setAttribute("data-note", note);
      tick.style.transform = `rotate(${angle}deg) translateY(-45px)`;
    });
    this.needleEl = dial.createDiv({
      cls: `mam-tuner-needle ${this.state.confirmed ? "mam-tuner-needle-confirmed" : "mam-tuner-needle-unconfirmed"}`
    });
    this.setNeedleAngle(this.state.key);
    const label = this.container.createDiv({
      cls: `mam-tuner-label ${this.state.confirmed ? "mam-tuner-label-confirmed" : "mam-tuner-label-unconfirmed"}`,
      text: this.formatKeyDisplay()
    });
  }
  update(state) {
    this.state = { ...state };
    this.setNeedleAngle(this.state.key);
    if (this.needleEl) {
      this.needleEl.className = `mam-tuner-needle ${this.state.confirmed ? "mam-tuner-needle-confirmed" : "mam-tuner-needle-unconfirmed"}`;
    }
    const label = this.container.querySelector(".mam-tuner-label");
    if (label) {
      label.className = `mam-tuner-label ${this.state.confirmed ? "mam-tuner-label-confirmed" : "mam-tuner-label-unconfirmed"}`;
      label.textContent = this.formatKeyDisplay();
    }
  }
  setNeedleAngle(key) {
    const idx = CHROMATIC_ORDER.indexOf(key);
    if (idx === -1) return;
    const angle = idx / 12 * 360;
    if (this.needleEl) {
      this.needleEl.style.transform = `rotate(${angle}deg)`;
    }
  }
  formatKeyDisplay() {
    return this.state.scale === "minor" ? `${this.state.key}m` : this.state.key;
  }
  destroy() {
    this.container.remove();
  }
};

// src/components/camelot-wheel.ts
var MAJOR_KEYS = [
  "1B",
  "2B",
  "3B",
  "4B",
  "5B",
  "6B",
  "7B",
  "8B",
  "9B",
  "10B",
  "11B",
  "12B"
];
var MINOR_KEYS = [
  "1A",
  "2A",
  "3A",
  "4A",
  "5A",
  "6A",
  "7A",
  "8A",
  "9A",
  "10A",
  "11A",
  "12A"
];
function keyNameToCamelot(key, scale) {
  const name = key.replace(/[mb]$/, "").replace("#", "sharp");
  const map = {
    major: {
      B: "1B",
      "Gb": "2B",
      "Fsharp": "2B",
      Db: "3B",
      "Csharp": "3B",
      "Ab": "4B",
      "Gsharp": "4B",
      Eb: "5B",
      "Dsharp": "5B",
      Bb: "6B",
      "Asharp": "6B",
      F: "7B",
      C: "8B",
      G: "9B",
      D: "10B",
      A: "11B",
      E: "12B"
    },
    minor: {
      "Gsharp": "1A",
      "Ab": "1A",
      Eb: "2A",
      "Dsharp": "2A",
      Bb: "3A",
      "Asharp": "3A",
      F: "4A",
      C: "5A",
      G: "6A",
      D: "7A",
      A: "8A",
      E: "9A",
      B: "10A",
      "Fsharp": "11A",
      "Gb": "11A",
      "Csharp": "12A",
      Db: "12A"
    }
  };
  const s = scale === "minor" ? "minor" : "major";
  return map[s]?.[name] || map[s]?.[key] || void 0;
}
function camelotToKeyName(camelot) {
  const map = {
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
    "12A": { key: "C#m", scale: "minor" }
  };
  return map[camelot];
}
function getCompatibleKeys(current) {
  const num = parseInt(current.slice(0, -1), 10);
  const letter = current.slice(-1);
  const compatible = [];
  compatible.push(`${num}${letter === "A" ? "B" : "A"}`);
  const prev = num === 1 ? 12 : num - 1;
  const next = num === 12 ? 1 : num + 1;
  compatible.push(`${prev}${letter}`, `${next}${letter}`);
  compatible.push(`${prev}${letter === "A" ? "B" : "A"}`);
  compatible.push(`${next}${letter === "A" ? "B" : "A"}`);
  return compatible;
}
var CamelotWheel = class {
  constructor(parent, config) {
    this.config = config;
    this.container = parent.createDiv({ cls: "mam-camelot" });
  }
  mount() {
    this.container.empty();
    const wheel = this.container.createDiv({ cls: "mam-camelot-wheel" });
    for (let i = 0; i < 12; i++) {
      const angle = i / 12 * 360;
      const majorKey = MAJOR_KEYS[i];
      const minorKey = MINOR_KEYS[i];
      this.renderKey(wheel, majorKey, angle, "major");
      this.renderKey(wheel, minorKey, angle, "minor");
    }
    const legend = this.container.createDiv({ cls: "mam-camelot-legend" });
    legend.createSpan({ cls: "mam-camelot-current", text: "\u25CF current " });
    legend.createSpan({ cls: "mam-camelot-compatible", text: "\u25E6 compatible " });
  }
  renderKey(wheel, key, angle, type) {
    const slot = wheel.createDiv({ cls: `mam-camelot-key mam-camelot-key-${type}` });
    const radius = type === "major" ? 60 : 35;
    slot.style.transform = `rotate(${angle}deg) translateY(-${radius}px)`;
    slot.setAttribute("data-camelot", key);
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
      const dvQuery = `\`\`\`dataview
LIST
FROM #music
WHERE key = "${match.key}"
SORT tempo ASC
\`\`\``;
      this.config.onKeyClick(key, dvQuery);
    });
  }
  destroy() {
    this.container.remove();
  }
};

// src/components/dashboard-processor.ts
var MusicDashboardProcessor = class {
  constructor(vaultActions) {
    this.vaultActions = vaultActions;
  }
  async process(source, el, ctx) {
    const container = el.createDiv({ cls: "mam-dashboard" });
    const filePath = ctx.sourcePath;
    let fm;
    try {
      const raw = await this.vaultActions.readFile(filePath);
      fm = this.parseFrontmatter(raw, filePath);
    } catch {
      container.createEl("p", {
        cls: "mam-dashboard-empty",
        text: "No music analysis data found in this note. Run \u201CAnalyze audio\u201D first."
      });
      return;
    }
    const header = container.createDiv({ cls: "mam-dashboard-header" });
    header.createEl("h3", { text: fm.sourceFile.split("/").pop() || "Untitled" });
    if (fm.duration) {
      header.createSpan({ cls: "mam-dashboard-duration", text: fm.duration });
    }
    const meta = container.createDiv({ cls: "mam-dashboard-meta" });
    const bpmEl = meta.createSpan({
      cls: fm.tempo_confirmed ? "mam-meta-confirmed" : "mam-meta-unconfirmed"
    });
    bpmEl.setText(`${fm.tempo} BPM`);
    if (fm.alternate_tempo) {
      bpmEl.setText(`${fm.tempo} BPM (or ${fm.alternate_tempo}?)`);
    }
    meta.createSpan({ text: " \u2022 " });
    const keyEl = meta.createSpan({
      cls: fm.key_confirmed ? "mam-meta-confirmed" : "mam-meta-unconfirmed"
    });
    keyEl.setText(fm.key);
    const controlsSection = container.createDiv({ cls: "mam-dashboard-section" });
    controlsSection.createEl("h4", { cls: "mam-dashboard-section-label", text: "Controls" });
    const controlsArea = controlsSection.createDiv({ cls: "mam-dashboard-controls" });
    const isMinor = fm.key.endsWith("m");
    const baseKey = isMinor ? fm.key.slice(0, -1) : fm.key;
    const bpmState = {
      bpm: fm.tempo,
      rawBpm: fm.raw_tempo ?? fm.tempo,
      alternateBpm: fm.alternate_tempo,
      confirmed: fm.tempo_confirmed
    };
    const keyState = {
      key: baseKey,
      scale: isMinor ? "minor" : "major",
      relativeKey: void 0,
      confirmed: fm.key_confirmed
    };
    const saveToFm = async (partial) => {
      try {
        const raw = await this.vaultActions.readFile(filePath);
        const updated = injectFrontmatter(raw, partial);
        await this.vaultActions.modifyFile(filePath, updated);
      } catch (e) {
        console.warn("[MAM] Dashboard save failed:", e);
      }
    };
    const bpmControl = new BpmControl(controlsArea, bpmState, {
      onChange: async (bpm) => {
        await saveToFm({ tempo: bpm, tempo_confirmed: true });
      },
      onConfirmed: async (confirmed) => {
        await saveToFm({ tempo_confirmed: confirmed });
      }
    });
    bpmControl.mount(controlsArea);
    const keyControl = new KeyControl(controlsArea, keyState, {
      onChange: async (key, scale) => {
        const display = scale === "minor" ? `${key}m` : key;
        await saveToFm({ key: display, key_confirmed: true });
      },
      onConfirmed: async (confirmed) => {
        await saveToFm({ key_confirmed: confirmed });
      }
    });
    keyControl.mount(controlsArea);
    const timelineSection = container.createDiv({ cls: "mam-dashboard-section" });
    timelineSection.createEl("h4", { cls: "mam-dashboard-section-label", text: "Structure" });
    const segments = (fm.structure || []).map((s) => ({
      id: s.segment,
      label: s.segment,
      startBar: s.bars[0],
      endBar: s.bars[1],
      color: this.colorForSegment(s.segment)
    }));
    const timeline = new StructureTimeline(
      timelineSection,
      segments,
      fm.tempo,
      fm.audio_start_offset ?? 0
    );
    timeline.onOffsetChange = async (offset) => {
      await saveToFm({ audio_start_offset: offset });
    };
    timeline.mount();
    const tunerSection = container.createDiv({ cls: "mam-dashboard-section" });
    tunerSection.createEl("h4", { cls: "mam-dashboard-section-label", text: "Tuner" });
    const tunerContainer = tunerSection.createDiv({ cls: "mam-dashboard-tuner" });
    const tuner = new TunerNeedle(tunerContainer, {
      key: baseKey,
      scale: isMinor ? "minor" : "major",
      confirmed: fm.key_confirmed
    });
    tuner.mount();
    const camelotSection = container.createDiv({ cls: "mam-dashboard-section" });
    camelotSection.createEl("h4", { cls: "mam-dashboard-section-label", text: "Camelot" });
    const camelotContainer = camelotSection.createDiv({ cls: "mam-dashboard-camelot" });
    const camelot = new CamelotWheel(camelotContainer, {
      current: keyNameToCamelot(baseKey, isMinor ? "minor" : "major"),
      onKeyClick: (_camelotKey, dvQuery) => this.handleCamelotClick(dvQuery)
    });
    camelot.mount();
  }
  parseFrontmatter(raw, sourcePath) {
    const fm = {};
    const match = /^---\s*\n([\s\S]*?)\n---\s*\n?/.exec(raw);
    if (match) {
      for (const line of match[1].split("\n")) {
        const idx = line.indexOf(":");
        if (idx > 0) {
          const k = line.slice(0, idx).trim();
          const v = line.slice(idx + 1).trim();
          if (!isNaN(Number(v)) && v !== "" && !v.includes(" ")) {
            fm[k] = Number(v);
          } else if (v === "true" || v === "false") {
            fm[k] = v === "true";
          } else {
            fm[k] = v.replace(/^["']|["']$/g, "");
          }
        }
      }
    }
    if (!fm.tempo && !fm.key) {
      throw new Error("No analysis data in frontmatter");
    }
    let structure = void 0;
    if (Array.isArray(fm.structure)) {
      structure = fm.structure;
    } else if (typeof fm.structure === "string" && fm.structure.startsWith("[") && fm.structure.endsWith("]")) {
      try {
        structure = JSON.parse(fm.structure);
      } catch {
      }
    }
    return {
      sourceFile: sourcePath,
      tempo: Number(fm.tempo ?? 0),
      raw_tempo: fm.raw_tempo ? Number(fm.raw_tempo) : void 0,
      alternate_tempo: fm.alternate_tempo ? Number(fm.alternate_tempo) : void 0,
      tempo_confirmed: !!fm.tempo_confirmed,
      key: String(fm.key ?? ""),
      key_confirmed: !!fm.key_confirmed,
      duration: fm.duration ? String(fm.duration) : void 0,
      audio_start_offset: Number(fm.audio_start_offset ?? 0),
      structure
    };
  }
  colorForSegment(name) {
    const colors = {
      Intro: "var(--color-accent)",
      Verse: "var(--interactive-accent)",
      Chorus: "var(--color-green)",
      Bridge: "var(--color-yellow)",
      "Pre-chorus": "var(--color-orange)",
      Hook: "var(--color-red)",
      Outro: "var(--color-purple)",
      Breakdown: "var(--color-cyan)"
    };
    return colors[name] || "var(--text-muted)";
  }
  handleCamelotClick(dvQuery) {
    navigator.clipboard?.writeText(dvQuery).catch(() => {
    });
    console.log("[MAM] Camelot key clicked \u2014 Dataview query copied to clipboard");
  }
};

// src/main.ts
var analysisCache = /* @__PURE__ */ new Map();
var MusicAnalysisPlugin = class extends import_obsidian2.Plugin {
  constructor() {
    super(...arguments);
    this.worker = null;
  }
  async onload() {
    console.log("[MusicAnalysis] Slice 3 loaded");
    this.addCommand({
      id: "analyze-audio",
      name: "Analyze audio (tempo, key, duration)",
      callback: () => this.runAnalysis()
    });
    this.addCommand({
      id: "confirm-analysis",
      name: "Confirm analysis (open correction modal)",
      callback: () => this.openConfirmModal()
    });
    const dashboardProcessor = new MusicDashboardProcessor({
      readFile: async (path) => {
        const f = this.app.vault.getFileByPath(path);
        if (!f) throw new Error("File not found: " + path);
        return await this.app.vault.read(f);
      },
      modifyFile: async (path, content) => {
        const f = this.app.vault.getFileByPath(path);
        if (!f) throw new Error("File not found: " + path);
        await this.app.vault.modify(f, content);
      },
      getFileByPath: (path) => {
        const f = this.app.vault.getFileByPath(path);
        return f ? { path: f.path } : null;
      }
    });
    this.registerMarkdownCodeBlockProcessor(
      "music-dashboard",
      (source, el, ctx) => dashboardProcessor.process(source, el, ctx)
    );
  }
  onunload() {
    this.worker?.terminate();
    this.worker = null;
  }
  async runAnalysis() {
    const file = this.app.workspace.getActiveFile();
    if (!file || !this.isAudioFile(file)) {
      new import_obsidian2.Notice("Select an audio file (mp3/wav/flac)");
      return;
    }
    const arrayBuf = await this.app.vault.readBinary(file);
    const hash = await sha256(arrayBuf);
    const notePath = `${file.path}.md`;
    const cached = analysisCache.get(notePath);
    if (cached && cached.hash === hash) {
      new import_obsidian2.Notice(`Cache hit: ${cached.result.tempo} BPM, ${cached.result.key}`);
      await this.writeNote(notePath, cached.result, file.name);
      return;
    }
    new import_obsidian2.Notice("Analyzing audio...");
    const result = await this.analyzeInWorker(arrayBuf, file.name);
    if (result.error) {
      new import_obsidian2.Notice(`Analysis failed: ${result.error}`);
      return;
    }
    analysisCache.set(notePath, { hash, result, timestamp: Date.now() });
    new import_obsidian2.Notice(
      `Done: ${result.tempo} BPM${result.alternateTempo ? " (or " + result.alternateTempo + "?)" : ""}, ${result.key}`
    );
    await this.writeNote(notePath, result, file.name);
  }
  /**
   * Open the confirm modal for the currently open analysis note.
   * Parses existing frontmatter and lets the user edit tempo/key.
   */
  openConfirmModal() {
    const view = this.app.workspace.getActiveViewOfType(import_obsidian2.MarkdownView);
    if (!view) {
      new import_obsidian2.Notice("Open an analysis note first");
      return;
    }
    const file = view.file;
    if (!file) {
      new import_obsidian2.Notice("No file open");
      return;
    }
    const cache = this.app.metadataCache.getFileCache(file);
    const fm = cache?.frontmatter || {};
    if (!fm.tempo && !fm.key) {
      new import_obsidian2.Notice("No analysis data found in this note");
      return;
    }
    const bpmState = {
      bpm: fm.tempo ?? 0,
      rawBpm: fm.raw_tempo ?? fm.tempo ?? 0,
      alternateBpm: fm.alternate_tempo,
      confirmed: fm.tempo_confirmed ?? false
    };
    const keyParts = String(fm.key || "").split(" / ");
    const keyName = keyParts[0] || "";
    const isMinor = keyName.endsWith("m");
    const baseKey = isMinor ? keyName.slice(0, -1) : keyName;
    const keyState = {
      key: baseKey,
      scale: isMinor ? "minor" : "major",
      relativeKey: keyParts[1],
      confirmed: fm.key_confirmed ?? false
    };
    new AnalysisConfirmModal(
      this.app,
      {
        fileName: file.basename,
        bpm: bpmState,
        key: keyState
      },
      {
        onSave: async (data) => {
          const keyDisplay = data.key.scale === "minor" ? `${data.key.key}m` : data.key.key;
          const updated = injectFrontmatter(await this.app.vault.read(file), {
            tempo: data.bpm.bpm,
            raw_tempo: data.bpm.rawBpm,
            alternate_tempo: data.bpm.alternateBpm,
            tempo_confirmed: data.bpm.confirmed,
            key: keyDisplay,
            key_confirmed: data.key.confirmed
          });
          await this.app.vault.modify(file, updated);
          new import_obsidian2.Notice("Analysis updated");
        }
      }
    ).open();
  }
  isAudioFile(file) {
    return /\.(mp3|wav|flac|aif|ogg|m4a)$/i.test(file.extension);
  }
  async analyzeInWorker(audioBuffer, fileName) {
    if (!this.worker) {
      const workerPath = this.app.vault.adapter.getResourcePath(
        `${this.manifest.dir}/dist/worker.js`
      );
      this.worker = new Worker(workerPath);
    }
    return new Promise((resolve, reject) => {
      const id = `${fileName}-${Date.now()}`;
      const handler = (e) => {
        if (e.data.id !== id) return;
        this.worker.removeEventListener("message", handler);
        if (e.data.type === "error") reject(new Error(e.data.error));
        else resolve(e.data.result);
      };
      this.worker.addEventListener("message", handler);
      this.worker.postMessage({ id, type: "analyze", audioBuffer });
    });
  }
  async writeNote(path, result, sourceFile) {
    const durationStr = this.formatDuration(result.duration);
    const keyDisplay = result.relativeKey ? `${result.key} / ${result.relativeKey}` : result.key;
    const content = injectFrontmatter("", {
      audio_source: sourceFile,
      key: keyDisplay,
      key_confirmed: false,
      tempo: result.tempo,
      raw_tempo: result.rawTempo,
      alternate_tempo: result.alternateTempo,
      tempo_confirmed: false,
      duration: durationStr
    });
    const existing = this.app.vault.getFileByPath(path);
    if (existing) {
      await this.app.vault.modify(existing, content);
    } else {
      await this.app.vault.create(path, content);
    }
  }
  formatDuration(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL21haW4udHMiLCAiLi4vc3JjL3NoYTI1Ni50cyIsICIuLi9zcmMveWFtbC1pbmplY3Rvci50cyIsICIuLi9zcmMvY29tcG9uZW50cy9jb25maXJtLW1vZGFsLnRzIiwgIi4uL3NyYy9jb21wb25lbnRzL3RhcC10ZW1wby50cyIsICIuLi9zcmMvY29tcG9uZW50cy9icG0tY29udHJvbC50cyIsICIuLi9zcmMvY29tcG9uZW50cy9rZXktY29udHJvbC50cyIsICIuLi9zcmMvY29tcG9uZW50cy9zdHJ1Y3R1cmUtdGltZWxpbmUudHMiLCAiLi4vc3JjL2NvbXBvbmVudHMvdHVuZXItbmVlZGxlLnRzIiwgIi4uL3NyYy9jb21wb25lbnRzL2NhbWVsb3Qtd2hlZWwudHMiLCAiLi4vc3JjL2NvbXBvbmVudHMvZGFzaGJvYXJkLXByb2Nlc3Nvci50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gbWFpbi50cyBcdTIwMTQgT2JzaWRpYW4gcGx1Z2luIGVudHJ5IHBvaW50IChTbGljZSAyOiBjb25maXJtLWZpcnN0IFVYKVxuaW1wb3J0IHsgUGx1Z2luLCBOb3RpY2UsIFRGaWxlLCBNYXJrZG93blZpZXcgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IHNoYTI1NiB9IGZyb20gXCIuL3NoYTI1NlwiO1xuaW1wb3J0IHsgaW5qZWN0RnJvbnRtYXR0ZXIgfSBmcm9tIFwiLi95YW1sLWluamVjdG9yXCI7XG5pbXBvcnQgeyBBbmFseXNpc1Jlc3VsdCB9IGZyb20gXCIuL2FuYWx5c2lzLWVuZ2luZVwiO1xuaW1wb3J0IHsgQW5hbHlzaXNDb25maXJtTW9kYWwgfSBmcm9tIFwiLi9jb21wb25lbnRzL2NvbmZpcm0tbW9kYWxcIjtcbmltcG9ydCB7IEJwbUNvbnRyb2xTdGF0ZSB9IGZyb20gXCIuL2NvbXBvbmVudHMvYnBtLWNvbnRyb2xcIjtcbmltcG9ydCB7IEtleUNvbnRyb2xTdGF0ZSB9IGZyb20gXCIuL2NvbXBvbmVudHMva2V5LWNvbnRyb2xcIjtcbmltcG9ydCB7IE11c2ljRGFzaGJvYXJkUHJvY2Vzc29yIH0gZnJvbSBcIi4vY29tcG9uZW50cy9kYXNoYm9hcmQtcHJvY2Vzc29yXCI7XG5cbmludGVyZmFjZSBBbmFseXNpc0NhY2hlRW50cnkge1xuICBoYXNoOiBzdHJpbmc7XG4gIHJlc3VsdDogQW5hbHlzaXNSZXN1bHQ7XG4gIHRpbWVzdGFtcDogbnVtYmVyO1xufVxuXG4vLyBJbi1tZW1vcnkgY2FjaGUgZm9yIGN1cnJlbnQgc2Vzc2lvbiAodmF1bHQtYm91bmQpXG5jb25zdCBhbmFseXNpc0NhY2hlID0gbmV3IE1hcDxzdHJpbmcsIEFuYWx5c2lzQ2FjaGVFbnRyeT4oKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTXVzaWNBbmFseXNpc1BsdWdpbiBleHRlbmRzIFBsdWdpbiB7XG4gIHByaXZhdGUgd29ya2VyOiBXb3JrZXIgfCBudWxsID0gbnVsbDtcblxuICBhc3luYyBvbmxvYWQoKSB7XG4gICAgY29uc29sZS5sb2coXCJbTXVzaWNBbmFseXNpc10gU2xpY2UgMyBsb2FkZWRcIik7XG5cbiAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwiYW5hbHl6ZS1hdWRpb1wiLFxuICAgICAgbmFtZTogXCJBbmFseXplIGF1ZGlvICh0ZW1wbywga2V5LCBkdXJhdGlvbilcIixcbiAgICAgIGNhbGxiYWNrOiAoKSA9PiB0aGlzLnJ1bkFuYWx5c2lzKCksXG4gICAgfSk7XG5cbiAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwiY29uZmlybS1hbmFseXNpc1wiLFxuICAgICAgbmFtZTogXCJDb25maXJtIGFuYWx5c2lzIChvcGVuIGNvcnJlY3Rpb24gbW9kYWwpXCIsXG4gICAgICBjYWxsYmFjazogKCkgPT4gdGhpcy5vcGVuQ29uZmlybU1vZGFsKCksXG4gICAgfSk7XG5cbiAgICAvLyBSZWdpc3RlciBgbXVzaWMtZGFzaGJvYXJkYCBjb2RlLWJsb2NrIHJlbmRlcmVyXG4gICAgY29uc3QgZGFzaGJvYXJkUHJvY2Vzc29yID0gbmV3IE11c2ljRGFzaGJvYXJkUHJvY2Vzc29yKHtcbiAgICAgIHJlYWRGaWxlOiBhc3luYyAocGF0aDogc3RyaW5nKSA9PiB7XG4gICAgICAgIGNvbnN0IGYgPSB0aGlzLmFwcC52YXVsdC5nZXRGaWxlQnlQYXRoKHBhdGgpO1xuICAgICAgICBpZiAoIWYpIHRocm93IG5ldyBFcnJvcihcIkZpbGUgbm90IGZvdW5kOiBcIiArIHBhdGgpO1xuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZChmKTtcbiAgICAgIH0sXG4gICAgICBtb2RpZnlGaWxlOiBhc3luYyAocGF0aDogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcpID0+IHtcbiAgICAgICAgY29uc3QgZiA9IHRoaXMuYXBwLnZhdWx0LmdldEZpbGVCeVBhdGgocGF0aCk7XG4gICAgICAgIGlmICghZikgdGhyb3cgbmV3IEVycm9yKFwiRmlsZSBub3QgZm91bmQ6IFwiICsgcGF0aCk7XG4gICAgICAgIGF3YWl0IHRoaXMuYXBwLnZhdWx0Lm1vZGlmeShmLCBjb250ZW50KTtcbiAgICAgIH0sXG4gICAgICBnZXRGaWxlQnlQYXRoOiAocGF0aDogc3RyaW5nKSA9PiB7XG4gICAgICAgIGNvbnN0IGYgPSB0aGlzLmFwcC52YXVsdC5nZXRGaWxlQnlQYXRoKHBhdGgpO1xuICAgICAgICByZXR1cm4gZiA/IHsgcGF0aDogZi5wYXRoIH0gOiBudWxsO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHRoaXMucmVnaXN0ZXJNYXJrZG93bkNvZGVCbG9ja1Byb2Nlc3NvcihcbiAgICAgIFwibXVzaWMtZGFzaGJvYXJkXCIsXG4gICAgICAoc291cmNlLCBlbCwgY3R4KSA9PiBkYXNoYm9hcmRQcm9jZXNzb3IucHJvY2Vzcyhzb3VyY2UsIGVsLCBjdHgpXG4gICAgKTtcbiAgfVxuXG4gIG9udW5sb2FkKCkge1xuICAgIHRoaXMud29ya2VyPy50ZXJtaW5hdGUoKTtcbiAgICB0aGlzLndvcmtlciA9IG51bGw7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHJ1bkFuYWx5c2lzKCkge1xuICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgIGlmICghZmlsZSB8fCAhdGhpcy5pc0F1ZGlvRmlsZShmaWxlKSkge1xuICAgICAgbmV3IE5vdGljZShcIlNlbGVjdCBhbiBhdWRpbyBmaWxlIChtcDMvd2F2L2ZsYWMpXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGFycmF5QnVmID0gYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZEJpbmFyeShmaWxlKTtcbiAgICBjb25zdCBoYXNoID0gYXdhaXQgc2hhMjU2KGFycmF5QnVmKTtcblxuICAgIGNvbnN0IG5vdGVQYXRoID0gYCR7ZmlsZS5wYXRofS5tZGA7XG4gICAgY29uc3QgY2FjaGVkID0gYW5hbHlzaXNDYWNoZS5nZXQobm90ZVBhdGgpO1xuICAgIGlmIChjYWNoZWQgJiYgY2FjaGVkLmhhc2ggPT09IGhhc2gpIHtcbiAgICAgIG5ldyBOb3RpY2UoYENhY2hlIGhpdDogJHtjYWNoZWQucmVzdWx0LnRlbXBvfSBCUE0sICR7Y2FjaGVkLnJlc3VsdC5rZXl9YCk7XG4gICAgICBhd2FpdCB0aGlzLndyaXRlTm90ZShub3RlUGF0aCwgY2FjaGVkLnJlc3VsdCwgZmlsZS5uYW1lKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBuZXcgTm90aWNlKFwiQW5hbHl6aW5nIGF1ZGlvLi4uXCIpO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5hbmFseXplSW5Xb3JrZXIoYXJyYXlCdWYsIGZpbGUubmFtZSk7XG4gICAgaWYgKHJlc3VsdC5lcnJvcikge1xuICAgICAgbmV3IE5vdGljZShgQW5hbHlzaXMgZmFpbGVkOiAke3Jlc3VsdC5lcnJvcn1gKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBhbmFseXNpc0NhY2hlLnNldChub3RlUGF0aCwgeyBoYXNoLCByZXN1bHQsIHRpbWVzdGFtcDogRGF0ZS5ub3coKSB9KTtcblxuICAgIG5ldyBOb3RpY2UoXG4gICAgICBgRG9uZTogJHtyZXN1bHQudGVtcG99IEJQTSR7cmVzdWx0LmFsdGVybmF0ZVRlbXBvID8gXCIgKG9yIFwiICsgcmVzdWx0LmFsdGVybmF0ZVRlbXBvICsgXCI/KVwiIDogXCJcIn0sICR7cmVzdWx0LmtleX1gXG4gICAgKTtcbiAgICBhd2FpdCB0aGlzLndyaXRlTm90ZShub3RlUGF0aCwgcmVzdWx0LCBmaWxlLm5hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIE9wZW4gdGhlIGNvbmZpcm0gbW9kYWwgZm9yIHRoZSBjdXJyZW50bHkgb3BlbiBhbmFseXNpcyBub3RlLlxuICAgKiBQYXJzZXMgZXhpc3RpbmcgZnJvbnRtYXR0ZXIgYW5kIGxldHMgdGhlIHVzZXIgZWRpdCB0ZW1wby9rZXkuXG4gICAqL1xuICBwcml2YXRlIG9wZW5Db25maXJtTW9kYWwoKSB7XG4gICAgY29uc3QgdmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gICAgaWYgKCF2aWV3KSB7XG4gICAgICBuZXcgTm90aWNlKFwiT3BlbiBhbiBhbmFseXNpcyBub3RlIGZpcnN0XCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGZpbGUgPSB2aWV3LmZpbGU7XG4gICAgaWYgKCFmaWxlKSB7XG4gICAgICBuZXcgTm90aWNlKFwiTm8gZmlsZSBvcGVuXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGNhY2hlID0gdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRGaWxlQ2FjaGUoZmlsZSk7XG4gICAgY29uc3QgZm0gPSBjYWNoZT8uZnJvbnRtYXR0ZXIgfHwge307XG5cbiAgICBpZiAoIWZtLnRlbXBvICYmICFmbS5rZXkpIHtcbiAgICAgIG5ldyBOb3RpY2UoXCJObyBhbmFseXNpcyBkYXRhIGZvdW5kIGluIHRoaXMgbm90ZVwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBicG1TdGF0ZTogQnBtQ29udHJvbFN0YXRlID0ge1xuICAgICAgYnBtOiBmbS50ZW1wbyA/PyAwLFxuICAgICAgcmF3QnBtOiBmbS5yYXdfdGVtcG8gPz8gZm0udGVtcG8gPz8gMCxcbiAgICAgIGFsdGVybmF0ZUJwbTogZm0uYWx0ZXJuYXRlX3RlbXBvLFxuICAgICAgY29uZmlybWVkOiBmbS50ZW1wb19jb25maXJtZWQgPz8gZmFsc2UsXG4gICAgfTtcblxuICAgIGNvbnN0IGtleVBhcnRzID0gU3RyaW5nKGZtLmtleSB8fCBcIlwiKS5zcGxpdChcIiAvIFwiKTtcbiAgICBjb25zdCBrZXlOYW1lID0ga2V5UGFydHNbMF0gfHwgXCJcIjtcbiAgICBjb25zdCBpc01pbm9yID0ga2V5TmFtZS5lbmRzV2l0aChcIm1cIik7XG4gICAgY29uc3QgYmFzZUtleSA9IGlzTWlub3IgPyBrZXlOYW1lLnNsaWNlKDAsIC0xKSA6IGtleU5hbWU7XG5cbiAgICBjb25zdCBrZXlTdGF0ZTogS2V5Q29udHJvbFN0YXRlID0ge1xuICAgICAga2V5OiBiYXNlS2V5LFxuICAgICAgc2NhbGU6IGlzTWlub3IgPyBcIm1pbm9yXCIgOiBcIm1ham9yXCIsXG4gICAgICByZWxhdGl2ZUtleToga2V5UGFydHNbMV0sXG4gICAgICBjb25maXJtZWQ6IGZtLmtleV9jb25maXJtZWQgPz8gZmFsc2UsXG4gICAgfTtcblxuICAgIG5ldyBBbmFseXNpc0NvbmZpcm1Nb2RhbChcbiAgICAgIHRoaXMuYXBwLFxuICAgICAge1xuICAgICAgICBmaWxlTmFtZTogZmlsZS5iYXNlbmFtZSxcbiAgICAgICAgYnBtOiBicG1TdGF0ZSxcbiAgICAgICAga2V5OiBrZXlTdGF0ZSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG9uU2F2ZTogYXN5bmMgKGRhdGEpID0+IHtcbiAgICAgICAgICBjb25zdCBrZXlEaXNwbGF5ID0gZGF0YS5rZXkuc2NhbGUgPT09IFwibWlub3JcIlxuICAgICAgICAgICAgPyBgJHtkYXRhLmtleS5rZXl9bWBcbiAgICAgICAgICAgIDogZGF0YS5rZXkua2V5O1xuXG4gICAgICAgICAgY29uc3QgdXBkYXRlZCA9IGluamVjdEZyb250bWF0dGVyKGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQoZmlsZSksIHtcbiAgICAgICAgICAgIHRlbXBvOiBkYXRhLmJwbS5icG0sXG4gICAgICAgICAgICByYXdfdGVtcG86IGRhdGEuYnBtLnJhd0JwbSxcbiAgICAgICAgICAgIGFsdGVybmF0ZV90ZW1wbzogZGF0YS5icG0uYWx0ZXJuYXRlQnBtLFxuICAgICAgICAgICAgdGVtcG9fY29uZmlybWVkOiBkYXRhLmJwbS5jb25maXJtZWQsXG4gICAgICAgICAgICBrZXk6IGtleURpc3BsYXksXG4gICAgICAgICAgICBrZXlfY29uZmlybWVkOiBkYXRhLmtleS5jb25maXJtZWQsXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBhd2FpdCB0aGlzLmFwcC52YXVsdC5tb2RpZnkoZmlsZSwgdXBkYXRlZCk7XG4gICAgICAgICAgbmV3IE5vdGljZShcIkFuYWx5c2lzIHVwZGF0ZWRcIik7XG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgKS5vcGVuKCk7XG4gIH1cblxuICBwcml2YXRlIGlzQXVkaW9GaWxlKGZpbGU6IFRGaWxlKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIC9cXC4obXAzfHdhdnxmbGFjfGFpZnxvZ2d8bTRhKSQvaS50ZXN0KGZpbGUuZXh0ZW5zaW9uKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgYW5hbHl6ZUluV29ya2VyKFxuICAgIGF1ZGlvQnVmZmVyOiBBcnJheUJ1ZmZlcixcbiAgICBmaWxlTmFtZTogc3RyaW5nLFxuICApOiBQcm9taXNlPEFuYWx5c2lzUmVzdWx0PiB7XG4gICAgaWYgKCF0aGlzLndvcmtlcikge1xuICAgICAgLy8gVGhlIHdvcmtlciBKUyBpcyBidW5kbGVkIHRvIGRpc3Qvd29ya2VyLmpzIGJ5IGVzYnVpbGRcbiAgICAgIGNvbnN0IHdvcmtlclBhdGggPSB0aGlzLmFwcC52YXVsdC5hZGFwdGVyLmdldFJlc291cmNlUGF0aChcbiAgICAgICAgYCR7dGhpcy5tYW5pZmVzdC5kaXJ9L2Rpc3Qvd29ya2VyLmpzYCxcbiAgICAgICk7XG4gICAgICB0aGlzLndvcmtlciA9IG5ldyBXb3JrZXIod29ya2VyUGF0aCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGlkID0gYCR7ZmlsZU5hbWV9LSR7RGF0ZS5ub3coKX1gO1xuICAgICAgY29uc3QgaGFuZGxlciA9IChlOiBNZXNzYWdlRXZlbnQpID0+IHtcbiAgICAgICAgaWYgKGUuZGF0YS5pZCAhPT0gaWQpIHJldHVybjtcbiAgICAgICAgdGhpcy53b3JrZXIhLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGhhbmRsZXIpO1xuICAgICAgICBpZiAoZS5kYXRhLnR5cGUgPT09IFwiZXJyb3JcIikgcmVqZWN0KG5ldyBFcnJvcihlLmRhdGEuZXJyb3IpKTtcbiAgICAgICAgZWxzZSByZXNvbHZlKGUuZGF0YS5yZXN1bHQpO1xuICAgICAgfTtcbiAgICAgIHRoaXMud29ya2VyIS5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBoYW5kbGVyKTtcbiAgICAgIHRoaXMud29ya2VyIS5wb3N0TWVzc2FnZSh7IGlkLCB0eXBlOiBcImFuYWx5emVcIiwgYXVkaW9CdWZmZXIgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHdyaXRlTm90ZShwYXRoOiBzdHJpbmcsIHJlc3VsdDogQW5hbHlzaXNSZXN1bHQsIHNvdXJjZUZpbGU6IHN0cmluZykge1xuICAgIGNvbnN0IGR1cmF0aW9uU3RyID0gdGhpcy5mb3JtYXREdXJhdGlvbihyZXN1bHQuZHVyYXRpb24pO1xuICAgIGNvbnN0IGtleURpc3BsYXkgPSByZXN1bHQucmVsYXRpdmVLZXkgPyBgJHtyZXN1bHQua2V5fSAvICR7cmVzdWx0LnJlbGF0aXZlS2V5fWAgOiByZXN1bHQua2V5O1xuXG4gICAgY29uc3QgY29udGVudCA9IGluamVjdEZyb250bWF0dGVyKFwiXCIsIHtcbiAgICAgIGF1ZGlvX3NvdXJjZTogc291cmNlRmlsZSxcbiAgICAgIGtleToga2V5RGlzcGxheSxcbiAgICAgIGtleV9jb25maXJtZWQ6IGZhbHNlLFxuICAgICAgdGVtcG86IHJlc3VsdC50ZW1wbyxcbiAgICAgIHJhd190ZW1wbzogcmVzdWx0LnJhd1RlbXBvLFxuICAgICAgYWx0ZXJuYXRlX3RlbXBvOiByZXN1bHQuYWx0ZXJuYXRlVGVtcG8sXG4gICAgICB0ZW1wb19jb25maXJtZWQ6IGZhbHNlLFxuICAgICAgZHVyYXRpb246IGR1cmF0aW9uU3RyLFxuICAgIH0pO1xuXG4gICAgY29uc3QgZXhpc3RpbmcgPSB0aGlzLmFwcC52YXVsdC5nZXRGaWxlQnlQYXRoKHBhdGgpO1xuICAgIGlmIChleGlzdGluZykge1xuICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQubW9kaWZ5KGV4aXN0aW5nLCBjb250ZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQuY3JlYXRlKHBhdGgsIGNvbnRlbnQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZm9ybWF0RHVyYXRpb24oc2VjOiBudW1iZXIpOiBzdHJpbmcge1xuICAgIGNvbnN0IG0gPSBNYXRoLmZsb29yKHNlYyAvIDYwKTtcbiAgICBjb25zdCBzID0gTWF0aC5mbG9vcihzZWMgJSA2MCk7XG4gICAgcmV0dXJuIGAke219OiR7cy50b1N0cmluZygpLnBhZFN0YXJ0KDIsIFwiMFwiKX1gO1xuICB9XG59XG5cbi8vIFNpZGUtbm90ZTogZXhwb3NlIGZvciB0eXBlLWNoZWNraW5nIGluIHRlc3RzXG5leHBvcnQgeyBNdXNpY0FuYWx5c2lzUGx1Z2luIH07XG4iLCAiLyoqXG4gKiBTSEEtMjU2IGhhc2ggdXRpbGl0eSBcdTIwMTQgcnVucyBvZmZsaW5lLCB6ZXJvIG5ldHdvcmsuXG4gKi9cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNoYTI1NihidWZmZXI6IEFycmF5QnVmZmVyKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgY29uc3QgaGFzaEJ1ZmZlciA9IGF3YWl0IGNyeXB0by5zdWJ0bGUuZGlnZXN0KFwiU0hBLTI1NlwiLCBidWZmZXIpO1xuICBjb25zdCBoYXNoQXJyYXkgPSBBcnJheS5mcm9tKG5ldyBVaW50OEFycmF5KGhhc2hCdWZmZXIpKTtcbiAgcmV0dXJuIGhhc2hBcnJheS5tYXAoKGIpID0+IGIudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsIFwiMFwiKSkuam9pbihcIlwiKTtcbn1cbiIsICIvKipcbiAqIFlBTUwgZnJvbnRtYXR0ZXIgaW5qZWN0aW9uIHV0aWxpdHkuXG4gKiBOb24tZGVzdHJ1Y3RpdmU6IHByZXNlcnZlcyBleGlzdGluZyBmcm9udG1hdHRlciBhbmQgYm9keSB0ZXh0LlxuICogQURSLTAwMzogSHlicmlkIEFzc2V0IE5vdGVzXG4gKi9cblxuZXhwb3J0IGludGVyZmFjZSBBdWRpb01ldGFkYXRhIHtcbiAgYXVkaW9fc291cmNlPzogc3RyaW5nO1xuICBrZXk/OiBzdHJpbmc7XG4gIGtleV9jb25maXJtZWQ/OiBib29sZWFuO1xuICB0ZW1wbz86IG51bWJlcjtcbiAgdGVtcG9fY29uZmlybWVkPzogYm9vbGVhbjtcbiAgcmF3X3RlbXBvPzogbnVtYmVyO1xuICBhbHRlcm5hdGVfdGVtcG8/OiBudW1iZXI7XG4gIHRpbWVfc2lnbmF0dXJlPzogc3RyaW5nO1xuICBkdXJhdGlvbj86IHN0cmluZztcbiAgdG90YWxfYmFycz86IG51bWJlcjtcbiAgYXVkaW9fc3RhcnRfb2Zmc2V0PzogbnVtYmVyO1xuICBhbmFseXNpc19jb25maWRlbmNlPzogbnVtYmVyOyAgLy8gREVQUkVDQVRFRCBcdTIwMTQgZG8gbm90IGRpc3BsYXkgYXMgdHJ1c3QgbWV0cmljXG4gIHN0cnVjdHVyZT86IEFycmF5PHtcbiAgICBzZWdtZW50OiBzdHJpbmc7XG4gICAgYmFyczogW251bWJlciwgbnVtYmVyXTtcbiAgICB0aW1lOiBbc3RyaW5nLCBzdHJpbmddO1xuICB9PjtcbiAgYXJ0aXN0Pzogc3RyaW5nW107XG4gIHByb2R1Y2VyPzogc3RyaW5nW107XG4gIG1peGVyPzogc3RyaW5nW107XG4gIGVuZ2luZWVyPzogc3RyaW5nW107XG4gIG11c2ljaWFucz86IHN0cmluZ1tdO1xuICBwcm9kdWNlcl9pbnN0YWdyYW0/OiBzdHJpbmdbXTtcbiAgc291cmNlX3VybD86IHN0cmluZztcbiAgbGljZW5zZV9zdGF0dXM/OiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZVZhbHVlKHZhbDogdW5rbm93bik6IHN0cmluZyB7XG4gIGlmIChBcnJheS5pc0FycmF5KHZhbCkpIHtcbiAgICBpZiAodmFsLmxlbmd0aCA9PT0gMCkgcmV0dXJuIFwiW11cIjtcbiAgICByZXR1cm4gXCJcXG5cIiArIHZhbC5tYXAoKHYpID0+IGAgIC0gXCIke1N0cmluZyh2KS5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJyl9XCJgKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsID09PSBcInN0cmluZ1wiKSB7XG4gICAgaWYgKHZhbCA9PT0gXCJcIiB8fCB2YWwuaW5jbHVkZXMoXCI6XCIpIHx8IHZhbC5pbmNsdWRlcyhcIlxcblwiKSkge1xuICAgICAgcmV0dXJuIGBcIiR7dmFsLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKX1cImA7XG4gICAgfVxuICAgIHJldHVybiB2YWw7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWwgPT09IFwibnVtYmVyXCIpIHJldHVybiBTdHJpbmcodmFsKTtcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHZhbCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbmplY3RGcm9udG1hdHRlcihcbiAgY29udGVudDogc3RyaW5nLFxuICBtZXRhZGF0YTogQXVkaW9NZXRhZGF0YSxcbik6IHN0cmluZyB7XG4gIGNvbnN0IGZyb250bWF0dGVyUmVnZXggPSAvXi0tLVxccypcXG4oW1xcc1xcU10qPylcXG4tLS1cXHMqXFxuPy87XG4gIGNvbnN0IG1hdGNoID0gZnJvbnRtYXR0ZXJSZWdleC5leGVjKGNvbnRlbnQpO1xuXG4gIGxldCBleGlzdGluZzogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gPSB7fTtcbiAgbGV0IGJvZHkgPSBjb250ZW50O1xuXG4gIGlmIChtYXRjaCkge1xuICAgIC8vIFBhcnNlIGV4aXN0aW5nIFlBTUwgKG5hXHUwMEVGdmUgXHUyMDE0IHN1ZmZpY2llbnQgZm9yIGZsYXQga2V5cyB3ZSBjb250cm9sKVxuICAgIGNvbnN0IHlhbWxCbG9jayA9IG1hdGNoWzFdO1xuICAgIGZvciAoY29uc3QgbGluZSBvZiB5YW1sQmxvY2suc3BsaXQoXCJcXG5cIikpIHtcbiAgICAgIGNvbnN0IGlkeCA9IGxpbmUuaW5kZXhPZihcIjpcIik7XG4gICAgICBpZiAoaWR4ID4gMCkge1xuICAgICAgICBjb25zdCBrZXkgPSBsaW5lLnNsaWNlKDAsIGlkeCkudHJpbSgpO1xuICAgICAgICBjb25zdCB2YWwgPSBsaW5lLnNsaWNlKGlkeCArIDEpLnRyaW0oKTtcbiAgICAgICAgaWYgKHZhbC5zdGFydHNXaXRoKFwiW1wiKSAmJiB2YWwuZW5kc1dpdGgoXCJdXCIpKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGV4aXN0aW5nW2tleV0gPSBKU09OLnBhcnNlKHZhbCk7XG4gICAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgICBleGlzdGluZ1trZXldID0gdmFsO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBleGlzdGluZ1trZXldID0gdmFsLnJlcGxhY2UoL15bXCInXXxbXCInXSQvZywgXCJcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgYm9keSA9IGNvbnRlbnQuc2xpY2UobWF0Y2hbMF0ubGVuZ3RoKTtcbiAgfVxuXG4gIC8vIE1lcmdlOiBtZXRhZGF0YSB3aW5zIG92ZXIgZXhpc3RpbmcgZm9yIG91ciBrZXlzXG4gIGNvbnN0IG1lcmdlZCA9IHsgLi4uZXhpc3RpbmcsIC4uLm1ldGFkYXRhIH07XG5cbiAgLy8gQnVpbGQgWUFNTFxuICBjb25zdCBsaW5lcyA9IE9iamVjdC5lbnRyaWVzKG1lcmdlZClcbiAgICAuZmlsdGVyKChbLCB2XSkgPT4gdiAhPT0gdW5kZWZpbmVkKVxuICAgIC5tYXAoKFtrLCB2XSkgPT4gYCR7a306ICR7c2VyaWFsaXplVmFsdWUodil9YCk7XG5cbiAgaWYgKGxpbmVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIGNvbnRlbnQ7XG5cbiAgY29uc3QgbmV3RnJvbnQgPSBgLS0tXFxuJHtsaW5lcy5qb2luKFwiXFxuXCIpfVxcbi0tLVxcbmA7XG4gIHJldHVybiBuZXdGcm9udCArIGJvZHk7XG59XG4iLCAiLy8gQW5hbHlzaXNDb25maXJtTW9kYWwgXHUyMDE0IG9wZW5zIG9uLWRlbWFuZCB3aGVuIHVzZXIgY2xpY2tzIGFuIHVuY29uZmlybWVkIHZhbHVlLlxuLy8gVXNlcyBCcG1Db250cm9sICsgS2V5Q29udHJvbCAocmV1c2FibGUgaW4gZGFzaGJvYXJkIGxhdGVyKS5cbi8vXG4vLyBDU1MgY2xhc3MgaG9va3M6XG4vLyAgLm1hbS1jb25maXJtLW1vZGFsICAgICAgIFx1MjAxNCBNb2RhbCByb290XG4vLyAgLm1hbS1tb2RhbC1oZWFkZXIgICAgICAgIFx1MjAxNCBUaXRsZSBhcmVhXG4vLyAgLm1hbS1tb2RhbC1ib2R5ICAgICAgICAgIFx1MjAxNCBDb250cm9scyBjb250YWluZXJcbi8vICAubWFtLW1vZGFsLXNlY3Rpb24gICAgICAgXHUyMDE0IEJQTSAvIEtleSBzZWN0aW9uIHdyYXBwZXJcbi8vICAubWFtLW1vZGFsLXNlY3Rpb24tbGFiZWwgXHUyMDE0IFwiVGVtcG9cIiAvIFwiS2V5XCIgbGFiZWxcbi8vICAubWFtLW1vZGFsLWZvb3RlciAgICAgICAgXHUyMDE0IFNhdmUgLyBDYW5jZWwgYWN0aW9uc1xuLy8gIC5tYW0tYnRuLXNhdmUgICAgICAgICAgICBcdTIwMTQgQ29tbWl0IGNoYW5nZXNcbi8vICAubWFtLWJ0bi1jYW5jZWwgICAgICAgICAgXHUyMDE0IERpc2NhcmQgY2hhbmdlc1xuXG5pbXBvcnQgeyBNb2RhbCwgQXBwIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBCcG1Db250cm9sLCBCcG1Db250cm9sU3RhdGUgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9icG0tY29udHJvbFwiO1xuaW1wb3J0IHsgS2V5Q29udHJvbCwgS2V5Q29udHJvbFN0YXRlIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMva2V5LWNvbnRyb2xcIjtcblxuZXhwb3J0IGludGVyZmFjZSBDb25maXJtTW9kYWxEYXRhIHtcbiAgZmlsZU5hbWU6IHN0cmluZztcbiAgYnBtOiBCcG1Db250cm9sU3RhdGU7XG4gIGtleTogS2V5Q29udHJvbFN0YXRlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENvbmZpcm1Nb2RhbENhbGxiYWNrcyB7XG4gIG9uU2F2ZTogKGRhdGE6IHsgYnBtOiBCcG1Db250cm9sU3RhdGU7IGtleTogS2V5Q29udHJvbFN0YXRlIH0pID0+IHZvaWQ7XG4gIG9uQ2FuY2VsPzogKCkgPT4gdm9pZDtcbn1cblxuZXhwb3J0IGNsYXNzIEFuYWx5c2lzQ29uZmlybU1vZGFsIGV4dGVuZHMgTW9kYWwge1xuICBwcml2YXRlIGRhdGE6IENvbmZpcm1Nb2RhbERhdGE7XG4gIHByaXZhdGUgY2FsbGJhY2tzOiBDb25maXJtTW9kYWxDYWxsYmFja3M7XG4gIHByaXZhdGUgYnBtQ29udHJvbD86IEJwbUNvbnRyb2w7XG4gIHByaXZhdGUga2V5Q29udHJvbD86IEtleUNvbnRyb2w7XG5cbiAgY29uc3RydWN0b3IoYXBwOiBBcHAsIGRhdGE6IENvbmZpcm1Nb2RhbERhdGEsIGNhbGxiYWNrczogQ29uZmlybU1vZGFsQ2FsbGJhY2tzKSB7XG4gICAgc3VwZXIoYXBwKTtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMuY2FsbGJhY2tzID0gY2FsbGJhY2tzO1xuICB9XG5cbiAgb25PcGVuKCkge1xuICAgIGNvbnN0IHsgY29udGVudEVsIH0gPSB0aGlzO1xuICAgIGNvbnRlbnRFbC5hZGRDbGFzcyhcIm1hbS1jb25maXJtLW1vZGFsXCIpO1xuXG4gICAgLy8gSGVhZGVyXG4gICAgY29uc3QgaGVhZGVyID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJtYW0tbW9kYWwtaGVhZGVyXCIgfSk7XG4gICAgaGVhZGVyLmNyZWF0ZUVsKFwiaDJcIiwgeyB0ZXh0OiBgQ29uZmlybSBhbmFseXNpczogJHt0aGlzLmRhdGEuZmlsZU5hbWV9YCB9KTtcbiAgICBoZWFkZXIuY3JlYXRlRWwoXCJwXCIsIHtcbiAgICAgIHRleHQ6IFwiVGFwIG9yIGVkaXQgdmFsdWVzIGJlbG93LiBNYXJrIGNvbmZpcm1lZCBvbmx5IHdoZW4gdGhleSBtYXRjaCB5b3VyIGVhcnMuXCIsXG4gICAgICBjbHM6IFwic2V0dGluZy1pdGVtLWRlc2NyaXB0aW9uXCIsXG4gICAgfSk7XG5cbiAgICBjb25zdCBib2R5ID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJtYW0tbW9kYWwtYm9keVwiIH0pO1xuXG4gICAgLy8gQlBNIHNlY3Rpb25cbiAgICBjb25zdCBicG1TZWN0aW9uID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwibWFtLW1vZGFsLXNlY3Rpb25cIiB9KTtcbiAgICBicG1TZWN0aW9uLmNyZWF0ZUVsKFwiaDNcIiwgeyBjbHM6IFwibWFtLW1vZGFsLXNlY3Rpb24tbGFiZWxcIiwgdGV4dDogXCJUZW1wb1wiIH0pO1xuICAgIHRoaXMuYnBtQ29udHJvbCA9IG5ldyBCcG1Db250cm9sKGJwbVNlY3Rpb24sIHRoaXMuZGF0YS5icG0sIHtcbiAgICAgIG9uQ2hhbmdlOiAoYnBtKSA9PiB7XG4gICAgICAgIC8vIExpdmUgdXBkYXRlIGlmIG5lZWRlZCAoZS5nLiwgc3luYyB3aXRoIG5vdGUgcHJldmlldylcbiAgICAgIH0sXG4gICAgICBvbkNvbmZpcm1lZDogKCkgPT4ge1xuICAgICAgICAvLyBPcHRpb25hbDogYXV0by1lbmFibGUga2V5IGNvbmZpcm0gd2hlbiBib3RoIGFyZSBjbG9zZVxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIEtleSBzZWN0aW9uXG4gICAgY29uc3Qga2V5U2VjdGlvbiA9IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIm1hbS1tb2RhbC1zZWN0aW9uXCIgfSk7XG4gICAga2V5U2VjdGlvbi5jcmVhdGVFbChcImgzXCIsIHsgY2xzOiBcIm1hbS1tb2RhbC1zZWN0aW9uLWxhYmVsXCIsIHRleHQ6IFwiS2V5XCIgfSk7XG4gICAgdGhpcy5rZXlDb250cm9sID0gbmV3IEtleUNvbnRyb2woa2V5U2VjdGlvbiwgdGhpcy5kYXRhLmtleSwge1xuICAgICAgb25DaGFuZ2U6IChrZXksIHNjYWxlKSA9PiB7XG4gICAgICAgIC8vIExpdmUgdXBkYXRlXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gRm9vdGVyOiBTYXZlIC8gQ2FuY2VsXG4gICAgY29uc3QgZm9vdGVyID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJtYW0tbW9kYWwtZm9vdGVyXCIgfSk7XG5cbiAgICBjb25zdCBidG5TYXZlID0gZm9vdGVyLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgY2xzOiBcIm1hbS1idG4tc2F2ZSBtb2QtY3RhXCIsIHRleHQ6IFwiU2F2ZVwiIH0pO1xuICAgIGJ0blNhdmUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIGlmICh0aGlzLmJwbUNvbnRyb2wgJiYgdGhpcy5rZXlDb250cm9sKSB7XG4gICAgICAgIHRoaXMuY2FsbGJhY2tzLm9uU2F2ZSh7XG4gICAgICAgICAgYnBtOiB0aGlzLmJwbUNvbnRyb2wuZ2V0U3RhdGUoKSxcbiAgICAgICAgICBrZXk6IHRoaXMua2V5Q29udHJvbC5nZXRTdGF0ZSgpLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGJ0bkNhbmNlbCA9IGZvb3Rlci5jcmVhdGVFbChcImJ1dHRvblwiLCB7IGNsczogXCJtYW0tYnRuLWNhbmNlbFwiLCB0ZXh0OiBcIkNhbmNlbFwiIH0pO1xuICAgIGJ0bkNhbmNlbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgdGhpcy5jYWxsYmFja3Mub25DYW5jZWw/LigpO1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgb25DbG9zZSgpIHtcbiAgICBjb25zdCB7IGNvbnRlbnRFbCB9ID0gdGhpcztcbiAgICBjb250ZW50RWwuZW1wdHkoKTtcbiAgfVxufVxuIiwgIi8vIFRhcC10ZW1wbyBjb250cm9sbGVyIFx1MjAxNCBhdmVyYWdlcyB0aGUgbGFzdCBOIGludGVyLXRhcCBpbnRlcnZhbHMuXG4vLyBVc2VkIGJ5IEJQTUNvbnRyb2wgKG1vZGFsICsgZGFzaGJvYXJkKS5cblxuZXhwb3J0IGludGVyZmFjZSBUYXBUZW1wb0NhbGxiYWNrcyB7XG4gIG9uQnBtQ2hhbmdlPzogKGJwbTogbnVtYmVyKSA9PiB2b2lkO1xuICBvblRhcD86ICgpID0+IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBUYXBUZW1wb0NvbnRyb2xsZXIge1xuICBwcml2YXRlIHRpbWVzOiBudW1iZXJbXSA9IFtdO1xuICBwcml2YXRlIG1heFRhcHM6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihvcHRzOiB7IG1heFRhcHM/OiBudW1iZXIgfSA9IHt9KSB7XG4gICAgdGhpcy5tYXhUYXBzID0gb3B0cy5tYXhUYXBzID8/IDg7XG4gIH1cblxuICAvKiogQ2FsbCBvbiBldmVyeSB0YXAuIFJldHVybnMgdGhlIGN1cnJlbnQgZXN0aW1hdGVkIEJQTSBvciBudWxsIGlmIG5vdCBlbm91Z2ggZGF0YS4gKi9cbiAgdGFwKCk6IG51bWJlciB8IG51bGwge1xuICAgIGNvbnN0IG5vdyA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIHRoaXMudGltZXMucHVzaChub3cpO1xuXG4gICAgaWYgKHRoaXMudGltZXMubGVuZ3RoID4gdGhpcy5tYXhUYXBzKSB7XG4gICAgICB0aGlzLnRpbWVzLnNoaWZ0KCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudGltZXMubGVuZ3RoIDwgMikgcmV0dXJuIG51bGw7XG5cbiAgICAvLyBVc2UgdGhlIGxhc3QgdXAtdG8tKG1heFRhcHMtMSkgaW50ZXJ2YWxzXG4gICAgY29uc3QgaW50ZXJ2YWxzOiBudW1iZXJbXSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdGhpcy50aW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgaW50ZXJ2YWxzLnB1c2godGhpcy50aW1lc1tpXSAtIHRoaXMudGltZXNbaSAtIDFdKTtcbiAgICB9XG5cbiAgICBjb25zdCBhdmcgPSBpbnRlcnZhbHMucmVkdWNlKChhLCBiKSA9PiBhICsgYiwgMCkgLyBpbnRlcnZhbHMubGVuZ3RoO1xuICAgIGlmIChhdmcgPD0gMCkgcmV0dXJuIG51bGw7XG5cbiAgICBjb25zdCBicG0gPSBNYXRoLnJvdW5kKDYwMDAwIC8gYXZnKTtcbiAgICAvLyBTYW5pdHkgY2xhbXBcbiAgICBpZiAoYnBtIDwgTUlOX1NBTkUgfHwgYnBtID4gTUFYX1NBTkUpIHJldHVybiBudWxsO1xuICAgIHJldHVybiBicG07XG4gIH1cblxuICByZXNldCgpOiB2b2lkIHtcbiAgICB0aGlzLnRpbWVzID0gW107XG4gIH1cbn1cblxuY29uc3QgTUlOX1NBTkUgPSA2MDtcbmNvbnN0IE1BWF9TQU5FID0gMjAwO1xuIiwgIi8vIEJQTUNvbnRyb2wgXHUyMDE0IHJldXNhYmxlIHRlbXBvIHdpZGdldCBmb3IgbW9kYWwgKyBkYXNoYm9hcmQuXG4vLyBDU1MgY2xhc3MgaG9va3MgKGZvciB0aGVtaW5nIGJ5IHVzZXIpOlxuLy8gIC5icG0tY29udHJvbCAgICAgICAgICBcdTIwMTQgcm9vdCBjb250YWluZXJcbi8vICAuYnBtLXZhbHVlICAgICAgICAgICAgXHUyMDE0IGN1cnJlbnQgZGlzcGxheWVkIEJQTVxuLy8gIC5icG0tcmF3ICAgICAgICAgICAgICBcdTIwMTQgcmF3IGRldGVjdCAoc21hbGwsIG11dGVkKVxuLy8gIC5icG0tYWx0ZXJuYXRlICAgICAgICBcdTIwMTQgaGFsZi9kb3VibGUgYWx0ZXJuYXRlIHZhbHVlXG4vLyAgLmJwbS1idG4taGFsdmUgICAgICAgIFx1MjAxNCBoYWx2ZSBidXR0b25cbi8vICAuYnBtLWJ0bi1kb3VibGUgICAgICAgXHUyMDE0IGRvdWJsZSBidXR0b25cbi8vICAuYnBtLWJ0bi10YXAgICAgICAgICAgXHUyMDE0IHRhcC10ZW1wbyBidXR0b25cbi8vICAuYnBtLWJ0bi10YXAtYWN0aXZlICAgXHUyMDE0IHRhcHBlZCByZWNlbnRseSAoYnJpZWYgZmxhc2gpXG4vLyAgLmJwbS1pbnB1dCAgICAgICAgICAgIFx1MjAxNCBtYW51YWwgQlBNIGlucHV0IChpbmxpbmUgZWRpdClcbi8vICAuYnBtLWNvbmZpcm1lZCAgICAgICAgXHUyMDE0IGNvbmZpcm1lZCBzdGF0ZSBmbGFnXG4vLyAgLmJwbS11bmNvbmZpcm1lZCAgICAgIFx1MjAxNCB1bmNvbmZpcm1lZCBzdGF0ZSBmbGFnXG5cbmltcG9ydCB7IFRhcFRlbXBvQ29udHJvbGxlciB9IGZyb20gXCIuL3RhcC10ZW1wb1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEJwbUNvbnRyb2xDYWxsYmFja3Mge1xuICBvbkNoYW5nZT86IChicG06IG51bWJlcikgPT4gdm9pZDtcbiAgb25Db25maXJtZWQ/OiAoY29uZmlybWVkOiBib29sZWFuKSA9PiB2b2lkO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJwbUNvbnRyb2xTdGF0ZSB7XG4gIGJwbTogbnVtYmVyO1xuICByYXdCcG06IG51bWJlcjtcbiAgYWx0ZXJuYXRlQnBtPzogbnVtYmVyO1xuICBjb25maXJtZWQ6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBjbGFzcyBCcG1Db250cm9sIHtcbiAgcHJpdmF0ZSBjb250YWluZXI6IEhUTUxFbGVtZW50O1xuICBwcml2YXRlIHN0YXRlOiBCcG1Db250cm9sU3RhdGU7XG4gIHByaXZhdGUgY2FsbGJhY2tzOiBCcG1Db250cm9sQ2FsbGJhY2tzO1xuICBwcml2YXRlIHRhcENvbnRyb2xsZXI6IFRhcFRlbXBvQ29udHJvbGxlcjtcbiAgcHJpdmF0ZSB0YXBGbGFzaFRpbWVvdXQ/OiBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0PjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwYXJlbnQ6IEhUTUxFbGVtZW50LFxuICAgIGluaXRpYWw6IEJwbUNvbnRyb2xTdGF0ZSxcbiAgICBjYWxsYmFja3M6IEJwbUNvbnRyb2xDYWxsYmFja3MgPSB7fSxcbiAgKSB7XG4gICAgdGhpcy5zdGF0ZSA9IHsgLi4uaW5pdGlhbCB9O1xuICAgIHRoaXMuY2FsbGJhY2tzID0gY2FsbGJhY2tzO1xuICAgIHRoaXMudGFwQ29udHJvbGxlciA9IG5ldyBUYXBUZW1wb0NvbnRyb2xsZXIoeyBtYXhUYXBzOiA4IH0pO1xuICAgIHRoaXMuY29udGFpbmVyID0gdGhpcy5idWlsZChwYXJlbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBidWlsZChwYXJlbnQ6IEhUTUxFbGVtZW50KTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IHJvb3QgPSBwYXJlbnQuY3JlYXRlRGl2KHsgY2xzOiBcImJwbS1jb250cm9sXCIgfSk7XG5cbiAgICAvLyBWYWx1ZSByb3c6IGN1cnJlbnQgQlBNICsgcmF3IEJQTVxuICAgIGNvbnN0IHZhbHVlUm93ID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwiYnBtLXZhbHVlLXJvd1wiIH0pO1xuICAgIHRoaXMucmVuZGVyVmFsdWUodmFsdWVSb3cpO1xuXG4gICAgLy8gQWx0ZXJuYXRlIHN1Z2dlc3Rpb25cbiAgICBpZiAodGhpcy5zdGF0ZS5hbHRlcm5hdGVCcG0pIHtcbiAgICAgIGNvbnN0IGFsdCA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcImJwbS1hbHRlcm5hdGUtcm93XCIgfSk7XG4gICAgICBjb25zdCBhbHRCdG4gPSBhbHQuY3JlYXRlRWwoXCJidXR0b25cIiwge1xuICAgICAgICBjbHM6IFwiYnBtLWFsdGVybmF0ZVwiLFxuICAgICAgICB0ZXh0OiBgb3IgJHt0aGlzLnN0YXRlLmFsdGVybmF0ZUJwbX0/YCxcbiAgICAgIH0pO1xuICAgICAgYWx0QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLmFjY2VwdEFsdGVybmF0ZSgpKTtcbiAgICB9XG5cbiAgICAvLyBBY3Rpb24gcm93OiBoYWx2ZSB8IGRvdWJsZSB8IHRhcFxuICAgIGNvbnN0IGFjdGlvbnMgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJicG0tYWN0aW9uc1wiIH0pO1xuXG4gICAgY29uc3QgYnRuSGFsdmUgPSBhY3Rpb25zLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgY2xzOiBcImJwbS1idG4taGFsdmVcIiwgdGV4dDogXCJcdTAwQkRcIiB9KTtcbiAgICBidG5IYWx2ZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5zZXRCcG0oTWF0aC5yb3VuZCh0aGlzLnN0YXRlLmJwbSAvIDIpKSk7XG5cbiAgICBjb25zdCBidG5Eb3VibGUgPSBhY3Rpb25zLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgY2xzOiBcImJwbS1idG4tZG91YmxlXCIsIHRleHQ6IFwiXHUwMEQ3MlwiIH0pO1xuICAgIGJ0bkRvdWJsZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5zZXRCcG0odGhpcy5zdGF0ZS5icG0gKiAyKSk7XG5cbiAgICBjb25zdCBidG5UYXAgPSBhY3Rpb25zLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgY2xzOiBcImJwbS1idG4tdGFwXCIsIHRleHQ6IFwiVGFwIHRlbXBvXCIgfSk7XG4gICAgYnRuVGFwLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLm9uVGFwKGJ0blRhcCkpO1xuXG4gICAgLy8gQ29uZmlybSB0b2dnbGVcbiAgICBjb25zdCBjb25maXJtUm93ID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwiYnBtLWNvbmZpcm0tcm93XCIgfSk7XG4gICAgY29uc3QgY29uZmlybUNiID0gY29uZmlybVJvdy5jcmVhdGVFbChcImlucHV0XCIsIHsgdHlwZTogXCJjaGVja2JveFwiIH0pO1xuICAgIGNvbmZpcm1DYi5jaGVja2VkID0gdGhpcy5zdGF0ZS5jb25maXJtZWQ7XG4gICAgY29uZmlybUNiLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xuICAgICAgdGhpcy5zdGF0ZS5jb25maXJtZWQgPSBjb25maXJtQ2IuY2hlY2tlZDtcbiAgICAgIHRoaXMucmVmcmVzaENvbmZpcm1lZFN0YXRlKHJvb3QpO1xuICAgICAgdGhpcy5jYWxsYmFja3Mub25Db25maXJtZWQ/Lih0aGlzLnN0YXRlLmNvbmZpcm1lZCk7XG4gICAgfSk7XG4gICAgY29uZmlybVJvdy5jcmVhdGVTcGFuKHsgdGV4dDogXCIgVGVtcG8gY29uZmlybWVkXCIgfSk7XG4gICAgdGhpcy5yZWZyZXNoQ29uZmlybWVkU3RhdGUocm9vdCk7XG5cbiAgICByZXR1cm4gcm9vdDtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyVmFsdWUoY29udGFpbmVyOiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnRhaW5lci5lbXB0eSgpO1xuICAgIGNvbnN0IGRpc3BsYXkgPSBjb250YWluZXIuY3JlYXRlU3Bhbih7IGNsczogXCJicG0tdmFsdWVcIiwgdGV4dDogU3RyaW5nKHRoaXMuc3RhdGUuYnBtKSB9KTtcbiAgICBkaXNwbGF5LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLnN0YXJ0SW5saW5lRWRpdChkaXNwbGF5KSk7XG5cbiAgICBjb250YWluZXIuY3JlYXRlU3Bhbih7IGNsczogXCJicG0tcmF3XCIsIHRleHQ6IGAgKHJhdyAke3RoaXMuc3RhdGUucmF3QnBtfSlgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGFydElubGluZUVkaXQoZWw6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgaW5wdXQudHlwZSA9IFwibnVtYmVyXCI7XG4gICAgaW5wdXQudmFsdWUgPSBTdHJpbmcodGhpcy5zdGF0ZS5icG0pO1xuICAgIGlucHV0LmNsYXNzTmFtZSA9IFwiYnBtLWlucHV0XCI7XG4gICAgaW5wdXQubWluID0gXCI0MFwiO1xuICAgIGlucHV0Lm1heCA9IFwiMzAwXCI7XG5cbiAgICBlbC5yZXBsYWNlV2l0aChpbnB1dCk7XG4gICAgaW5wdXQuZm9jdXMoKTtcbiAgICBpbnB1dC5zZWxlY3QoKTtcblxuICAgIGNvbnN0IGNvbW1pdCA9ICgpID0+IHtcbiAgICAgIGNvbnN0IHZhbCA9IHBhcnNlSW50KGlucHV0LnZhbHVlLCAxMCk7XG4gICAgICBpZiAoIWlzTmFOKHZhbCkgJiYgdmFsID49IDQwICYmIHZhbCA8PSAzMDApIHtcbiAgICAgICAgdGhpcy5zZXRCcG0odmFsKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucmVmcmVzaFZhbHVlKCk7XG4gICAgfTtcblxuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsIGNvbW1pdCk7XG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGUpID0+IHtcbiAgICAgIGlmIChlLmtleSA9PT0gXCJFbnRlclwiKSBjb21taXQoKTtcbiAgICAgIGlmIChlLmtleSA9PT0gXCJFc2NhcGVcIikgdGhpcy5yZWZyZXNoVmFsdWUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgcmVmcmVzaFZhbHVlKCkge1xuICAgIGNvbnN0IHJvdyA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCIuYnBtLXZhbHVlLXJvd1wiKSBhcyBIVE1MRWxlbWVudDtcbiAgICBpZiAocm93KSB0aGlzLnJlbmRlclZhbHVlKHJvdyk7XG4gIH1cblxuICBwcml2YXRlIHNldEJwbShicG06IG51bWJlcikge1xuICAgIHRoaXMuc3RhdGUuYnBtID0gYnBtO1xuICAgIC8vIFJlY29tcHV0ZSBhbHRlcm5hdGUgZnJvbSBuZXcgZGlzcGxheWVkIHZhbHVlXG4gICAgY29uc3QgZG91YmxlZCA9IGJwbSAqIDI7XG4gICAgY29uc3QgaGFsdmVkID0gTWF0aC5yb3VuZChicG0gLyAyKTtcbiAgICBpZiAoZG91YmxlZCA8PSAyMDAgJiYgZG91YmxlZCAhPT0gYnBtKSB7XG4gICAgICB0aGlzLnN0YXRlLmFsdGVybmF0ZUJwbSA9IGRvdWJsZWQ7XG4gICAgfSBlbHNlIGlmIChoYWx2ZWQgPj0gNjAgJiYgaGFsdmVkICE9PSBicG0pIHtcbiAgICAgIHRoaXMuc3RhdGUuYWx0ZXJuYXRlQnBtID0gaGFsdmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0YXRlLmFsdGVybmF0ZUJwbSA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgdGhpcy5yZWZyZXNoVmFsdWUoKTtcbiAgICB0aGlzLnJlZnJlc2hBbHRlcm5hdGUoKTtcbiAgICB0aGlzLmNhbGxiYWNrcy5vbkNoYW5nZT8uKHRoaXMuc3RhdGUuYnBtKTtcbiAgfVxuXG4gIHByaXZhdGUgYWNjZXB0QWx0ZXJuYXRlKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmFsdGVybmF0ZUJwbSkge1xuICAgICAgdGhpcy5zZXRCcG0odGhpcy5zdGF0ZS5hbHRlcm5hdGVCcG0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVmcmVzaEFsdGVybmF0ZSgpIHtcbiAgICBjb25zdCBleGlzdGluZyA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCIuYnBtLWFsdGVybmF0ZS1yb3dcIik7XG4gICAgaWYgKGV4aXN0aW5nKSBleGlzdGluZy5yZW1vdmUoKTtcblxuICAgIGlmICh0aGlzLnN0YXRlLmFsdGVybmF0ZUJwbSkge1xuICAgICAgY29uc3QgYWN0aW9ucyA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCIuYnBtLWFjdGlvbnNcIikgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICBjb25zdCBhbHQgPSB0aGlzLmNvbnRhaW5lci5jcmVhdGVEaXYoeyBjbHM6IFwiYnBtLWFsdGVybmF0ZS1yb3dcIiB9KTtcbiAgICAgIGlmIChhY3Rpb25zKSB0aGlzLmNvbnRhaW5lci5pbnNlcnRCZWZvcmUoYWx0LCBhY3Rpb25zKTtcbiAgICAgIGVsc2UgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoYWx0KTtcblxuICAgICAgY29uc3QgYnRuID0gYWx0LmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHtcbiAgICAgICAgY2xzOiBcImJwbS1hbHRlcm5hdGVcIixcbiAgICAgICAgdGV4dDogYG9yICR7dGhpcy5zdGF0ZS5hbHRlcm5hdGVCcG19P2AsXG4gICAgICB9KTtcbiAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5hY2NlcHRBbHRlcm5hdGUoKSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBvblRhcChidG46IEhUTUxCdXR0b25FbGVtZW50KSB7XG4gICAgY29uc3QgYnBtID0gdGhpcy50YXBDb250cm9sbGVyLnRhcCgpO1xuXG4gICAgLy8gRmxhc2ggdGhlIGJ1dHRvblxuICAgIGJ0bi5jbGFzc0xpc3QuYWRkKFwiYnBtLWJ0bi10YXAtYWN0aXZlXCIpO1xuICAgIGNsZWFyVGltZW91dCh0aGlzLnRhcEZsYXNoVGltZW91dCk7XG4gICAgdGhpcy50YXBGbGFzaFRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IGJ0bi5jbGFzc0xpc3QucmVtb3ZlKFwiYnBtLWJ0bi10YXAtYWN0aXZlXCIpLCAxNTApO1xuXG4gICAgaWYgKGJwbSAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5zZXRCcG0oYnBtKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlZnJlc2hDb25maXJtZWRTdGF0ZShyb290OiBIVE1MRWxlbWVudCkge1xuICAgIHJvb3QuY2xhc3NMaXN0LnRvZ2dsZShcImJwbS1jb25maXJtZWRcIiwgdGhpcy5zdGF0ZS5jb25maXJtZWQpO1xuICAgIHJvb3QuY2xhc3NMaXN0LnRvZ2dsZShcImJwbS11bmNvbmZpcm1lZFwiLCAhdGhpcy5zdGF0ZS5jb25maXJtZWQpO1xuICB9XG5cbiAgZ2V0U3RhdGUoKTogQnBtQ29udHJvbFN0YXRlIHtcbiAgICByZXR1cm4geyAuLi50aGlzLnN0YXRlIH07XG4gIH1cblxuICBtb3VudChwYXJlbnQ6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gICAgcGFyZW50LmFwcGVuZENoaWxkKHRoaXMuY29udGFpbmVyKTtcbiAgfVxuXG4gIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5jb250YWluZXIucmVtb3ZlKCk7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGFwRmxhc2hUaW1lb3V0KTtcbiAgfVxufVxuIiwgIi8vIEtleUNvbnRyb2wgXHUyMDE0IHJldXNhYmxlIGtleSB3aWRnZXQgZm9yIG1vZGFsICsgZGFzaGJvYXJkLlxuLy8gQ1NTIGNsYXNzIGhvb2tzIChmb3IgdGhlbWluZyBieSB1c2VyKTpcbi8vICAua2V5LWNvbnRyb2wgICAgICAgICAgICBcdTIwMTQgcm9vdCBjb250YWluZXJcbi8vICAua2V5LXZhbHVlICAgICAgICAgICAgICBcdTIwMTQgY3VycmVudCBkaXNwbGF5ZWQga2V5IChlLmcuIFwiQyMgbWlub3JcIilcbi8vICAua2V5LXJlbGF0aXZlICAgICAgICAgICBcdTIwMTQgcmVsYXRpdmUgbWFqb3IvbWlub3IgZGlzcGxheVxuLy8gIC5rZXktYnRuLXNlbWl0b25lLXVwICAgIFx1MjAxNCArMSBzZW1pdG9uZSBidXR0b25cbi8vICAua2V5LWJ0bi1zZW1pdG9uZS1kb3duICBcdTIwMTQgLTEgc2VtaXRvbmUgYnV0dG9uXG4vLyAgLmtleS1idG4tbW9kZS10b2dnbGUgICAgXHUyMDE0IG1ham9yL21pbm9yIHRvZ2dsZVxuLy8gIC5rZXktYnRuLXJlbGF0aXZlICAgICAgIFx1MjAxNCBqdW1wIHRvIHJlbGF0aXZlIGtleVxuLy8gIC5rZXktY29uZmlybWVkICAgICAgICAgIFx1MjAxNCBjb25maXJtZWQgc3RhdGUgZmxhZ1xuLy8gIC5rZXktdW5jb25maXJtZWQgICAgICAgIFx1MjAxNCB1bmNvbmZpcm1lZCBzdGF0ZSBmbGFnXG5cbmNvbnN0IENIUk9NQVRJQyA9IFtcIkNcIiwgXCJDI1wiLCBcIkRcIiwgXCJEI1wiLCBcIkVcIiwgXCJGXCIsIFwiRiNcIiwgXCJHXCIsIFwiRyNcIiwgXCJBXCIsIFwiQSNcIiwgXCJCXCJdO1xuXG4vLyBNaW5vciBcdTIxOTIgcmVsYXRpdmUgbWFqb3JcbmNvbnN0IFJFTEFUSVZFX01BSk9SOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICBBbTogXCJDXCIsIEVtOiBcIkdcIiwgQm06IFwiRFwiLCBcIkYjbVwiOiBcIkFcIiwgXCJDI21cIjogXCJFXCIsXG4gIFwiRyNtXCI6IFwiQlwiLCBcIkQjbVwiOiBcIkYjXCIsIFwiQSNtXCI6IFwiQyNcIiwgRG06IFwiRlwiLFxuICBHbTogXCJCYlwiLCBDbTogXCJFYlwiLCBGbTogXCJBYlwiLFxufTtcblxuLy8gTWFqb3IgXHUyMTkyIHJlbGF0aXZlIG1pbm9yXG5jb25zdCBSRUxBVElWRV9NSU5PUjogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IE9iamVjdC5mcm9tRW50cmllcyhcbiAgT2JqZWN0LmVudHJpZXMoUkVMQVRJVkVfTUFKT1IpLm1hcCgoW2ssIHZdKSA9PiBbdiwga10pLFxuKTtcblxuZXhwb3J0IGludGVyZmFjZSBLZXlDb250cm9sQ2FsbGJhY2tzIHtcbiAgb25DaGFuZ2U/OiAoa2V5OiBzdHJpbmcsIHNjYWxlOiBzdHJpbmcpID0+IHZvaWQ7XG4gIG9uQ29uZmlybWVkPzogKGNvbmZpcm1lZDogYm9vbGVhbikgPT4gdm9pZDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBLZXlDb250cm9sU3RhdGUge1xuICBrZXk6IHN0cmluZzsgICAgLy8gZS5nLiBcIkMjXCIgKHdpdGhvdXQgbSBzdWZmaXgpXG4gIHNjYWxlOiBzdHJpbmc7ICAvLyBcIm1pbm9yXCIgfCBcIm1ham9yXCJcbiAgcmVsYXRpdmVLZXk/OiBzdHJpbmc7XG4gIGNvbmZpcm1lZDogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNsYXNzIEtleUNvbnRyb2wge1xuICBwcml2YXRlIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XG4gIHByaXZhdGUgc3RhdGU6IEtleUNvbnRyb2xTdGF0ZTtcbiAgcHJpdmF0ZSBjYWxsYmFja3M6IEtleUNvbnRyb2xDYWxsYmFja3M7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcGFyZW50OiBIVE1MRWxlbWVudCxcbiAgICBpbml0aWFsOiBLZXlDb250cm9sU3RhdGUsXG4gICAgY2FsbGJhY2tzOiBLZXlDb250cm9sQ2FsbGJhY2tzID0ge30sXG4gICkge1xuICAgIHRoaXMuc3RhdGUgPSB7IC4uLmluaXRpYWwgfTtcbiAgICB0aGlzLmNhbGxiYWNrcyA9IGNhbGxiYWNrcztcbiAgICB0aGlzLmNvbnRhaW5lciA9IHRoaXMuYnVpbGQocGFyZW50KTtcbiAgfVxuXG4gIHByaXZhdGUgYnVpbGQocGFyZW50OiBIVE1MRWxlbWVudCk6IEhUTUxFbGVtZW50IHtcbiAgICBjb25zdCByb290ID0gcGFyZW50LmNyZWF0ZURpdih7IGNsczogXCJrZXktY29udHJvbFwiIH0pO1xuXG4gICAgLy8gVmFsdWUgcm93XG4gICAgY29uc3QgdmFsdWVSb3cgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJrZXktdmFsdWUtcm93XCIgfSk7XG4gICAgdGhpcy5yZW5kZXJWYWx1ZSh2YWx1ZVJvdyk7XG5cbiAgICAvLyBSZWxhdGl2ZSBrZXkgaGludFxuICAgIHRoaXMucmVuZGVyUmVsYXRpdmUocm9vdCk7XG5cbiAgICAvLyBBY3Rpb24gcm93OiBcdTI2NkQgfCBcdTI2NkYgfCBtb2RlIHRvZ2dsZSB8IHJlbGF0aXZlXG4gICAgY29uc3QgYWN0aW9ucyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcImtleS1hY3Rpb25zXCIgfSk7XG5cbiAgICBjb25zdCBidG5Eb3duID0gYWN0aW9ucy5jcmVhdGVFbChcImJ1dHRvblwiLCB7IGNsczogXCJrZXktYnRuLXNlbWl0b25lLWRvd25cIiwgdGV4dDogXCJcdTI2NkRcIiB9KTtcbiAgICBidG5Eb3duLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLnNoaWZ0U2VtaXRvbmUoLTEpKTtcblxuICAgIGNvbnN0IGJ0blVwID0gYWN0aW9ucy5jcmVhdGVFbChcImJ1dHRvblwiLCB7IGNsczogXCJrZXktYnRuLXNlbWl0b25lLXVwXCIsIHRleHQ6IFwiXHUyNjZGXCIgfSk7XG4gICAgYnRuVXAuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMuc2hpZnRTZW1pdG9uZSgxKSk7XG5cbiAgICBjb25zdCBidG5Nb2RlID0gYWN0aW9ucy5jcmVhdGVFbChcImJ1dHRvblwiLCB7XG4gICAgICBjbHM6IFwia2V5LWJ0bi1tb2RlLXRvZ2dsZVwiLFxuICAgICAgdGV4dDogdGhpcy5zdGF0ZS5zY2FsZSA9PT0gXCJtaW5vclwiID8gXCJtYWpvclwiIDogXCJtaW5vclwiLFxuICAgIH0pO1xuICAgIGJ0bk1vZGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMudG9nZ2xlTW9kZSgpKTtcblxuICAgIGNvbnN0IGJ0blJlbGF0aXZlID0gYWN0aW9ucy5jcmVhdGVFbChcImJ1dHRvblwiLCB7XG4gICAgICBjbHM6IFwia2V5LWJ0bi1yZWxhdGl2ZVwiLFxuICAgICAgdGV4dDogXCJSZWxhdGl2ZVwiLFxuICAgIH0pO1xuICAgIGJ0blJlbGF0aXZlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLmp1bXBUb1JlbGF0aXZlKCkpO1xuXG4gICAgLy8gQ29uZmlybSB0b2dnbGVcbiAgICBjb25zdCBjb25maXJtUm93ID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwia2V5LWNvbmZpcm0tcm93XCIgfSk7XG4gICAgY29uc3QgY29uZmlybUNiID0gY29uZmlybVJvdy5jcmVhdGVFbChcImlucHV0XCIsIHsgdHlwZTogXCJjaGVja2JveFwiIH0pO1xuICAgIGNvbmZpcm1DYi5jaGVja2VkID0gdGhpcy5zdGF0ZS5jb25maXJtZWQ7XG4gICAgY29uZmlybUNiLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xuICAgICAgdGhpcy5zdGF0ZS5jb25maXJtZWQgPSBjb25maXJtQ2IuY2hlY2tlZDtcbiAgICAgIHRoaXMucmVmcmVzaENvbmZpcm1lZFN0YXRlKHJvb3QpO1xuICAgICAgdGhpcy5jYWxsYmFja3Mub25Db25maXJtZWQ/Lih0aGlzLnN0YXRlLmNvbmZpcm1lZCk7XG4gICAgfSk7XG4gICAgY29uZmlybVJvdy5jcmVhdGVTcGFuKHsgdGV4dDogXCIgS2V5IGNvbmZpcm1lZFwiIH0pO1xuICAgIHRoaXMucmVmcmVzaENvbmZpcm1lZFN0YXRlKHJvb3QpO1xuXG4gICAgcmV0dXJuIHJvb3Q7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlclZhbHVlKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQpIHtcbiAgICBjb250YWluZXIuZW1wdHkoKTtcbiAgICBjb25zdCBkaXNwbGF5S2V5ID0gdGhpcy5mb3JtYXRLZXlEaXNwbGF5KHRoaXMuc3RhdGUua2V5LCB0aGlzLnN0YXRlLnNjYWxlKTtcbiAgICBjb25zdCBlbCA9IGNvbnRhaW5lci5jcmVhdGVTcGFuKHsgY2xzOiBcImtleS12YWx1ZVwiLCB0ZXh0OiBkaXNwbGF5S2V5IH0pO1xuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLnN0YXJ0SW5saW5lRWRpdChlbCkpO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJSZWxhdGl2ZShyb290OiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IGV4aXN0aW5nID0gcm9vdC5xdWVyeVNlbGVjdG9yKFwiLmtleS1yZWxhdGl2ZS1yb3dcIik7XG4gICAgaWYgKGV4aXN0aW5nKSBleGlzdGluZy5yZW1vdmUoKTtcblxuICAgIGNvbnN0IHJlbGF0aXZlID0gdGhpcy5jb21wdXRlUmVsYXRpdmUoKTtcbiAgICBpZiAoIXJlbGF0aXZlKSByZXR1cm47XG5cbiAgICBjb25zdCByb3cgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJrZXktcmVsYXRpdmUtcm93XCIgfSk7XG4gICAgLy8gSW5zZXJ0IGJlZm9yZSBhY3Rpb25zXG4gICAgY29uc3QgYWN0aW9ucyA9IHJvb3QucXVlcnlTZWxlY3RvcihcIi5rZXktYWN0aW9uc1wiKTtcbiAgICBpZiAoYWN0aW9ucykgcm9vdC5pbnNlcnRCZWZvcmUocm93LCBhY3Rpb25zKTtcbiAgICBlbHNlIHJvb3QuYXBwZW5kQ2hpbGQocm93KTtcblxuICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcImtleS1yZWxhdGl2ZVwiLCB0ZXh0OiBgUmVsYXRpdmU6ICR7cmVsYXRpdmV9YCB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZm9ybWF0S2V5RGlzcGxheShrZXk6IHN0cmluZywgc2NhbGU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHNjYWxlID09PSBcIm1pbm9yXCIgPyBgJHtrZXl9bWAgOiBrZXk7XG4gIH1cblxuICBwcml2YXRlIHBhcnNlS2V5RGlzcGxheShkaXNwbGF5OiBzdHJpbmcpOiB7IGtleTogc3RyaW5nOyBzY2FsZTogc3RyaW5nIH0ge1xuICAgIGlmIChkaXNwbGF5LmVuZHNXaXRoKFwibVwiKSkge1xuICAgICAgcmV0dXJuIHsga2V5OiBkaXNwbGF5LnNsaWNlKDAsIC0xKSwgc2NhbGU6IFwibWlub3JcIiB9O1xuICAgIH1cbiAgICByZXR1cm4geyBrZXk6IGRpc3BsYXksIHNjYWxlOiBcIm1ham9yXCIgfTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhcnRJbmxpbmVFZGl0KGVsOiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgIGlucHV0LnZhbHVlID0gdGhpcy5mb3JtYXRLZXlEaXNwbGF5KHRoaXMuc3RhdGUua2V5LCB0aGlzLnN0YXRlLnNjYWxlKTtcbiAgICBpbnB1dC5jbGFzc05hbWUgPSBcImtleS1pbnB1dFwiO1xuXG4gICAgZWwucmVwbGFjZVdpdGgoaW5wdXQpO1xuICAgIGlucHV0LmZvY3VzKCk7XG4gICAgaW5wdXQuc2VsZWN0KCk7XG5cbiAgICBjb25zdCBjb21taXQgPSAoKSA9PiB7XG4gICAgICBjb25zdCBwYXJzZWQgPSB0aGlzLnBhcnNlS2V5RGlzcGxheShpbnB1dC52YWx1ZS50cmltKCkpO1xuICAgICAgaWYgKENIUk9NQVRJQy5pbmNsdWRlcyhwYXJzZWQua2V5KSkge1xuICAgICAgICB0aGlzLnN0YXRlLmtleSA9IHBhcnNlZC5rZXk7XG4gICAgICAgIHRoaXMuc3RhdGUuc2NhbGUgPSBwYXJzZWQuc2NhbGU7XG4gICAgICAgIHRoaXMucmVmcmVzaCgpO1xuICAgICAgICB0aGlzLmNhbGxiYWNrcy5vbkNoYW5nZT8uKHRoaXMuc3RhdGUua2V5LCB0aGlzLnN0YXRlLnNjYWxlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgY29tbWl0KTtcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZSkgPT4ge1xuICAgICAgaWYgKGUua2V5ID09PSBcIkVudGVyXCIpIHtcbiAgICAgICAgY29tbWl0KCk7XG4gICAgICAgIGlucHV0LmJsdXIoKTtcbiAgICAgIH1cbiAgICAgIGlmIChlLmtleSA9PT0gXCJFc2NhcGVcIikgdGhpcy5yZWZyZXNoKCk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHNoaWZ0U2VtaXRvbmUoZGVsdGE6IG51bWJlcikge1xuICAgIGNvbnN0IGlkeCA9IENIUk9NQVRJQy5pbmRleE9mKHRoaXMuc3RhdGUua2V5KTtcbiAgICBpZiAoaWR4ID09PSAtMSkgcmV0dXJuO1xuICAgIGNvbnN0IG5ld0lkeCA9IChpZHggKyBkZWx0YSArIDEyKSAlIDEyO1xuICAgIHRoaXMuc3RhdGUua2V5ID0gQ0hST01BVElDW25ld0lkeF07XG4gICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgdGhpcy5jYWxsYmFja3Mub25DaGFuZ2U/Lih0aGlzLnN0YXRlLmtleSwgdGhpcy5zdGF0ZS5zY2FsZSk7XG4gIH1cblxuICBwcml2YXRlIHRvZ2dsZU1vZGUoKSB7XG4gICAgdGhpcy5zdGF0ZS5zY2FsZSA9IHRoaXMuc3RhdGUuc2NhbGUgPT09IFwibWlub3JcIiA/IFwibWFqb3JcIiA6IFwibWlub3JcIjtcbiAgICB0aGlzLnJlZnJlc2goKTtcbiAgICB0aGlzLmNhbGxiYWNrcy5vbkNoYW5nZT8uKHRoaXMuc3RhdGUua2V5LCB0aGlzLnN0YXRlLnNjYWxlKTtcbiAgfVxuXG4gIHByaXZhdGUganVtcFRvUmVsYXRpdmUoKSB7XG4gICAgY29uc3QgcmVsYXRpdmUgPSB0aGlzLmNvbXB1dGVSZWxhdGl2ZSh0cnVlKTtcbiAgICBpZiAocmVsYXRpdmUpIHtcbiAgICAgIGNvbnN0IHBhcnNlZCA9IHRoaXMucGFyc2VLZXlEaXNwbGF5KHJlbGF0aXZlKTtcbiAgICAgIHRoaXMuc3RhdGUua2V5ID0gcGFyc2VkLmtleTtcbiAgICAgIHRoaXMuc3RhdGUuc2NhbGUgPSBwYXJzZWQuc2NhbGU7XG4gICAgICB0aGlzLnJlZnJlc2goKTtcbiAgICAgIHRoaXMuY2FsbGJhY2tzLm9uQ2hhbmdlPy4odGhpcy5zdGF0ZS5rZXksIHRoaXMuc3RhdGUuc2NhbGUpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY29tcHV0ZVJlbGF0aXZlKGZvckp1bXAgPSBmYWxzZSk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3QgZGlzcGxheSA9IHRoaXMuZm9ybWF0S2V5RGlzcGxheSh0aGlzLnN0YXRlLmtleSwgdGhpcy5zdGF0ZS5zY2FsZSk7XG4gICAgaWYgKHRoaXMuc3RhdGUuc2NhbGUgPT09IFwibWlub3JcIikge1xuICAgICAgY29uc3QgcmVsID0gUkVMQVRJVkVfTUFKT1JbZGlzcGxheV07XG4gICAgICByZXR1cm4gcmVsIHx8IHVuZGVmaW5lZDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcmVsID0gUkVMQVRJVkVfTUlOT1JbZGlzcGxheV07XG4gICAgICByZXR1cm4gcmVsIHx8IHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlZnJlc2goKSB7XG4gICAgY29uc3QgdmFsUm93ID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcihcIi5rZXktdmFsdWUtcm93XCIpIGFzIEhUTUxFbGVtZW50O1xuICAgIGlmICh2YWxSb3cpIHRoaXMucmVuZGVyVmFsdWUodmFsUm93KTtcbiAgICB0aGlzLnJlbmRlclJlbGF0aXZlKHRoaXMuY29udGFpbmVyKTtcblxuICAgIGNvbnN0IG1vZGVCdG4gPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFwiLmtleS1idG4tbW9kZS10b2dnbGVcIikgYXMgSFRNTEVsZW1lbnQ7XG4gICAgaWYgKG1vZGVCdG4pIG1vZGVCdG4udGV4dENvbnRlbnQgPSB0aGlzLnN0YXRlLnNjYWxlID09PSBcIm1pbm9yXCIgPyBcIm1ham9yXCIgOiBcIm1pbm9yXCI7XG4gIH1cblxuICBwcml2YXRlIHJlZnJlc2hDb25maXJtZWRTdGF0ZShyb290OiBIVE1MRWxlbWVudCkge1xuICAgIHJvb3QuY2xhc3NMaXN0LnRvZ2dsZShcImtleS1jb25maXJtZWRcIiwgdGhpcy5zdGF0ZS5jb25maXJtZWQpO1xuICAgIHJvb3QuY2xhc3NMaXN0LnRvZ2dsZShcImtleS11bmNvbmZpcm1lZFwiLCAhdGhpcy5zdGF0ZS5jb25maXJtZWQpO1xuICB9XG5cbiAgZ2V0U3RhdGUoKTogS2V5Q29udHJvbFN0YXRlIHtcbiAgICByZXR1cm4geyAuLi50aGlzLnN0YXRlIH07XG4gIH1cblxuICBtb3VudChwYXJlbnQ6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gICAgcGFyZW50LmFwcGVuZENoaWxkKHRoaXMuY29udGFpbmVyKTtcbiAgfVxuXG4gIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5jb250YWluZXIucmVtb3ZlKCk7XG4gIH1cbn1cbiIsICIvLyBTdHJ1Y3R1cmVUaW1lbGluZSBcdTIwMTQgbWFudWFsIHNlZ21lbnQgYmFycyB3aXRoIGhvdmVyIHRvb2x0aXAgYW5kIG9mZnNldCBzbGlkZXIuXG4vL1xuLy8gQ1NTIGNsYXNzIGhvb2tzIChmb3IgdGhlbWluZyBieSB1c2VyKTpcbi8vICAubWFtLXRpbWVsaW5lICAgICAgICAgICAgICBcdTIwMTQgcm9vdCBjb250YWluZXJcbi8vICAubWFtLXRpbWVsaW5lLXRyYWNrICAgICAgICBcdTIwMTQgaG9yaXpvbnRhbCBiYXIgdHJhY2tcbi8vICAubWFtLXRpbWVsaW5lLXNlZ21lbnQgICAgICBcdTIwMTQgaW5kaXZpZHVhbCBjb2xvcmVkIGJhclxuLy8gIC5tYW0tdGltZWxpbmUtc2VnbWVudC1sYWJlbFxuLy8gIC5tYW0tdGltZWxpbmUtb2Zmc2V0LXJvdyAgIFx1MjAxNCBzbGlkZXIgKyBsYWJlbCB3cmFwcGVyXG4vLyAgLm1hbS10aW1lbGluZS1vZmZzZXQtbGFiZWxcbi8vICAubWFtLXRpbWVsaW5lLXNsaWRlciAgICAgICBcdTIwMTQgSFRNTCByYW5nZSBpbnB1dFxuLy8gIC5tYW0tdGltZWxpbmUtdG9vbHRpcCAgICAgIFx1MjAxNCBmbG9hdGluZyBob3ZlciB0b29sdGlwIChhYnMgcG9zaXRpb25lZClcbi8vICAubWFtLXRpbWVsaW5lLWVtcHR5ICAgICAgICBcdTIwMTQgbm8tc2VnbWVudHMgc3RhdGVcblxuZXhwb3J0IGludGVyZmFjZSBTdHJ1Y3R1cmVTZWdtZW50IHtcbiAgaWQ6IHN0cmluZztcbiAgbGFiZWw6IHN0cmluZztcbiAgc3RhcnRCYXI6IG51bWJlcjtcbiAgZW5kQmFyOiBudW1iZXI7XG4gIGNvbG9yOiBzdHJpbmc7IC8vIENTUyBjb2xvciB2YWx1ZSAoT2JzaWRpYW4gdmFyIG9yIGxpdGVyYWwpXG59XG5cbmV4cG9ydCBjbGFzcyBTdHJ1Y3R1cmVUaW1lbGluZSB7XG4gIHByaXZhdGUgY29udGFpbmVyOiBIVE1MRWxlbWVudDtcbiAgcHJpdmF0ZSBzZWdtZW50czogU3RydWN0dXJlU2VnbWVudFtdO1xuICBwcml2YXRlIGJwbTogbnVtYmVyO1xuICBwcml2YXRlIG9mZnNldEJhcnM6IG51bWJlcjtcbiAgcHJpdmF0ZSB0cmFja0VsOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHRvb2x0aXBFbDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcblxuICBvbk9mZnNldENoYW5nZT86IChvZmZzZXRCYXJzOiBudW1iZXIpID0+IHZvaWQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcGFyZW50OiBIVE1MRWxlbWVudCxcbiAgICBzZWdtZW50czogU3RydWN0dXJlU2VnbWVudFtdLFxuICAgIGJwbTogbnVtYmVyLFxuICAgIG9mZnNldEJhcnMgPSAwLFxuICApIHtcbiAgICB0aGlzLmNvbnRhaW5lciA9IHBhcmVudC5jcmVhdGVEaXYoeyBjbHM6IFwibWFtLXRpbWVsaW5lXCIgfSk7XG4gICAgdGhpcy5zZWdtZW50cyA9IHNlZ21lbnRzO1xuICAgIHRoaXMuYnBtID0gYnBtO1xuICAgIHRoaXMub2Zmc2V0QmFycyA9IG9mZnNldEJhcnM7XG4gIH1cblxuICBtb3VudCgpOiB2b2lkIHtcbiAgICB0aGlzLmNvbnRhaW5lci5lbXB0eSgpO1xuXG4gICAgaWYgKHRoaXMuc2VnbWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLmNvbnRhaW5lci5jcmVhdGVEaXYoe1xuICAgICAgICBjbHM6IFwibWFtLXRpbWVsaW5lLWVtcHR5XCIsXG4gICAgICAgIHRleHQ6IFwiTm8gc3RydWN0dXJlIGRlZmluZWQuIEFkZCBzZWdtZW50cyB0byBmcm9udG1hdHRlcjogc3RydWN0dXJlOiBbLi4uXVwiLFxuICAgICAgfSk7XG4gICAgICB0aGlzLmJ1aWxkT2Zmc2V0Um93KCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQ29tcHV0ZSB0b3RhbCBzcGFuIChhY2NvdW50aW5nIGZvciBvZmZzZXQgbGVhZC1pbilcbiAgICBjb25zdCB0b3RhbEJhcnMgPSBNYXRoLm1heCguLi50aGlzLnNlZ21lbnRzLm1hcCgocykgPT4gcy5lbmRCYXIpKTtcbiAgICBjb25zdCBlZmZlY3RpdmVUb3RhbCA9IHRvdGFsQmFycyArIHRoaXMub2Zmc2V0QmFycztcblxuICAgIC8vIFRyYWNrIGNvbnRhaW5lclxuICAgIHRoaXMudHJhY2tFbCA9IHRoaXMuY29udGFpbmVyLmNyZWF0ZURpdih7IGNsczogXCJtYW0tdGltZWxpbmUtdHJhY2tcIiB9KTtcblxuICAgIC8vIFJlbmRlciBlYWNoIHNlZ21lbnQgYXMgYW4gYWJzb2x1dGVseS1wb3NpdGlvbmVkIHByb3BvcnRpb25hbCBiYXJcbiAgICB0aGlzLnNlZ21lbnRzLmZvckVhY2goKHNlZykgPT4ge1xuICAgICAgY29uc3QgbGVmdFBjdCA9ICgoc2VnLnN0YXJ0QmFyICsgdGhpcy5vZmZzZXRCYXJzKSAvIGVmZmVjdGl2ZVRvdGFsKSAqIDEwMDtcbiAgICAgIGNvbnN0IHdpZHRoUGN0ID0gKChzZWcuZW5kQmFyIC0gc2VnLnN0YXJ0QmFyKSAvIGVmZmVjdGl2ZVRvdGFsKSAqIDEwMDtcblxuICAgICAgY29uc3QgYmFyID0gdGhpcy50cmFja0VsIS5jcmVhdGVEaXYoeyBjbHM6IFwibWFtLXRpbWVsaW5lLXNlZ21lbnRcIiB9KTtcbiAgICAgIGJhci5zdHlsZS5sZWZ0ID0gYCR7bGVmdFBjdH0lYDtcbiAgICAgIGJhci5zdHlsZS53aWR0aCA9IGAke3dpZHRoUGN0fSVgO1xuICAgICAgYmFyLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHNlZy5jb2xvcjtcbiAgICAgIGJhci5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tbWFtLXNlZ21lbnQtY29sb3JcIiwgc2VnLmNvbG9yKTtcblxuICAgICAgYmFyLmNyZWF0ZVNwYW4oe1xuICAgICAgICBjbHM6IFwibWFtLXRpbWVsaW5lLXNlZ21lbnQtbGFiZWxcIixcbiAgICAgICAgdGV4dDogc2VnLmxhYmVsLFxuICAgICAgfSk7XG5cbiAgICAgIGJhci5hZGRFdmVudExpc3RlbmVyKFwibW91c2VlbnRlclwiLCAoKSA9PiB0aGlzLnNob3dUb29sdGlwKHNlZywgYmFyKSk7XG4gICAgICBiYXIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIiwgKCkgPT4gdGhpcy5oaWRlVG9vbHRpcCgpKTtcbiAgICB9KTtcblxuICAgIHRoaXMuYnVpbGRPZmZzZXRSb3coKTtcbiAgfVxuXG4gIHByaXZhdGUgYnVpbGRPZmZzZXRSb3coKTogdm9pZCB7XG4gICAgY29uc3Qgcm93ID0gdGhpcy5jb250YWluZXIuY3JlYXRlRGl2KHsgY2xzOiBcIm1hbS10aW1lbGluZS1vZmZzZXQtcm93XCIgfSk7XG4gICAgcm93LmNyZWF0ZVNwYW4oe1xuICAgICAgY2xzOiBcIm1hbS10aW1lbGluZS1vZmZzZXQtbGFiZWxcIixcbiAgICAgIHRleHQ6IGBUcmltIGxlYWQtaW46ICR7dGhpcy5vZmZzZXRCYXJzfSBiYXIke3RoaXMub2Zmc2V0QmFycyA9PT0gMSA/IFwiXCIgOiBcInNcIn1gLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc2xpZGVyID0gcm93LmNyZWF0ZUVsKFwiaW5wdXRcIiwgeyB0eXBlOiBcInJhbmdlXCIgfSk7XG4gICAgc2xpZGVyLmNsYXNzTmFtZSA9IFwibWFtLXRpbWVsaW5lLXNsaWRlclwiO1xuICAgIHNsaWRlci5taW4gPSBcIjBcIjtcbiAgICBzbGlkZXIubWF4ID0gU3RyaW5nKE1hdGguY2VpbCh0aGlzLm9mZnNldEJhcnMgKyA0KSk7XG4gICAgc2xpZGVyLnZhbHVlID0gU3RyaW5nKHRoaXMub2Zmc2V0QmFycyk7XG4gICAgc2xpZGVyLnN0ZXAgPSBcIjFcIjtcblxuICAgIHNsaWRlci5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKCkgPT4ge1xuICAgICAgY29uc3QgdmFsID0gcGFyc2VJbnQoc2xpZGVyLnZhbHVlLCAxMCk7XG4gICAgICB0aGlzLm9mZnNldEJhcnMgPSB2YWw7XG4gICAgICAvLyBVcGRhdGUgbGFiZWxcbiAgICAgIGNvbnN0IGxhYmVsID0gcm93LnF1ZXJ5U2VsZWN0b3IoXCIubWFtLXRpbWVsaW5lLW9mZnNldC1sYWJlbFwiKTtcbiAgICAgIGlmIChsYWJlbCkge1xuICAgICAgICBsYWJlbC50ZXh0Q29udGVudCA9IGBUcmltIGxlYWQtaW46ICR7dmFsfSBiYXIke3ZhbCA9PT0gMSA/IFwiXCIgOiBcInNcIn1gO1xuICAgICAgfVxuICAgICAgdGhpcy5vbk9mZnNldENoYW5nZT8uKHZhbCk7XG4gICAgICAvLyBSZS1yZW5kZXIgd2l0aCBuZXcgb2Zmc2V0XG4gICAgICB0aGlzLm1vdW50KCk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHNob3dUb29sdGlwKHNlZzogU3RydWN0dXJlU2VnbWVudCwgYW5jaG9yOiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgIGlmICghdGhpcy50cmFja0VsKSByZXR1cm47XG5cbiAgICB0aGlzLnRvb2x0aXBFbCA9IHRoaXMudHJhY2tFbC5jcmVhdGVEaXYoeyBjbHM6IFwibWFtLXRpbWVsaW5lLXRvb2x0aXBcIiB9KTtcbiAgICBjb25zdCBiZWF0TGVuID0gNjAgLyB0aGlzLmJwbTtcbiAgICBjb25zdCBzdGFydFRpbWUgPSBzZWcuc3RhcnRCYXIgKiA0ICogYmVhdExlbjtcbiAgICBjb25zdCBzdGFydFN0ciA9IHRoaXMuZm9ybWF0VGltZShzdGFydFRpbWUpO1xuICAgIGNvbnN0IGVuZFRpbWUgPSBzZWcuZW5kQmFyICogNCAqIGJlYXRMZW47XG4gICAgY29uc3QgZW5kU3RyID0gdGhpcy5mb3JtYXRUaW1lKGVuZFRpbWUpO1xuXG4gICAgdGhpcy50b29sdGlwRWwuaW5uZXJIVE1MID0gYFxuICAgICAgPHN0cm9uZz4ke3NlZy5sYWJlbH08L3N0cm9uZz48YnIvPlxuICAgICAgQmFycyAke3NlZy5zdGFydEJhcn0gXFx1MjAxMyAke3NlZy5lbmRCYXJ9PGJyLz5cbiAgICAgICR7c3RhcnRTdHJ9IFxcdTIwMTMgJHtlbmRTdHJ9XG4gICAgYDtcblxuICAgIC8vIFBvc2l0aW9uIHRvb2x0aXAgYWJvdmUgdGhlIGhvdmVyZWQgYmFyLCBjZW50ZXJlZFxuICAgIGNvbnN0IHRyYWNrUmVjdCA9IHRoaXMudHJhY2tFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBiYXJSZWN0ID0gYW5jaG9yLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGxlZnQgPSBiYXJSZWN0LmxlZnQgLSB0cmFja1JlY3QubGVmdCArIGJhclJlY3Qud2lkdGggLyAyIC0gNjA7XG4gICAgY29uc3QgdG9wID0gLTQwO1xuICAgIHRoaXMudG9vbHRpcEVsLnN0eWxlLmxlZnQgPSBgJHtsZWZ0fXB4YDtcbiAgICB0aGlzLnRvb2x0aXBFbC5zdHlsZS50b3AgPSBgJHt0b3B9cHhgO1xuICB9XG5cbiAgcHJpdmF0ZSBoaWRlVG9vbHRpcCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy50b29sdGlwRWwpIHtcbiAgICAgIHRoaXMudG9vbHRpcEVsLnJlbW92ZSgpO1xuICAgICAgdGhpcy50b29sdGlwRWwgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZm9ybWF0VGltZShzZWM6IG51bWJlcik6IHN0cmluZyB7XG4gICAgY29uc3QgbSA9IE1hdGguZmxvb3Ioc2VjIC8gNjApO1xuICAgIGNvbnN0IHMgPSBNYXRoLmZsb29yKHNlYyAlIDYwKTtcbiAgICBjb25zdCBtcyA9IE1hdGguZmxvb3IoKHNlYyAlIDEpICogMTAwKTtcbiAgICByZXR1cm4gYCR7bX06JHtzLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgXCIwXCIpfS4ke21zLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgXCIwXCIpfWA7XG4gIH1cblxuICBkZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuY29udGFpbmVyLnJlbW92ZSgpO1xuICB9XG59XG4iLCAiLy8gVHVuZXJOZWVkbGUgXHUyMDE0IGtleS1wb3NpdGlvbiBnYXVnZS4gU3R5bGVkIGJ5IGNvbmZpcm1lZCBzdGF0ZSwgTk9UIGNvbmZpZGVuY2UuXG4vL1xuLy8gQ1NTIGNsYXNzIGhvb2tzIChmb3IgdGhlbWluZyBieSB1c2VyKTpcbi8vICAubWFtLXR1bmVyICAgICAgICAgICAgIFx1MjAxNCByb290IGNvbnRhaW5lclxuLy8gIC5tYW0tdHVuZXItZGlhbCAgICAgICAgXHUyMDE0IGNpcmN1bGFyIGJhY2tncm91bmRcbi8vICAubWFtLXR1bmVyLXRpY2sgICAgICAgIFx1MjAxNCBtYWpvci9taW5vciBwb3NpdGlvbiBtYXJrc1xuLy8gIC5tYW0tdHVuZXItbmVlZGxlICAgICAgXHUyMDE0IGFuaW1hdGVkIHBvaW50ZXJcbi8vICAubWFtLXR1bmVyLW5lZWRsZS1jb25maXJtZWQgICBcdTIwMTQgY29uZmlybWVkIHN0eWxlXG4vLyAgLm1hbS10dW5lci1uZWVkbGUtdW5jb25maXJtZWQgXHUyMDE0IHVuY29uZmlybWVkIHN0eWxlXG4vLyAgLm1hbS10dW5lci1sYWJlbCAgICAgICBcdTIwMTQga2V5IGRpc3BsYXkgYmVsb3cgZGlhbFxuLy8gIC5tYW0tdHVuZXItbGFiZWwtY29uZmlybWVkXG4vLyAgLm1hbS10dW5lci1sYWJlbC11bmNvbmZpcm1lZFxuXG5jb25zdCBDSFJPTUFUSUNfT1JERVIgPSBbXG4gIFwiQ1wiLCBcIkMjXCIsIFwiRFwiLCBcIkQjXCIsIFwiRVwiLCBcIkZcIiwgXCJGI1wiLCBcIkdcIiwgXCJHI1wiLCBcIkFcIiwgXCJBI1wiLCBcIkJcIixcbl07XG5cbmV4cG9ydCBpbnRlcmZhY2UgVHVuZXJOZWVkbGVTdGF0ZSB7XG4gIGtleTogc3RyaW5nOyAgICAgIC8vIGUuZy4gXCJDI1wiXG4gIHNjYWxlOiBzdHJpbmc7ICAgIC8vIFwibWlub3JcIiB8IFwibWFqb3JcIlxuICBjb25maXJtZWQ6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBjbGFzcyBUdW5lck5lZWRsZSB7XG4gIHByaXZhdGUgY29udGFpbmVyOiBIVE1MRWxlbWVudDtcbiAgcHJpdmF0ZSBzdGF0ZTogVHVuZXJOZWVkbGVTdGF0ZTtcbiAgcHJpdmF0ZSBuZWVkbGVFbDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcblxuICBjb25zdHJ1Y3RvcihwYXJlbnQ6IEhUTUxFbGVtZW50LCBpbml0aWFsOiBUdW5lck5lZWRsZVN0YXRlKSB7XG4gICAgdGhpcy5zdGF0ZSA9IHsgLi4uaW5pdGlhbCB9O1xuICAgIHRoaXMuY29udGFpbmVyID0gcGFyZW50LmNyZWF0ZURpdih7IGNsczogXCJtYW0tdHVuZXJcIiB9KTtcbiAgfVxuXG4gIG1vdW50KCk6IHZvaWQge1xuICAgIHRoaXMuY29udGFpbmVyLmVtcHR5KCk7XG5cbiAgICBjb25zdCBkaWFsID0gdGhpcy5jb250YWluZXIuY3JlYXRlRGl2KHsgY2xzOiBcIm1hbS10dW5lci1kaWFsXCIgfSk7XG5cbiAgICAvLyBSZW5kZXIgcG9zaXRpb24gdGlja3MgZm9yIGVhY2ggY2hyb21hdGljIG5vdGVcbiAgICBDSFJPTUFUSUNfT1JERVIuZm9yRWFjaCgobm90ZSwgaSkgPT4ge1xuICAgICAgY29uc3QgYW5nbGUgPSAoaSAvIDEyKSAqIDM2MDtcbiAgICAgIGNvbnN0IHRpY2sgPSBkaWFsLmNyZWF0ZURpdih7IGNsczogXCJtYW0tdHVuZXItdGlja1wiIH0pO1xuICAgICAgLy8gQ1NTIHRyYW5zZm9ybSBoYW5kbGVzIHBvc2l0aW9uaW5nIHZpYSB0cmFuc2Zvcm06IHJvdGF0ZShhbmdsZSkgdHJhbnNsYXRlWShyYWRpdXMpXG4gICAgICB0aWNrLnNldEF0dHJpYnV0ZShcImRhdGEtbm90ZVwiLCBub3RlKTtcbiAgICAgIHRpY2suc3R5bGUudHJhbnNmb3JtID0gYHJvdGF0ZSgke2FuZ2xlfWRlZykgdHJhbnNsYXRlWSgtNDVweClgO1xuICAgIH0pO1xuXG4gICAgLy8gTmVlZGxlXG4gICAgdGhpcy5uZWVkbGVFbCA9IGRpYWwuY3JlYXRlRGl2KHtcbiAgICAgIGNsczogYG1hbS10dW5lci1uZWVkbGUgJHtcbiAgICAgICAgdGhpcy5zdGF0ZS5jb25maXJtZWRcbiAgICAgICAgICA/IFwibWFtLXR1bmVyLW5lZWRsZS1jb25maXJtZWRcIlxuICAgICAgICAgIDogXCJtYW0tdHVuZXItbmVlZGxlLXVuY29uZmlybWVkXCJcbiAgICAgIH1gLFxuICAgIH0pO1xuICAgIHRoaXMuc2V0TmVlZGxlQW5nbGUodGhpcy5zdGF0ZS5rZXkpO1xuXG4gICAgLy8gTGFiZWxcbiAgICBjb25zdCBsYWJlbCA9IHRoaXMuY29udGFpbmVyLmNyZWF0ZURpdih7XG4gICAgICBjbHM6IGBtYW0tdHVuZXItbGFiZWwgJHtcbiAgICAgICAgdGhpcy5zdGF0ZS5jb25maXJtZWRcbiAgICAgICAgICA/IFwibWFtLXR1bmVyLWxhYmVsLWNvbmZpcm1lZFwiXG4gICAgICAgICAgOiBcIm1hbS10dW5lci1sYWJlbC11bmNvbmZpcm1lZFwiXG4gICAgICB9YCxcbiAgICAgIHRleHQ6IHRoaXMuZm9ybWF0S2V5RGlzcGxheSgpLFxuICAgIH0pO1xuICB9XG5cbiAgdXBkYXRlKHN0YXRlOiBUdW5lck5lZWRsZVN0YXRlKTogdm9pZCB7XG4gICAgdGhpcy5zdGF0ZSA9IHsgLi4uc3RhdGUgfTtcbiAgICB0aGlzLnNldE5lZWRsZUFuZ2xlKHRoaXMuc3RhdGUua2V5KTtcbiAgICBpZiAodGhpcy5uZWVkbGVFbCkge1xuICAgICAgdGhpcy5uZWVkbGVFbC5jbGFzc05hbWUgPSBgbWFtLXR1bmVyLW5lZWRsZSAke1xuICAgICAgICB0aGlzLnN0YXRlLmNvbmZpcm1lZFxuICAgICAgICAgID8gXCJtYW0tdHVuZXItbmVlZGxlLWNvbmZpcm1lZFwiXG4gICAgICAgICAgOiBcIm1hbS10dW5lci1uZWVkbGUtdW5jb25maXJtZWRcIlxuICAgICAgfWA7XG4gICAgfVxuICAgIGNvbnN0IGxhYmVsID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcihcIi5tYW0tdHVuZXItbGFiZWxcIik7XG4gICAgaWYgKGxhYmVsKSB7XG4gICAgICBsYWJlbC5jbGFzc05hbWUgPSBgbWFtLXR1bmVyLWxhYmVsICR7XG4gICAgICAgIHRoaXMuc3RhdGUuY29uZmlybWVkXG4gICAgICAgICAgPyBcIm1hbS10dW5lci1sYWJlbC1jb25maXJtZWRcIlxuICAgICAgICAgIDogXCJtYW0tdHVuZXItbGFiZWwtdW5jb25maXJtZWRcIlxuICAgICAgfWA7XG4gICAgICBsYWJlbC50ZXh0Q29udGVudCA9IHRoaXMuZm9ybWF0S2V5RGlzcGxheSgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc2V0TmVlZGxlQW5nbGUoa2V5OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBpZHggPSBDSFJPTUFUSUNfT1JERVIuaW5kZXhPZihrZXkpO1xuICAgIGlmIChpZHggPT09IC0xKSByZXR1cm47XG4gICAgY29uc3QgYW5nbGUgPSAoaWR4IC8gMTIpICogMzYwO1xuICAgIGlmICh0aGlzLm5lZWRsZUVsKSB7XG4gICAgICB0aGlzLm5lZWRsZUVsLnN0eWxlLnRyYW5zZm9ybSA9IGByb3RhdGUoJHthbmdsZX1kZWcpYDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGZvcm1hdEtleURpc3BsYXkoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5zY2FsZSA9PT0gXCJtaW5vclwiXG4gICAgICA/IGAke3RoaXMuc3RhdGUua2V5fW1gXG4gICAgICA6IHRoaXMuc3RhdGUua2V5O1xuICB9XG5cbiAgZGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmNvbnRhaW5lci5yZW1vdmUoKTtcbiAgfVxufVxuIiwgIi8vIENhbWVsb3RXaGVlbCBcdTIwMTQgaW50ZXJhY3RpdmUgaGFybW9uaWMtbWl4aW5nIGd1aWRlLlxuLy8gQ2xpY2sgYW55IGtleSBcdTIxOTIgY2xpcGJvYXJkIGdldHMgYSBEYXRhdmlldyBxdWVyeSBmb3IgdGhhdCBrZXkuXG4vL1xuLy8gQ1NTIGNsYXNzIGhvb2tzIChmb3IgdGhlbWluZyBieSB1c2VyKTpcbi8vICAubWFtLWNhbWVsb3QgICAgICAgICAgICAgIFx1MjAxNCByb290IGNvbnRhaW5lclxuLy8gIC5tYW0tY2FtZWxvdC13aGVlbCAgICAgICAgXHUyMDE0IG91dGVyIHJpbmdcbi8vICAubWFtLWNhbWVsb3QtaW5uZXIgICAgICAgIFx1MjAxNCBpbm5lciByaW5nIChtaW5vcilcbi8vICAubWFtLWNhbWVsb3Qta2V5ICAgICAgICAgIFx1MjAxNCBldmVyeSBrZXkgc2xvdFxuLy8gIC5tYW0tY2FtZWxvdC1rZXktbWFqb3IgICAgXHUyMDE0IG91dGVyLXJpbmcga2V5c1xuLy8gIC5tYW0tY2FtZWxvdC1rZXktbWlub3IgICAgXHUyMDE0IGlubmVyLXJpbmcga2V5c1xuLy8gIC5tYW0tY2FtZWxvdC1jdXJyZW50ICAgICAgXHUyMDE0IHRoZSBjdXJyZW50bHkgZGV0ZWN0ZWQvY29uZmlybWVkIGtleVxuLy8gIC5tYW0tY2FtZWxvdC1jb21wYXRpYmxlICAgXHUyMDE0IGhhcm1vbmljYWxseSBjb21wYXRpYmxlIG5laWdoYm9yc1xuLy8gIC5tYW0tY2FtZWxvdC1sYWJlbCAgICAgICAgXHUyMDE0IHRleHQgaW5zaWRlIGVhY2ggc2xvdFxuLy8gIC5tYW0tY2FtZWxvdC1sZWdlbmQgICAgICAgXHUyMDE0IGJvdHRvbSBsZWdlbmQgbGluZVxuXG5leHBvcnQgdHlwZSBDYW1lbG90S2V5ID0gc3RyaW5nOyAvLyBlLmcuIFwiMUFcIiwgXCI4QlwiXG5cbmNvbnN0IE1BSk9SX0tFWVM6IENhbWVsb3RLZXlbXSA9IFtcbiAgXCIxQlwiLCBcIjJCXCIsIFwiM0JcIiwgXCI0QlwiLCBcIjVCXCIsIFwiNkJcIiwgXCI3QlwiLCBcIjhCXCIsIFwiOUJcIiwgXCIxMEJcIiwgXCIxMUJcIiwgXCIxMkJcIixcbl07XG5jb25zdCBNSU5PUl9LRVlTOiBDYW1lbG90S2V5W10gPSBbXG4gIFwiMUFcIiwgXCIyQVwiLCBcIjNBXCIsIFwiNEFcIiwgXCI1QVwiLCBcIjZBXCIsIFwiN0FcIiwgXCI4QVwiLCBcIjlBXCIsIFwiMTBBXCIsIFwiMTFBXCIsIFwiMTJBXCIsXG5dO1xuXG4vKiogTWFwIGEgc3RhbmRhcmQga2V5IG5hbWUgdG8gQ2FtZWxvdCBub3RhdGlvbi4gKi9cbmV4cG9ydCBmdW5jdGlvbiBrZXlOYW1lVG9DYW1lbG90KGtleTogc3RyaW5nLCBzY2FsZTogc3RyaW5nKTogQ2FtZWxvdEtleSB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IG5hbWUgPSBrZXkucmVwbGFjZSgvW21iXSQvLCBcIlwiKS5yZXBsYWNlKFwiI1wiLCBcInNoYXJwXCIpO1xuICBjb25zdCBtYXA6IFJlY29yZDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIENhbWVsb3RLZXk+PiA9IHtcbiAgICBtYWpvcjoge1xuICAgICAgQjogXCIxQlwiLCBcIkdiXCI6IFwiMkJcIiwgXCJGc2hhcnBcIjogXCIyQlwiLCBEYjogXCIzQlwiLCBcIkNzaGFycFwiOiBcIjNCXCIsXG4gICAgICBcIkFiXCI6IFwiNEJcIiwgXCJHc2hhcnBcIjogXCI0QlwiLCBFYjogXCI1QlwiLCBcIkRzaGFycFwiOiBcIjVCXCIsXG4gICAgICBCYjogXCI2QlwiLCBcIkFzaGFycFwiOiBcIjZCXCIsIEY6IFwiN0JcIiwgQzogXCI4QlwiLCBHOiBcIjlCXCIsIEQ6IFwiMTBCXCIsIEE6IFwiMTFCXCIsIEU6IFwiMTJCXCIsXG4gICAgfSxcbiAgICBtaW5vcjoge1xuICAgICAgXCJHc2hhcnBcIjogXCIxQVwiLCBcIkFiXCI6IFwiMUFcIiwgRWI6IFwiMkFcIiwgXCJEc2hhcnBcIjogXCIyQVwiLFxuICAgICAgQmI6IFwiM0FcIiwgXCJBc2hhcnBcIjogXCIzQVwiLCBGOiBcIjRBXCIsIEM6IFwiNUFcIixcbiAgICAgIEc6IFwiNkFcIiwgRDogXCI3QVwiLCBBOiBcIjhBXCIsIEU6IFwiOUFcIiwgQjogXCIxMEFcIixcbiAgICAgIFwiRnNoYXJwXCI6IFwiMTFBXCIsIFwiR2JcIjogXCIxMUFcIiwgXCJDc2hhcnBcIjogXCIxMkFcIiwgRGI6IFwiMTJBXCIsXG4gICAgfSxcbiAgfTtcbiAgY29uc3QgcyA9IHNjYWxlID09PSBcIm1pbm9yXCIgPyBcIm1pbm9yXCIgOiBcIm1ham9yXCI7XG4gIHJldHVybiBtYXBbc10/LltuYW1lXSB8fCBtYXBbc10/LltrZXldIHx8IHVuZGVmaW5lZDtcbn1cblxuLyoqIENvbnZlcnQgQ2FtZWxvdCBiYWNrIHRvIGEgRGF0YXZpZXctZnJpZW5kbHkga2V5IG5hbWUuICovXG5leHBvcnQgZnVuY3Rpb24gY2FtZWxvdFRvS2V5TmFtZShjYW1lbG90OiBDYW1lbG90S2V5KTogeyBrZXk6IHN0cmluZzsgc2NhbGU6IHN0cmluZyB9IHwgdW5kZWZpbmVkIHtcbiAgY29uc3QgbWFwOiBSZWNvcmQ8Q2FtZWxvdEtleSwgeyBrZXk6IHN0cmluZzsgc2NhbGU6IHN0cmluZyB9PiA9IHtcbiAgICBcIjFCXCI6IHsga2V5OiBcIkJcIiwgc2NhbGU6IFwibWFqb3JcIiB9LFxuICAgIFwiMkJcIjogeyBrZXk6IFwiRiNcIiwgc2NhbGU6IFwibWFqb3JcIiB9LFxuICAgIFwiM0JcIjogeyBrZXk6IFwiQyNcIiwgc2NhbGU6IFwibWFqb3JcIiB9LFxuICAgIFwiNEJcIjogeyBrZXk6IFwiRyNcIiwgc2NhbGU6IFwibWFqb3JcIiB9LFxuICAgIFwiNUJcIjogeyBrZXk6IFwiRCNcIiwgc2NhbGU6IFwibWFqb3JcIiB9LFxuICAgIFwiNkJcIjogeyBrZXk6IFwiQSNcIiwgc2NhbGU6IFwibWFqb3JcIiB9LFxuICAgIFwiN0JcIjogeyBrZXk6IFwiRlwiLCBzY2FsZTogXCJtYWpvclwiIH0sXG4gICAgXCI4QlwiOiB7IGtleTogXCJDXCIsIHNjYWxlOiBcIm1ham9yXCIgfSxcbiAgICBcIjlCXCI6IHsga2V5OiBcIkdcIiwgc2NhbGU6IFwibWFqb3JcIiB9LFxuICAgIFwiMTBCXCI6IHsga2V5OiBcIkRcIiwgc2NhbGU6IFwibWFqb3JcIiB9LFxuICAgIFwiMTFCXCI6IHsga2V5OiBcIkFcIiwgc2NhbGU6IFwibWFqb3JcIiB9LFxuICAgIFwiMTJCXCI6IHsga2V5OiBcIkVcIiwgc2NhbGU6IFwibWFqb3JcIiB9LFxuICAgIFwiMUFcIjogeyBrZXk6IFwiRyNtXCIsIHNjYWxlOiBcIm1pbm9yXCIgfSxcbiAgICBcIjJBXCI6IHsga2V5OiBcIkQjbVwiLCBzY2FsZTogXCJtaW5vclwiIH0sXG4gICAgXCIzQVwiOiB7IGtleTogXCJBI21cIiwgc2NhbGU6IFwibWlub3JcIiB9LFxuICAgIFwiNEFcIjogeyBrZXk6IFwiRm1cIiwgc2NhbGU6IFwibWlub3JcIiB9LFxuICAgIFwiNUFcIjogeyBrZXk6IFwiQ21cIiwgc2NhbGU6IFwibWlub3JcIiB9LFxuICAgIFwiNkFcIjogeyBrZXk6IFwiR21cIiwgc2NhbGU6IFwibWlub3JcIiB9LFxuICAgIFwiN0FcIjogeyBrZXk6IFwiRG1cIiwgc2NhbGU6IFwibWlub3JcIiB9LFxuICAgIFwiOEFcIjogeyBrZXk6IFwiQW1cIiwgc2NhbGU6IFwibWlub3JcIiB9LFxuICAgIFwiOUFcIjogeyBrZXk6IFwiRW1cIiwgc2NhbGU6IFwibWlub3JcIiB9LFxuICAgIFwiMTBBXCI6IHsga2V5OiBcIkJtXCIsIHNjYWxlOiBcIm1pbm9yXCIgfSxcbiAgICBcIjExQVwiOiB7IGtleTogXCJGI21cIiwgc2NhbGU6IFwibWlub3JcIiB9LFxuICAgIFwiMTJBXCI6IHsga2V5OiBcIkMjbVwiLCBzY2FsZTogXCJtaW5vclwiIH0sXG4gIH07XG4gIHJldHVybiBtYXBbY2FtZWxvdF07XG59XG5cbi8qKiBSZXR1cm4gdGhlIHNldCBvZiBoYXJtb25pY2FsbHkgY29tcGF0aWJsZSBDYW1lbG90IGtleXMuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29tcGF0aWJsZUtleXMoY3VycmVudDogQ2FtZWxvdEtleSk6IENhbWVsb3RLZXlbXSB7XG4gIGNvbnN0IG51bSA9IHBhcnNlSW50KGN1cnJlbnQuc2xpY2UoMCwgLTEpLCAxMCk7IC8vIFwiNkFcIiBcdTIxOTIgNlxuICBjb25zdCBsZXR0ZXIgPSBjdXJyZW50LnNsaWNlKC0xKTsgLy8gXCI2QVwiIFx1MjE5MiBcIkFcIlxuICBjb25zdCBjb21wYXRpYmxlOiBDYW1lbG90S2V5W10gPSBbXTtcblxuICAvLyBTYW1lIG51bWJlciwgb3Bwb3NpdGUgbGV0dGVyIChtYWpvciBcdTIxOTQgbWlub3IgcmVsYXRpdmUpXG4gIGNvbXBhdGlibGUucHVzaChgJHtudW19JHtsZXR0ZXIgPT09IFwiQVwiID8gXCJCXCIgOiBcIkFcIn1gIGFzIENhbWVsb3RLZXkpO1xuXG4gIC8vIFNhbWUgbGV0dGVyLCBcdTAwQjExIG51bWJlclxuICBjb25zdCBwcmV2ID0gbnVtID09PSAxID8gMTIgOiBudW0gLSAxO1xuICBjb25zdCBuZXh0ID0gbnVtID09PSAxMiA/IDEgOiBudW0gKyAxO1xuICBjb21wYXRpYmxlLnB1c2goYCR7cHJldn0ke2xldHRlcn1gIGFzIENhbWVsb3RLZXksIGAke25leHR9JHtsZXR0ZXJ9YCBhcyBDYW1lbG90S2V5KTtcblxuICAvLyBDcm9zcy1sZXR0ZXIgXHUwMEIxMSAoZW5lcmd5IGJvb3N0L2Ryb3ApXG4gIGNvbXBhdGlibGUucHVzaChgJHtwcmV2fSR7bGV0dGVyID09PSBcIkFcIiA/IFwiQlwiIDogXCJBXCJ9YCBhcyBDYW1lbG90S2V5KTtcbiAgY29tcGF0aWJsZS5wdXNoKGAke25leHR9JHtsZXR0ZXIgPT09IFwiQVwiID8gXCJCXCIgOiBcIkFcIn1gIGFzIENhbWVsb3RLZXkpO1xuXG4gIHJldHVybiBjb21wYXRpYmxlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENhbWVsb3RXaGVlbENvbmZpZyB7XG4gIGN1cnJlbnQ6IENhbWVsb3RLZXkgfCB1bmRlZmluZWQ7XG4gIG9uS2V5Q2xpY2s6IChjYW1lbG90OiBDYW1lbG90S2V5LCBkdlF1ZXJ5OiBzdHJpbmcpID0+IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBDYW1lbG90V2hlZWwge1xuICBwcml2YXRlIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XG4gIHByaXZhdGUgY29uZmlnOiBDYW1lbG90V2hlZWxDb25maWc7XG5cbiAgY29uc3RydWN0b3IocGFyZW50OiBIVE1MRWxlbWVudCwgY29uZmlnOiBDYW1lbG90V2hlZWxDb25maWcpIHtcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB0aGlzLmNvbnRhaW5lciA9IHBhcmVudC5jcmVhdGVEaXYoeyBjbHM6IFwibWFtLWNhbWVsb3RcIiB9KTtcbiAgfVxuXG4gIG1vdW50KCk6IHZvaWQge1xuICAgIHRoaXMuY29udGFpbmVyLmVtcHR5KCk7XG5cbiAgICBjb25zdCB3aGVlbCA9IHRoaXMuY29udGFpbmVyLmNyZWF0ZURpdih7IGNsczogXCJtYW0tY2FtZWxvdC13aGVlbFwiIH0pO1xuXG4gICAgLy8gUmVuZGVyIGFsbCAxMiBwb3NpdGlvbnMgYXJvdW5kIHRoZSBjbG9ja1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTI7IGkrKykge1xuICAgICAgY29uc3QgYW5nbGUgPSAoaSAvIDEyKSAqIDM2MDtcbiAgICAgIGNvbnN0IG1ham9yS2V5ID0gTUFKT1JfS0VZU1tpXTtcbiAgICAgIGNvbnN0IG1pbm9yS2V5ID0gTUlOT1JfS0VZU1tpXTtcblxuICAgICAgLy8gTWFqb3IgKG91dGVyIHJpbmcpXG4gICAgICB0aGlzLnJlbmRlcktleSh3aGVlbCwgbWFqb3JLZXksIGFuZ2xlLCBcIm1ham9yXCIpO1xuICAgICAgLy8gTWlub3IgKGlubmVyIHJpbmcpXG4gICAgICB0aGlzLnJlbmRlcktleSh3aGVlbCwgbWlub3JLZXksIGFuZ2xlLCBcIm1pbm9yXCIpO1xuICAgIH1cblxuICAgIC8vIExlZ2VuZFxuICAgIGNvbnN0IGxlZ2VuZCA9IHRoaXMuY29udGFpbmVyLmNyZWF0ZURpdih7IGNsczogXCJtYW0tY2FtZWxvdC1sZWdlbmRcIiB9KTtcbiAgICBsZWdlbmQuY3JlYXRlU3Bhbih7IGNsczogXCJtYW0tY2FtZWxvdC1jdXJyZW50XCIsIHRleHQ6IFwiXHUyNUNGIGN1cnJlbnQgXCIgfSk7XG4gICAgbGVnZW5kLmNyZWF0ZVNwYW4oeyBjbHM6IFwibWFtLWNhbWVsb3QtY29tcGF0aWJsZVwiLCB0ZXh0OiBcIlx1MjVFNiBjb21wYXRpYmxlIFwiIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJLZXkoXG4gICAgd2hlZWw6IEhUTUxFbGVtZW50LFxuICAgIGtleTogQ2FtZWxvdEtleSxcbiAgICBhbmdsZTogbnVtYmVyLFxuICAgIHR5cGU6IFwibWFqb3JcIiB8IFwibWlub3JcIixcbiAgKTogdm9pZCB7XG4gICAgY29uc3Qgc2xvdCA9IHdoZWVsLmNyZWF0ZURpdih7IGNsczogYG1hbS1jYW1lbG90LWtleSBtYW0tY2FtZWxvdC1rZXktJHt0eXBlfWAgfSk7XG5cbiAgICBjb25zdCByYWRpdXMgPSB0eXBlID09PSBcIm1ham9yXCIgPyA2MCA6IDM1O1xuICAgIC8vIFBvc2l0aW9uIHZpYSBDU1MgdHJhbnNmb3JtOyB1c2VyIHN0eWxlc2hlZXQgc2hvdWxkIHNldCB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXJcbiAgICBzbG90LnN0eWxlLnRyYW5zZm9ybSA9IGByb3RhdGUoJHthbmdsZX1kZWcpIHRyYW5zbGF0ZVkoLSR7cmFkaXVzfXB4KWA7XG4gICAgc2xvdC5zZXRBdHRyaWJ1dGUoXCJkYXRhLWNhbWVsb3RcIiwga2V5KTtcblxuICAgIC8vIEhpZ2hsaWdodGluZ1xuICAgIGNvbnN0IGNvbXBhdGlibGUgPSB0aGlzLmNvbmZpZy5jdXJyZW50ID8gZ2V0Q29tcGF0aWJsZUtleXModGhpcy5jb25maWcuY3VycmVudCkgOiBbXTtcbiAgICBpZiAodGhpcy5jb25maWcuY3VycmVudCA9PT0ga2V5KSB7XG4gICAgICBzbG90LmFkZENsYXNzKFwibWFtLWNhbWVsb3QtY3VycmVudFwiKTtcbiAgICB9IGVsc2UgaWYgKGNvbXBhdGlibGUuaW5jbHVkZXMoa2V5KSkge1xuICAgICAgc2xvdC5hZGRDbGFzcyhcIm1hbS1jYW1lbG90LWNvbXBhdGlibGVcIik7XG4gICAgfVxuXG4gICAgc2xvdC5jcmVhdGVTcGFuKHsgY2xzOiBcIm1hbS1jYW1lbG90LWxhYmVsXCIsIHRleHQ6IGtleSB9KTtcblxuICAgIHNsb3QuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIGNvbnN0IG1hdGNoID0gY2FtZWxvdFRvS2V5TmFtZShrZXkpO1xuICAgICAgaWYgKCFtYXRjaCkgcmV0dXJuO1xuICAgICAgY29uc3QgZHZRdWVyeSA9IGBcXGBcXGBcXGBkYXRhdmlld1xcbkxJU1RcXG5GUk9NICNtdXNpY1xcbldIRVJFIGtleSA9IFwiJHttYXRjaC5rZXl9XCJcXG5TT1JUIHRlbXBvIEFTQ1xcblxcYFxcYFxcYGA7XG4gICAgICB0aGlzLmNvbmZpZy5vbktleUNsaWNrKGtleSwgZHZRdWVyeSk7XG4gICAgfSk7XG4gIH1cblxuICBkZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuY29udGFpbmVyLnJlbW92ZSgpO1xuICB9XG59XG4iLCAiLy8gTXVzaWNEYXNoYm9hcmRQcm9jZXNzb3IgXHUyMDE0IE9ic2lkaWFuIGNvZGUtYmxvY2sgcmVuZGVyZXIgZm9yIGBtdXNpYy1kYXNoYm9hcmRgXG4vLyBEcml2ZW4gZW50aXJlbHkgYnkgZnJvbnRtYXR0ZXIgKHplcm8gYW5hbHlzaXMgYXQgcmVuZGVyIHRpbWUpLlxuLy9cbi8vIENTUyBjbGFzcyBob29rcyAoZm9yIHRoZW1pbmcgYnkgdXNlcik6XG4vLyAgLm1hbS1kYXNoYm9hcmQgICAgICAgICAgICAgXHUyMDE0IHJvb3QgY29udGFpbmVyXG4vLyAgLm1hbS1kYXNoYm9hcmQtaGVhZGVyICAgICAgXHUyMDE0IHRvcCB0aXRsZSBiYXJcbi8vICAubWFtLWRhc2hib2FyZC1tZXRhICAgICAgICBcdTIwMTQgQlBNICsga2V5IHJvd1xuLy8gIC5tYW0tZGFzaGJvYXJkLXNlY3Rpb24gICAgIFx1MjAxNCBzdWItc3VyZmFjZSB3cmFwcGVyXG4vLyAgLm1hbS1kYXNoYm9hcmQtc2VjdGlvbi1sYWJlbFxuLy8gIC5tYW0tZGFzaGJvYXJkLWNvbnRyb2xzICAgIFx1MjAxNCBCUE0gKyBrZXkgcmV1c2FibGUgY29udHJvbHMgYXJlYVxuLy8gIC5tYW0tZGFzaGJvYXJkLXRpbWVsaW5lICAgIFx1MjAxNCBzdHJ1Y3R1cmUgdGltZWxpbmUgY29udGFpbmVyXG4vLyAgLm1hbS1kYXNoYm9hcmQtdHVuZXIgICAgICAgXHUyMDE0IHR1bmVyIGdhdWdlIGNvbnRhaW5lclxuLy8gIC5tYW0tZGFzaGJvYXJkLWNhbWVsb3QgICAgIFx1MjAxNCBDYW1lbG90IHdoZWVsIGNvbnRhaW5lclxuXG5pbXBvcnQgeyBNYXJrZG93blBvc3RQcm9jZXNzb3JDb250ZXh0IH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBCcG1Db250cm9sLCBCcG1Db250cm9sU3RhdGUsIEJwbUNvbnRyb2xDYWxsYmFja3MgfSBmcm9tIFwiLi9icG0tY29udHJvbFwiO1xuaW1wb3J0IHsgS2V5Q29udHJvbCwgS2V5Q29udHJvbFN0YXRlLCBLZXlDb250cm9sQ2FsbGJhY2tzIH0gZnJvbSBcIi4va2V5LWNvbnRyb2xcIjtcbmltcG9ydCB7IFN0cnVjdHVyZVRpbWVsaW5lLCBTdHJ1Y3R1cmVTZWdtZW50IH0gZnJvbSBcIi4vc3RydWN0dXJlLXRpbWVsaW5lXCI7XG5pbXBvcnQgeyBUdW5lck5lZWRsZSB9IGZyb20gXCIuL3R1bmVyLW5lZWRsZVwiO1xuaW1wb3J0IHsgQ2FtZWxvdFdoZWVsLCBrZXlOYW1lVG9DYW1lbG90IH0gZnJvbSBcIi4vY2FtZWxvdC13aGVlbFwiO1xuaW1wb3J0IHsgaW5qZWN0RnJvbnRtYXR0ZXIgfSBmcm9tIFwiLi4veWFtbC1pbmplY3RvclwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIERhc2hib2FyZEZyb250bWF0dGVyIHtcbiAgc291cmNlRmlsZTogc3RyaW5nOyAgICAgICAgICAvLyBhY3RpdmUgZmlsZSBwYXRoXG4gIHRlbXBvOiBudW1iZXI7XG4gIHJhd190ZW1wbz86IG51bWJlcjtcbiAgYWx0ZXJuYXRlX3RlbXBvPzogbnVtYmVyO1xuICB0ZW1wb19jb25maXJtZWQ6IGJvb2xlYW47XG4gIGtleTogc3RyaW5nO1xuICBrZXlfY29uZmlybWVkOiBib29sZWFuO1xuICBkdXJhdGlvbj86IHN0cmluZzsgICAgICAgICAgIC8vIFwiMjozNFwiXG4gIGF1ZGlvX3N0YXJ0X29mZnNldD86IG51bWJlcjsgLy8gYmFycyB0byB0cmltIGxlYWQtaW5cbiAgc3RydWN0dXJlPzogQXJyYXk8e1xuICAgIHNlZ21lbnQ6IHN0cmluZztcbiAgICBiYXJzOiBbbnVtYmVyLCBudW1iZXJdO1xuICAgIHRpbWU/OiBbc3RyaW5nLCBzdHJpbmddO1xuICB9Pjtcbn1cblxuZXhwb3J0IGNsYXNzIE11c2ljRGFzaGJvYXJkUHJvY2Vzc29yIHtcbiAgcHJpdmF0ZSB2YXVsdEFjdGlvbnM6IHtcbiAgICByZWFkRmlsZTogKHBhdGg6IHN0cmluZykgPT4gUHJvbWlzZTxzdHJpbmc+O1xuICAgIG1vZGlmeUZpbGU6IChwYXRoOiBzdHJpbmcsIGNvbnRlbnQ6IHN0cmluZykgPT4gUHJvbWlzZTx2b2lkPjtcbiAgICBnZXRGaWxlQnlQYXRoOiAocGF0aDogc3RyaW5nKSA9PiB7IHBhdGg6IHN0cmluZyB9IHwgbnVsbDtcbiAgfTtcblxuICBjb25zdHJ1Y3Rvcih2YXVsdEFjdGlvbnM6IE11c2ljRGFzaGJvYXJkUHJvY2Vzc29yW1widmF1bHRBY3Rpb25zXCJdKSB7XG4gICAgdGhpcy52YXVsdEFjdGlvbnMgPSB2YXVsdEFjdGlvbnM7XG4gIH1cblxuICBhc3luYyBwcm9jZXNzKFxuICAgIHNvdXJjZTogc3RyaW5nLFxuICAgIGVsOiBIVE1MRWxlbWVudCxcbiAgICBjdHg6IE1hcmtkb3duUG9zdFByb2Nlc3NvckNvbnRleHQsXG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIC8vIHNvdXJjZSBpcyBpZ25vcmVkIFx1MjAxNCB0aGUgcHJvY2Vzc29yIHJlYWRzIHRoZSBwYXJlbnQgbm90ZSdzIGZyb250bWF0dGVyXG4gICAgY29uc3QgY29udGFpbmVyID0gZWwuY3JlYXRlRGl2KHsgY2xzOiBcIm1hbS1kYXNoYm9hcmRcIiB9KTtcblxuICAgIC8vIFJlc29sdmUgdGhlIHNvdXJjZSBmaWxlXG4gICAgY29uc3QgZmlsZVBhdGggPSBjdHguc291cmNlUGF0aDtcblxuICAgIC8vIFJlYWQgZnJvbnRtYXR0ZXIgZnJvbSB0aGUgdmF1bHRcbiAgICBsZXQgZm06IERhc2hib2FyZEZyb250bWF0dGVyO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByYXcgPSBhd2FpdCB0aGlzLnZhdWx0QWN0aW9ucy5yZWFkRmlsZShmaWxlUGF0aCk7XG4gICAgICBmbSA9IHRoaXMucGFyc2VGcm9udG1hdHRlcihyYXcsIGZpbGVQYXRoKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIGNvbnRhaW5lci5jcmVhdGVFbChcInBcIiwge1xuICAgICAgICBjbHM6IFwibWFtLWRhc2hib2FyZC1lbXB0eVwiLFxuICAgICAgICB0ZXh0OiBcIk5vIG11c2ljIGFuYWx5c2lzIGRhdGEgZm91bmQgaW4gdGhpcyBub3RlLiBSdW4gXFx1MjAxY0FuYWx5emUgYXVkaW9cXHUyMDFkIGZpcnN0LlwiLFxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gXHUyNTAwXHUyNTAwIEhlYWRlciBcdTI1MDBcdTI1MDBcbiAgICBjb25zdCBoZWFkZXIgPSBjb250YWluZXIuY3JlYXRlRGl2KHsgY2xzOiBcIm1hbS1kYXNoYm9hcmQtaGVhZGVyXCIgfSk7XG4gICAgaGVhZGVyLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiBmbS5zb3VyY2VGaWxlLnNwbGl0KFwiL1wiKS5wb3AoKSB8fCBcIlVudGl0bGVkXCIgfSk7XG4gICAgaWYgKGZtLmR1cmF0aW9uKSB7XG4gICAgICBoZWFkZXIuY3JlYXRlU3Bhbih7IGNsczogXCJtYW0tZGFzaGJvYXJkLWR1cmF0aW9uXCIsIHRleHQ6IGZtLmR1cmF0aW9uIH0pO1xuICAgIH1cblxuICAgIC8vIFx1MjUwMFx1MjUwMCBNZXRhIHJvdyAoQlBNICsga2V5LCBjb21wYWN0KSBcdTI1MDBcdTI1MDBcbiAgICBjb25zdCBtZXRhID0gY29udGFpbmVyLmNyZWF0ZURpdih7IGNsczogXCJtYW0tZGFzaGJvYXJkLW1ldGFcIiB9KTtcbiAgICBjb25zdCBicG1FbCA9IG1ldGEuY3JlYXRlU3Bhbih7XG4gICAgICBjbHM6IGZtLnRlbXBvX2NvbmZpcm1lZCA/IFwibWFtLW1ldGEtY29uZmlybWVkXCIgOiBcIm1hbS1tZXRhLXVuY29uZmlybWVkXCIsXG4gICAgfSk7XG4gICAgYnBtRWwuc2V0VGV4dChgJHtmbS50ZW1wb30gQlBNYCk7XG4gICAgaWYgKGZtLmFsdGVybmF0ZV90ZW1wbykge1xuICAgICAgYnBtRWwuc2V0VGV4dChgJHtmbS50ZW1wb30gQlBNIChvciAke2ZtLmFsdGVybmF0ZV90ZW1wb30/KWApO1xuICAgIH1cbiAgICBtZXRhLmNyZWF0ZVNwYW4oeyB0ZXh0OiBcIiBcXHUyMDIyIFwiIH0pO1xuICAgIGNvbnN0IGtleUVsID0gbWV0YS5jcmVhdGVTcGFuKHtcbiAgICAgIGNsczogZm0ua2V5X2NvbmZpcm1lZCA/IFwibWFtLW1ldGEtY29uZmlybWVkXCIgOiBcIm1hbS1tZXRhLXVuY29uZmlybWVkXCIsXG4gICAgfSk7XG4gICAga2V5RWwuc2V0VGV4dChmbS5rZXkpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIENvbnRyb2xzIChyZXVzYWJsZSBCUE0gKyBLZXkpIFx1MjUwMFx1MjUwMFxuICAgIGNvbnN0IGNvbnRyb2xzU2VjdGlvbiA9IGNvbnRhaW5lci5jcmVhdGVEaXYoeyBjbHM6IFwibWFtLWRhc2hib2FyZC1zZWN0aW9uXCIgfSk7XG4gICAgY29udHJvbHNTZWN0aW9uLmNyZWF0ZUVsKFwiaDRcIiwgeyBjbHM6IFwibWFtLWRhc2hib2FyZC1zZWN0aW9uLWxhYmVsXCIsIHRleHQ6IFwiQ29udHJvbHNcIiB9KTtcbiAgICBjb25zdCBjb250cm9sc0FyZWEgPSBjb250cm9sc1NlY3Rpb24uY3JlYXRlRGl2KHsgY2xzOiBcIm1hbS1kYXNoYm9hcmQtY29udHJvbHNcIiB9KTtcblxuICAgIGNvbnN0IGlzTWlub3IgPSBmbS5rZXkuZW5kc1dpdGgoXCJtXCIpO1xuICAgIGNvbnN0IGJhc2VLZXkgPSBpc01pbm9yID8gZm0ua2V5LnNsaWNlKDAsIC0xKSA6IGZtLmtleTtcblxuICAgIGNvbnN0IGJwbVN0YXRlOiBCcG1Db250cm9sU3RhdGUgPSB7XG4gICAgICBicG06IGZtLnRlbXBvLFxuICAgICAgcmF3QnBtOiBmbS5yYXdfdGVtcG8gPz8gZm0udGVtcG8sXG4gICAgICBhbHRlcm5hdGVCcG06IGZtLmFsdGVybmF0ZV90ZW1wbyxcbiAgICAgIGNvbmZpcm1lZDogZm0udGVtcG9fY29uZmlybWVkLFxuICAgIH07XG4gICAgY29uc3Qga2V5U3RhdGU6IEtleUNvbnRyb2xTdGF0ZSA9IHtcbiAgICAgIGtleTogYmFzZUtleSxcbiAgICAgIHNjYWxlOiBpc01pbm9yID8gXCJtaW5vclwiIDogXCJtYWpvclwiLFxuICAgICAgcmVsYXRpdmVLZXk6IHVuZGVmaW5lZCxcbiAgICAgIGNvbmZpcm1lZDogZm0ua2V5X2NvbmZpcm1lZCxcbiAgICB9O1xuXG4gICAgY29uc3Qgc2F2ZVRvRm0gPSBhc3luYyAocGFydGlhbDogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJhdyA9IGF3YWl0IHRoaXMudmF1bHRBY3Rpb25zLnJlYWRGaWxlKGZpbGVQYXRoKTtcbiAgICAgICAgY29uc3QgdXBkYXRlZCA9IGluamVjdEZyb250bWF0dGVyKHJhdywgcGFydGlhbCBhcyBhbnkpO1xuICAgICAgICBhd2FpdCB0aGlzLnZhdWx0QWN0aW9ucy5tb2RpZnlGaWxlKGZpbGVQYXRoLCB1cGRhdGVkKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gU2lsZW50IGZhaWwgXHUyMDE0IHZhdWx0IHdyaXRlcyBhcmUgYmVzdC1lZmZvcnQgaW4gZGFzaGJvYXJkXG4gICAgICAgIGNvbnNvbGUud2FybihcIltNQU1dIERhc2hib2FyZCBzYXZlIGZhaWxlZDpcIiwgZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IGJwbUNvbnRyb2wgPSBuZXcgQnBtQ29udHJvbChjb250cm9sc0FyZWEsIGJwbVN0YXRlLCB7XG4gICAgICBvbkNoYW5nZTogYXN5bmMgKGJwbSkgPT4ge1xuICAgICAgICBhd2FpdCBzYXZlVG9GbSh7IHRlbXBvOiBicG0sIHRlbXBvX2NvbmZpcm1lZDogdHJ1ZSB9KTtcbiAgICAgIH0sXG4gICAgICBvbkNvbmZpcm1lZDogYXN5bmMgKGNvbmZpcm1lZCkgPT4ge1xuICAgICAgICBhd2FpdCBzYXZlVG9GbSh7IHRlbXBvX2NvbmZpcm1lZDogY29uZmlybWVkIH0pO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBicG1Db250cm9sLm1vdW50KGNvbnRyb2xzQXJlYSk7XG5cbiAgICBjb25zdCBrZXlDb250cm9sID0gbmV3IEtleUNvbnRyb2woY29udHJvbHNBcmVhLCBrZXlTdGF0ZSwge1xuICAgICAgb25DaGFuZ2U6IGFzeW5jIChrZXksIHNjYWxlKSA9PiB7XG4gICAgICAgIGNvbnN0IGRpc3BsYXkgPSBzY2FsZSA9PT0gXCJtaW5vclwiID8gYCR7a2V5fW1gIDoga2V5O1xuICAgICAgICBhd2FpdCBzYXZlVG9GbSh7IGtleTogZGlzcGxheSwga2V5X2NvbmZpcm1lZDogdHJ1ZSB9KTtcbiAgICAgIH0sXG4gICAgICBvbkNvbmZpcm1lZDogYXN5bmMgKGNvbmZpcm1lZCkgPT4ge1xuICAgICAgICBhd2FpdCBzYXZlVG9GbSh7IGtleV9jb25maXJtZWQ6IGNvbmZpcm1lZCB9KTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAga2V5Q29udHJvbC5tb3VudChjb250cm9sc0FyZWEpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIFN0cnVjdHVyZSB0aW1lbGluZSBcdTI1MDBcdTI1MDBcbiAgICBjb25zdCB0aW1lbGluZVNlY3Rpb24gPSBjb250YWluZXIuY3JlYXRlRGl2KHsgY2xzOiBcIm1hbS1kYXNoYm9hcmQtc2VjdGlvblwiIH0pO1xuICAgIHRpbWVsaW5lU2VjdGlvbi5jcmVhdGVFbChcImg0XCIsIHsgY2xzOiBcIm1hbS1kYXNoYm9hcmQtc2VjdGlvbi1sYWJlbFwiLCB0ZXh0OiBcIlN0cnVjdHVyZVwiIH0pO1xuXG4gICAgY29uc3Qgc2VnbWVudHM6IFN0cnVjdHVyZVNlZ21lbnRbXSA9IChmbS5zdHJ1Y3R1cmUgfHwgW10pLm1hcCgocykgPT4gKHtcbiAgICAgIGlkOiBzLnNlZ21lbnQsXG4gICAgICBsYWJlbDogcy5zZWdtZW50LFxuICAgICAgc3RhcnRCYXI6IHMuYmFyc1swXSxcbiAgICAgIGVuZEJhcjogcy5iYXJzWzFdLFxuICAgICAgY29sb3I6IHRoaXMuY29sb3JGb3JTZWdtZW50KHMuc2VnbWVudCksXG4gICAgfSkpO1xuXG4gICAgY29uc3QgdGltZWxpbmUgPSBuZXcgU3RydWN0dXJlVGltZWxpbmUoXG4gICAgICB0aW1lbGluZVNlY3Rpb24sXG4gICAgICBzZWdtZW50cyxcbiAgICAgIGZtLnRlbXBvLFxuICAgICAgZm0uYXVkaW9fc3RhcnRfb2Zmc2V0ID8/IDAsXG4gICAgKTtcbiAgICB0aW1lbGluZS5vbk9mZnNldENoYW5nZSA9IGFzeW5jIChvZmZzZXQpID0+IHtcbiAgICAgIGF3YWl0IHNhdmVUb0ZtKHsgYXVkaW9fc3RhcnRfb2Zmc2V0OiBvZmZzZXQgfSk7XG4gICAgfTtcbiAgICB0aW1lbGluZS5tb3VudCgpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIFR1bmVyIG5lZWRsZSBcdTI1MDBcdTI1MDBcbiAgICBjb25zdCB0dW5lclNlY3Rpb24gPSBjb250YWluZXIuY3JlYXRlRGl2KHsgY2xzOiBcIm1hbS1kYXNoYm9hcmQtc2VjdGlvblwiIH0pO1xuICAgIHR1bmVyU2VjdGlvbi5jcmVhdGVFbChcImg0XCIsIHsgY2xzOiBcIm1hbS1kYXNoYm9hcmQtc2VjdGlvbi1sYWJlbFwiLCB0ZXh0OiBcIlR1bmVyXCIgfSk7XG4gICAgY29uc3QgdHVuZXJDb250YWluZXIgPSB0dW5lclNlY3Rpb24uY3JlYXRlRGl2KHsgY2xzOiBcIm1hbS1kYXNoYm9hcmQtdHVuZXJcIiB9KTtcbiAgICBjb25zdCB0dW5lciA9IG5ldyBUdW5lck5lZWRsZSh0dW5lckNvbnRhaW5lciwge1xuICAgICAga2V5OiBiYXNlS2V5LFxuICAgICAgc2NhbGU6IGlzTWlub3IgPyBcIm1pbm9yXCIgOiBcIm1ham9yXCIsXG4gICAgICBjb25maXJtZWQ6IGZtLmtleV9jb25maXJtZWQsXG4gICAgfSk7XG4gICAgdHVuZXIubW91bnQoKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBDYW1lbG90IHdoZWVsIFx1MjUwMFx1MjUwMFxuICAgIGNvbnN0IGNhbWVsb3RTZWN0aW9uID0gY29udGFpbmVyLmNyZWF0ZURpdih7IGNsczogXCJtYW0tZGFzaGJvYXJkLXNlY3Rpb25cIiB9KTtcbiAgICBjYW1lbG90U2VjdGlvbi5jcmVhdGVFbChcImg0XCIsIHsgY2xzOiBcIm1hbS1kYXNoYm9hcmQtc2VjdGlvbi1sYWJlbFwiLCB0ZXh0OiBcIkNhbWVsb3RcIiB9KTtcbiAgICBjb25zdCBjYW1lbG90Q29udGFpbmVyID0gY2FtZWxvdFNlY3Rpb24uY3JlYXRlRGl2KHsgY2xzOiBcIm1hbS1kYXNoYm9hcmQtY2FtZWxvdFwiIH0pO1xuICAgIGNvbnN0IGNhbWVsb3QgPSBuZXcgQ2FtZWxvdFdoZWVsKGNhbWVsb3RDb250YWluZXIsIHtcbiAgICAgIGN1cnJlbnQ6IGtleU5hbWVUb0NhbWVsb3QoYmFzZUtleSwgaXNNaW5vciA/IFwibWlub3JcIiA6IFwibWFqb3JcIiksXG4gICAgICBvbktleUNsaWNrOiAoX2NhbWVsb3RLZXksIGR2UXVlcnkpID0+IHRoaXMuaGFuZGxlQ2FtZWxvdENsaWNrKGR2UXVlcnkpLFxuICAgIH0pO1xuICAgIGNhbWVsb3QubW91bnQoKTtcbiAgfVxuXG4gIHByaXZhdGUgcGFyc2VGcm9udG1hdHRlcihyYXc6IHN0cmluZywgc291cmNlUGF0aDogc3RyaW5nKTogRGFzaGJvYXJkRnJvbnRtYXR0ZXIge1xuICAgIGNvbnN0IGZtOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiA9IHt9O1xuICAgIGNvbnN0IG1hdGNoID0gL14tLS1cXHMqXFxuKFtcXHNcXFNdKj8pXFxuLS0tXFxzKlxcbj8vLmV4ZWMocmF3KTtcbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgIGZvciAoY29uc3QgbGluZSBvZiBtYXRjaFsxXS5zcGxpdChcIlxcblwiKSkge1xuICAgICAgICBjb25zdCBpZHggPSBsaW5lLmluZGV4T2YoXCI6XCIpO1xuICAgICAgICBpZiAoaWR4ID4gMCkge1xuICAgICAgICAgIGNvbnN0IGsgPSBsaW5lLnNsaWNlKDAsIGlkeCkudHJpbSgpO1xuICAgICAgICAgIGNvbnN0IHYgPSBsaW5lLnNsaWNlKGlkeCArIDEpLnRyaW0oKTtcbiAgICAgICAgICBpZiAoIWlzTmFOKE51bWJlcih2KSkgJiYgdiAhPT0gXCJcIiAmJiAhdi5pbmNsdWRlcyhcIiBcIikpIHtcbiAgICAgICAgICAgIChmbSBhcyBhbnkpW2tdID0gTnVtYmVyKHYpO1xuICAgICAgICAgIH0gZWxzZSBpZiAodiA9PT0gXCJ0cnVlXCIgfHwgdiA9PT0gXCJmYWxzZVwiKSB7XG4gICAgICAgICAgICAoZm0gYXMgYW55KVtrXSA9IHYgPT09IFwidHJ1ZVwiO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAoZm0gYXMgYW55KVtrXSA9IHYucmVwbGFjZSgvXltcIiddfFtcIiddJC9nLCBcIlwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWZtLnRlbXBvICYmICFmbS5rZXkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIGFuYWx5c2lzIGRhdGEgaW4gZnJvbnRtYXR0ZXJcIik7XG4gICAgfVxuXG4gICAgbGV0IHN0cnVjdHVyZTogRGFzaGJvYXJkRnJvbnRtYXR0ZXJbXCJzdHJ1Y3R1cmVcIl0gPSB1bmRlZmluZWQ7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZm0uc3RydWN0dXJlKSkge1xuICAgICAgc3RydWN0dXJlID0gZm0uc3RydWN0dXJlIGFzIGFueTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBmbS5zdHJ1Y3R1cmUgPT09IFwic3RyaW5nXCIgJiYgZm0uc3RydWN0dXJlLnN0YXJ0c1dpdGgoXCJbXCIpICYmIGZtLnN0cnVjdHVyZS5lbmRzV2l0aChcIl1cIikpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHN0cnVjdHVyZSA9IEpTT04ucGFyc2UoZm0uc3RydWN0dXJlKTtcbiAgICAgIH0gY2F0Y2ggeyAvKiBuby1vcCAqLyB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHNvdXJjZUZpbGU6IHNvdXJjZVBhdGgsXG4gICAgICB0ZW1wbzogTnVtYmVyKGZtLnRlbXBvID8/IDApLFxuICAgICAgcmF3X3RlbXBvOiBmbS5yYXdfdGVtcG8gPyBOdW1iZXIoZm0ucmF3X3RlbXBvKSA6IHVuZGVmaW5lZCxcbiAgICAgIGFsdGVybmF0ZV90ZW1wbzogZm0uYWx0ZXJuYXRlX3RlbXBvID8gTnVtYmVyKGZtLmFsdGVybmF0ZV90ZW1wbykgOiB1bmRlZmluZWQsXG4gICAgICB0ZW1wb19jb25maXJtZWQ6ICEhZm0udGVtcG9fY29uZmlybWVkLFxuICAgICAga2V5OiBTdHJpbmcoZm0ua2V5ID8/IFwiXCIpLFxuICAgICAga2V5X2NvbmZpcm1lZDogISFmbS5rZXlfY29uZmlybWVkLFxuICAgICAgZHVyYXRpb246IGZtLmR1cmF0aW9uID8gU3RyaW5nKGZtLmR1cmF0aW9uKSA6IHVuZGVmaW5lZCxcbiAgICAgIGF1ZGlvX3N0YXJ0X29mZnNldDogTnVtYmVyKGZtLmF1ZGlvX3N0YXJ0X29mZnNldCA/PyAwKSxcbiAgICAgIHN0cnVjdHVyZSxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBjb2xvckZvclNlZ21lbnQobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBjb2xvcnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgICBJbnRybzogXCJ2YXIoLS1jb2xvci1hY2NlbnQpXCIgLFxuICAgICAgVmVyc2U6IFwidmFyKC0taW50ZXJhY3RpdmUtYWNjZW50KVwiLFxuICAgICAgQ2hvcnVzOiBcInZhcigtLWNvbG9yLWdyZWVuKVwiICxcbiAgICAgIEJyaWRnZTogXCJ2YXIoLS1jb2xvci15ZWxsb3cpXCIgLFxuICAgICAgXCJQcmUtY2hvcnVzXCI6IFwidmFyKC0tY29sb3Itb3JhbmdlKVwiICxcbiAgICAgIEhvb2s6IFwidmFyKC0tY29sb3ItcmVkKVwiICxcbiAgICAgIE91dHJvOiBcInZhcigtLWNvbG9yLXB1cnBsZSlcIiAsXG4gICAgICBCcmVha2Rvd246IFwidmFyKC0tY29sb3ItY3lhbilcIiAsXG4gICAgfTtcbiAgICByZXR1cm4gY29sb3JzW25hbWVdIHx8IFwidmFyKC0tdGV4dC1tdXRlZClcIjtcbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlQ2FtZWxvdENsaWNrKGR2UXVlcnk6IHN0cmluZyk6IHZvaWQge1xuICAgIG5hdmlnYXRvci5jbGlwYm9hcmQ/LndyaXRlVGV4dChkdlF1ZXJ5KS5jYXRjaCgoKSA9PiB7IC8qIG5vLW9wICovIH0pO1xuICAgIGNvbnNvbGUubG9nKFwiW01BTV0gQ2FtZWxvdCBrZXkgY2xpY2tlZCBcdTIwMTQgRGF0YXZpZXcgcXVlcnkgY29waWVkIHRvIGNsaXBib2FyZFwiKTtcbiAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQSxJQUFBQSxtQkFBb0Q7OztBQ0dwRCxlQUFzQixPQUFPLFFBQXNDO0FBQ2pFLFFBQU0sYUFBYSxNQUFNLE9BQU8sT0FBTyxPQUFPLFdBQVcsTUFBTTtBQUMvRCxRQUFNLFlBQVksTUFBTSxLQUFLLElBQUksV0FBVyxVQUFVLENBQUM7QUFDdkQsU0FBTyxVQUFVLElBQUksQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLEVBQUUsU0FBUyxHQUFHLEdBQUcsQ0FBQyxFQUFFLEtBQUssRUFBRTtBQUN0RTs7O0FDMEJBLFNBQVMsZUFBZSxLQUFzQjtBQUM1QyxNQUFJLE1BQU0sUUFBUSxHQUFHLEdBQUc7QUFDdEIsUUFBSSxJQUFJLFdBQVcsRUFBRyxRQUFPO0FBQzdCLFdBQU8sT0FBTyxJQUFJLElBQUksQ0FBQyxNQUFNLFFBQVEsT0FBTyxDQUFDLEVBQUUsUUFBUSxNQUFNLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxJQUFJO0FBQUEsRUFDbkY7QUFDQSxNQUFJLE9BQU8sUUFBUSxVQUFVO0FBQzNCLFFBQUksUUFBUSxNQUFNLElBQUksU0FBUyxHQUFHLEtBQUssSUFBSSxTQUFTLElBQUksR0FBRztBQUN6RCxhQUFPLElBQUksSUFBSSxRQUFRLE1BQU0sS0FBSyxDQUFDO0FBQUEsSUFDckM7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUNBLE1BQUksT0FBTyxRQUFRLFNBQVUsUUFBTyxPQUFPLEdBQUc7QUFDOUMsU0FBTyxLQUFLLFVBQVUsR0FBRztBQUMzQjtBQUVPLFNBQVMsa0JBQ2QsU0FDQSxVQUNRO0FBQ1IsUUFBTSxtQkFBbUI7QUFDekIsUUFBTSxRQUFRLGlCQUFpQixLQUFLLE9BQU87QUFFM0MsTUFBSSxXQUFvQyxDQUFDO0FBQ3pDLE1BQUksT0FBTztBQUVYLE1BQUksT0FBTztBQUVULFVBQU0sWUFBWSxNQUFNLENBQUM7QUFDekIsZUFBVyxRQUFRLFVBQVUsTUFBTSxJQUFJLEdBQUc7QUFDeEMsWUFBTSxNQUFNLEtBQUssUUFBUSxHQUFHO0FBQzVCLFVBQUksTUFBTSxHQUFHO0FBQ1gsY0FBTSxNQUFNLEtBQUssTUFBTSxHQUFHLEdBQUcsRUFBRSxLQUFLO0FBQ3BDLGNBQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxDQUFDLEVBQUUsS0FBSztBQUNyQyxZQUFJLElBQUksV0FBVyxHQUFHLEtBQUssSUFBSSxTQUFTLEdBQUcsR0FBRztBQUM1QyxjQUFJO0FBQ0YscUJBQVMsR0FBRyxJQUFJLEtBQUssTUFBTSxHQUFHO0FBQUEsVUFDaEMsUUFBUTtBQUNOLHFCQUFTLEdBQUcsSUFBSTtBQUFBLFVBQ2xCO0FBQUEsUUFDRixPQUFPO0FBQ0wsbUJBQVMsR0FBRyxJQUFJLElBQUksUUFBUSxnQkFBZ0IsRUFBRTtBQUFBLFFBQ2hEO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFDQSxXQUFPLFFBQVEsTUFBTSxNQUFNLENBQUMsRUFBRSxNQUFNO0FBQUEsRUFDdEM7QUFHQSxRQUFNLFNBQVMsRUFBRSxHQUFHLFVBQVUsR0FBRyxTQUFTO0FBRzFDLFFBQU0sUUFBUSxPQUFPLFFBQVEsTUFBTSxFQUNoQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxNQUFNLE1BQVMsRUFDakMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEtBQUssZUFBZSxDQUFDLENBQUMsRUFBRTtBQUUvQyxNQUFJLE1BQU0sV0FBVyxFQUFHLFFBQU87QUFFL0IsUUFBTSxXQUFXO0FBQUEsRUFBUSxNQUFNLEtBQUssSUFBSSxDQUFDO0FBQUE7QUFBQTtBQUN6QyxTQUFPLFdBQVc7QUFDcEI7OztBQ2hGQSxzQkFBMkI7OztBQ0xwQixJQUFNLHFCQUFOLE1BQXlCO0FBQUEsRUFJOUIsWUFBWSxPQUE2QixDQUFDLEdBQUc7QUFIN0MsU0FBUSxRQUFrQixDQUFDO0FBSXpCLFNBQUssVUFBVSxLQUFLLFdBQVc7QUFBQSxFQUNqQztBQUFBO0FBQUEsRUFHQSxNQUFxQjtBQUNuQixVQUFNLE1BQU0sWUFBWSxJQUFJO0FBQzVCLFNBQUssTUFBTSxLQUFLLEdBQUc7QUFFbkIsUUFBSSxLQUFLLE1BQU0sU0FBUyxLQUFLLFNBQVM7QUFDcEMsV0FBSyxNQUFNLE1BQU07QUFBQSxJQUNuQjtBQUVBLFFBQUksS0FBSyxNQUFNLFNBQVMsRUFBRyxRQUFPO0FBR2xDLFVBQU0sWUFBc0IsQ0FBQztBQUM3QixhQUFTLElBQUksR0FBRyxJQUFJLEtBQUssTUFBTSxRQUFRLEtBQUs7QUFDMUMsZ0JBQVUsS0FBSyxLQUFLLE1BQU0sQ0FBQyxJQUFJLEtBQUssTUFBTSxJQUFJLENBQUMsQ0FBQztBQUFBLElBQ2xEO0FBRUEsVUFBTSxNQUFNLFVBQVUsT0FBTyxDQUFDLEdBQUcsTUFBTSxJQUFJLEdBQUcsQ0FBQyxJQUFJLFVBQVU7QUFDN0QsUUFBSSxPQUFPLEVBQUcsUUFBTztBQUVyQixVQUFNLE1BQU0sS0FBSyxNQUFNLE1BQVEsR0FBRztBQUVsQyxRQUFJLE1BQU0sWUFBWSxNQUFNLFNBQVUsUUFBTztBQUM3QyxXQUFPO0FBQUEsRUFDVDtBQUFBLEVBRUEsUUFBYztBQUNaLFNBQUssUUFBUSxDQUFDO0FBQUEsRUFDaEI7QUFDRjtBQUVBLElBQU0sV0FBVztBQUNqQixJQUFNLFdBQVc7OztBQ3BCVixJQUFNLGFBQU4sTUFBaUI7QUFBQSxFQU90QixZQUNFLFFBQ0EsU0FDQSxZQUFpQyxDQUFDLEdBQ2xDO0FBQ0EsU0FBSyxRQUFRLEVBQUUsR0FBRyxRQUFRO0FBQzFCLFNBQUssWUFBWTtBQUNqQixTQUFLLGdCQUFnQixJQUFJLG1CQUFtQixFQUFFLFNBQVMsRUFBRSxDQUFDO0FBQzFELFNBQUssWUFBWSxLQUFLLE1BQU0sTUFBTTtBQUFBLEVBQ3BDO0FBQUEsRUFFUSxNQUFNLFFBQWtDO0FBQzlDLFVBQU0sT0FBTyxPQUFPLFVBQVUsRUFBRSxLQUFLLGNBQWMsQ0FBQztBQUdwRCxVQUFNLFdBQVcsS0FBSyxVQUFVLEVBQUUsS0FBSyxnQkFBZ0IsQ0FBQztBQUN4RCxTQUFLLFlBQVksUUFBUTtBQUd6QixRQUFJLEtBQUssTUFBTSxjQUFjO0FBQzNCLFlBQU0sTUFBTSxLQUFLLFVBQVUsRUFBRSxLQUFLLG9CQUFvQixDQUFDO0FBQ3ZELFlBQU0sU0FBUyxJQUFJLFNBQVMsVUFBVTtBQUFBLFFBQ3BDLEtBQUs7QUFBQSxRQUNMLE1BQU0sTUFBTSxLQUFLLE1BQU0sWUFBWTtBQUFBLE1BQ3JDLENBQUM7QUFDRCxhQUFPLGlCQUFpQixTQUFTLE1BQU0sS0FBSyxnQkFBZ0IsQ0FBQztBQUFBLElBQy9EO0FBR0EsVUFBTSxVQUFVLEtBQUssVUFBVSxFQUFFLEtBQUssY0FBYyxDQUFDO0FBRXJELFVBQU0sV0FBVyxRQUFRLFNBQVMsVUFBVSxFQUFFLEtBQUssaUJBQWlCLE1BQU0sT0FBSSxDQUFDO0FBQy9FLGFBQVMsaUJBQWlCLFNBQVMsTUFBTSxLQUFLLE9BQU8sS0FBSyxNQUFNLEtBQUssTUFBTSxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBRXBGLFVBQU0sWUFBWSxRQUFRLFNBQVMsVUFBVSxFQUFFLEtBQUssa0JBQWtCLE1BQU0sUUFBSyxDQUFDO0FBQ2xGLGNBQVUsaUJBQWlCLFNBQVMsTUFBTSxLQUFLLE9BQU8sS0FBSyxNQUFNLE1BQU0sQ0FBQyxDQUFDO0FBRXpFLFVBQU0sU0FBUyxRQUFRLFNBQVMsVUFBVSxFQUFFLEtBQUssZUFBZSxNQUFNLFlBQVksQ0FBQztBQUNuRixXQUFPLGlCQUFpQixTQUFTLE1BQU0sS0FBSyxNQUFNLE1BQU0sQ0FBQztBQUd6RCxVQUFNLGFBQWEsS0FBSyxVQUFVLEVBQUUsS0FBSyxrQkFBa0IsQ0FBQztBQUM1RCxVQUFNLFlBQVksV0FBVyxTQUFTLFNBQVMsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUNuRSxjQUFVLFVBQVUsS0FBSyxNQUFNO0FBQy9CLGNBQVUsaUJBQWlCLFVBQVUsTUFBTTtBQUN6QyxXQUFLLE1BQU0sWUFBWSxVQUFVO0FBQ2pDLFdBQUssc0JBQXNCLElBQUk7QUFDL0IsV0FBSyxVQUFVLGNBQWMsS0FBSyxNQUFNLFNBQVM7QUFBQSxJQUNuRCxDQUFDO0FBQ0QsZUFBVyxXQUFXLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNsRCxTQUFLLHNCQUFzQixJQUFJO0FBRS9CLFdBQU87QUFBQSxFQUNUO0FBQUEsRUFFUSxZQUFZLFdBQXdCO0FBQzFDLGNBQVUsTUFBTTtBQUNoQixVQUFNLFVBQVUsVUFBVSxXQUFXLEVBQUUsS0FBSyxhQUFhLE1BQU0sT0FBTyxLQUFLLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDdkYsWUFBUSxpQkFBaUIsU0FBUyxNQUFNLEtBQUssZ0JBQWdCLE9BQU8sQ0FBQztBQUVyRSxjQUFVLFdBQVcsRUFBRSxLQUFLLFdBQVcsTUFBTSxTQUFTLEtBQUssTUFBTSxNQUFNLElBQUksQ0FBQztBQUFBLEVBQzlFO0FBQUEsRUFFUSxnQkFBZ0IsSUFBaUI7QUFDdkMsVUFBTSxRQUFRLFNBQVMsY0FBYyxPQUFPO0FBQzVDLFVBQU0sT0FBTztBQUNiLFVBQU0sUUFBUSxPQUFPLEtBQUssTUFBTSxHQUFHO0FBQ25DLFVBQU0sWUFBWTtBQUNsQixVQUFNLE1BQU07QUFDWixVQUFNLE1BQU07QUFFWixPQUFHLFlBQVksS0FBSztBQUNwQixVQUFNLE1BQU07QUFDWixVQUFNLE9BQU87QUFFYixVQUFNLFNBQVMsTUFBTTtBQUNuQixZQUFNLE1BQU0sU0FBUyxNQUFNLE9BQU8sRUFBRTtBQUNwQyxVQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssT0FBTyxNQUFNLE9BQU8sS0FBSztBQUMxQyxhQUFLLE9BQU8sR0FBRztBQUFBLE1BQ2pCO0FBQ0EsV0FBSyxhQUFhO0FBQUEsSUFDcEI7QUFFQSxVQUFNLGlCQUFpQixRQUFRLE1BQU07QUFDckMsVUFBTSxpQkFBaUIsV0FBVyxDQUFDLE1BQU07QUFDdkMsVUFBSSxFQUFFLFFBQVEsUUFBUyxRQUFPO0FBQzlCLFVBQUksRUFBRSxRQUFRLFNBQVUsTUFBSyxhQUFhO0FBQUEsSUFDNUMsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUVRLGVBQWU7QUFDckIsVUFBTSxNQUFNLEtBQUssVUFBVSxjQUFjLGdCQUFnQjtBQUN6RCxRQUFJLElBQUssTUFBSyxZQUFZLEdBQUc7QUFBQSxFQUMvQjtBQUFBLEVBRVEsT0FBTyxLQUFhO0FBQzFCLFNBQUssTUFBTSxNQUFNO0FBRWpCLFVBQU0sVUFBVSxNQUFNO0FBQ3RCLFVBQU0sU0FBUyxLQUFLLE1BQU0sTUFBTSxDQUFDO0FBQ2pDLFFBQUksV0FBVyxPQUFPLFlBQVksS0FBSztBQUNyQyxXQUFLLE1BQU0sZUFBZTtBQUFBLElBQzVCLFdBQVcsVUFBVSxNQUFNLFdBQVcsS0FBSztBQUN6QyxXQUFLLE1BQU0sZUFBZTtBQUFBLElBQzVCLE9BQU87QUFDTCxXQUFLLE1BQU0sZUFBZTtBQUFBLElBQzVCO0FBQ0EsU0FBSyxhQUFhO0FBQ2xCLFNBQUssaUJBQWlCO0FBQ3RCLFNBQUssVUFBVSxXQUFXLEtBQUssTUFBTSxHQUFHO0FBQUEsRUFDMUM7QUFBQSxFQUVRLGtCQUFrQjtBQUN4QixRQUFJLEtBQUssTUFBTSxjQUFjO0FBQzNCLFdBQUssT0FBTyxLQUFLLE1BQU0sWUFBWTtBQUFBLElBQ3JDO0FBQUEsRUFDRjtBQUFBLEVBRVEsbUJBQW1CO0FBQ3pCLFVBQU0sV0FBVyxLQUFLLFVBQVUsY0FBYyxvQkFBb0I7QUFDbEUsUUFBSSxTQUFVLFVBQVMsT0FBTztBQUU5QixRQUFJLEtBQUssTUFBTSxjQUFjO0FBQzNCLFlBQU0sVUFBVSxLQUFLLFVBQVUsY0FBYyxjQUFjO0FBQzNELFlBQU0sTUFBTSxLQUFLLFVBQVUsVUFBVSxFQUFFLEtBQUssb0JBQW9CLENBQUM7QUFDakUsVUFBSSxRQUFTLE1BQUssVUFBVSxhQUFhLEtBQUssT0FBTztBQUFBLFVBQ2hELE1BQUssVUFBVSxZQUFZLEdBQUc7QUFFbkMsWUFBTSxNQUFNLElBQUksU0FBUyxVQUFVO0FBQUEsUUFDakMsS0FBSztBQUFBLFFBQ0wsTUFBTSxNQUFNLEtBQUssTUFBTSxZQUFZO0FBQUEsTUFDckMsQ0FBQztBQUNELFVBQUksaUJBQWlCLFNBQVMsTUFBTSxLQUFLLGdCQUFnQixDQUFDO0FBQUEsSUFDNUQ7QUFBQSxFQUNGO0FBQUEsRUFFUSxNQUFNLEtBQXdCO0FBQ3BDLFVBQU0sTUFBTSxLQUFLLGNBQWMsSUFBSTtBQUduQyxRQUFJLFVBQVUsSUFBSSxvQkFBb0I7QUFDdEMsaUJBQWEsS0FBSyxlQUFlO0FBQ2pDLFNBQUssa0JBQWtCLFdBQVcsTUFBTSxJQUFJLFVBQVUsT0FBTyxvQkFBb0IsR0FBRyxHQUFHO0FBRXZGLFFBQUksUUFBUSxNQUFNO0FBQ2hCLFdBQUssT0FBTyxHQUFHO0FBQUEsSUFDakI7QUFBQSxFQUNGO0FBQUEsRUFFUSxzQkFBc0IsTUFBbUI7QUFDL0MsU0FBSyxVQUFVLE9BQU8saUJBQWlCLEtBQUssTUFBTSxTQUFTO0FBQzNELFNBQUssVUFBVSxPQUFPLG1CQUFtQixDQUFDLEtBQUssTUFBTSxTQUFTO0FBQUEsRUFDaEU7QUFBQSxFQUVBLFdBQTRCO0FBQzFCLFdBQU8sRUFBRSxHQUFHLEtBQUssTUFBTTtBQUFBLEVBQ3pCO0FBQUEsRUFFQSxNQUFNLFFBQTJCO0FBQy9CLFdBQU8sWUFBWSxLQUFLLFNBQVM7QUFBQSxFQUNuQztBQUFBLEVBRUEsVUFBZ0I7QUFDZCxTQUFLLFVBQVUsT0FBTztBQUN0QixpQkFBYSxLQUFLLGVBQWU7QUFBQSxFQUNuQztBQUNGOzs7QUM3TEEsSUFBTSxZQUFZLENBQUMsS0FBSyxNQUFNLEtBQUssTUFBTSxLQUFLLEtBQUssTUFBTSxLQUFLLE1BQU0sS0FBSyxNQUFNLEdBQUc7QUFHbEYsSUFBTSxpQkFBeUM7QUFBQSxFQUM3QyxJQUFJO0FBQUEsRUFBSyxJQUFJO0FBQUEsRUFBSyxJQUFJO0FBQUEsRUFBSyxPQUFPO0FBQUEsRUFBSyxPQUFPO0FBQUEsRUFDOUMsT0FBTztBQUFBLEVBQUssT0FBTztBQUFBLEVBQU0sT0FBTztBQUFBLEVBQU0sSUFBSTtBQUFBLEVBQzFDLElBQUk7QUFBQSxFQUFNLElBQUk7QUFBQSxFQUFNLElBQUk7QUFDMUI7QUFHQSxJQUFNLGlCQUF5QyxPQUFPO0FBQUEsRUFDcEQsT0FBTyxRQUFRLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZEO0FBY08sSUFBTSxhQUFOLE1BQWlCO0FBQUEsRUFLdEIsWUFDRSxRQUNBLFNBQ0EsWUFBaUMsQ0FBQyxHQUNsQztBQUNBLFNBQUssUUFBUSxFQUFFLEdBQUcsUUFBUTtBQUMxQixTQUFLLFlBQVk7QUFDakIsU0FBSyxZQUFZLEtBQUssTUFBTSxNQUFNO0FBQUEsRUFDcEM7QUFBQSxFQUVRLE1BQU0sUUFBa0M7QUFDOUMsVUFBTSxPQUFPLE9BQU8sVUFBVSxFQUFFLEtBQUssY0FBYyxDQUFDO0FBR3BELFVBQU0sV0FBVyxLQUFLLFVBQVUsRUFBRSxLQUFLLGdCQUFnQixDQUFDO0FBQ3hELFNBQUssWUFBWSxRQUFRO0FBR3pCLFNBQUssZUFBZSxJQUFJO0FBR3hCLFVBQU0sVUFBVSxLQUFLLFVBQVUsRUFBRSxLQUFLLGNBQWMsQ0FBQztBQUVyRCxVQUFNLFVBQVUsUUFBUSxTQUFTLFVBQVUsRUFBRSxLQUFLLHlCQUF5QixNQUFNLFNBQUksQ0FBQztBQUN0RixZQUFRLGlCQUFpQixTQUFTLE1BQU0sS0FBSyxjQUFjLEVBQUUsQ0FBQztBQUU5RCxVQUFNLFFBQVEsUUFBUSxTQUFTLFVBQVUsRUFBRSxLQUFLLHVCQUF1QixNQUFNLFNBQUksQ0FBQztBQUNsRixVQUFNLGlCQUFpQixTQUFTLE1BQU0sS0FBSyxjQUFjLENBQUMsQ0FBQztBQUUzRCxVQUFNLFVBQVUsUUFBUSxTQUFTLFVBQVU7QUFBQSxNQUN6QyxLQUFLO0FBQUEsTUFDTCxNQUFNLEtBQUssTUFBTSxVQUFVLFVBQVUsVUFBVTtBQUFBLElBQ2pELENBQUM7QUFDRCxZQUFRLGlCQUFpQixTQUFTLE1BQU0sS0FBSyxXQUFXLENBQUM7QUFFekQsVUFBTSxjQUFjLFFBQVEsU0FBUyxVQUFVO0FBQUEsTUFDN0MsS0FBSztBQUFBLE1BQ0wsTUFBTTtBQUFBLElBQ1IsQ0FBQztBQUNELGdCQUFZLGlCQUFpQixTQUFTLE1BQU0sS0FBSyxlQUFlLENBQUM7QUFHakUsVUFBTSxhQUFhLEtBQUssVUFBVSxFQUFFLEtBQUssa0JBQWtCLENBQUM7QUFDNUQsVUFBTSxZQUFZLFdBQVcsU0FBUyxTQUFTLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDbkUsY0FBVSxVQUFVLEtBQUssTUFBTTtBQUMvQixjQUFVLGlCQUFpQixVQUFVLE1BQU07QUFDekMsV0FBSyxNQUFNLFlBQVksVUFBVTtBQUNqQyxXQUFLLHNCQUFzQixJQUFJO0FBQy9CLFdBQUssVUFBVSxjQUFjLEtBQUssTUFBTSxTQUFTO0FBQUEsSUFDbkQsQ0FBQztBQUNELGVBQVcsV0FBVyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDaEQsU0FBSyxzQkFBc0IsSUFBSTtBQUUvQixXQUFPO0FBQUEsRUFDVDtBQUFBLEVBRVEsWUFBWSxXQUF3QjtBQUMxQyxjQUFVLE1BQU07QUFDaEIsVUFBTSxhQUFhLEtBQUssaUJBQWlCLEtBQUssTUFBTSxLQUFLLEtBQUssTUFBTSxLQUFLO0FBQ3pFLFVBQU0sS0FBSyxVQUFVLFdBQVcsRUFBRSxLQUFLLGFBQWEsTUFBTSxXQUFXLENBQUM7QUFDdEUsT0FBRyxpQkFBaUIsU0FBUyxNQUFNLEtBQUssZ0JBQWdCLEVBQUUsQ0FBQztBQUFBLEVBQzdEO0FBQUEsRUFFUSxlQUFlLE1BQW1CO0FBQ3hDLFVBQU0sV0FBVyxLQUFLLGNBQWMsbUJBQW1CO0FBQ3ZELFFBQUksU0FBVSxVQUFTLE9BQU87QUFFOUIsVUFBTSxXQUFXLEtBQUssZ0JBQWdCO0FBQ3RDLFFBQUksQ0FBQyxTQUFVO0FBRWYsVUFBTSxNQUFNLEtBQUssVUFBVSxFQUFFLEtBQUssbUJBQW1CLENBQUM7QUFFdEQsVUFBTSxVQUFVLEtBQUssY0FBYyxjQUFjO0FBQ2pELFFBQUksUUFBUyxNQUFLLGFBQWEsS0FBSyxPQUFPO0FBQUEsUUFDdEMsTUFBSyxZQUFZLEdBQUc7QUFFekIsUUFBSSxXQUFXLEVBQUUsS0FBSyxnQkFBZ0IsTUFBTSxhQUFhLFFBQVEsR0FBRyxDQUFDO0FBQUEsRUFDdkU7QUFBQSxFQUVRLGlCQUFpQixLQUFhLE9BQXVCO0FBQzNELFdBQU8sVUFBVSxVQUFVLEdBQUcsR0FBRyxNQUFNO0FBQUEsRUFDekM7QUFBQSxFQUVRLGdCQUFnQixTQUFpRDtBQUN2RSxRQUFJLFFBQVEsU0FBUyxHQUFHLEdBQUc7QUFDekIsYUFBTyxFQUFFLEtBQUssUUFBUSxNQUFNLEdBQUcsRUFBRSxHQUFHLE9BQU8sUUFBUTtBQUFBLElBQ3JEO0FBQ0EsV0FBTyxFQUFFLEtBQUssU0FBUyxPQUFPLFFBQVE7QUFBQSxFQUN4QztBQUFBLEVBRVEsZ0JBQWdCLElBQWlCO0FBQ3ZDLFVBQU0sUUFBUSxTQUFTLGNBQWMsT0FBTztBQUM1QyxVQUFNLFFBQVEsS0FBSyxpQkFBaUIsS0FBSyxNQUFNLEtBQUssS0FBSyxNQUFNLEtBQUs7QUFDcEUsVUFBTSxZQUFZO0FBRWxCLE9BQUcsWUFBWSxLQUFLO0FBQ3BCLFVBQU0sTUFBTTtBQUNaLFVBQU0sT0FBTztBQUViLFVBQU0sU0FBUyxNQUFNO0FBQ25CLFlBQU0sU0FBUyxLQUFLLGdCQUFnQixNQUFNLE1BQU0sS0FBSyxDQUFDO0FBQ3RELFVBQUksVUFBVSxTQUFTLE9BQU8sR0FBRyxHQUFHO0FBQ2xDLGFBQUssTUFBTSxNQUFNLE9BQU87QUFDeEIsYUFBSyxNQUFNLFFBQVEsT0FBTztBQUMxQixhQUFLLFFBQVE7QUFDYixhQUFLLFVBQVUsV0FBVyxLQUFLLE1BQU0sS0FBSyxLQUFLLE1BQU0sS0FBSztBQUFBLE1BQzVEO0FBQUEsSUFDRjtBQUVBLFVBQU0saUJBQWlCLFFBQVEsTUFBTTtBQUNyQyxVQUFNLGlCQUFpQixXQUFXLENBQUMsTUFBTTtBQUN2QyxVQUFJLEVBQUUsUUFBUSxTQUFTO0FBQ3JCLGVBQU87QUFDUCxjQUFNLEtBQUs7QUFBQSxNQUNiO0FBQ0EsVUFBSSxFQUFFLFFBQVEsU0FBVSxNQUFLLFFBQVE7QUFBQSxJQUN2QyxDQUFDO0FBQUEsRUFDSDtBQUFBLEVBRVEsY0FBYyxPQUFlO0FBQ25DLFVBQU0sTUFBTSxVQUFVLFFBQVEsS0FBSyxNQUFNLEdBQUc7QUFDNUMsUUFBSSxRQUFRLEdBQUk7QUFDaEIsVUFBTSxVQUFVLE1BQU0sUUFBUSxNQUFNO0FBQ3BDLFNBQUssTUFBTSxNQUFNLFVBQVUsTUFBTTtBQUNqQyxTQUFLLFFBQVE7QUFDYixTQUFLLFVBQVUsV0FBVyxLQUFLLE1BQU0sS0FBSyxLQUFLLE1BQU0sS0FBSztBQUFBLEVBQzVEO0FBQUEsRUFFUSxhQUFhO0FBQ25CLFNBQUssTUFBTSxRQUFRLEtBQUssTUFBTSxVQUFVLFVBQVUsVUFBVTtBQUM1RCxTQUFLLFFBQVE7QUFDYixTQUFLLFVBQVUsV0FBVyxLQUFLLE1BQU0sS0FBSyxLQUFLLE1BQU0sS0FBSztBQUFBLEVBQzVEO0FBQUEsRUFFUSxpQkFBaUI7QUFDdkIsVUFBTSxXQUFXLEtBQUssZ0JBQWdCLElBQUk7QUFDMUMsUUFBSSxVQUFVO0FBQ1osWUFBTSxTQUFTLEtBQUssZ0JBQWdCLFFBQVE7QUFDNUMsV0FBSyxNQUFNLE1BQU0sT0FBTztBQUN4QixXQUFLLE1BQU0sUUFBUSxPQUFPO0FBQzFCLFdBQUssUUFBUTtBQUNiLFdBQUssVUFBVSxXQUFXLEtBQUssTUFBTSxLQUFLLEtBQUssTUFBTSxLQUFLO0FBQUEsSUFDNUQ7QUFBQSxFQUNGO0FBQUEsRUFFUSxnQkFBZ0IsVUFBVSxPQUEyQjtBQUMzRCxVQUFNLFVBQVUsS0FBSyxpQkFBaUIsS0FBSyxNQUFNLEtBQUssS0FBSyxNQUFNLEtBQUs7QUFDdEUsUUFBSSxLQUFLLE1BQU0sVUFBVSxTQUFTO0FBQ2hDLFlBQU0sTUFBTSxlQUFlLE9BQU87QUFDbEMsYUFBTyxPQUFPO0FBQUEsSUFDaEIsT0FBTztBQUNMLFlBQU0sTUFBTSxlQUFlLE9BQU87QUFDbEMsYUFBTyxPQUFPO0FBQUEsSUFDaEI7QUFBQSxFQUNGO0FBQUEsRUFFUSxVQUFVO0FBQ2hCLFVBQU0sU0FBUyxLQUFLLFVBQVUsY0FBYyxnQkFBZ0I7QUFDNUQsUUFBSSxPQUFRLE1BQUssWUFBWSxNQUFNO0FBQ25DLFNBQUssZUFBZSxLQUFLLFNBQVM7QUFFbEMsVUFBTSxVQUFVLEtBQUssVUFBVSxjQUFjLHNCQUFzQjtBQUNuRSxRQUFJLFFBQVMsU0FBUSxjQUFjLEtBQUssTUFBTSxVQUFVLFVBQVUsVUFBVTtBQUFBLEVBQzlFO0FBQUEsRUFFUSxzQkFBc0IsTUFBbUI7QUFDL0MsU0FBSyxVQUFVLE9BQU8saUJBQWlCLEtBQUssTUFBTSxTQUFTO0FBQzNELFNBQUssVUFBVSxPQUFPLG1CQUFtQixDQUFDLEtBQUssTUFBTSxTQUFTO0FBQUEsRUFDaEU7QUFBQSxFQUVBLFdBQTRCO0FBQzFCLFdBQU8sRUFBRSxHQUFHLEtBQUssTUFBTTtBQUFBLEVBQ3pCO0FBQUEsRUFFQSxNQUFNLFFBQTJCO0FBQy9CLFdBQU8sWUFBWSxLQUFLLFNBQVM7QUFBQSxFQUNuQztBQUFBLEVBRUEsVUFBZ0I7QUFDZCxTQUFLLFVBQVUsT0FBTztBQUFBLEVBQ3hCO0FBQ0Y7OztBSHBNTyxJQUFNLHVCQUFOLGNBQW1DLHNCQUFNO0FBQUEsRUFNOUMsWUFBWSxLQUFVLE1BQXdCLFdBQWtDO0FBQzlFLFVBQU0sR0FBRztBQUNULFNBQUssT0FBTztBQUNaLFNBQUssWUFBWTtBQUFBLEVBQ25CO0FBQUEsRUFFQSxTQUFTO0FBQ1AsVUFBTSxFQUFFLFVBQVUsSUFBSTtBQUN0QixjQUFVLFNBQVMsbUJBQW1CO0FBR3RDLFVBQU0sU0FBUyxVQUFVLFVBQVUsRUFBRSxLQUFLLG1CQUFtQixDQUFDO0FBQzlELFdBQU8sU0FBUyxNQUFNLEVBQUUsTUFBTSxxQkFBcUIsS0FBSyxLQUFLLFFBQVEsR0FBRyxDQUFDO0FBQ3pFLFdBQU8sU0FBUyxLQUFLO0FBQUEsTUFDbkIsTUFBTTtBQUFBLE1BQ04sS0FBSztBQUFBLElBQ1AsQ0FBQztBQUVELFVBQU0sT0FBTyxVQUFVLFVBQVUsRUFBRSxLQUFLLGlCQUFpQixDQUFDO0FBRzFELFVBQU0sYUFBYSxLQUFLLFVBQVUsRUFBRSxLQUFLLG9CQUFvQixDQUFDO0FBQzlELGVBQVcsU0FBUyxNQUFNLEVBQUUsS0FBSywyQkFBMkIsTUFBTSxRQUFRLENBQUM7QUFDM0UsU0FBSyxhQUFhLElBQUksV0FBVyxZQUFZLEtBQUssS0FBSyxLQUFLO0FBQUEsTUFDMUQsVUFBVSxDQUFDLFFBQVE7QUFBQSxNQUVuQjtBQUFBLE1BQ0EsYUFBYSxNQUFNO0FBQUEsTUFFbkI7QUFBQSxJQUNGLENBQUM7QUFHRCxVQUFNLGFBQWEsS0FBSyxVQUFVLEVBQUUsS0FBSyxvQkFBb0IsQ0FBQztBQUM5RCxlQUFXLFNBQVMsTUFBTSxFQUFFLEtBQUssMkJBQTJCLE1BQU0sTUFBTSxDQUFDO0FBQ3pFLFNBQUssYUFBYSxJQUFJLFdBQVcsWUFBWSxLQUFLLEtBQUssS0FBSztBQUFBLE1BQzFELFVBQVUsQ0FBQyxLQUFLLFVBQVU7QUFBQSxNQUUxQjtBQUFBLElBQ0YsQ0FBQztBQUdELFVBQU0sU0FBUyxVQUFVLFVBQVUsRUFBRSxLQUFLLG1CQUFtQixDQUFDO0FBRTlELFVBQU0sVUFBVSxPQUFPLFNBQVMsVUFBVSxFQUFFLEtBQUssd0JBQXdCLE1BQU0sT0FBTyxDQUFDO0FBQ3ZGLFlBQVEsaUJBQWlCLFNBQVMsTUFBTTtBQUN0QyxVQUFJLEtBQUssY0FBYyxLQUFLLFlBQVk7QUFDdEMsYUFBSyxVQUFVLE9BQU87QUFBQSxVQUNwQixLQUFLLEtBQUssV0FBVyxTQUFTO0FBQUEsVUFDOUIsS0FBSyxLQUFLLFdBQVcsU0FBUztBQUFBLFFBQ2hDLENBQUM7QUFBQSxNQUNIO0FBQ0EsV0FBSyxNQUFNO0FBQUEsSUFDYixDQUFDO0FBRUQsVUFBTSxZQUFZLE9BQU8sU0FBUyxVQUFVLEVBQUUsS0FBSyxrQkFBa0IsTUFBTSxTQUFTLENBQUM7QUFDckYsY0FBVSxpQkFBaUIsU0FBUyxNQUFNO0FBQ3hDLFdBQUssVUFBVSxXQUFXO0FBQzFCLFdBQUssTUFBTTtBQUFBLElBQ2IsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUVBLFVBQVU7QUFDUixVQUFNLEVBQUUsVUFBVSxJQUFJO0FBQ3RCLGNBQVUsTUFBTTtBQUFBLEVBQ2xCO0FBQ0Y7OztBSS9FTyxJQUFNLG9CQUFOLE1BQXdCO0FBQUEsRUFVN0IsWUFDRSxRQUNBLFVBQ0EsS0FDQSxhQUFhLEdBQ2I7QUFWRixTQUFRLFVBQThCO0FBQ3RDLFNBQVEsWUFBZ0M7QUFVdEMsU0FBSyxZQUFZLE9BQU8sVUFBVSxFQUFFLEtBQUssZUFBZSxDQUFDO0FBQ3pELFNBQUssV0FBVztBQUNoQixTQUFLLE1BQU07QUFDWCxTQUFLLGFBQWE7QUFBQSxFQUNwQjtBQUFBLEVBRUEsUUFBYztBQUNaLFNBQUssVUFBVSxNQUFNO0FBRXJCLFFBQUksS0FBSyxTQUFTLFdBQVcsR0FBRztBQUM5QixXQUFLLFVBQVUsVUFBVTtBQUFBLFFBQ3ZCLEtBQUs7QUFBQSxRQUNMLE1BQU07QUFBQSxNQUNSLENBQUM7QUFDRCxXQUFLLGVBQWU7QUFDcEI7QUFBQSxJQUNGO0FBR0EsVUFBTSxZQUFZLEtBQUssSUFBSSxHQUFHLEtBQUssU0FBUyxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztBQUNoRSxVQUFNLGlCQUFpQixZQUFZLEtBQUs7QUFHeEMsU0FBSyxVQUFVLEtBQUssVUFBVSxVQUFVLEVBQUUsS0FBSyxxQkFBcUIsQ0FBQztBQUdyRSxTQUFLLFNBQVMsUUFBUSxDQUFDLFFBQVE7QUFDN0IsWUFBTSxXQUFZLElBQUksV0FBVyxLQUFLLGNBQWMsaUJBQWtCO0FBQ3RFLFlBQU0sWUFBYSxJQUFJLFNBQVMsSUFBSSxZQUFZLGlCQUFrQjtBQUVsRSxZQUFNLE1BQU0sS0FBSyxRQUFTLFVBQVUsRUFBRSxLQUFLLHVCQUF1QixDQUFDO0FBQ25FLFVBQUksTUFBTSxPQUFPLEdBQUcsT0FBTztBQUMzQixVQUFJLE1BQU0sUUFBUSxHQUFHLFFBQVE7QUFDN0IsVUFBSSxNQUFNLGtCQUFrQixJQUFJO0FBQ2hDLFVBQUksTUFBTSxZQUFZLHVCQUF1QixJQUFJLEtBQUs7QUFFdEQsVUFBSSxXQUFXO0FBQUEsUUFDYixLQUFLO0FBQUEsUUFDTCxNQUFNLElBQUk7QUFBQSxNQUNaLENBQUM7QUFFRCxVQUFJLGlCQUFpQixjQUFjLE1BQU0sS0FBSyxZQUFZLEtBQUssR0FBRyxDQUFDO0FBQ25FLFVBQUksaUJBQWlCLGNBQWMsTUFBTSxLQUFLLFlBQVksQ0FBQztBQUFBLElBQzdELENBQUM7QUFFRCxTQUFLLGVBQWU7QUFBQSxFQUN0QjtBQUFBLEVBRVEsaUJBQXVCO0FBQzdCLFVBQU0sTUFBTSxLQUFLLFVBQVUsVUFBVSxFQUFFLEtBQUssMEJBQTBCLENBQUM7QUFDdkUsUUFBSSxXQUFXO0FBQUEsTUFDYixLQUFLO0FBQUEsTUFDTCxNQUFNLGlCQUFpQixLQUFLLFVBQVUsT0FBTyxLQUFLLGVBQWUsSUFBSSxLQUFLLEdBQUc7QUFBQSxJQUMvRSxDQUFDO0FBRUQsVUFBTSxTQUFTLElBQUksU0FBUyxTQUFTLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFDdEQsV0FBTyxZQUFZO0FBQ25CLFdBQU8sTUFBTTtBQUNiLFdBQU8sTUFBTSxPQUFPLEtBQUssS0FBSyxLQUFLLGFBQWEsQ0FBQyxDQUFDO0FBQ2xELFdBQU8sUUFBUSxPQUFPLEtBQUssVUFBVTtBQUNyQyxXQUFPLE9BQU87QUFFZCxXQUFPLGlCQUFpQixTQUFTLE1BQU07QUFDckMsWUFBTSxNQUFNLFNBQVMsT0FBTyxPQUFPLEVBQUU7QUFDckMsV0FBSyxhQUFhO0FBRWxCLFlBQU0sUUFBUSxJQUFJLGNBQWMsNEJBQTRCO0FBQzVELFVBQUksT0FBTztBQUNULGNBQU0sY0FBYyxpQkFBaUIsR0FBRyxPQUFPLFFBQVEsSUFBSSxLQUFLLEdBQUc7QUFBQSxNQUNyRTtBQUNBLFdBQUssaUJBQWlCLEdBQUc7QUFFekIsV0FBSyxNQUFNO0FBQUEsSUFDYixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBRVEsWUFBWSxLQUF1QixRQUEyQjtBQUNwRSxRQUFJLENBQUMsS0FBSyxRQUFTO0FBRW5CLFNBQUssWUFBWSxLQUFLLFFBQVEsVUFBVSxFQUFFLEtBQUssdUJBQXVCLENBQUM7QUFDdkUsVUFBTSxVQUFVLEtBQUssS0FBSztBQUMxQixVQUFNLFlBQVksSUFBSSxXQUFXLElBQUk7QUFDckMsVUFBTSxXQUFXLEtBQUssV0FBVyxTQUFTO0FBQzFDLFVBQU0sVUFBVSxJQUFJLFNBQVMsSUFBSTtBQUNqQyxVQUFNLFNBQVMsS0FBSyxXQUFXLE9BQU87QUFFdEMsU0FBSyxVQUFVLFlBQVk7QUFBQSxnQkFDZixJQUFJLEtBQUs7QUFBQSxhQUNaLElBQUksUUFBUSxXQUFXLElBQUksTUFBTTtBQUFBLFFBQ3RDLFFBQVEsV0FBVyxNQUFNO0FBQUE7QUFJN0IsVUFBTSxZQUFZLEtBQUssUUFBUSxzQkFBc0I7QUFDckQsVUFBTSxVQUFVLE9BQU8sc0JBQXNCO0FBQzdDLFVBQU0sT0FBTyxRQUFRLE9BQU8sVUFBVSxPQUFPLFFBQVEsUUFBUSxJQUFJO0FBQ2pFLFVBQU0sTUFBTTtBQUNaLFNBQUssVUFBVSxNQUFNLE9BQU8sR0FBRyxJQUFJO0FBQ25DLFNBQUssVUFBVSxNQUFNLE1BQU0sR0FBRyxHQUFHO0FBQUEsRUFDbkM7QUFBQSxFQUVRLGNBQW9CO0FBQzFCLFFBQUksS0FBSyxXQUFXO0FBQ2xCLFdBQUssVUFBVSxPQUFPO0FBQ3RCLFdBQUssWUFBWTtBQUFBLElBQ25CO0FBQUEsRUFDRjtBQUFBLEVBRVEsV0FBVyxLQUFxQjtBQUN0QyxVQUFNLElBQUksS0FBSyxNQUFNLE1BQU0sRUFBRTtBQUM3QixVQUFNLElBQUksS0FBSyxNQUFNLE1BQU0sRUFBRTtBQUM3QixVQUFNLEtBQUssS0FBSyxNQUFPLE1BQU0sSUFBSyxHQUFHO0FBQ3JDLFdBQU8sR0FBRyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsU0FBUyxHQUFHLEdBQUcsQ0FBQyxJQUFJLEdBQUcsU0FBUyxFQUFFLFNBQVMsR0FBRyxHQUFHLENBQUM7QUFBQSxFQUNoRjtBQUFBLEVBRUEsVUFBZ0I7QUFDZCxTQUFLLFVBQVUsT0FBTztBQUFBLEVBQ3hCO0FBQ0Y7OztBQzlJQSxJQUFNLGtCQUFrQjtBQUFBLEVBQ3RCO0FBQUEsRUFBSztBQUFBLEVBQU07QUFBQSxFQUFLO0FBQUEsRUFBTTtBQUFBLEVBQUs7QUFBQSxFQUFLO0FBQUEsRUFBTTtBQUFBLEVBQUs7QUFBQSxFQUFNO0FBQUEsRUFBSztBQUFBLEVBQU07QUFDOUQ7QUFRTyxJQUFNLGNBQU4sTUFBa0I7QUFBQSxFQUt2QixZQUFZLFFBQXFCLFNBQTJCO0FBRjVELFNBQVEsV0FBK0I7QUFHckMsU0FBSyxRQUFRLEVBQUUsR0FBRyxRQUFRO0FBQzFCLFNBQUssWUFBWSxPQUFPLFVBQVUsRUFBRSxLQUFLLFlBQVksQ0FBQztBQUFBLEVBQ3hEO0FBQUEsRUFFQSxRQUFjO0FBQ1osU0FBSyxVQUFVLE1BQU07QUFFckIsVUFBTSxPQUFPLEtBQUssVUFBVSxVQUFVLEVBQUUsS0FBSyxpQkFBaUIsQ0FBQztBQUcvRCxvQkFBZ0IsUUFBUSxDQUFDLE1BQU0sTUFBTTtBQUNuQyxZQUFNLFFBQVMsSUFBSSxLQUFNO0FBQ3pCLFlBQU0sT0FBTyxLQUFLLFVBQVUsRUFBRSxLQUFLLGlCQUFpQixDQUFDO0FBRXJELFdBQUssYUFBYSxhQUFhLElBQUk7QUFDbkMsV0FBSyxNQUFNLFlBQVksVUFBVSxLQUFLO0FBQUEsSUFDeEMsQ0FBQztBQUdELFNBQUssV0FBVyxLQUFLLFVBQVU7QUFBQSxNQUM3QixLQUFLLG9CQUNILEtBQUssTUFBTSxZQUNQLCtCQUNBLDhCQUNOO0FBQUEsSUFDRixDQUFDO0FBQ0QsU0FBSyxlQUFlLEtBQUssTUFBTSxHQUFHO0FBR2xDLFVBQU0sUUFBUSxLQUFLLFVBQVUsVUFBVTtBQUFBLE1BQ3JDLEtBQUssbUJBQ0gsS0FBSyxNQUFNLFlBQ1AsOEJBQ0EsNkJBQ047QUFBQSxNQUNBLE1BQU0sS0FBSyxpQkFBaUI7QUFBQSxJQUM5QixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBRUEsT0FBTyxPQUErQjtBQUNwQyxTQUFLLFFBQVEsRUFBRSxHQUFHLE1BQU07QUFDeEIsU0FBSyxlQUFlLEtBQUssTUFBTSxHQUFHO0FBQ2xDLFFBQUksS0FBSyxVQUFVO0FBQ2pCLFdBQUssU0FBUyxZQUFZLG9CQUN4QixLQUFLLE1BQU0sWUFDUCwrQkFDQSw4QkFDTjtBQUFBLElBQ0Y7QUFDQSxVQUFNLFFBQVEsS0FBSyxVQUFVLGNBQWMsa0JBQWtCO0FBQzdELFFBQUksT0FBTztBQUNULFlBQU0sWUFBWSxtQkFDaEIsS0FBSyxNQUFNLFlBQ1AsOEJBQ0EsNkJBQ047QUFDQSxZQUFNLGNBQWMsS0FBSyxpQkFBaUI7QUFBQSxJQUM1QztBQUFBLEVBQ0Y7QUFBQSxFQUVRLGVBQWUsS0FBbUI7QUFDeEMsVUFBTSxNQUFNLGdCQUFnQixRQUFRLEdBQUc7QUFDdkMsUUFBSSxRQUFRLEdBQUk7QUFDaEIsVUFBTSxRQUFTLE1BQU0sS0FBTTtBQUMzQixRQUFJLEtBQUssVUFBVTtBQUNqQixXQUFLLFNBQVMsTUFBTSxZQUFZLFVBQVUsS0FBSztBQUFBLElBQ2pEO0FBQUEsRUFDRjtBQUFBLEVBRVEsbUJBQTJCO0FBQ2pDLFdBQU8sS0FBSyxNQUFNLFVBQVUsVUFDeEIsR0FBRyxLQUFLLE1BQU0sR0FBRyxNQUNqQixLQUFLLE1BQU07QUFBQSxFQUNqQjtBQUFBLEVBRUEsVUFBZ0I7QUFDZCxTQUFLLFVBQVUsT0FBTztBQUFBLEVBQ3hCO0FBQ0Y7OztBQzFGQSxJQUFNLGFBQTJCO0FBQUEsRUFDL0I7QUFBQSxFQUFNO0FBQUEsRUFBTTtBQUFBLEVBQU07QUFBQSxFQUFNO0FBQUEsRUFBTTtBQUFBLEVBQU07QUFBQSxFQUFNO0FBQUEsRUFBTTtBQUFBLEVBQU07QUFBQSxFQUFPO0FBQUEsRUFBTztBQUN0RTtBQUNBLElBQU0sYUFBMkI7QUFBQSxFQUMvQjtBQUFBLEVBQU07QUFBQSxFQUFNO0FBQUEsRUFBTTtBQUFBLEVBQU07QUFBQSxFQUFNO0FBQUEsRUFBTTtBQUFBLEVBQU07QUFBQSxFQUFNO0FBQUEsRUFBTTtBQUFBLEVBQU87QUFBQSxFQUFPO0FBQ3RFO0FBR08sU0FBUyxpQkFBaUIsS0FBYSxPQUF1QztBQUNuRixRQUFNLE9BQU8sSUFBSSxRQUFRLFNBQVMsRUFBRSxFQUFFLFFBQVEsS0FBSyxPQUFPO0FBQzFELFFBQU0sTUFBa0Q7QUFBQSxJQUN0RCxPQUFPO0FBQUEsTUFDTCxHQUFHO0FBQUEsTUFBTSxNQUFNO0FBQUEsTUFBTSxVQUFVO0FBQUEsTUFBTSxJQUFJO0FBQUEsTUFBTSxVQUFVO0FBQUEsTUFDekQsTUFBTTtBQUFBLE1BQU0sVUFBVTtBQUFBLE1BQU0sSUFBSTtBQUFBLE1BQU0sVUFBVTtBQUFBLE1BQ2hELElBQUk7QUFBQSxNQUFNLFVBQVU7QUFBQSxNQUFNLEdBQUc7QUFBQSxNQUFNLEdBQUc7QUFBQSxNQUFNLEdBQUc7QUFBQSxNQUFNLEdBQUc7QUFBQSxNQUFPLEdBQUc7QUFBQSxNQUFPLEdBQUc7QUFBQSxJQUM5RTtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsVUFBVTtBQUFBLE1BQU0sTUFBTTtBQUFBLE1BQU0sSUFBSTtBQUFBLE1BQU0sVUFBVTtBQUFBLE1BQ2hELElBQUk7QUFBQSxNQUFNLFVBQVU7QUFBQSxNQUFNLEdBQUc7QUFBQSxNQUFNLEdBQUc7QUFBQSxNQUN0QyxHQUFHO0FBQUEsTUFBTSxHQUFHO0FBQUEsTUFBTSxHQUFHO0FBQUEsTUFBTSxHQUFHO0FBQUEsTUFBTSxHQUFHO0FBQUEsTUFDdkMsVUFBVTtBQUFBLE1BQU8sTUFBTTtBQUFBLE1BQU8sVUFBVTtBQUFBLE1BQU8sSUFBSTtBQUFBLElBQ3JEO0FBQUEsRUFDRjtBQUNBLFFBQU0sSUFBSSxVQUFVLFVBQVUsVUFBVTtBQUN4QyxTQUFPLElBQUksQ0FBQyxJQUFJLElBQUksS0FBSyxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUs7QUFDNUM7QUFHTyxTQUFTLGlCQUFpQixTQUFpRTtBQUNoRyxRQUFNLE1BQTBEO0FBQUEsSUFDOUQsTUFBTSxFQUFFLEtBQUssS0FBSyxPQUFPLFFBQVE7QUFBQSxJQUNqQyxNQUFNLEVBQUUsS0FBSyxNQUFNLE9BQU8sUUFBUTtBQUFBLElBQ2xDLE1BQU0sRUFBRSxLQUFLLE1BQU0sT0FBTyxRQUFRO0FBQUEsSUFDbEMsTUFBTSxFQUFFLEtBQUssTUFBTSxPQUFPLFFBQVE7QUFBQSxJQUNsQyxNQUFNLEVBQUUsS0FBSyxNQUFNLE9BQU8sUUFBUTtBQUFBLElBQ2xDLE1BQU0sRUFBRSxLQUFLLE1BQU0sT0FBTyxRQUFRO0FBQUEsSUFDbEMsTUFBTSxFQUFFLEtBQUssS0FBSyxPQUFPLFFBQVE7QUFBQSxJQUNqQyxNQUFNLEVBQUUsS0FBSyxLQUFLLE9BQU8sUUFBUTtBQUFBLElBQ2pDLE1BQU0sRUFBRSxLQUFLLEtBQUssT0FBTyxRQUFRO0FBQUEsSUFDakMsT0FBTyxFQUFFLEtBQUssS0FBSyxPQUFPLFFBQVE7QUFBQSxJQUNsQyxPQUFPLEVBQUUsS0FBSyxLQUFLLE9BQU8sUUFBUTtBQUFBLElBQ2xDLE9BQU8sRUFBRSxLQUFLLEtBQUssT0FBTyxRQUFRO0FBQUEsSUFDbEMsTUFBTSxFQUFFLEtBQUssT0FBTyxPQUFPLFFBQVE7QUFBQSxJQUNuQyxNQUFNLEVBQUUsS0FBSyxPQUFPLE9BQU8sUUFBUTtBQUFBLElBQ25DLE1BQU0sRUFBRSxLQUFLLE9BQU8sT0FBTyxRQUFRO0FBQUEsSUFDbkMsTUFBTSxFQUFFLEtBQUssTUFBTSxPQUFPLFFBQVE7QUFBQSxJQUNsQyxNQUFNLEVBQUUsS0FBSyxNQUFNLE9BQU8sUUFBUTtBQUFBLElBQ2xDLE1BQU0sRUFBRSxLQUFLLE1BQU0sT0FBTyxRQUFRO0FBQUEsSUFDbEMsTUFBTSxFQUFFLEtBQUssTUFBTSxPQUFPLFFBQVE7QUFBQSxJQUNsQyxNQUFNLEVBQUUsS0FBSyxNQUFNLE9BQU8sUUFBUTtBQUFBLElBQ2xDLE1BQU0sRUFBRSxL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QUNBLFVBQ3lCO0FBQ3pCLFFBQUksQ0FBQyxLQUFLLFFBQVE7QUFFaEIsWUFBTSxhQUFhLEtBQUssSUFBSSxNQUFNLFFBQVE7QUFBQSxRQUN4QyxHQUFHLEtBQUssU0FBUyxHQUFHO0FBQUEsTUFDdEI7QUFDQSxXQUFLLFNBQVMsSUFBSSxPQUFPLFVBQVU7QUFBQSxJQUNyQztBQUVBLFdBQU8sSUFBSSxRQUFRLENBQUMsU0FBUyxXQUFXO0FBQ3RDLFlBQU0sS0FBSyxHQUFHLFFBQVEsSUFBSSxLQUFLLElBQUksQ0FBQztBQUNwQyxZQUFNLFVBQVUsQ0FBQyxNQUFvQjtBQUNuQyxZQUFJLEVBQUUsS0FBSyxPQUFPLEdBQUk7QUFDdEIsYUFBSyxPQUFRLG9CQUFvQixXQUFXLE9BQU87QUFDbkQsWUFBSSxFQUFFLEtBQUssU0FBUyxRQUFTLFFBQU8sSUFBSSxNQUFNLEVBQUUsS0FBSyxLQUFLLENBQUM7QUFBQSxZQUN0RCxTQUFRLEVBQUUsS0FBSyxNQUFNO0FBQUEsTUFDNUI7QUFDQSxXQUFLLE9BQVEsaUJBQWlCLFdBQVcsT0FBTztBQUNoRCxXQUFLLE9BQVEsWUFBWSxFQUFFLElBQUksTUFBTSxXQUFXLFlBQVksQ0FBQztBQUFBLElBQy9ELENBQUM7QUFBQSxFQUNIO0FBQUEsRUFFQSxNQUFjLFVBQVUsTUFBYyxRQUF3QixZQUFvQjtBQUNoRixVQUFNLGNBQWMsS0FBSyxlQUFlLE9BQU8sUUFBUTtBQUN2RCxVQUFNLGFBQWEsT0FBTyxjQUFjLEdBQUcsT0FBTyxHQUFHLE1BQU0sT0FBTyxXQUFXLEtBQUssT0FBTztBQUV6RixVQUFNLFVBQVUsa0JBQWtCLElBQUk7QUFBQSxNQUNwQyxjQUFjO0FBQUEsTUFDZCxLQUFLO0FBQUEsTUFDTCxlQUFlO0FBQUEsTUFDZixPQUFPLE9BQU87QUFBQSxNQUNkLFdBQVcsT0FBTztBQUFBLE1BQ2xCLGlCQUFpQixPQUFPO0FBQUEsTUFDeEIsaUJBQWlCO0FBQUEsTUFDakIsVUFBVTtBQUFBLElBQ1osQ0FBQztBQUVELFVBQU0sV0FBVyxLQUFLLElBQUksTUFBTSxjQUFjLElBQUk7QUFDbEQsUUFBSSxVQUFVO0FBQ1osWUFBTSxLQUFLLElBQUksTUFBTSxPQUFPLFVBQVUsT0FBTztBQUFBLElBQy9DLE9BQU87QUFDTCxZQUFNLEtBQUssSUFBSSxNQUFNLE9BQU8sTUFBTSxPQUFPO0FBQUEsSUFDM0M7QUFBQSxFQUNGO0FBQUEsRUFFUSxlQUFlLEtBQXFCO0FBQzFDLFVBQU0sSUFBSSxLQUFLLE1BQU0sTUFBTSxFQUFFO0FBQzdCLFVBQU0sSUFBSSxLQUFLLE1BQU0sTUFBTSxFQUFFO0FBQzdCLFdBQU8sR0FBRyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsU0FBUyxHQUFHLEdBQUcsQ0FBQztBQUFBLEVBQzlDO0FBQ0Y7IiwKICAibmFtZXMiOiBbImltcG9ydF9vYnNpZGlhbiJdCn0K
