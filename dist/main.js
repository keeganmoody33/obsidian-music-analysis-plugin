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
function serializeValue(val, indent = 0) {
  const pad = "  ".repeat(indent);
  if (Array.isArray(val)) {
    if (val.length === 0) return "[]";
    if (val.every((v) => v !== null && typeof v === "object" && !Array.isArray(v))) {
      return "\n" + val.map((item) => {
        const entries = Object.entries(item).map(([k2, v2]) => `${pad}    ${k2}: ${serializeValue(v2, indent + 2)}`).join("\n");
        return `${pad}  -
${entries}`;
      }).join("\n");
    }
    return "\n" + val.map((v) => `${pad}  - ${serializeScalar(v)}`).join("\n");
  }
  if (typeof val === "object" && val !== null) {
    const entries = Object.entries(val).map(([k2, v2]) => `${pad}  ${k2}: ${serializeValue(v2, indent + 1)}`);
    return "\n" + entries.join("\n");
  }
  return serializeScalar(val);
}
function serializeScalar(val) {
  if (val === null || val === void 0) return "";
  if (typeof val === "boolean") return String(val);
  if (typeof val === "number") return String(val);
  const str = String(val);
  const needsQuotes = str === "" || str.includes(":") || str.includes("#") || str.includes("\n") || str.includes('"') || str.startsWith("-") || str.startsWith("[") || str.startsWith("{") || str === "true" || str === "false" || str === "null" || str === "~" || /^\d{4}-/.test(str);
  if (needsQuotes) {
    return `"${str.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  }
  return str;
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
var SHARP_TO_NAME = {
  C: "C",
  "C#": "Csharp",
  Db: "Db",
  D: "D",
  "D#": "Dsharp",
  Eb: "Eb",
  E: "E",
  F: "F",
  "F#": "Fsharp",
  Gb: "Gb",
  G: "G",
  "G#": "Gsharp",
  Ab: "Ab",
  A: "A",
  "A#": "Asharp",
  Bb: "Bb",
  B: "B"
};
function keyNameToCamelot(key, scale) {
  const raw = key.endsWith("m") && key.length > 1 ? key.slice(0, -1) : key;
  const name = SHARP_TO_NAME[raw];
  if (!name) return void 0;
  const isMinor = scale === "minor";
  if (isMinor) {
    const minorMap = {
      Csharp: "12A",
      Db: "12A",
      Dsharp: "2A",
      Eb: "2A",
      Fsharp: "11A",
      Gb: "11A",
      Gsharp: "1A",
      Ab: "1A",
      Asharp: "3A",
      Bb: "3A",
      F: "4A",
      C: "5A",
      G: "6A",
      D: "7A",
      A: "8A",
      E: "9A",
      B: "10A"
    };
    return minorMap[name];
  }
  const majorMap = {
    B: "1B",
    Fsharp: "2B",
    Gb: "2B",
    Csharp: "3B",
    Db: "3B",
    Gsharp: "4B",
    Ab: "4B",
    Dsharp: "5B",
    Eb: "5B",
    Asharp: "6B",
    Bb: "6B",
    F: "7B",
    C: "8B",
    G: "9B",
    D: "10B",
    A: "11B",
    E: "12B"
  };
  return majorMap[name];
}
function camelotToKeyName(camelot) {
  const map = {
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
    "12A": { key: "C# / Dbm", scale: "minor" }
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
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 260 260");
    svg.setAttribute("class", "mam-camelot-wheel");
    this.container.appendChild(svg);
    const cx = 130;
    const cy = 130;
    const outerR = 100;
    const innerR = 60;
    for (let i = 0; i < 12; i++) {
      const angle = i * 30 - 90;
      const angleRad = angle * Math.PI / 180;
      const majorKey = MAJOR_KEYS[i];
      const minorKey = MINOR_KEYS[i];
      this.renderKey(svg, cx, cy, outerR, angleRad, majorKey, "major");
      this.renderKey(svg, cx, cy, innerR, angleRad, minorKey, "minor");
    }
    const legend = this.container.createDiv({ cls: "mam-camelot-legend" });
    legend.createSpan({ cls: "mam-camelot-current", text: "\u25CF current " });
    legend.createSpan({ cls: "mam-camelot-compatible", text: "\u25E6 compatible " });
  }
  renderKey(svg, cx, cy, radius, angleRad, key, type) {
    const ns = "http://www.w3.org/2000/svg";
    const x = cx + radius * Math.cos(angleRad);
    const y = cy + radius * Math.sin(angleRad);
    const g = document.createElementNS(ns, "g");
    g.setAttribute("class", `mam-camelot-key mam-camelot-key-${type}`);
    g.setAttribute("data-camelot", key);
    const compatible = this.config.current ? getCompatibleKeys(this.config.current) : [];
    if (this.config.current === key) {
      g.classList.add("mam-camelot-current");
    } else if (compatible.includes(key)) {
      g.classList.add("mam-camelot-compatible");
    }
    const text = document.createElementNS(ns, "text");
    text.setAttribute("class", "mam-camelot-label");
    text.setAttribute("x", String(x));
    text.setAttribute("y", String(y));
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.textContent = key;
    g.appendChild(text);
    svg.appendChild(g);
    g.addEventListener("click", () => {
      const match = camelotToKeyName(key);
      if (!match) return;
      const dvKey = match.key.split(" / ")[0];
      const dvQuery = `\`\`\`dataview
LIST
FROM #music
WHERE key = "${dvKey}"
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL21haW4udHMiLCAiLi4vc3JjL3NoYTI1Ni50cyIsICIuLi9zcmMveWFtbC1pbmplY3Rvci50cyIsICIuLi9zcmMvY29tcG9uZW50cy9jb25maXJtLW1vZGFsLnRzIiwgIi4uL3NyYy9jb21wb25lbnRzL3RhcC10ZW1wby50cyIsICIuLi9zcmMvY29tcG9uZW50cy9icG0tY29udHJvbC50cyIsICIuLi9zcmMvY29tcG9uZW50cy9rZXktY29udHJvbC50cyIsICIuLi9zcmMvY29tcG9uZW50cy9zdHJ1Y3R1cmUtdGltZWxpbmUudHMiLCAiLi4vc3JjL2NvbXBvbmVudHMvdHVuZXItbmVlZGxlLnRzIiwgIi4uL3NyYy9jb21wb25lbnRzL2NhbWVsb3Qtd2hlZWwudHMiLCAiLi4vc3JjL2NvbXBvbmVudHMvZGFzaGJvYXJkLXByb2Nlc3Nvci50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gbWFpbi50cyBcdTIwMTQgT2JzaWRpYW4gcGx1Z2luIGVudHJ5IHBvaW50IChTbGljZSAyOiBjb25maXJtLWZpcnN0IFVYKVxuaW1wb3J0IHsgUGx1Z2luLCBOb3RpY2UsIFRGaWxlLCBNYXJrZG93blZpZXcgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IHNoYTI1NiB9IGZyb20gXCIuL3NoYTI1NlwiO1xuaW1wb3J0IHsgaW5qZWN0RnJvbnRtYXR0ZXIgfSBmcm9tIFwiLi95YW1sLWluamVjdG9yXCI7XG5pbXBvcnQgeyBBbmFseXNpc1Jlc3VsdCB9IGZyb20gXCIuL2FuYWx5c2lzLWVuZ2luZVwiO1xuaW1wb3J0IHsgQW5hbHlzaXNDb25maXJtTW9kYWwgfSBmcm9tIFwiLi9jb21wb25lbnRzL2NvbmZpcm0tbW9kYWxcIjtcbmltcG9ydCB7IEJwbUNvbnRyb2xTdGF0ZSB9IGZyb20gXCIuL2NvbXBvbmVudHMvYnBtLWNvbnRyb2xcIjtcbmltcG9ydCB7IEtleUNvbnRyb2xTdGF0ZSB9IGZyb20gXCIuL2NvbXBvbmVudHMva2V5LWNvbnRyb2xcIjtcbmltcG9ydCB7IE11c2ljRGFzaGJvYXJkUHJvY2Vzc29yIH0gZnJvbSBcIi4vY29tcG9uZW50cy9kYXNoYm9hcmQtcHJvY2Vzc29yXCI7XG5cbmludGVyZmFjZSBBbmFseXNpc0NhY2hlRW50cnkge1xuICBoYXNoOiBzdHJpbmc7XG4gIHJlc3VsdDogQW5hbHlzaXNSZXN1bHQ7XG4gIHRpbWVzdGFtcDogbnVtYmVyO1xufVxuXG4vLyBJbi1tZW1vcnkgY2FjaGUgZm9yIGN1cnJlbnQgc2Vzc2lvbiAodmF1bHQtYm91bmQpXG5jb25zdCBhbmFseXNpc0NhY2hlID0gbmV3IE1hcDxzdHJpbmcsIEFuYWx5c2lzQ2FjaGVFbnRyeT4oKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTXVzaWNBbmFseXNpc1BsdWdpbiBleHRlbmRzIFBsdWdpbiB7XG4gIHByaXZhdGUgd29ya2VyOiBXb3JrZXIgfCBudWxsID0gbnVsbDtcblxuICBhc3luYyBvbmxvYWQoKSB7XG4gICAgY29uc29sZS5sb2coXCJbTXVzaWNBbmFseXNpc10gU2xpY2UgMyBsb2FkZWRcIik7XG5cbiAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwiYW5hbHl6ZS1hdWRpb1wiLFxuICAgICAgbmFtZTogXCJBbmFseXplIGF1ZGlvICh0ZW1wbywga2V5LCBkdXJhdGlvbilcIixcbiAgICAgIGNhbGxiYWNrOiAoKSA9PiB0aGlzLnJ1bkFuYWx5c2lzKCksXG4gICAgfSk7XG5cbiAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwiY29uZmlybS1hbmFseXNpc1wiLFxuICAgICAgbmFtZTogXCJDb25maXJtIGFuYWx5c2lzIChvcGVuIGNvcnJlY3Rpb24gbW9kYWwpXCIsXG4gICAgICBjYWxsYmFjazogKCkgPT4gdGhpcy5vcGVuQ29uZmlybU1vZGFsKCksXG4gICAgfSk7XG5cbiAgICAvLyBSZWdpc3RlciBgbXVzaWMtZGFzaGJvYXJkYCBjb2RlLWJsb2NrIHJlbmRlcmVyXG4gICAgY29uc3QgZGFzaGJvYXJkUHJvY2Vzc29yID0gbmV3IE11c2ljRGFzaGJvYXJkUHJvY2Vzc29yKHtcbiAgICAgIHJlYWRGaWxlOiBhc3luYyAocGF0aDogc3RyaW5nKSA9PiB7XG4gICAgICAgIGNvbnN0IGYgPSB0aGlzLmFwcC52YXVsdC5nZXRGaWxlQnlQYXRoKHBhdGgpO1xuICAgICAgICBpZiAoIWYpIHRocm93IG5ldyBFcnJvcihcIkZpbGUgbm90IGZvdW5kOiBcIiArIHBhdGgpO1xuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZChmKTtcbiAgICAgIH0sXG4gICAgICBtb2RpZnlGaWxlOiBhc3luYyAocGF0aDogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcpID0+IHtcbiAgICAgICAgY29uc3QgZiA9IHRoaXMuYXBwLnZhdWx0LmdldEZpbGVCeVBhdGgocGF0aCk7XG4gICAgICAgIGlmICghZikgdGhyb3cgbmV3IEVycm9yKFwiRmlsZSBub3QgZm91bmQ6IFwiICsgcGF0aCk7XG4gICAgICAgIGF3YWl0IHRoaXMuYXBwLnZhdWx0Lm1vZGlmeShmLCBjb250ZW50KTtcbiAgICAgIH0sXG4gICAgICBnZXRGaWxlQnlQYXRoOiAocGF0aDogc3RyaW5nKSA9PiB7XG4gICAgICAgIGNvbnN0IGYgPSB0aGlzLmFwcC52YXVsdC5nZXRGaWxlQnlQYXRoKHBhdGgpO1xuICAgICAgICByZXR1cm4gZiA/IHsgcGF0aDogZi5wYXRoIH0gOiBudWxsO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHRoaXMucmVnaXN0ZXJNYXJrZG93bkNvZGVCbG9ja1Byb2Nlc3NvcihcbiAgICAgIFwibXVzaWMtZGFzaGJvYXJkXCIsXG4gICAgICAoc291cmNlLCBlbCwgY3R4KSA9PiBkYXNoYm9hcmRQcm9jZXNzb3IucHJvY2Vzcyhzb3VyY2UsIGVsLCBjdHgpXG4gICAgKTtcbiAgfVxuXG4gIG9udW5sb2FkKCkge1xuICAgIHRoaXMud29ya2VyPy50ZXJtaW5hdGUoKTtcbiAgICB0aGlzLndvcmtlciA9IG51bGw7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHJ1bkFuYWx5c2lzKCkge1xuICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgIGlmICghZmlsZSB8fCAhdGhpcy5pc0F1ZGlvRmlsZShmaWxlKSkge1xuICAgICAgbmV3IE5vdGljZShcIlNlbGVjdCBhbiBhdWRpbyBmaWxlIChtcDMvd2F2L2ZsYWMpXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGFycmF5QnVmID0gYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZEJpbmFyeShmaWxlKTtcbiAgICBjb25zdCBoYXNoID0gYXdhaXQgc2hhMjU2KGFycmF5QnVmKTtcblxuICAgIGNvbnN0IG5vdGVQYXRoID0gYCR7ZmlsZS5wYXRofS5tZGA7XG4gICAgY29uc3QgY2FjaGVkID0gYW5hbHlzaXNDYWNoZS5nZXQobm90ZVBhdGgpO1xuICAgIGlmIChjYWNoZWQgJiYgY2FjaGVkLmhhc2ggPT09IGhhc2gpIHtcbiAgICAgIG5ldyBOb3RpY2UoYENhY2hlIGhpdDogJHtjYWNoZWQucmVzdWx0LnRlbXBvfSBCUE0sICR7Y2FjaGVkLnJlc3VsdC5rZXl9YCk7XG4gICAgICBhd2FpdCB0aGlzLndyaXRlTm90ZShub3RlUGF0aCwgY2FjaGVkLnJlc3VsdCwgZmlsZS5uYW1lKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBuZXcgTm90aWNlKFwiQW5hbHl6aW5nIGF1ZGlvLi4uXCIpO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5hbmFseXplSW5Xb3JrZXIoYXJyYXlCdWYsIGZpbGUubmFtZSk7XG4gICAgaWYgKHJlc3VsdC5lcnJvcikge1xuICAgICAgbmV3IE5vdGljZShgQW5hbHlzaXMgZmFpbGVkOiAke3Jlc3VsdC5lcnJvcn1gKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBhbmFseXNpc0NhY2hlLnNldChub3RlUGF0aCwgeyBoYXNoLCByZXN1bHQsIHRpbWVzdGFtcDogRGF0ZS5ub3coKSB9KTtcblxuICAgIG5ldyBOb3RpY2UoXG4gICAgICBgRG9uZTogJHtyZXN1bHQudGVtcG99IEJQTSR7cmVzdWx0LmFsdGVybmF0ZVRlbXBvID8gXCIgKG9yIFwiICsgcmVzdWx0LmFsdGVybmF0ZVRlbXBvICsgXCI/KVwiIDogXCJcIn0sICR7cmVzdWx0LmtleX1gXG4gICAgKTtcbiAgICBhd2FpdCB0aGlzLndyaXRlTm90ZShub3RlUGF0aCwgcmVzdWx0LCBmaWxlLm5hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIE9wZW4gdGhlIGNvbmZpcm0gbW9kYWwgZm9yIHRoZSBjdXJyZW50bHkgb3BlbiBhbmFseXNpcyBub3RlLlxuICAgKiBQYXJzZXMgZXhpc3RpbmcgZnJvbnRtYXR0ZXIgYW5kIGxldHMgdGhlIHVzZXIgZWRpdCB0ZW1wby9rZXkuXG4gICAqL1xuICBwcml2YXRlIG9wZW5Db25maXJtTW9kYWwoKSB7XG4gICAgY29uc3QgdmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gICAgaWYgKCF2aWV3KSB7XG4gICAgICBuZXcgTm90aWNlKFwiT3BlbiBhbiBhbmFseXNpcyBub3RlIGZpcnN0XCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGZpbGUgPSB2aWV3LmZpbGU7XG4gICAgaWYgKCFmaWxlKSB7XG4gICAgICBuZXcgTm90aWNlKFwiTm8gZmlsZSBvcGVuXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGNhY2hlID0gdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRGaWxlQ2FjaGUoZmlsZSk7XG4gICAgY29uc3QgZm0gPSBjYWNoZT8uZnJvbnRtYXR0ZXIgfHwge307XG5cbiAgICBpZiAoIWZtLnRlbXBvICYmICFmbS5rZXkpIHtcbiAgICAgIG5ldyBOb3RpY2UoXCJObyBhbmFseXNpcyBkYXRhIGZvdW5kIGluIHRoaXMgbm90ZVwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBicG1TdGF0ZTogQnBtQ29udHJvbFN0YXRlID0ge1xuICAgICAgYnBtOiBmbS50ZW1wbyA/PyAwLFxuICAgICAgcmF3QnBtOiBmbS5yYXdfdGVtcG8gPz8gZm0udGVtcG8gPz8gMCxcbiAgICAgIGFsdGVybmF0ZUJwbTogZm0uYWx0ZXJuYXRlX3RlbXBvLFxuICAgICAgY29uZmlybWVkOiBmbS50ZW1wb19jb25maXJtZWQgPz8gZmFsc2UsXG4gICAgfTtcblxuICAgIGNvbnN0IGtleVBhcnRzID0gU3RyaW5nKGZtLmtleSB8fCBcIlwiKS5zcGxpdChcIiAvIFwiKTtcbiAgICBjb25zdCBrZXlOYW1lID0ga2V5UGFydHNbMF0gfHwgXCJcIjtcbiAgICBjb25zdCBpc01pbm9yID0ga2V5TmFtZS5lbmRzV2l0aChcIm1cIik7XG4gICAgY29uc3QgYmFzZUtleSA9IGlzTWlub3IgPyBrZXlOYW1lLnNsaWNlKDAsIC0xKSA6IGtleU5hbWU7XG5cbiAgICBjb25zdCBrZXlTdGF0ZTogS2V5Q29udHJvbFN0YXRlID0ge1xuICAgICAga2V5OiBiYXNlS2V5LFxuICAgICAgc2NhbGU6IGlzTWlub3IgPyBcIm1pbm9yXCIgOiBcIm1ham9yXCIsXG4gICAgICByZWxhdGl2ZUtleToga2V5UGFydHNbMV0sXG4gICAgICBjb25maXJtZWQ6IGZtLmtleV9jb25maXJtZWQgPz8gZmFsc2UsXG4gICAgfTtcblxuICAgIG5ldyBBbmFseXNpc0NvbmZpcm1Nb2RhbChcbiAgICAgIHRoaXMuYXBwLFxuICAgICAge1xuICAgICAgICBmaWxlTmFtZTogZmlsZS5iYXNlbmFtZSxcbiAgICAgICAgYnBtOiBicG1TdGF0ZSxcbiAgICAgICAga2V5OiBrZXlTdGF0ZSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG9uU2F2ZTogYXN5bmMgKGRhdGEpID0+IHtcbiAgICAgICAgICBjb25zdCBrZXlEaXNwbGF5ID0gZGF0YS5rZXkuc2NhbGUgPT09IFwibWlub3JcIlxuICAgICAgICAgICAgPyBgJHtkYXRhLmtleS5rZXl9bWBcbiAgICAgICAgICAgIDogZGF0YS5rZXkua2V5O1xuXG4gICAgICAgICAgY29uc3QgdXBkYXRlZCA9IGluamVjdEZyb250bWF0dGVyKGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQoZmlsZSksIHtcbiAgICAgICAgICAgIHRlbXBvOiBkYXRhLmJwbS5icG0sXG4gICAgICAgICAgICByYXdfdGVtcG86IGRhdGEuYnBtLnJhd0JwbSxcbiAgICAgICAgICAgIGFsdGVybmF0ZV90ZW1wbzogZGF0YS5icG0uYWx0ZXJuYXRlQnBtLFxuICAgICAgICAgICAgdGVtcG9fY29uZmlybWVkOiBkYXRhLmJwbS5jb25maXJtZWQsXG4gICAgICAgICAgICBrZXk6IGtleURpc3BsYXksXG4gICAgICAgICAgICBrZXlfY29uZmlybWVkOiBkYXRhLmtleS5jb25maXJtZWQsXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBhd2FpdCB0aGlzLmFwcC52YXVsdC5tb2RpZnkoZmlsZSwgdXBkYXRlZCk7XG4gICAgICAgICAgbmV3IE5vdGljZShcIkFuYWx5c2lzIHVwZGF0ZWRcIik7XG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgKS5vcGVuKCk7XG4gIH1cblxuICBwcml2YXRlIGlzQXVkaW9GaWxlKGZpbGU6IFRGaWxlKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIC9cXC4obXAzfHdhdnxmbGFjfGFpZnxvZ2d8bTRhKSQvaS50ZXN0KGZpbGUuZXh0ZW5zaW9uKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgYW5hbHl6ZUluV29ya2VyKFxuICAgIGF1ZGlvQnVmZmVyOiBBcnJheUJ1ZmZlcixcbiAgICBmaWxlTmFtZTogc3RyaW5nLFxuICApOiBQcm9taXNlPEFuYWx5c2lzUmVzdWx0PiB7XG4gICAgaWYgKCF0aGlzLndvcmtlcikge1xuICAgICAgLy8gVGhlIHdvcmtlciBKUyBpcyBidW5kbGVkIHRvIGRpc3Qvd29ya2VyLmpzIGJ5IGVzYnVpbGRcbiAgICAgIGNvbnN0IHdvcmtlclBhdGggPSB0aGlzLmFwcC52YXVsdC5hZGFwdGVyLmdldFJlc291cmNlUGF0aChcbiAgICAgICAgYCR7dGhpcy5tYW5pZmVzdC5kaXJ9L2Rpc3Qvd29ya2VyLmpzYCxcbiAgICAgICk7XG4gICAgICB0aGlzLndvcmtlciA9IG5ldyBXb3JrZXIod29ya2VyUGF0aCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGlkID0gYCR7ZmlsZU5hbWV9LSR7RGF0ZS5ub3coKX1gO1xuICAgICAgY29uc3QgaGFuZGxlciA9IChlOiBNZXNzYWdlRXZlbnQpID0+IHtcbiAgICAgICAgaWYgKGUuZGF0YS5pZCAhPT0gaWQpIHJldHVybjtcbiAgICAgICAgdGhpcy53b3JrZXIhLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGhhbmRsZXIpO1xuICAgICAgICBpZiAoZS5kYXRhLnR5cGUgPT09IFwiZXJyb3JcIikgcmVqZWN0KG5ldyBFcnJvcihlLmRhdGEuZXJyb3IpKTtcbiAgICAgICAgZWxzZSByZXNvbHZlKGUuZGF0YS5yZXN1bHQpO1xuICAgICAgfTtcbiAgICAgIHRoaXMud29ya2VyIS5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBoYW5kbGVyKTtcbiAgICAgIHRoaXMud29ya2VyIS5wb3N0TWVzc2FnZSh7IGlkLCB0eXBlOiBcImFuYWx5emVcIiwgYXVkaW9CdWZmZXIgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHdyaXRlTm90ZShwYXRoOiBzdHJpbmcsIHJlc3VsdDogQW5hbHlzaXNSZXN1bHQsIHNvdXJjZUZpbGU6IHN0cmluZykge1xuICAgIGNvbnN0IGR1cmF0aW9uU3RyID0gdGhpcy5mb3JtYXREdXJhdGlvbihyZXN1bHQuZHVyYXRpb24pO1xuICAgIGNvbnN0IGtleURpc3BsYXkgPSByZXN1bHQucmVsYXRpdmVLZXkgPyBgJHtyZXN1bHQua2V5fSAvICR7cmVzdWx0LnJlbGF0aXZlS2V5fWAgOiByZXN1bHQua2V5O1xuXG4gICAgY29uc3QgY29udGVudCA9IGluamVjdEZyb250bWF0dGVyKFwiXCIsIHtcbiAgICAgIGF1ZGlvX3NvdXJjZTogc291cmNlRmlsZSxcbiAgICAgIGtleToga2V5RGlzcGxheSxcbiAgICAgIGtleV9jb25maXJtZWQ6IGZhbHNlLFxuICAgICAgdGVtcG86IHJlc3VsdC50ZW1wbyxcbiAgICAgIHJhd190ZW1wbzogcmVzdWx0LnJhd1RlbXBvLFxuICAgICAgYWx0ZXJuYXRlX3RlbXBvOiByZXN1bHQuYWx0ZXJuYXRlVGVtcG8sXG4gICAgICB0ZW1wb19jb25maXJtZWQ6IGZhbHNlLFxuICAgICAgZHVyYXRpb246IGR1cmF0aW9uU3RyLFxuICAgIH0pO1xuXG4gICAgY29uc3QgZXhpc3RpbmcgPSB0aGlzLmFwcC52YXVsdC5nZXRGaWxlQnlQYXRoKHBhdGgpO1xuICAgIGlmIChleGlzdGluZykge1xuICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQubW9kaWZ5KGV4aXN0aW5nLCBjb250ZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQuY3JlYXRlKHBhdGgsIGNvbnRlbnQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZm9ybWF0RHVyYXRpb24oc2VjOiBudW1iZXIpOiBzdHJpbmcge1xuICAgIGNvbnN0IG0gPSBNYXRoLmZsb29yKHNlYyAvIDYwKTtcbiAgICBjb25zdCBzID0gTWF0aC5mbG9vcihzZWMgJSA2MCk7XG4gICAgcmV0dXJuIGAke219OiR7cy50b1N0cmluZygpLnBhZFN0YXJ0KDIsIFwiMFwiKX1gO1xuICB9XG59XG5cbi8vIFNpZGUtbm90ZTogZXhwb3NlIGZvciB0eXBlLWNoZWNraW5nIGluIHRlc3RzXG5leHBvcnQgeyBNdXNpY0FuYWx5c2lzUGx1Z2luIH07XG4iLCAiLyoqXG4gKiBTSEEtMjU2IGhhc2ggdXRpbGl0eSBcdTIwMTQgcnVucyBvZmZsaW5lLCB6ZXJvIG5ldHdvcmsuXG4gKi9cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNoYTI1NihidWZmZXI6IEFycmF5QnVmZmVyKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgY29uc3QgaGFzaEJ1ZmZlciA9IGF3YWl0IGNyeXB0by5zdWJ0bGUuZGlnZXN0KFwiU0hBLTI1NlwiLCBidWZmZXIpO1xuICBjb25zdCBoYXNoQXJyYXkgPSBBcnJheS5mcm9tKG5ldyBVaW50OEFycmF5KGhhc2hCdWZmZXIpKTtcbiAgcmV0dXJuIGhhc2hBcnJheS5tYXAoKGIpID0+IGIudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsIFwiMFwiKSkuam9pbihcIlwiKTtcbn1cbiIsICIvKipcbiAqIFlBTUwgZnJvbnRtYXR0ZXIgaW5qZWN0aW9uIHV0aWxpdHkuXG4gKiBOb24tZGVzdHJ1Y3RpdmU6IHByZXNlcnZlcyBleGlzdGluZyBmcm9udG1hdHRlciBhbmQgYm9keSB0ZXh0LlxuICogQURSLTAwMzogSHlicmlkIEFzc2V0IE5vdGVzXG4gKi9cblxuZXhwb3J0IGludGVyZmFjZSBBdWRpb01ldGFkYXRhIHtcbiAgYXVkaW9fc291cmNlPzogc3RyaW5nO1xuICBrZXk/OiBzdHJpbmc7XG4gIGtleV9jb25maXJtZWQ/OiBib29sZWFuO1xuICB0ZW1wbz86IG51bWJlcjtcbiAgdGVtcG9fY29uZmlybWVkPzogYm9vbGVhbjtcbiAgcmF3X3RlbXBvPzogbnVtYmVyO1xuICBhbHRlcm5hdGVfdGVtcG8/OiBudW1iZXI7XG4gIHRpbWVfc2lnbmF0dXJlPzogc3RyaW5nO1xuICBkdXJhdGlvbj86IHN0cmluZztcbiAgdG90YWxfYmFycz86IG51bWJlcjtcbiAgYXVkaW9fc3RhcnRfb2Zmc2V0PzogbnVtYmVyO1xuICBhbmFseXNpc19jb25maWRlbmNlPzogbnVtYmVyOyAvLyBERVBSRUNBVEVEIFx1MjAxNCBkbyBub3QgZGlzcGxheSBhcyB0cnVzdCBtZXRyaWNcbiAgc3RydWN0dXJlPzogQXJyYXk8e1xuICAgIHNlZ21lbnQ6IHN0cmluZztcbiAgICBiYXJzOiBbbnVtYmVyLCBudW1iZXJdO1xuICAgIHRpbWU6IFtzdHJpbmcsIHN0cmluZ107XG4gIH0+O1xuICBhcnRpc3Q/OiBzdHJpbmdbXTtcbiAgcHJvZHVjZXI/OiBzdHJpbmdbXTtcbiAgbWl4ZXI/OiBzdHJpbmdbXTtcbiAgZW5naW5lZXI/OiBzdHJpbmdbXTtcbiAgbXVzaWNpYW5zPzogc3RyaW5nW107XG4gIHByb2R1Y2VyX2luc3RhZ3JhbT86IHN0cmluZ1tdO1xuICBzb3VyY2VfdXJsPzogc3RyaW5nO1xuICBsaWNlbnNlX3N0YXR1cz86IHN0cmluZztcbn1cblxuZnVuY3Rpb24gc2VyaWFsaXplVmFsdWUodmFsOiB1bmtub3duLCBpbmRlbnQgPSAwKTogc3RyaW5nIHtcbiAgY29uc3QgcGFkID0gXCIgIFwiLnJlcGVhdChpbmRlbnQpO1xuXG4gIGlmIChBcnJheS5pc0FycmF5KHZhbCkpIHtcbiAgICBpZiAodmFsLmxlbmd0aCA9PT0gMCkgcmV0dXJuIFwiW11cIjtcbiAgICAvLyBJZiBhcnJheSBvZiBvYmplY3RzIChzdHJ1Y3R1cmUpLCBlbWl0IGluZGVudGVkIG9iamVjdCBmb3JtXG4gICAgaWYgKHZhbC5ldmVyeSgodikgPT4gdiAhPT0gbnVsbCAmJiB0eXBlb2YgdiA9PT0gXCJvYmplY3RcIiAmJiAhQXJyYXkuaXNBcnJheSh2KSkpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFwiXFxuXCIgK1xuICAgICAgICB2YWxcbiAgICAgICAgICAubWFwKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBlbnRyaWVzID0gT2JqZWN0LmVudHJpZXMoaXRlbSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPilcbiAgICAgICAgICAgICAgLm1hcCgoW2syLCB2Ml0pID0+IGAke3BhZH0gICAgJHtrMn06ICR7c2VyaWFsaXplVmFsdWUodjIsIGluZGVudCArIDIpfWApXG4gICAgICAgICAgICAgIC5qb2luKFwiXFxuXCIpO1xuICAgICAgICAgICAgcmV0dXJuIGAke3BhZH0gIC1cXG4ke2VudHJpZXN9YDtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5qb2luKFwiXFxuXCIpXG4gICAgICApO1xuICAgIH1cbiAgICAvLyBBcnJheSBvZiBwcmltaXRpdmVzXG4gICAgcmV0dXJuIFwiXFxuXCIgKyB2YWwubWFwKCh2KSA9PiBgJHtwYWR9ICAtICR7c2VyaWFsaXplU2NhbGFyKHYpfWApLmpvaW4oXCJcXG5cIik7XG4gIH1cblxuICBpZiAodHlwZW9mIHZhbCA9PT0gXCJvYmplY3RcIiAmJiB2YWwgIT09IG51bGwpIHtcbiAgICBjb25zdCBlbnRyaWVzID0gT2JqZWN0LmVudHJpZXModmFsIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+KVxuICAgICAgLm1hcCgoW2syLCB2Ml0pID0+IGAke3BhZH0gICR7azJ9OiAke3NlcmlhbGl6ZVZhbHVlKHYyLCBpbmRlbnQgKyAxKX1gKTtcbiAgICByZXR1cm4gXCJcXG5cIiArIGVudHJpZXMuam9pbihcIlxcblwiKTtcbiAgfVxuXG4gIHJldHVybiBzZXJpYWxpemVTY2FsYXIodmFsKTtcbn1cblxuLyoqIFF1b3RlIGEgc2NhbGFyIGlmIGl0IGNvbnRhaW5zIFlBTUwtc3BlY2lhbCBjaGFyYWN0ZXJzLiAqL1xuZnVuY3Rpb24gc2VyaWFsaXplU2NhbGFyKHZhbDogdW5rbm93bik6IHN0cmluZyB7XG4gIGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpIHJldHVybiBcIlwiO1xuICBpZiAodHlwZW9mIHZhbCA9PT0gXCJib29sZWFuXCIpIHJldHVybiBTdHJpbmcodmFsKTtcbiAgaWYgKHR5cGVvZiB2YWwgPT09IFwibnVtYmVyXCIpIHJldHVybiBTdHJpbmcodmFsKTtcblxuICBjb25zdCBzdHIgPSBTdHJpbmcodmFsKTtcbiAgLy8gTXVzdCBxdW90ZSBzdHJpbmdzIHRoYXQgY29udGFpbiA6LCAjLCBuZXdsaW5lLCBzdGFydCB3aXRoIHlhbWwgaW5kaWNhdG9ycyxcbiAgLy8gY29udGFpbiBxdW90ZXMsIG9yIGxvb2sgbGlrZSBib29sZWFucy9udW1iZXJzLlxuICBjb25zdCBuZWVkc1F1b3RlcyA9XG4gICAgc3RyID09PSBcIlwiIHx8XG4gICAgc3RyLmluY2x1ZGVzKFwiOlwiKSB8fFxuICAgIHN0ci5pbmNsdWRlcyhcIiNcIikgfHxcbiAgICBzdHIuaW5jbHVkZXMoXCJcXG5cIikgfHxcbiAgICBzdHIuaW5jbHVkZXMoJ1wiJykgfHxcbiAgICBzdHIuc3RhcnRzV2l0aChcIi1cIikgfHxcbiAgICBzdHIuc3RhcnRzV2l0aChcIltcIikgfHxcbiAgICBzdHIuc3RhcnRzV2l0aChcIntcIikgfHxcbiAgICBzdHIgPT09IFwidHJ1ZVwiIHx8XG4gICAgc3RyID09PSBcImZhbHNlXCIgfHxcbiAgICBzdHIgPT09IFwibnVsbFwiIHx8XG4gICAgc3RyID09PSBcIn5cIiB8fFxuICAgIC9eXFxkezR9LS8udGVzdChzdHIpOyAvLyBJU08gZGF0ZXNcblxuICBpZiAobmVlZHNRdW90ZXMpIHtcbiAgICAvLyBEb3VibGUtcXVvdGUgd2l0aCBlc2NhcGluZ1xuICAgIHJldHVybiBgXCIke3N0ci5yZXBsYWNlKC9cXFxcL2csIFwiXFxcXFxcXFxcIikucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpfVwiYDtcbiAgfVxuICByZXR1cm4gc3RyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5qZWN0RnJvbnRtYXR0ZXIoXG4gIGNvbnRlbnQ6IHN0cmluZyxcbiAgbWV0YWRhdGE6IEF1ZGlvTWV0YWRhdGEsXG4pOiBzdHJpbmcge1xuICBjb25zdCBmcm9udG1hdHRlclJlZ2V4ID0gL14tLS1cXHMqXFxuKFtcXHNcXFNdKj8pXFxuLS0tXFxzKlxcbj8vO1xuICBjb25zdCBtYXRjaCA9IGZyb250bWF0dGVyUmVnZXguZXhlYyhjb250ZW50KTtcblxuICBsZXQgZXhpc3Rpbmc6IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0ge307XG4gIGxldCBib2R5ID0gY29udGVudDtcblxuICBpZiAobWF0Y2gpIHtcbiAgICAvLyBQYXJzZSBleGlzdGluZyBZQU1MIChuYVx1MDBFRnZlIFx1MjAxNCBzdWZmaWNpZW50IGZvciBmbGF0IGtleXMgd2UgY29udHJvbClcbiAgICBjb25zdCB5YW1sQmxvY2sgPSBtYXRjaFsxXTtcbiAgICBmb3IgKGNvbnN0IGxpbmUgb2YgeWFtbEJsb2NrLnNwbGl0KFwiXFxuXCIpKSB7XG4gICAgICBjb25zdCBpZHggPSBsaW5lLmluZGV4T2YoXCI6XCIpO1xuICAgICAgaWYgKGlkeCA+IDApIHtcbiAgICAgICAgY29uc3Qga2V5ID0gbGluZS5zbGljZSgwLCBpZHgpLnRyaW0oKTtcbiAgICAgICAgY29uc3QgdmFsID0gbGluZS5zbGljZShpZHggKyAxKS50cmltKCk7XG4gICAgICAgIGlmICh2YWwuc3RhcnRzV2l0aChcIltcIikgJiYgdmFsLmVuZHNXaXRoKFwiXVwiKSkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBleGlzdGluZ1trZXldID0gSlNPTi5wYXJzZSh2YWwpO1xuICAgICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgZXhpc3Rpbmdba2V5XSA9IHZhbDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZXhpc3Rpbmdba2V5XSA9IHZhbC5yZXBsYWNlKC9eW1wiJ118W1wiJ10kL2csIFwiXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGJvZHkgPSBjb250ZW50LnNsaWNlKG1hdGNoWzBdLmxlbmd0aCk7XG4gIH1cblxuICAvLyBNZXJnZTogbWV0YWRhdGEgd2lucyBvdmVyIGV4aXN0aW5nIGZvciBvdXIga2V5c1xuICBjb25zdCBtZXJnZWQgPSB7IC4uLmV4aXN0aW5nLCAuLi5tZXRhZGF0YSB9O1xuXG4gIC8vIEJ1aWxkIFlBTUxcbiAgY29uc3QgbGluZXMgPSBPYmplY3QuZW50cmllcyhtZXJnZWQpXG4gICAgLmZpbHRlcigoWywgdl0pID0+IHYgIT09IHVuZGVmaW5lZClcbiAgICAubWFwKChbaywgdl0pID0+IGAke2t9OiAke3NlcmlhbGl6ZVZhbHVlKHYpfWApO1xuXG4gIGlmIChsaW5lcy5sZW5ndGggPT09IDApIHJldHVybiBjb250ZW50O1xuXG4gIGNvbnN0IG5ld0Zyb250ID0gYC0tLVxcbiR7bGluZXMuam9pbihcIlxcblwiKX1cXG4tLS1cXG5gO1xuICByZXR1cm4gbmV3RnJvbnQgKyBib2R5O1xufVxuIiwgIi8vIEFuYWx5c2lzQ29uZmlybU1vZGFsIFx1MjAxNCBvcGVucyBvbi1kZW1hbmQgd2hlbiB1c2VyIGNsaWNrcyBhbiB1bmNvbmZpcm1lZCB2YWx1ZS5cbi8vIFVzZXMgQnBtQ29udHJvbCArIEtleUNvbnRyb2wgKHJldXNhYmxlIGluIGRhc2hib2FyZCBsYXRlcikuXG4vL1xuLy8gQ1NTIGNsYXNzIGhvb2tzOlxuLy8gIC5tYW0tY29uZmlybS1tb2RhbCAgICAgICBcdTIwMTQgTW9kYWwgcm9vdFxuLy8gIC5tYW0tbW9kYWwtaGVhZGVyICAgICAgICBcdTIwMTQgVGl0bGUgYXJlYVxuLy8gIC5tYW0tbW9kYWwtYm9keSAgICAgICAgICBcdTIwMTQgQ29udHJvbHMgY29udGFpbmVyXG4vLyAgLm1hbS1tb2RhbC1zZWN0aW9uICAgICAgIFx1MjAxNCBCUE0gLyBLZXkgc2VjdGlvbiB3cmFwcGVyXG4vLyAgLm1hbS1tb2RhbC1zZWN0aW9uLWxhYmVsIFx1MjAxNCBcIlRlbXBvXCIgLyBcIktleVwiIGxhYmVsXG4vLyAgLm1hbS1tb2RhbC1mb290ZXIgICAgICAgIFx1MjAxNCBTYXZlIC8gQ2FuY2VsIGFjdGlvbnNcbi8vICAubWFtLWJ0bi1zYXZlICAgICAgICAgICAgXHUyMDE0IENvbW1pdCBjaGFuZ2VzXG4vLyAgLm1hbS1idG4tY2FuY2VsICAgICAgICAgIFx1MjAxNCBEaXNjYXJkIGNoYW5nZXNcblxuaW1wb3J0IHsgTW9kYWwsIEFwcCB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgQnBtQ29udHJvbCwgQnBtQ29udHJvbFN0YXRlIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvYnBtLWNvbnRyb2xcIjtcbmltcG9ydCB7IEtleUNvbnRyb2wsIEtleUNvbnRyb2xTdGF0ZSB9IGZyb20gXCIuLi9jb21wb25lbnRzL2tleS1jb250cm9sXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29uZmlybU1vZGFsRGF0YSB7XG4gIGZpbGVOYW1lOiBzdHJpbmc7XG4gIGJwbTogQnBtQ29udHJvbFN0YXRlO1xuICBrZXk6IEtleUNvbnRyb2xTdGF0ZTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDb25maXJtTW9kYWxDYWxsYmFja3Mge1xuICBvblNhdmU6IChkYXRhOiB7IGJwbTogQnBtQ29udHJvbFN0YXRlOyBrZXk6IEtleUNvbnRyb2xTdGF0ZSB9KSA9PiB2b2lkO1xuICBvbkNhbmNlbD86ICgpID0+IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBBbmFseXNpc0NvbmZpcm1Nb2RhbCBleHRlbmRzIE1vZGFsIHtcbiAgcHJpdmF0ZSBkYXRhOiBDb25maXJtTW9kYWxEYXRhO1xuICBwcml2YXRlIGNhbGxiYWNrczogQ29uZmlybU1vZGFsQ2FsbGJhY2tzO1xuICBwcml2YXRlIGJwbUNvbnRyb2w/OiBCcG1Db250cm9sO1xuICBwcml2YXRlIGtleUNvbnRyb2w/OiBLZXlDb250cm9sO1xuXG4gIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBkYXRhOiBDb25maXJtTW9kYWxEYXRhLCBjYWxsYmFja3M6IENvbmZpcm1Nb2RhbENhbGxiYWNrcykge1xuICAgIHN1cGVyKGFwcCk7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLmNhbGxiYWNrcyA9IGNhbGxiYWNrcztcbiAgfVxuXG4gIG9uT3BlbigpIHtcbiAgICBjb25zdCB7IGNvbnRlbnRFbCB9ID0gdGhpcztcbiAgICBjb250ZW50RWwuYWRkQ2xhc3MoXCJtYW0tY29uZmlybS1tb2RhbFwiKTtcblxuICAgIC8vIEhlYWRlclxuICAgIGNvbnN0IGhlYWRlciA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwibWFtLW1vZGFsLWhlYWRlclwiIH0pO1xuICAgIGhlYWRlci5jcmVhdGVFbChcImgyXCIsIHsgdGV4dDogYENvbmZpcm0gYW5hbHlzaXM6ICR7dGhpcy5kYXRhLmZpbGVOYW1lfWAgfSk7XG4gICAgaGVhZGVyLmNyZWF0ZUVsKFwicFwiLCB7XG4gICAgICB0ZXh0OiBcIlRhcCBvciBlZGl0IHZhbHVlcyBiZWxvdy4gTWFyayBjb25maXJtZWQgb25seSB3aGVuIHRoZXkgbWF0Y2ggeW91ciBlYXJzLlwiLFxuICAgICAgY2xzOiBcInNldHRpbmctaXRlbS1kZXNjcmlwdGlvblwiLFxuICAgIH0pO1xuXG4gICAgY29uc3QgYm9keSA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwibWFtLW1vZGFsLWJvZHlcIiB9KTtcblxuICAgIC8vIEJQTSBzZWN0aW9uXG4gICAgY29uc3QgYnBtU2VjdGlvbiA9IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIm1hbS1tb2RhbC1zZWN0aW9uXCIgfSk7XG4gICAgYnBtU2VjdGlvbi5jcmVhdGVFbChcImgzXCIsIHsgY2xzOiBcIm1hbS1tb2RhbC1zZWN0aW9uLWxhYmVsXCIsIHRleHQ6IFwiVGVtcG9cIiB9KTtcbiAgICB0aGlzLmJwbUNvbnRyb2wgPSBuZXcgQnBtQ29udHJvbChicG1TZWN0aW9uLCB0aGlzLmRhdGEuYnBtLCB7XG4gICAgICBvbkNoYW5nZTogKGJwbSkgPT4ge1xuICAgICAgICAvLyBMaXZlIHVwZGF0ZSBpZiBuZWVkZWQgKGUuZy4sIHN5bmMgd2l0aCBub3RlIHByZXZpZXcpXG4gICAgICB9LFxuICAgICAgb25Db25maXJtZWQ6ICgpID0+IHtcbiAgICAgICAgLy8gT3B0aW9uYWw6IGF1dG8tZW5hYmxlIGtleSBjb25maXJtIHdoZW4gYm90aCBhcmUgY2xvc2VcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBLZXkgc2VjdGlvblxuICAgIGNvbnN0IGtleVNlY3Rpb24gPSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJtYW0tbW9kYWwtc2VjdGlvblwiIH0pO1xuICAgIGtleVNlY3Rpb24uY3JlYXRlRWwoXCJoM1wiLCB7IGNsczogXCJtYW0tbW9kYWwtc2VjdGlvbi1sYWJlbFwiLCB0ZXh0OiBcIktleVwiIH0pO1xuICAgIHRoaXMua2V5Q29udHJvbCA9IG5ldyBLZXlDb250cm9sKGtleVNlY3Rpb24sIHRoaXMuZGF0YS5rZXksIHtcbiAgICAgIG9uQ2hhbmdlOiAoa2V5LCBzY2FsZSkgPT4ge1xuICAgICAgICAvLyBMaXZlIHVwZGF0ZVxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIEZvb3RlcjogU2F2ZSAvIENhbmNlbFxuICAgIGNvbnN0IGZvb3RlciA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwibWFtLW1vZGFsLWZvb3RlclwiIH0pO1xuXG4gICAgY29uc3QgYnRuU2F2ZSA9IGZvb3Rlci5jcmVhdGVFbChcImJ1dHRvblwiLCB7IGNsczogXCJtYW0tYnRuLXNhdmUgbW9kLWN0YVwiLCB0ZXh0OiBcIlNhdmVcIiB9KTtcbiAgICBidG5TYXZlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICBpZiAodGhpcy5icG1Db250cm9sICYmIHRoaXMua2V5Q29udHJvbCkge1xuICAgICAgICB0aGlzLmNhbGxiYWNrcy5vblNhdmUoe1xuICAgICAgICAgIGJwbTogdGhpcy5icG1Db250cm9sLmdldFN0YXRlKCksXG4gICAgICAgICAga2V5OiB0aGlzLmtleUNvbnRyb2wuZ2V0U3RhdGUoKSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBidG5DYW5jZWwgPSBmb290ZXIuY3JlYXRlRWwoXCJidXR0b25cIiwgeyBjbHM6IFwibWFtLWJ0bi1jYW5jZWxcIiwgdGV4dDogXCJDYW5jZWxcIiB9KTtcbiAgICBidG5DYW5jZWwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIHRoaXMuY2FsbGJhY2tzLm9uQ2FuY2VsPy4oKTtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9KTtcbiAgfVxuXG4gIG9uQ2xvc2UoKSB7XG4gICAgY29uc3QgeyBjb250ZW50RWwgfSA9IHRoaXM7XG4gICAgY29udGVudEVsLmVtcHR5KCk7XG4gIH1cbn1cbiIsICIvLyBUYXAtdGVtcG8gY29udHJvbGxlciBcdTIwMTQgYXZlcmFnZXMgdGhlIGxhc3QgTiBpbnRlci10YXAgaW50ZXJ2YWxzLlxuLy8gVXNlZCBieSBCUE1Db250cm9sIChtb2RhbCArIGRhc2hib2FyZCkuXG5cbmV4cG9ydCBpbnRlcmZhY2UgVGFwVGVtcG9DYWxsYmFja3Mge1xuICBvbkJwbUNoYW5nZT86IChicG06IG51bWJlcikgPT4gdm9pZDtcbiAgb25UYXA/OiAoKSA9PiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgVGFwVGVtcG9Db250cm9sbGVyIHtcbiAgcHJpdmF0ZSB0aW1lczogbnVtYmVyW10gPSBbXTtcbiAgcHJpdmF0ZSBtYXhUYXBzOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3Iob3B0czogeyBtYXhUYXBzPzogbnVtYmVyIH0gPSB7fSkge1xuICAgIHRoaXMubWF4VGFwcyA9IG9wdHMubWF4VGFwcyA/PyA4O1xuICB9XG5cbiAgLyoqIENhbGwgb24gZXZlcnkgdGFwLiBSZXR1cm5zIHRoZSBjdXJyZW50IGVzdGltYXRlZCBCUE0gb3IgbnVsbCBpZiBub3QgZW5vdWdoIGRhdGEuICovXG4gIHRhcCgpOiBudW1iZXIgfCBudWxsIHtcbiAgICBjb25zdCBub3cgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICB0aGlzLnRpbWVzLnB1c2gobm93KTtcblxuICAgIGlmICh0aGlzLnRpbWVzLmxlbmd0aCA+IHRoaXMubWF4VGFwcykge1xuICAgICAgdGhpcy50aW1lcy5zaGlmdCgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnRpbWVzLmxlbmd0aCA8IDIpIHJldHVybiBudWxsO1xuXG4gICAgLy8gVXNlIHRoZSBsYXN0IHVwLXRvLShtYXhUYXBzLTEpIGludGVydmFsc1xuICAgIGNvbnN0IGludGVydmFsczogbnVtYmVyW10gPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IHRoaXMudGltZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGludGVydmFscy5wdXNoKHRoaXMudGltZXNbaV0gLSB0aGlzLnRpbWVzW2kgLSAxXSk7XG4gICAgfVxuXG4gICAgY29uc3QgYXZnID0gaW50ZXJ2YWxzLnJlZHVjZSgoYSwgYikgPT4gYSArIGIsIDApIC8gaW50ZXJ2YWxzLmxlbmd0aDtcbiAgICBpZiAoYXZnIDw9IDApIHJldHVybiBudWxsO1xuXG4gICAgY29uc3QgYnBtID0gTWF0aC5yb3VuZCg2MDAwMCAvIGF2Zyk7XG4gICAgLy8gU2FuaXR5IGNsYW1wXG4gICAgaWYgKGJwbSA8IE1JTl9TQU5FIHx8IGJwbSA+IE1BWF9TQU5FKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gYnBtO1xuICB9XG5cbiAgcmVzZXQoKTogdm9pZCB7XG4gICAgdGhpcy50aW1lcyA9IFtdO1xuICB9XG59XG5cbmNvbnN0IE1JTl9TQU5FID0gNjA7XG5jb25zdCBNQVhfU0FORSA9IDIwMDtcbiIsICIvLyBCUE1Db250cm9sIFx1MjAxNCByZXVzYWJsZSB0ZW1wbyB3aWRnZXQgZm9yIG1vZGFsICsgZGFzaGJvYXJkLlxuLy8gQ1NTIGNsYXNzIGhvb2tzIChmb3IgdGhlbWluZyBieSB1c2VyKTpcbi8vICAuYnBtLWNvbnRyb2wgICAgICAgICAgXHUyMDE0IHJvb3QgY29udGFpbmVyXG4vLyAgLmJwbS12YWx1ZSAgICAgICAgICAgIFx1MjAxNCBjdXJyZW50IGRpc3BsYXllZCBCUE1cbi8vICAuYnBtLXJhdyAgICAgICAgICAgICAgXHUyMDE0IHJhdyBkZXRlY3QgKHNtYWxsLCBtdXRlZClcbi8vICAuYnBtLWFsdGVybmF0ZSAgICAgICAgXHUyMDE0IGhhbGYvZG91YmxlIGFsdGVybmF0ZSB2YWx1ZVxuLy8gIC5icG0tYnRuLWhhbHZlICAgICAgICBcdTIwMTQgaGFsdmUgYnV0dG9uXG4vLyAgLmJwbS1idG4tZG91YmxlICAgICAgIFx1MjAxNCBkb3VibGUgYnV0dG9uXG4vLyAgLmJwbS1idG4tdGFwICAgICAgICAgIFx1MjAxNCB0YXAtdGVtcG8gYnV0dG9uXG4vLyAgLmJwbS1idG4tdGFwLWFjdGl2ZSAgIFx1MjAxNCB0YXBwZWQgcmVjZW50bHkgKGJyaWVmIGZsYXNoKVxuLy8gIC5icG0taW5wdXQgICAgICAgICAgICBcdTIwMTQgbWFudWFsIEJQTSBpbnB1dCAoaW5saW5lIGVkaXQpXG4vLyAgLmJwbS1jb25maXJtZWQgICAgICAgIFx1MjAxNCBjb25maXJtZWQgc3RhdGUgZmxhZ1xuLy8gIC5icG0tdW5jb25maXJtZWQgICAgICBcdTIwMTQgdW5jb25maXJtZWQgc3RhdGUgZmxhZ1xuXG5pbXBvcnQgeyBUYXBUZW1wb0NvbnRyb2xsZXIgfSBmcm9tIFwiLi90YXAtdGVtcG9cIjtcblxuZXhwb3J0IGludGVyZmFjZSBCcG1Db250cm9sQ2FsbGJhY2tzIHtcbiAgb25DaGFuZ2U/OiAoYnBtOiBudW1iZXIpID0+IHZvaWQ7XG4gIG9uQ29uZmlybWVkPzogKGNvbmZpcm1lZDogYm9vbGVhbikgPT4gdm9pZDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBCcG1Db250cm9sU3RhdGUge1xuICBicG06IG51bWJlcjtcbiAgcmF3QnBtOiBudW1iZXI7XG4gIGFsdGVybmF0ZUJwbT86IG51bWJlcjtcbiAgY29uZmlybWVkOiBib29sZWFuO1xufVxuXG5leHBvcnQgY2xhc3MgQnBtQ29udHJvbCB7XG4gIHByaXZhdGUgY29udGFpbmVyOiBIVE1MRWxlbWVudDtcbiAgcHJpdmF0ZSBzdGF0ZTogQnBtQ29udHJvbFN0YXRlO1xuICBwcml2YXRlIGNhbGxiYWNrczogQnBtQ29udHJvbENhbGxiYWNrcztcbiAgcHJpdmF0ZSB0YXBDb250cm9sbGVyOiBUYXBUZW1wb0NvbnRyb2xsZXI7XG4gIHByaXZhdGUgdGFwRmxhc2hUaW1lb3V0PzogUmV0dXJuVHlwZTx0eXBlb2Ygc2V0VGltZW91dD47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcGFyZW50OiBIVE1MRWxlbWVudCxcbiAgICBpbml0aWFsOiBCcG1Db250cm9sU3RhdGUsXG4gICAgY2FsbGJhY2tzOiBCcG1Db250cm9sQ2FsbGJhY2tzID0ge30sXG4gICkge1xuICAgIHRoaXMuc3RhdGUgPSB7IC4uLmluaXRpYWwgfTtcbiAgICB0aGlzLmNhbGxiYWNrcyA9IGNhbGxiYWNrcztcbiAgICB0aGlzLnRhcENvbnRyb2xsZXIgPSBuZXcgVGFwVGVtcG9Db250cm9sbGVyKHsgbWF4VGFwczogOCB9KTtcbiAgICB0aGlzLmNvbnRhaW5lciA9IHRoaXMuYnVpbGQocGFyZW50KTtcbiAgfVxuXG4gIHByaXZhdGUgYnVpbGQocGFyZW50OiBIVE1MRWxlbWVudCk6IEhUTUxFbGVtZW50IHtcbiAgICBjb25zdCByb290ID0gcGFyZW50LmNyZWF0ZURpdih7IGNsczogXCJicG0tY29udHJvbFwiIH0pO1xuXG4gICAgLy8gVmFsdWUgcm93OiBjdXJyZW50IEJQTSArIHJhdyBCUE1cbiAgICBjb25zdCB2YWx1ZVJvdyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcImJwbS12YWx1ZS1yb3dcIiB9KTtcbiAgICB0aGlzLnJlbmRlclZhbHVlKHZhbHVlUm93KTtcblxuICAgIC8vIEFsdGVybmF0ZSBzdWdnZXN0aW9uXG4gICAgaWYgKHRoaXMuc3RhdGUuYWx0ZXJuYXRlQnBtKSB7XG4gICAgICBjb25zdCBhbHQgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJicG0tYWx0ZXJuYXRlLXJvd1wiIH0pO1xuICAgICAgY29uc3QgYWx0QnRuID0gYWx0LmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHtcbiAgICAgICAgY2xzOiBcImJwbS1hbHRlcm5hdGVcIixcbiAgICAgICAgdGV4dDogYG9yICR7dGhpcy5zdGF0ZS5hbHRlcm5hdGVCcG19P2AsXG4gICAgICB9KTtcbiAgICAgIGFsdEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5hY2NlcHRBbHRlcm5hdGUoKSk7XG4gICAgfVxuXG4gICAgLy8gQWN0aW9uIHJvdzogaGFsdmUgfCBkb3VibGUgfCB0YXBcbiAgICBjb25zdCBhY3Rpb25zID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwiYnBtLWFjdGlvbnNcIiB9KTtcblxuICAgIGNvbnN0IGJ0bkhhbHZlID0gYWN0aW9ucy5jcmVhdGVFbChcImJ1dHRvblwiLCB7IGNsczogXCJicG0tYnRuLWhhbHZlXCIsIHRleHQ6IFwiXHUwMEJEXCIgfSk7XG4gICAgYnRuSGFsdmUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMuc2V0QnBtKE1hdGgucm91bmQodGhpcy5zdGF0ZS5icG0gLyAyKSkpO1xuXG4gICAgY29uc3QgYnRuRG91YmxlID0gYWN0aW9ucy5jcmVhdGVFbChcImJ1dHRvblwiLCB7IGNsczogXCJicG0tYnRuLWRvdWJsZVwiLCB0ZXh0OiBcIlx1MDBENzJcIiB9KTtcbiAgICBidG5Eb3VibGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMuc2V0QnBtKHRoaXMuc3RhdGUuYnBtICogMikpO1xuXG4gICAgY29uc3QgYnRuVGFwID0gYWN0aW9ucy5jcmVhdGVFbChcImJ1dHRvblwiLCB7IGNsczogXCJicG0tYnRuLXRhcFwiLCB0ZXh0OiBcIlRhcCB0ZW1wb1wiIH0pO1xuICAgIGJ0blRhcC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5vblRhcChidG5UYXApKTtcblxuICAgIC8vIENvbmZpcm0gdG9nZ2xlXG4gICAgY29uc3QgY29uZmlybVJvdyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcImJwbS1jb25maXJtLXJvd1wiIH0pO1xuICAgIGNvbnN0IGNvbmZpcm1DYiA9IGNvbmZpcm1Sb3cuY3JlYXRlRWwoXCJpbnB1dFwiLCB7IHR5cGU6IFwiY2hlY2tib3hcIiB9KTtcbiAgICBjb25maXJtQ2IuY2hlY2tlZCA9IHRoaXMuc3RhdGUuY29uZmlybWVkO1xuICAgIGNvbmZpcm1DYi5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcbiAgICAgIHRoaXMuc3RhdGUuY29uZmlybWVkID0gY29uZmlybUNiLmNoZWNrZWQ7XG4gICAgICB0aGlzLnJlZnJlc2hDb25maXJtZWRTdGF0ZShyb290KTtcbiAgICAgIHRoaXMuY2FsbGJhY2tzLm9uQ29uZmlybWVkPy4odGhpcy5zdGF0ZS5jb25maXJtZWQpO1xuICAgIH0pO1xuICAgIGNvbmZpcm1Sb3cuY3JlYXRlU3Bhbih7IHRleHQ6IFwiIFRlbXBvIGNvbmZpcm1lZFwiIH0pO1xuICAgIHRoaXMucmVmcmVzaENvbmZpcm1lZFN0YXRlKHJvb3QpO1xuXG4gICAgcmV0dXJuIHJvb3Q7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlclZhbHVlKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQpIHtcbiAgICBjb250YWluZXIuZW1wdHkoKTtcbiAgICBjb25zdCBkaXNwbGF5ID0gY29udGFpbmVyLmNyZWF0ZVNwYW4oeyBjbHM6IFwiYnBtLXZhbHVlXCIsIHRleHQ6IFN0cmluZyh0aGlzLnN0YXRlLmJwbSkgfSk7XG4gICAgZGlzcGxheS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5zdGFydElubGluZUVkaXQoZGlzcGxheSkpO1xuXG4gICAgY29udGFpbmVyLmNyZWF0ZVNwYW4oeyBjbHM6IFwiYnBtLXJhd1wiLCB0ZXh0OiBgIChyYXcgJHt0aGlzLnN0YXRlLnJhd0JwbX0pYCB9KTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhcnRJbmxpbmVFZGl0KGVsOiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgIGlucHV0LnR5cGUgPSBcIm51bWJlclwiO1xuICAgIGlucHV0LnZhbHVlID0gU3RyaW5nKHRoaXMuc3RhdGUuYnBtKTtcbiAgICBpbnB1dC5jbGFzc05hbWUgPSBcImJwbS1pbnB1dFwiO1xuICAgIGlucHV0Lm1pbiA9IFwiNDBcIjtcbiAgICBpbnB1dC5tYXggPSBcIjMwMFwiO1xuXG4gICAgZWwucmVwbGFjZVdpdGgoaW5wdXQpO1xuICAgIGlucHV0LmZvY3VzKCk7XG4gICAgaW5wdXQuc2VsZWN0KCk7XG5cbiAgICBjb25zdCBjb21taXQgPSAoKSA9PiB7XG4gICAgICBjb25zdCB2YWwgPSBwYXJzZUludChpbnB1dC52YWx1ZSwgMTApO1xuICAgICAgaWYgKCFpc05hTih2YWwpICYmIHZhbCA+PSA0MCAmJiB2YWwgPD0gMzAwKSB7XG4gICAgICAgIHRoaXMuc2V0QnBtKHZhbCk7XG4gICAgICB9XG4gICAgICB0aGlzLnJlZnJlc2hWYWx1ZSgpO1xuICAgIH07XG5cbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCBjb21taXQpO1xuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChlKSA9PiB7XG4gICAgICBpZiAoZS5rZXkgPT09IFwiRW50ZXJcIikgY29tbWl0KCk7XG4gICAgICBpZiAoZS5rZXkgPT09IFwiRXNjYXBlXCIpIHRoaXMucmVmcmVzaFZhbHVlKCk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHJlZnJlc2hWYWx1ZSgpIHtcbiAgICBjb25zdCByb3cgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFwiLmJwbS12YWx1ZS1yb3dcIikgYXMgSFRNTEVsZW1lbnQ7XG4gICAgaWYgKHJvdykgdGhpcy5yZW5kZXJWYWx1ZShyb3cpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRCcG0oYnBtOiBudW1iZXIpIHtcbiAgICB0aGlzLnN0YXRlLmJwbSA9IGJwbTtcbiAgICAvLyBSZWNvbXB1dGUgYWx0ZXJuYXRlIGZyb20gbmV3IGRpc3BsYXllZCB2YWx1ZVxuICAgIGNvbnN0IGRvdWJsZWQgPSBicG0gKiAyO1xuICAgIGNvbnN0IGhhbHZlZCA9IE1hdGgucm91bmQoYnBtIC8gMik7XG4gICAgaWYgKGRvdWJsZWQgPD0gMjAwICYmIGRvdWJsZWQgIT09IGJwbSkge1xuICAgICAgdGhpcy5zdGF0ZS5hbHRlcm5hdGVCcG0gPSBkb3VibGVkO1xuICAgIH0gZWxzZSBpZiAoaGFsdmVkID49IDYwICYmIGhhbHZlZCAhPT0gYnBtKSB7XG4gICAgICB0aGlzLnN0YXRlLmFsdGVybmF0ZUJwbSA9IGhhbHZlZDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdGF0ZS5hbHRlcm5hdGVCcG0gPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHRoaXMucmVmcmVzaFZhbHVlKCk7XG4gICAgdGhpcy5yZWZyZXNoQWx0ZXJuYXRlKCk7XG4gICAgdGhpcy5jYWxsYmFja3Mub25DaGFuZ2U/Lih0aGlzLnN0YXRlLmJwbSk7XG4gIH1cblxuICBwcml2YXRlIGFjY2VwdEFsdGVybmF0ZSgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5hbHRlcm5hdGVCcG0pIHtcbiAgICAgIHRoaXMuc2V0QnBtKHRoaXMuc3RhdGUuYWx0ZXJuYXRlQnBtKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlZnJlc2hBbHRlcm5hdGUoKSB7XG4gICAgY29uc3QgZXhpc3RpbmcgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFwiLmJwbS1hbHRlcm5hdGUtcm93XCIpO1xuICAgIGlmIChleGlzdGluZykgZXhpc3RpbmcucmVtb3ZlKCk7XG5cbiAgICBpZiAodGhpcy5zdGF0ZS5hbHRlcm5hdGVCcG0pIHtcbiAgICAgIGNvbnN0IGFjdGlvbnMgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFwiLmJwbS1hY3Rpb25zXCIpIGFzIEhUTUxFbGVtZW50O1xuICAgICAgY29uc3QgYWx0ID0gdGhpcy5jb250YWluZXIuY3JlYXRlRGl2KHsgY2xzOiBcImJwbS1hbHRlcm5hdGUtcm93XCIgfSk7XG4gICAgICBpZiAoYWN0aW9ucykgdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKGFsdCwgYWN0aW9ucyk7XG4gICAgICBlbHNlIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKGFsdCk7XG5cbiAgICAgIGNvbnN0IGJ0biA9IGFsdC5jcmVhdGVFbChcImJ1dHRvblwiLCB7XG4gICAgICAgIGNsczogXCJicG0tYWx0ZXJuYXRlXCIsXG4gICAgICAgIHRleHQ6IGBvciAke3RoaXMuc3RhdGUuYWx0ZXJuYXRlQnBtfT9gLFxuICAgICAgfSk7XG4gICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMuYWNjZXB0QWx0ZXJuYXRlKCkpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgb25UYXAoYnRuOiBIVE1MQnV0dG9uRWxlbWVudCkge1xuICAgIGNvbnN0IGJwbSA9IHRoaXMudGFwQ29udHJvbGxlci50YXAoKTtcblxuICAgIC8vIEZsYXNoIHRoZSBidXR0b25cbiAgICBidG4uY2xhc3NMaXN0LmFkZChcImJwbS1idG4tdGFwLWFjdGl2ZVwiKTtcbiAgICBjbGVhclRpbWVvdXQodGhpcy50YXBGbGFzaFRpbWVvdXQpO1xuICAgIHRoaXMudGFwRmxhc2hUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiBidG4uY2xhc3NMaXN0LnJlbW92ZShcImJwbS1idG4tdGFwLWFjdGl2ZVwiKSwgMTUwKTtcblxuICAgIGlmIChicG0gIT09IG51bGwpIHtcbiAgICAgIHRoaXMuc2V0QnBtKGJwbSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZWZyZXNoQ29uZmlybWVkU3RhdGUocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICByb290LmNsYXNzTGlzdC50b2dnbGUoXCJicG0tY29uZmlybWVkXCIsIHRoaXMuc3RhdGUuY29uZmlybWVkKTtcbiAgICByb290LmNsYXNzTGlzdC50b2dnbGUoXCJicG0tdW5jb25maXJtZWRcIiwgIXRoaXMuc3RhdGUuY29uZmlybWVkKTtcbiAgfVxuXG4gIGdldFN0YXRlKCk6IEJwbUNvbnRyb2xTdGF0ZSB7XG4gICAgcmV0dXJuIHsgLi4udGhpcy5zdGF0ZSB9O1xuICB9XG5cbiAgbW91bnQocGFyZW50OiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgIHBhcmVudC5hcHBlbmRDaGlsZCh0aGlzLmNvbnRhaW5lcik7XG4gIH1cblxuICBkZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuY29udGFpbmVyLnJlbW92ZSgpO1xuICAgIGNsZWFyVGltZW91dCh0aGlzLnRhcEZsYXNoVGltZW91dCk7XG4gIH1cbn1cbiIsICIvLyBLZXlDb250cm9sIFx1MjAxNCByZXVzYWJsZSBrZXkgd2lkZ2V0IGZvciBtb2RhbCArIGRhc2hib2FyZC5cbi8vIENTUyBjbGFzcyBob29rcyAoZm9yIHRoZW1pbmcgYnkgdXNlcik6XG4vLyAgLmtleS1jb250cm9sICAgICAgICAgICAgXHUyMDE0IHJvb3QgY29udGFpbmVyXG4vLyAgLmtleS12YWx1ZSAgICAgICAgICAgICAgXHUyMDE0IGN1cnJlbnQgZGlzcGxheWVkIGtleSAoZS5nLiBcIkMjIG1pbm9yXCIpXG4vLyAgLmtleS1yZWxhdGl2ZSAgICAgICAgICAgXHUyMDE0IHJlbGF0aXZlIG1ham9yL21pbm9yIGRpc3BsYXlcbi8vICAua2V5LWJ0bi1zZW1pdG9uZS11cCAgICBcdTIwMTQgKzEgc2VtaXRvbmUgYnV0dG9uXG4vLyAgLmtleS1idG4tc2VtaXRvbmUtZG93biAgXHUyMDE0IC0xIHNlbWl0b25lIGJ1dHRvblxuLy8gIC5rZXktYnRuLW1vZGUtdG9nZ2xlICAgIFx1MjAxNCBtYWpvci9taW5vciB0b2dnbGVcbi8vICAua2V5LWJ0bi1yZWxhdGl2ZSAgICAgICBcdTIwMTQganVtcCB0byByZWxhdGl2ZSBrZXlcbi8vICAua2V5LWNvbmZpcm1lZCAgICAgICAgICBcdTIwMTQgY29uZmlybWVkIHN0YXRlIGZsYWdcbi8vICAua2V5LXVuY29uZmlybWVkICAgICAgICBcdTIwMTQgdW5jb25maXJtZWQgc3RhdGUgZmxhZ1xuXG5jb25zdCBDSFJPTUFUSUMgPSBbXCJDXCIsIFwiQyNcIiwgXCJEXCIsIFwiRCNcIiwgXCJFXCIsIFwiRlwiLCBcIkYjXCIsIFwiR1wiLCBcIkcjXCIsIFwiQVwiLCBcIkEjXCIsIFwiQlwiXTtcblxuLy8gTWlub3IgXHUyMTkyIHJlbGF0aXZlIG1ham9yXG5jb25zdCBSRUxBVElWRV9NQUpPUjogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgQW06IFwiQ1wiLCBFbTogXCJHXCIsIEJtOiBcIkRcIiwgXCJGI21cIjogXCJBXCIsIFwiQyNtXCI6IFwiRVwiLFxuICBcIkcjbVwiOiBcIkJcIiwgXCJEI21cIjogXCJGI1wiLCBcIkEjbVwiOiBcIkMjXCIsIERtOiBcIkZcIixcbiAgR206IFwiQmJcIiwgQ206IFwiRWJcIiwgRm06IFwiQWJcIixcbn07XG5cbi8vIE1ham9yIFx1MjE5MiByZWxhdGl2ZSBtaW5vclxuY29uc3QgUkVMQVRJVkVfTUlOT1I6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSBPYmplY3QuZnJvbUVudHJpZXMoXG4gIE9iamVjdC5lbnRyaWVzKFJFTEFUSVZFX01BSk9SKS5tYXAoKFtrLCB2XSkgPT4gW3YsIGtdKSxcbik7XG5cbmV4cG9ydCBpbnRlcmZhY2UgS2V5Q29udHJvbENhbGxiYWNrcyB7XG4gIG9uQ2hhbmdlPzogKGtleTogc3RyaW5nLCBzY2FsZTogc3RyaW5nKSA9PiB2b2lkO1xuICBvbkNvbmZpcm1lZD86IChjb25maXJtZWQ6IGJvb2xlYW4pID0+IHZvaWQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgS2V5Q29udHJvbFN0YXRlIHtcbiAga2V5OiBzdHJpbmc7ICAgIC8vIGUuZy4gXCJDI1wiICh3aXRob3V0IG0gc3VmZml4KVxuICBzY2FsZTogc3RyaW5nOyAgLy8gXCJtaW5vclwiIHwgXCJtYWpvclwiXG4gIHJlbGF0aXZlS2V5Pzogc3RyaW5nO1xuICBjb25maXJtZWQ6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBjbGFzcyBLZXlDb250cm9sIHtcbiAgcHJpdmF0ZSBjb250YWluZXI6IEhUTUxFbGVtZW50O1xuICBwcml2YXRlIHN0YXRlOiBLZXlDb250cm9sU3RhdGU7XG4gIHByaXZhdGUgY2FsbGJhY2tzOiBLZXlDb250cm9sQ2FsbGJhY2tzO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHBhcmVudDogSFRNTEVsZW1lbnQsXG4gICAgaW5pdGlhbDogS2V5Q29udHJvbFN0YXRlLFxuICAgIGNhbGxiYWNrczogS2V5Q29udHJvbENhbGxiYWNrcyA9IHt9LFxuICApIHtcbiAgICB0aGlzLnN0YXRlID0geyAuLi5pbml0aWFsIH07XG4gICAgdGhpcy5jYWxsYmFja3MgPSBjYWxsYmFja3M7XG4gICAgdGhpcy5jb250YWluZXIgPSB0aGlzLmJ1aWxkKHBhcmVudCk7XG4gIH1cblxuICBwcml2YXRlIGJ1aWxkKHBhcmVudDogSFRNTEVsZW1lbnQpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3Qgcm9vdCA9IHBhcmVudC5jcmVhdGVEaXYoeyBjbHM6IFwia2V5LWNvbnRyb2xcIiB9KTtcblxuICAgIC8vIFZhbHVlIHJvd1xuICAgIGNvbnN0IHZhbHVlUm93ID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwia2V5LXZhbHVlLXJvd1wiIH0pO1xuICAgIHRoaXMucmVuZGVyVmFsdWUodmFsdWVSb3cpO1xuXG4gICAgLy8gUmVsYXRpdmUga2V5IGhpbnRcbiAgICB0aGlzLnJlbmRlclJlbGF0aXZlKHJvb3QpO1xuXG4gICAgLy8gQWN0aW9uIHJvdzogXHUyNjZEIHwgXHUyNjZGIHwgbW9kZSB0b2dnbGUgfCByZWxhdGl2ZVxuICAgIGNvbnN0IGFjdGlvbnMgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJrZXktYWN0aW9uc1wiIH0pO1xuXG4gICAgY29uc3QgYnRuRG93biA9IGFjdGlvbnMuY3JlYXRlRWwoXCJidXR0b25cIiwgeyBjbHM6IFwia2V5LWJ0bi1zZW1pdG9uZS1kb3duXCIsIHRleHQ6IFwiXHUyNjZEXCIgfSk7XG4gICAgYnRuRG93bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5zaGlmdFNlbWl0b25lKC0xKSk7XG5cbiAgICBjb25zdCBidG5VcCA9IGFjdGlvbnMuY3JlYXRlRWwoXCJidXR0b25cIiwgeyBjbHM6IFwia2V5LWJ0bi1zZW1pdG9uZS11cFwiLCB0ZXh0OiBcIlx1MjY2RlwiIH0pO1xuICAgIGJ0blVwLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLnNoaWZ0U2VtaXRvbmUoMSkpO1xuXG4gICAgY29uc3QgYnRuTW9kZSA9IGFjdGlvbnMuY3JlYXRlRWwoXCJidXR0b25cIiwge1xuICAgICAgY2xzOiBcImtleS1idG4tbW9kZS10b2dnbGVcIixcbiAgICAgIHRleHQ6IHRoaXMuc3RhdGUuc2NhbGUgPT09IFwibWlub3JcIiA/IFwibWFqb3JcIiA6IFwibWlub3JcIixcbiAgICB9KTtcbiAgICBidG5Nb2RlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLnRvZ2dsZU1vZGUoKSk7XG5cbiAgICBjb25zdCBidG5SZWxhdGl2ZSA9IGFjdGlvbnMuY3JlYXRlRWwoXCJidXR0b25cIiwge1xuICAgICAgY2xzOiBcImtleS1idG4tcmVsYXRpdmVcIixcbiAgICAgIHRleHQ6IFwiUmVsYXRpdmVcIixcbiAgICB9KTtcbiAgICBidG5SZWxhdGl2ZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5qdW1wVG9SZWxhdGl2ZSgpKTtcblxuICAgIC8vIENvbmZpcm0gdG9nZ2xlXG4gICAgY29uc3QgY29uZmlybVJvdyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcImtleS1jb25maXJtLXJvd1wiIH0pO1xuICAgIGNvbnN0IGNvbmZpcm1DYiA9IGNvbmZpcm1Sb3cuY3JlYXRlRWwoXCJpbnB1dFwiLCB7IHR5cGU6IFwiY2hlY2tib3hcIiB9KTtcbiAgICBjb25maXJtQ2IuY2hlY2tlZCA9IHRoaXMuc3RhdGUuY29uZmlybWVkO1xuICAgIGNvbmZpcm1DYi5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcbiAgICAgIHRoaXMuc3RhdGUuY29uZmlybWVkID0gY29uZmlybUNiLmNoZWNrZWQ7XG4gICAgICB0aGlzLnJlZnJlc2hDb25maXJtZWRTdGF0ZShyb290KTtcbiAgICAgIHRoaXMuY2FsbGJhY2tzLm9uQ29uZmlybWVkPy4odGhpcy5zdGF0ZS5jb25maXJtZWQpO1xuICAgIH0pO1xuICAgIGNvbmZpcm1Sb3cuY3JlYXRlU3Bhbih7IHRleHQ6IFwiIEtleSBjb25maXJtZWRcIiB9KTtcbiAgICB0aGlzLnJlZnJlc2hDb25maXJtZWRTdGF0ZShyb290KTtcblxuICAgIHJldHVybiByb290O1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJWYWx1ZShjb250YWluZXI6IEhUTUxFbGVtZW50KSB7XG4gICAgY29udGFpbmVyLmVtcHR5KCk7XG4gICAgY29uc3QgZGlzcGxheUtleSA9IHRoaXMuZm9ybWF0S2V5RGlzcGxheSh0aGlzLnN0YXRlLmtleSwgdGhpcy5zdGF0ZS5zY2FsZSk7XG4gICAgY29uc3QgZWwgPSBjb250YWluZXIuY3JlYXRlU3Bhbih7IGNsczogXCJrZXktdmFsdWVcIiwgdGV4dDogZGlzcGxheUtleSB9KTtcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5zdGFydElubGluZUVkaXQoZWwpKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyUmVsYXRpdmUocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCBleGlzdGluZyA9IHJvb3QucXVlcnlTZWxlY3RvcihcIi5rZXktcmVsYXRpdmUtcm93XCIpO1xuICAgIGlmIChleGlzdGluZykgZXhpc3RpbmcucmVtb3ZlKCk7XG5cbiAgICBjb25zdCByZWxhdGl2ZSA9IHRoaXMuY29tcHV0ZVJlbGF0aXZlKCk7XG4gICAgaWYgKCFyZWxhdGl2ZSkgcmV0dXJuO1xuXG4gICAgY29uc3Qgcm93ID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwia2V5LXJlbGF0aXZlLXJvd1wiIH0pO1xuICAgIC8vIEluc2VydCBiZWZvcmUgYWN0aW9uc1xuICAgIGNvbnN0IGFjdGlvbnMgPSByb290LnF1ZXJ5U2VsZWN0b3IoXCIua2V5LWFjdGlvbnNcIik7XG4gICAgaWYgKGFjdGlvbnMpIHJvb3QuaW5zZXJ0QmVmb3JlKHJvdywgYWN0aW9ucyk7XG4gICAgZWxzZSByb290LmFwcGVuZENoaWxkKHJvdyk7XG5cbiAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJrZXktcmVsYXRpdmVcIiwgdGV4dDogYFJlbGF0aXZlOiAke3JlbGF0aXZlfWAgfSk7XG4gIH1cblxuICBwcml2YXRlIGZvcm1hdEtleURpc3BsYXkoa2V5OiBzdHJpbmcsIHNjYWxlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBzY2FsZSA9PT0gXCJtaW5vclwiID8gYCR7a2V5fW1gIDoga2V5O1xuICB9XG5cbiAgcHJpdmF0ZSBwYXJzZUtleURpc3BsYXkoZGlzcGxheTogc3RyaW5nKTogeyBrZXk6IHN0cmluZzsgc2NhbGU6IHN0cmluZyB9IHtcbiAgICBpZiAoZGlzcGxheS5lbmRzV2l0aChcIm1cIikpIHtcbiAgICAgIHJldHVybiB7IGtleTogZGlzcGxheS5zbGljZSgwLCAtMSksIHNjYWxlOiBcIm1pbm9yXCIgfTtcbiAgICB9XG4gICAgcmV0dXJuIHsga2V5OiBkaXNwbGF5LCBzY2FsZTogXCJtYWpvclwiIH07XG4gIH1cblxuICBwcml2YXRlIHN0YXJ0SW5saW5lRWRpdChlbDogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgICBpbnB1dC52YWx1ZSA9IHRoaXMuZm9ybWF0S2V5RGlzcGxheSh0aGlzLnN0YXRlLmtleSwgdGhpcy5zdGF0ZS5zY2FsZSk7XG4gICAgaW5wdXQuY2xhc3NOYW1lID0gXCJrZXktaW5wdXRcIjtcblxuICAgIGVsLnJlcGxhY2VXaXRoKGlucHV0KTtcbiAgICBpbnB1dC5mb2N1cygpO1xuICAgIGlucHV0LnNlbGVjdCgpO1xuXG4gICAgY29uc3QgY29tbWl0ID0gKCkgPT4ge1xuICAgICAgY29uc3QgcGFyc2VkID0gdGhpcy5wYXJzZUtleURpc3BsYXkoaW5wdXQudmFsdWUudHJpbSgpKTtcbiAgICAgIGlmIChDSFJPTUFUSUMuaW5jbHVkZXMocGFyc2VkLmtleSkpIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5rZXkgPSBwYXJzZWQua2V5O1xuICAgICAgICB0aGlzLnN0YXRlLnNjYWxlID0gcGFyc2VkLnNjYWxlO1xuICAgICAgICB0aGlzLnJlZnJlc2goKTtcbiAgICAgICAgdGhpcy5jYWxsYmFja3Mub25DaGFuZ2U/Lih0aGlzLnN0YXRlLmtleSwgdGhpcy5zdGF0ZS5zY2FsZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsIGNvbW1pdCk7XG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGUpID0+IHtcbiAgICAgIGlmIChlLmtleSA9PT0gXCJFbnRlclwiKSB7XG4gICAgICAgIGNvbW1pdCgpO1xuICAgICAgICBpbnB1dC5ibHVyKCk7XG4gICAgICB9XG4gICAgICBpZiAoZS5rZXkgPT09IFwiRXNjYXBlXCIpIHRoaXMucmVmcmVzaCgpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzaGlmdFNlbWl0b25lKGRlbHRhOiBudW1iZXIpIHtcbiAgICBjb25zdCBpZHggPSBDSFJPTUFUSUMuaW5kZXhPZih0aGlzLnN0YXRlLmtleSk7XG4gICAgaWYgKGlkeCA9PT0gLTEpIHJldHVybjtcbiAgICBjb25zdCBuZXdJZHggPSAoaWR4ICsgZGVsdGEgKyAxMikgJSAxMjtcbiAgICB0aGlzLnN0YXRlLmtleSA9IENIUk9NQVRJQ1tuZXdJZHhdO1xuICAgIHRoaXMucmVmcmVzaCgpO1xuICAgIHRoaXMuY2FsbGJhY2tzLm9uQ2hhbmdlPy4odGhpcy5zdGF0ZS5rZXksIHRoaXMuc3RhdGUuc2NhbGUpO1xuICB9XG5cbiAgcHJpdmF0ZSB0b2dnbGVNb2RlKCkge1xuICAgIHRoaXMuc3RhdGUuc2NhbGUgPSB0aGlzLnN0YXRlLnNjYWxlID09PSBcIm1pbm9yXCIgPyBcIm1ham9yXCIgOiBcIm1pbm9yXCI7XG4gICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgdGhpcy5jYWxsYmFja3Mub25DaGFuZ2U/Lih0aGlzLnN0YXRlLmtleSwgdGhpcy5zdGF0ZS5zY2FsZSk7XG4gIH1cblxuICBwcml2YXRlIGp1bXBUb1JlbGF0aXZlKCkge1xuICAgIGNvbnN0IHJlbGF0aXZlID0gdGhpcy5jb21wdXRlUmVsYXRpdmUodHJ1ZSk7XG4gICAgaWYgKHJlbGF0aXZlKSB7XG4gICAgICBjb25zdCBwYXJzZWQgPSB0aGlzLnBhcnNlS2V5RGlzcGxheShyZWxhdGl2ZSk7XG4gICAgICB0aGlzLnN0YXRlLmtleSA9IHBhcnNlZC5rZXk7XG4gICAgICB0aGlzLnN0YXRlLnNjYWxlID0gcGFyc2VkLnNjYWxlO1xuICAgICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgICB0aGlzLmNhbGxiYWNrcy5vbkNoYW5nZT8uKHRoaXMuc3RhdGUua2V5LCB0aGlzLnN0YXRlLnNjYWxlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNvbXB1dGVSZWxhdGl2ZShmb3JKdW1wID0gZmFsc2UpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IGRpc3BsYXkgPSB0aGlzLmZvcm1hdEtleURpc3BsYXkodGhpcy5zdGF0ZS5rZXksIHRoaXMuc3RhdGUuc2NhbGUpO1xuICAgIGlmICh0aGlzLnN0YXRlLnNjYWxlID09PSBcIm1pbm9yXCIpIHtcbiAgICAgIGNvbnN0IHJlbCA9IFJFTEFUSVZFX01BSk9SW2Rpc3BsYXldO1xuICAgICAgcmV0dXJuIHJlbCB8fCB1bmRlZmluZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHJlbCA9IFJFTEFUSVZFX01JTk9SW2Rpc3BsYXldO1xuICAgICAgcmV0dXJuIHJlbCB8fCB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZWZyZXNoKCkge1xuICAgIGNvbnN0IHZhbFJvdyA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCIua2V5LXZhbHVlLXJvd1wiKSBhcyBIVE1MRWxlbWVudDtcbiAgICBpZiAodmFsUm93KSB0aGlzLnJlbmRlclZhbHVlKHZhbFJvdyk7XG4gICAgdGhpcy5yZW5kZXJSZWxhdGl2ZSh0aGlzLmNvbnRhaW5lcik7XG5cbiAgICBjb25zdCBtb2RlQnRuID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcihcIi5rZXktYnRuLW1vZGUtdG9nZ2xlXCIpIGFzIEhUTUxFbGVtZW50O1xuICAgIGlmIChtb2RlQnRuKSBtb2RlQnRuLnRleHRDb250ZW50ID0gdGhpcy5zdGF0ZS5zY2FsZSA9PT0gXCJtaW5vclwiID8gXCJtYWpvclwiIDogXCJtaW5vclwiO1xuICB9XG5cbiAgcHJpdmF0ZSByZWZyZXNoQ29uZmlybWVkU3RhdGUocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICByb290LmNsYXNzTGlzdC50b2dnbGUoXCJrZXktY29uZmlybWVkXCIsIHRoaXMuc3RhdGUuY29uZmlybWVkKTtcbiAgICByb290LmNsYXNzTGlzdC50b2dnbGUoXCJrZXktdW5jb25maXJtZWRcIiwgIXRoaXMuc3RhdGUuY29uZmlybWVkKTtcbiAgfVxuXG4gIGdldFN0YXRlKCk6IEtleUNvbnRyb2xTdGF0ZSB7XG4gICAgcmV0dXJuIHsgLi4udGhpcy5zdGF0ZSB9O1xuICB9XG5cbiAgbW91bnQocGFyZW50OiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgIHBhcmVudC5hcHBlbmRDaGlsZCh0aGlzLmNvbnRhaW5lcik7XG4gIH1cblxuICBkZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuY29udGFpbmVyLnJlbW92ZSgpO1xuICB9XG59XG4iLCAiLy8gU3RydWN0dXJlVGltZWxpbmUgXHUyMDE0IG1hbnVhbCBzZWdtZW50IGJhcnMgd2l0aCBob3ZlciB0b29sdGlwIGFuZCBvZmZzZXQgc2xpZGVyLlxuLy9cbi8vIENTUyBjbGFzcyBob29rcyAoZm9yIHRoZW1pbmcgYnkgdXNlcik6XG4vLyAgLm1hbS10aW1lbGluZSAgICAgICAgICAgICAgXHUyMDE0IHJvb3QgY29udGFpbmVyXG4vLyAgLm1hbS10aW1lbGluZS10cmFjayAgICAgICAgXHUyMDE0IGhvcml6b250YWwgYmFyIHRyYWNrXG4vLyAgLm1hbS10aW1lbGluZS1zZWdtZW50ICAgICAgXHUyMDE0IGluZGl2aWR1YWwgY29sb3JlZCBiYXJcbi8vICAubWFtLXRpbWVsaW5lLXNlZ21lbnQtbGFiZWxcbi8vICAubWFtLXRpbWVsaW5lLW9mZnNldC1yb3cgICBcdTIwMTQgc2xpZGVyICsgbGFiZWwgd3JhcHBlclxuLy8gIC5tYW0tdGltZWxpbmUtb2Zmc2V0LWxhYmVsXG4vLyAgLm1hbS10aW1lbGluZS1zbGlkZXIgICAgICAgXHUyMDE0IEhUTUwgcmFuZ2UgaW5wdXRcbi8vICAubWFtLXRpbWVsaW5lLXRvb2x0aXAgICAgICBcdTIwMTQgZmxvYXRpbmcgaG92ZXIgdG9vbHRpcCAoYWJzIHBvc2l0aW9uZWQpXG4vLyAgLm1hbS10aW1lbGluZS1lbXB0eSAgICAgICAgXHUyMDE0IG5vLXNlZ21lbnRzIHN0YXRlXG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RydWN0dXJlU2VnbWVudCB7XG4gIGlkOiBzdHJpbmc7XG4gIGxhYmVsOiBzdHJpbmc7XG4gIHN0YXJ0QmFyOiBudW1iZXI7XG4gIGVuZEJhcjogbnVtYmVyO1xuICBjb2xvcjogc3RyaW5nOyAvLyBDU1MgY29sb3IgdmFsdWUgKE9ic2lkaWFuIHZhciBvciBsaXRlcmFsKVxufVxuXG5leHBvcnQgY2xhc3MgU3RydWN0dXJlVGltZWxpbmUge1xuICBwcml2YXRlIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XG4gIHByaXZhdGUgc2VnbWVudHM6IFN0cnVjdHVyZVNlZ21lbnRbXTtcbiAgcHJpdmF0ZSBicG06IG51bWJlcjtcbiAgcHJpdmF0ZSBvZmZzZXRCYXJzOiBudW1iZXI7XG4gIHByaXZhdGUgdHJhY2tFbDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSB0b29sdGlwRWw6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG5cbiAgb25PZmZzZXRDaGFuZ2U/OiAob2Zmc2V0QmFyczogbnVtYmVyKSA9PiB2b2lkO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHBhcmVudDogSFRNTEVsZW1lbnQsXG4gICAgc2VnbWVudHM6IFN0cnVjdHVyZVNlZ21lbnRbXSxcbiAgICBicG06IG51bWJlcixcbiAgICBvZmZzZXRCYXJzID0gMCxcbiAgKSB7XG4gICAgdGhpcy5jb250YWluZXIgPSBwYXJlbnQuY3JlYXRlRGl2KHsgY2xzOiBcIm1hbS10aW1lbGluZVwiIH0pO1xuICAgIHRoaXMuc2VnbWVudHMgPSBzZWdtZW50cztcbiAgICB0aGlzLmJwbSA9IGJwbTtcbiAgICB0aGlzLm9mZnNldEJhcnMgPSBvZmZzZXRCYXJzO1xuICB9XG5cbiAgbW91bnQoKTogdm9pZCB7XG4gICAgdGhpcy5jb250YWluZXIuZW1wdHkoKTtcblxuICAgIGlmICh0aGlzLnNlZ21lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5jb250YWluZXIuY3JlYXRlRGl2KHtcbiAgICAgICAgY2xzOiBcIm1hbS10aW1lbGluZS1lbXB0eVwiLFxuICAgICAgICB0ZXh0OiBcIk5vIHN0cnVjdHVyZSBkZWZpbmVkLiBBZGQgc2VnbWVudHMgdG8gZnJvbnRtYXR0ZXI6IHN0cnVjdHVyZTogWy4uLl1cIixcbiAgICAgIH0pO1xuICAgICAgdGhpcy5idWlsZE9mZnNldFJvdygpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIENvbXB1dGUgdG90YWwgc3BhbiAoYWNjb3VudGluZyBmb3Igb2Zmc2V0IGxlYWQtaW4pXG4gICAgY29uc3QgdG90YWxCYXJzID0gTWF0aC5tYXgoLi4udGhpcy5zZWdtZW50cy5tYXAoKHMpID0+IHMuZW5kQmFyKSk7XG4gICAgY29uc3QgZWZmZWN0aXZlVG90YWwgPSB0b3RhbEJhcnMgKyB0aGlzLm9mZnNldEJhcnM7XG5cbiAgICAvLyBUcmFjayBjb250YWluZXJcbiAgICB0aGlzLnRyYWNrRWwgPSB0aGlzLmNvbnRhaW5lci5jcmVhdGVEaXYoeyBjbHM6IFwibWFtLXRpbWVsaW5lLXRyYWNrXCIgfSk7XG5cbiAgICAvLyBSZW5kZXIgZWFjaCBzZWdtZW50IGFzIGFuIGFic29sdXRlbHktcG9zaXRpb25lZCBwcm9wb3J0aW9uYWwgYmFyXG4gICAgdGhpcy5zZWdtZW50cy5mb3JFYWNoKChzZWcpID0+IHtcbiAgICAgIGNvbnN0IGxlZnRQY3QgPSAoKHNlZy5zdGFydEJhciArIHRoaXMub2Zmc2V0QmFycykgLyBlZmZlY3RpdmVUb3RhbCkgKiAxMDA7XG4gICAgICBjb25zdCB3aWR0aFBjdCA9ICgoc2VnLmVuZEJhciAtIHNlZy5zdGFydEJhcikgLyBlZmZlY3RpdmVUb3RhbCkgKiAxMDA7XG5cbiAgICAgIGNvbnN0IGJhciA9IHRoaXMudHJhY2tFbCEuY3JlYXRlRGl2KHsgY2xzOiBcIm1hbS10aW1lbGluZS1zZWdtZW50XCIgfSk7XG4gICAgICBiYXIuc3R5bGUubGVmdCA9IGAke2xlZnRQY3R9JWA7XG4gICAgICBiYXIuc3R5bGUud2lkdGggPSBgJHt3aWR0aFBjdH0lYDtcbiAgICAgIGJhci5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBzZWcuY29sb3I7XG4gICAgICBiYXIuc3R5bGUuc2V0UHJvcGVydHkoXCItLW1hbS1zZWdtZW50LWNvbG9yXCIsIHNlZy5jb2xvcik7XG5cbiAgICAgIGJhci5jcmVhdGVTcGFuKHtcbiAgICAgICAgY2xzOiBcIm1hbS10aW1lbGluZS1zZWdtZW50LWxhYmVsXCIsXG4gICAgICAgIHRleHQ6IHNlZy5sYWJlbCxcbiAgICAgIH0pO1xuXG4gICAgICBiYXIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZW50ZXJcIiwgKCkgPT4gdGhpcy5zaG93VG9vbHRpcChzZWcsIGJhcikpO1xuICAgICAgYmFyLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsICgpID0+IHRoaXMuaGlkZVRvb2x0aXAoKSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmJ1aWxkT2Zmc2V0Um93KCk7XG4gIH1cblxuICBwcml2YXRlIGJ1aWxkT2Zmc2V0Um93KCk6IHZvaWQge1xuICAgIGNvbnN0IHJvdyA9IHRoaXMuY29udGFpbmVyLmNyZWF0ZURpdih7IGNsczogXCJtYW0tdGltZWxpbmUtb2Zmc2V0LXJvd1wiIH0pO1xuICAgIHJvdy5jcmVhdGVTcGFuKHtcbiAgICAgIGNsczogXCJtYW0tdGltZWxpbmUtb2Zmc2V0LWxhYmVsXCIsXG4gICAgICB0ZXh0OiBgVHJpbSBsZWFkLWluOiAke3RoaXMub2Zmc2V0QmFyc30gYmFyJHt0aGlzLm9mZnNldEJhcnMgPT09IDEgPyBcIlwiIDogXCJzXCJ9YCxcbiAgICB9KTtcblxuICAgIGNvbnN0IHNsaWRlciA9IHJvdy5jcmVhdGVFbChcImlucHV0XCIsIHsgdHlwZTogXCJyYW5nZVwiIH0pO1xuICAgIHNsaWRlci5jbGFzc05hbWUgPSBcIm1hbS10aW1lbGluZS1zbGlkZXJcIjtcbiAgICBzbGlkZXIubWluID0gXCIwXCI7XG4gICAgc2xpZGVyLm1heCA9IFN0cmluZyhNYXRoLmNlaWwodGhpcy5vZmZzZXRCYXJzICsgNCkpO1xuICAgIHNsaWRlci52YWx1ZSA9IFN0cmluZyh0aGlzLm9mZnNldEJhcnMpO1xuICAgIHNsaWRlci5zdGVwID0gXCIxXCI7XG5cbiAgICBzbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsICgpID0+IHtcbiAgICAgIGNvbnN0IHZhbCA9IHBhcnNlSW50KHNsaWRlci52YWx1ZSwgMTApO1xuICAgICAgdGhpcy5vZmZzZXRCYXJzID0gdmFsO1xuICAgICAgLy8gVXBkYXRlIGxhYmVsXG4gICAgICBjb25zdCBsYWJlbCA9IHJvdy5xdWVyeVNlbGVjdG9yKFwiLm1hbS10aW1lbGluZS1vZmZzZXQtbGFiZWxcIik7XG4gICAgICBpZiAobGFiZWwpIHtcbiAgICAgICAgbGFiZWwudGV4dENvbnRlbnQgPSBgVHJpbSBsZWFkLWluOiAke3ZhbH0gYmFyJHt2YWwgPT09IDEgPyBcIlwiIDogXCJzXCJ9YDtcbiAgICAgIH1cbiAgICAgIHRoaXMub25PZmZzZXRDaGFuZ2U/Lih2YWwpO1xuICAgICAgLy8gUmUtcmVuZGVyIHdpdGggbmV3IG9mZnNldFxuICAgICAgdGhpcy5tb3VudCgpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzaG93VG9vbHRpcChzZWc6IFN0cnVjdHVyZVNlZ21lbnQsIGFuY2hvcjogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMudHJhY2tFbCkgcmV0dXJuO1xuXG4gICAgdGhpcy50b29sdGlwRWwgPSB0aGlzLnRyYWNrRWwuY3JlYXRlRGl2KHsgY2xzOiBcIm1hbS10aW1lbGluZS10b29sdGlwXCIgfSk7XG4gICAgY29uc3QgYmVhdExlbiA9IDYwIC8gdGhpcy5icG07XG4gICAgY29uc3Qgc3RhcnRUaW1lID0gc2VnLnN0YXJ0QmFyICogNCAqIGJlYXRMZW47XG4gICAgY29uc3Qgc3RhcnRTdHIgPSB0aGlzLmZvcm1hdFRpbWUoc3RhcnRUaW1lKTtcbiAgICBjb25zdCBlbmRUaW1lID0gc2VnLmVuZEJhciAqIDQgKiBiZWF0TGVuO1xuICAgIGNvbnN0IGVuZFN0ciA9IHRoaXMuZm9ybWF0VGltZShlbmRUaW1lKTtcblxuICAgIHRoaXMudG9vbHRpcEVsLmlubmVySFRNTCA9IGBcbiAgICAgIDxzdHJvbmc+JHtzZWcubGFiZWx9PC9zdHJvbmc+PGJyLz5cbiAgICAgIEJhcnMgJHtzZWcuc3RhcnRCYXJ9IFxcdTIwMTMgJHtzZWcuZW5kQmFyfTxici8+XG4gICAgICAke3N0YXJ0U3RyfSBcXHUyMDEzICR7ZW5kU3RyfVxuICAgIGA7XG5cbiAgICAvLyBQb3NpdGlvbiB0b29sdGlwIGFib3ZlIHRoZSBob3ZlcmVkIGJhciwgY2VudGVyZWRcbiAgICBjb25zdCB0cmFja1JlY3QgPSB0aGlzLnRyYWNrRWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgYmFyUmVjdCA9IGFuY2hvci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBsZWZ0ID0gYmFyUmVjdC5sZWZ0IC0gdHJhY2tSZWN0LmxlZnQgKyBiYXJSZWN0LndpZHRoIC8gMiAtIDYwO1xuICAgIGNvbnN0IHRvcCA9IC00MDtcbiAgICB0aGlzLnRvb2x0aXBFbC5zdHlsZS5sZWZ0ID0gYCR7bGVmdH1weGA7XG4gICAgdGhpcy50b29sdGlwRWwuc3R5bGUudG9wID0gYCR7dG9wfXB4YDtcbiAgfVxuXG4gIHByaXZhdGUgaGlkZVRvb2x0aXAoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMudG9vbHRpcEVsKSB7XG4gICAgICB0aGlzLnRvb2x0aXBFbC5yZW1vdmUoKTtcbiAgICAgIHRoaXMudG9vbHRpcEVsID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGZvcm1hdFRpbWUoc2VjOiBudW1iZXIpOiBzdHJpbmcge1xuICAgIGNvbnN0IG0gPSBNYXRoLmZsb29yKHNlYyAvIDYwKTtcbiAgICBjb25zdCBzID0gTWF0aC5mbG9vcihzZWMgJSA2MCk7XG4gICAgY29uc3QgbXMgPSBNYXRoLmZsb29yKChzZWMgJSAxKSAqIDEwMCk7XG4gICAgcmV0dXJuIGAke219OiR7cy50b1N0cmluZygpLnBhZFN0YXJ0KDIsIFwiMFwiKX0uJHttcy50b1N0cmluZygpLnBhZFN0YXJ0KDIsIFwiMFwiKX1gO1xuICB9XG5cbiAgZGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmNvbnRhaW5lci5yZW1vdmUoKTtcbiAgfVxufVxuIiwgIi8vIFR1bmVyTmVlZGxlIFx1MjAxNCBrZXktcG9zaXRpb24gZ2F1Z2UuIFN0eWxlZCBieSBjb25maXJtZWQgc3RhdGUsIE5PVCBjb25maWRlbmNlLlxuLy9cbi8vIENTUyBjbGFzcyBob29rcyAoZm9yIHRoZW1pbmcgYnkgdXNlcik6XG4vLyAgLm1hbS10dW5lciAgICAgICAgICAgICBcdTIwMTQgcm9vdCBjb250YWluZXJcbi8vICAubWFtLXR1bmVyLWRpYWwgICAgICAgIFx1MjAxNCBjaXJjdWxhciBiYWNrZ3JvdW5kXG4vLyAgLm1hbS10dW5lci10aWNrICAgICAgICBcdTIwMTQgbWFqb3IvbWlub3IgcG9zaXRpb24gbWFya3Ncbi8vICAubWFtLXR1bmVyLW5lZWRsZSAgICAgIFx1MjAxNCBhbmltYXRlZCBwb2ludGVyXG4vLyAgLm1hbS10dW5lci1uZWVkbGUtY29uZmlybWVkICAgXHUyMDE0IGNvbmZpcm1lZCBzdHlsZVxuLy8gIC5tYW0tdHVuZXItbmVlZGxlLXVuY29uZmlybWVkIFx1MjAxNCB1bmNvbmZpcm1lZCBzdHlsZVxuLy8gIC5tYW0tdHVuZXItbGFiZWwgICAgICAgXHUyMDE0IGtleSBkaXNwbGF5IGJlbG93IGRpYWxcbi8vICAubWFtLXR1bmVyLWxhYmVsLWNvbmZpcm1lZFxuLy8gIC5tYW0tdHVuZXItbGFiZWwtdW5jb25maXJtZWRcblxuY29uc3QgQ0hST01BVElDX09SREVSID0gW1xuICBcIkNcIiwgXCJDI1wiLCBcIkRcIiwgXCJEI1wiLCBcIkVcIiwgXCJGXCIsIFwiRiNcIiwgXCJHXCIsIFwiRyNcIiwgXCJBXCIsIFwiQSNcIiwgXCJCXCIsXG5dO1xuXG5leHBvcnQgaW50ZXJmYWNlIFR1bmVyTmVlZGxlU3RhdGUge1xuICBrZXk6IHN0cmluZzsgICAgICAvLyBlLmcuIFwiQyNcIlxuICBzY2FsZTogc3RyaW5nOyAgICAvLyBcIm1pbm9yXCIgfCBcIm1ham9yXCJcbiAgY29uZmlybWVkOiBib29sZWFuO1xufVxuXG5leHBvcnQgY2xhc3MgVHVuZXJOZWVkbGUge1xuICBwcml2YXRlIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XG4gIHByaXZhdGUgc3RhdGU6IFR1bmVyTmVlZGxlU3RhdGU7XG4gIHByaXZhdGUgbmVlZGxlRWw6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IocGFyZW50OiBIVE1MRWxlbWVudCwgaW5pdGlhbDogVHVuZXJOZWVkbGVTdGF0ZSkge1xuICAgIHRoaXMuc3RhdGUgPSB7IC4uLmluaXRpYWwgfTtcbiAgICB0aGlzLmNvbnRhaW5lciA9IHBhcmVudC5jcmVhdGVEaXYoeyBjbHM6IFwibWFtLXR1bmVyXCIgfSk7XG4gIH1cblxuICBtb3VudCgpOiB2b2lkIHtcbiAgICB0aGlzLmNvbnRhaW5lci5lbXB0eSgpO1xuXG4gICAgY29uc3QgZGlhbCA9IHRoaXMuY29udGFpbmVyLmNyZWF0ZURpdih7IGNsczogXCJtYW0tdHVuZXItZGlhbFwiIH0pO1xuXG4gICAgLy8gUmVuZGVyIHBvc2l0aW9uIHRpY2tzIGZvciBlYWNoIGNocm9tYXRpYyBub3RlXG4gICAgQ0hST01BVElDX09SREVSLmZvckVhY2goKG5vdGUsIGkpID0+IHtcbiAgICAgIGNvbnN0IGFuZ2xlID0gKGkgLyAxMikgKiAzNjA7XG4gICAgICBjb25zdCB0aWNrID0gZGlhbC5jcmVhdGVEaXYoeyBjbHM6IFwibWFtLXR1bmVyLXRpY2tcIiB9KTtcbiAgICAgIC8vIENTUyB0cmFuc2Zvcm0gaGFuZGxlcyBwb3NpdGlvbmluZyB2aWEgdHJhbnNmb3JtOiByb3RhdGUoYW5nbGUpIHRyYW5zbGF0ZVkocmFkaXVzKVxuICAgICAgdGljay5zZXRBdHRyaWJ1dGUoXCJkYXRhLW5vdGVcIiwgbm90ZSk7XG4gICAgICB0aWNrLnN0eWxlLnRyYW5zZm9ybSA9IGByb3RhdGUoJHthbmdsZX1kZWcpIHRyYW5zbGF0ZVkoLTQ1cHgpYDtcbiAgICB9KTtcblxuICAgIC8vIE5lZWRsZVxuICAgIHRoaXMubmVlZGxlRWwgPSBkaWFsLmNyZWF0ZURpdih7XG4gICAgICBjbHM6IGBtYW0tdHVuZXItbmVlZGxlICR7XG4gICAgICAgIHRoaXMuc3RhdGUuY29uZmlybWVkXG4gICAgICAgICAgPyBcIm1hbS10dW5lci1uZWVkbGUtY29uZmlybWVkXCJcbiAgICAgICAgICA6IFwibWFtLXR1bmVyLW5lZWRsZS11bmNvbmZpcm1lZFwiXG4gICAgICB9YCxcbiAgICB9KTtcbiAgICB0aGlzLnNldE5lZWRsZUFuZ2xlKHRoaXMuc3RhdGUua2V5KTtcblxuICAgIC8vIExhYmVsXG4gICAgY29uc3QgbGFiZWwgPSB0aGlzLmNvbnRhaW5lci5jcmVhdGVEaXYoe1xuICAgICAgY2xzOiBgbWFtLXR1bmVyLWxhYmVsICR7XG4gICAgICAgIHRoaXMuc3RhdGUuY29uZmlybWVkXG4gICAgICAgICAgPyBcIm1hbS10dW5lci1sYWJlbC1jb25maXJtZWRcIlxuICAgICAgICAgIDogXCJtYW0tdHVuZXItbGFiZWwtdW5jb25maXJtZWRcIlxuICAgICAgfWAsXG4gICAgICB0ZXh0OiB0aGlzLmZvcm1hdEtleURpc3BsYXkoKSxcbiAgICB9KTtcbiAgfVxuXG4gIHVwZGF0ZShzdGF0ZTogVHVuZXJOZWVkbGVTdGF0ZSk6IHZvaWQge1xuICAgIHRoaXMuc3RhdGUgPSB7IC4uLnN0YXRlIH07XG4gICAgdGhpcy5zZXROZWVkbGVBbmdsZSh0aGlzLnN0YXRlLmtleSk7XG4gICAgaWYgKHRoaXMubmVlZGxlRWwpIHtcbiAgICAgIHRoaXMubmVlZGxlRWwuY2xhc3NOYW1lID0gYG1hbS10dW5lci1uZWVkbGUgJHtcbiAgICAgICAgdGhpcy5zdGF0ZS5jb25maXJtZWRcbiAgICAgICAgICA/IFwibWFtLXR1bmVyLW5lZWRsZS1jb25maXJtZWRcIlxuICAgICAgICAgIDogXCJtYW0tdHVuZXItbmVlZGxlLXVuY29uZmlybWVkXCJcbiAgICAgIH1gO1xuICAgIH1cbiAgICBjb25zdCBsYWJlbCA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCIubWFtLXR1bmVyLWxhYmVsXCIpO1xuICAgIGlmIChsYWJlbCkge1xuICAgICAgbGFiZWwuY2xhc3NOYW1lID0gYG1hbS10dW5lci1sYWJlbCAke1xuICAgICAgICB0aGlzLnN0YXRlLmNvbmZpcm1lZFxuICAgICAgICAgID8gXCJtYW0tdHVuZXItbGFiZWwtY29uZmlybWVkXCJcbiAgICAgICAgICA6IFwibWFtLXR1bmVyLWxhYmVsLXVuY29uZmlybWVkXCJcbiAgICAgIH1gO1xuICAgICAgbGFiZWwudGV4dENvbnRlbnQgPSB0aGlzLmZvcm1hdEtleURpc3BsYXkoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHNldE5lZWRsZUFuZ2xlKGtleTogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3QgaWR4ID0gQ0hST01BVElDX09SREVSLmluZGV4T2Yoa2V5KTtcbiAgICBpZiAoaWR4ID09PSAtMSkgcmV0dXJuO1xuICAgIGNvbnN0IGFuZ2xlID0gKGlkeCAvIDEyKSAqIDM2MDtcbiAgICBpZiAodGhpcy5uZWVkbGVFbCkge1xuICAgICAgdGhpcy5uZWVkbGVFbC5zdHlsZS50cmFuc2Zvcm0gPSBgcm90YXRlKCR7YW5nbGV9ZGVnKWA7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBmb3JtYXRLZXlEaXNwbGF5KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuc2NhbGUgPT09IFwibWlub3JcIlxuICAgICAgPyBgJHt0aGlzLnN0YXRlLmtleX1tYFxuICAgICAgOiB0aGlzLnN0YXRlLmtleTtcbiAgfVxuXG4gIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5jb250YWluZXIucmVtb3ZlKCk7XG4gIH1cbn1cbiIsICIvLyBDYW1lbG90V2hlZWwgXHUyMDE0IGludGVyYWN0aXZlIGhhcm1vbmljLW1peGluZyBndWlkZS5cbi8vIENsaWNrIGFueSBrZXkgXHUyMTkyIGNsaXBib2FyZCBnZXRzIGEgRGF0YXZpZXcgcXVlcnkgZm9yIHRoYXQga2V5LlxuLy9cbi8vIENTUyBjbGFzcyBob29rcyAoZm9yIHRoZW1pbmcgYnkgdXNlcik6XG4vLyAgLm1hbS1jYW1lbG90ICAgICAgICAgICAgICBcdTIwMTQgcm9vdCBjb250YWluZXJcbi8vICAubWFtLWNhbWVsb3Qtd2hlZWwgICAgICAgIFx1MjAxNCBzZWxmLWNvbnRhaW5lZCBTVkdcbi8vICAubWFtLWNhbWVsb3QtaW5uZXIgICAgICAgIFx1MjAxNCBpbm5lciByaW5nIChtaW5vcilcbi8vICAubWFtLWNhbWVsb3Qta2V5ICAgICAgICAgIFx1MjAxNCBldmVyeSBrZXkgc2xvdCAoZ3JvdXAgZWxlbWVudClcbi8vICAubWFtLWNhbWVsb3Qta2V5LW1ham9yICAgIFx1MjAxNCBvdXRlci1yaW5nIGtleXNcbi8vICAubWFtLWNhbWVsb3Qta2V5LW1pbm9yICAgIFx1MjAxNCBpbm5lci1yaW5nIGtleXNcbi8vICAubWFtLWNhbWVsb3QtY3VycmVudCAgICAgIFx1MjAxNCB0aGUgY3VycmVudGx5IGRldGVjdGVkL2NvbmZpcm1lZCBrZXlcbi8vICAubWFtLWNhbWVsb3QtY29tcGF0aWJsZSAgIFx1MjAxNCBoYXJtb25pY2FsbHkgY29tcGF0aWJsZSBuZWlnaGJvcnNcbi8vICAubWFtLWNhbWVsb3QtbGFiZWwgICAgICAgIFx1MjAxNCB0ZXh0IGluc2lkZSBlYWNoIHNsb3Rcbi8vICAubWFtLWNhbWVsb3QtbGVnZW5kICAgICAgIFx1MjAxNCBib3R0b20gbGVnZW5kIGxpbmVcblxuZXhwb3J0IHR5cGUgQ2FtZWxvdEtleSA9IHN0cmluZzsgLy8gZS5nLiBcIjFBXCIsIFwiOEJcIlxuXG5jb25zdCBNQUpPUl9LRVlTOiBDYW1lbG90S2V5W10gPSBbXG4gIFwiMUJcIiwgXCIyQlwiLCBcIjNCXCIsIFwiNEJcIiwgXCI1QlwiLCBcIjZCXCIsIFwiN0JcIiwgXCI4QlwiLCBcIjlCXCIsIFwiMTBCXCIsIFwiMTFCXCIsIFwiMTJCXCIsXG5dO1xuY29uc3QgTUlOT1JfS0VZUzogQ2FtZWxvdEtleVtdID0gW1xuICBcIjFBXCIsIFwiMkFcIiwgXCIzQVwiLCBcIjRBXCIsIFwiNUFcIiwgXCI2QVwiLCBcIjdBXCIsIFwiOEFcIiwgXCI5QVwiLCBcIjEwQVwiLCBcIjExQVwiLCBcIjEyQVwiLFxuXTtcblxuY29uc3QgU0hBUlBfVE9fTkFNRTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgQzogXCJDXCIsIFwiQyNcIjogXCJDc2hhcnBcIiwgRGI6IFwiRGJcIixcbiAgRDogXCJEXCIsIFwiRCNcIjogXCJEc2hhcnBcIiwgRWI6IFwiRWJcIixcbiAgRTogXCJFXCIsIEY6IFwiRlwiLCBcIkYjXCI6IFwiRnNoYXJwXCIsIEdiOiBcIkdiXCIsXG4gIEc6IFwiR1wiLCBcIkcjXCI6IFwiR3NoYXJwXCIsIEFiOiBcIkFiXCIsXG4gIEE6IFwiQVwiLCBcIkEjXCI6IFwiQXNoYXJwXCIsIEJiOiBcIkJiXCIsXG4gIEI6IFwiQlwiLFxufTtcblxuLyoqIE1hcCBhIHN0YW5kYXJkIGtleSBuYW1lIHRvIENhbWVsb3Qgbm90YXRpb24uXG4gKiAgSW5wdXQga2V5IGNhbiBoYXZlIGEgdHJhaWxpbmcgXCJtXCIgZm9yIG1pbm9yIChlLmcuIFwiQyNtXCIpLlxuICogIEJhcmUga2V5IG5hbWVzIG11c3QgbWF0Y2ggZXhhY3RseSAoc2hhcnBzIHdpdGggIywgZmxhdHMgd2l0aCBiIHN1ZmZpeCkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBrZXlOYW1lVG9DYW1lbG90KGtleTogc3RyaW5nLCBzY2FsZTogc3RyaW5nKTogQ2FtZWxvdEtleSB8IHVuZGVmaW5lZCB7XG4gIC8vIFN0cmlwIHRyYWlsaW5nIFwibVwiIChtaW5vciBtYXJrZXIpIG9ubHk7IGRvIE5PVCBzdHJpcCB0cmFpbGluZyBcImJcIiAoZmxhdCBzaWduKS5cbiAgY29uc3QgcmF3ID0ga2V5LmVuZHNXaXRoKFwibVwiKSAmJiBrZXkubGVuZ3RoID4gMSA/IGtleS5zbGljZSgwLCAtMSkgOiBrZXk7XG4gIGNvbnN0IG5hbWUgPSBTSEFSUF9UT19OQU1FW3Jhd107XG4gIGlmICghbmFtZSkgcmV0dXJuIHVuZGVmaW5lZDtcblxuICBjb25zdCBpc01pbm9yID0gc2NhbGUgPT09IFwibWlub3JcIjtcbiAgaWYgKGlzTWlub3IpIHtcbiAgICBjb25zdCBtaW5vck1hcDogUmVjb3JkPHN0cmluZywgQ2FtZWxvdEtleT4gPSB7XG4gICAgICBDc2hhcnA6IFwiMTJBXCIsIERiOiBcIjEyQVwiLFxuICAgICAgRHNoYXJwOiBcIjJBXCIsICBFYjogXCIyQVwiLFxuICAgICAgRnNoYXJwOiBcIjExQVwiLCBHYjogXCIxMUFcIixcbiAgICAgIEdzaGFycDogXCIxQVwiLCAgQWI6IFwiMUFcIixcbiAgICAgIEFzaGFycDogXCIzQVwiLCAgQmI6IFwiM0FcIixcbiAgICAgIEY6IFwiNEFcIixcbiAgICAgIEM6IFwiNUFcIixcbiAgICAgIEc6IFwiNkFcIixcbiAgICAgIEQ6IFwiN0FcIixcbiAgICAgIEE6IFwiOEFcIixcbiAgICAgIEU6IFwiOUFcIixcbiAgICAgIEI6IFwiMTBBXCIsXG4gICAgfTtcbiAgICByZXR1cm4gbWlub3JNYXBbbmFtZV07XG4gIH1cbiAgY29uc3QgbWFqb3JNYXA6IFJlY29yZDxzdHJpbmcsIENhbWVsb3RLZXk+ID0ge1xuICAgIEI6IFwiMUJcIixcbiAgICBGc2hhcnA6IFwiMkJcIiwgR2I6IFwiMkJcIixcbiAgICBDc2hhcnA6IFwiM0JcIiwgRGI6IFwiM0JcIixcbiAgICBHc2hhcnA6IFwiNEJcIiwgQWI6IFwiNEJcIixcbiAgICBEc2hhcnA6IFwiNUJcIiwgRWI6IFwiNUJcIixcbiAgICBBc2hhcnA6IFwiNkJcIiwgQmI6IFwiNkJcIixcbiAgICBGOiBcIjdCXCIsXG4gICAgQzogXCI4QlwiLFxuICAgIEc6IFwiOUJcIixcbiAgICBEOiBcIjEwQlwiLFxuICAgIEE6IFwiMTFCXCIsXG4gICAgRTogXCIxMkJcIixcbiAgfTtcbiAgcmV0dXJuIG1ham9yTWFwW25hbWVdO1xufVxuXG4vKiogQ29udmVydCBDYW1lbG90IGJhY2sgdG8gYSBEYXRhdmlldy1mcmllbmRseSBrZXkgbmFtZS4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYW1lbG90VG9LZXlOYW1lKGNhbWVsb3Q6IENhbWVsb3RLZXkpOiB7IGtleTogc3RyaW5nOyBzY2FsZTogc3RyaW5nIH0gfCB1bmRlZmluZWQge1xuICBjb25zdCBtYXA6IFJlY29yZDxDYW1lbG90S2V5LCB7IGtleTogc3RyaW5nOyBzY2FsZTogc3RyaW5nIH0+ID0ge1xuICAgIFwiMUJcIjogeyBrZXk6IFwiQlwiLCBzY2FsZTogXCJtYWpvclwiIH0sXG4gICAgXCIyQlwiOiB7IGtleTogXCJGIyAvIEdiXCIsIHNjYWxlOiBcIm1ham9yXCIgfSxcbiAgICBcIjNCXCI6IHsga2V5OiBcIkMjIC8gRGJcIiwgc2NhbGU6IFwibWFqb3JcIiB9LFxuICAgIFwiNEJcIjogeyBrZXk6IFwiRyMgLyBBYlwiLCBzY2FsZTogXCJtYWpvclwiIH0sXG4gICAgXCI1QlwiOiB7IGtleTogXCJEIyAvIEViXCIsIHNjYWxlOiBcIm1ham9yXCIgfSxcbiAgICBcIjZCXCI6IHsga2V5OiBcIkEjIC8gQmJcIiwgc2NhbGU6IFwibWFqb3JcIiB9LFxuICAgIFwiN0JcIjogeyBrZXk6IFwiRlwiLCBzY2FsZTogXCJtYWpvclwiIH0sXG4gICAgXCI4QlwiOiB7IGtleTogXCJDXCIsIHNjYWxlOiBcIm1ham9yXCIgfSxcbiAgICBcIjlCXCI6IHsga2V5OiBcIkdcIiwgc2NhbGU6IFwibWFqb3JcIiB9LFxuICAgIFwiMTBCXCI6IHsga2V5OiBcIkRcIiwgc2NhbGU6IFwibWFqb3JcIiB9LFxuICAgIFwiMTFCXCI6IHsga2V5OiBcIkFcIiwgc2NhbGU6IFwibWFqb3JcIiB9LFxuICAgIFwiMTJCXCI6IHsga2V5OiBcIkVcIiwgc2NhbGU6IFwibWFqb3JcIiB9LFxuICAgIFwiMUFcIjogeyBrZXk6IFwiRyMgLyBBYm1cIiwgc2NhbGU6IFwibWlub3JcIiB9LFxuICAgIFwiMkFcIjogeyBrZXk6IFwiRCMgLyBFYm1cIiwgc2NhbGU6IFwibWlub3JcIiB9LFxuICAgIFwiM0FcIjogeyBrZXk6IFwiQSMgLyBCYm1cIiwgc2NhbGU6IFwibWlub3JcIiB9LFxuICAgIFwiNEFcIjogeyBrZXk6IFwiRm1cIiwgc2NhbGU6IFwibWlub3JcIiB9LFxuICAgIFwiNUFcIjogeyBrZXk6IFwiQ21cIiwgc2NhbGU6IFwibWlub3JcIiB9LFxuICAgIFwiNkFcIjogeyBrZXk6IFwiR21cIiwgc2NhbGU6IFwibWlub3JcIiB9LFxuICAgIFwiN0FcIjogeyBrZXk6IFwiRG1cIiwgc2NhbGU6IFwibWlub3JcIiB9LFxuICAgIFwiOEFcIjogeyBrZXk6IFwiQW1cIiwgc2NhbGU6IFwibWlub3JcIiB9LFxuICAgIFwiOUFcIjogeyBrZXk6IFwiRW1cIiwgc2NhbGU6IFwibWlub3JcIiB9LFxuICAgIFwiMTBBXCI6IHsga2V5OiBcIkJtXCIsIHNjYWxlOiBcIm1pbm9yXCIgfSxcbiAgICBcIjExQVwiOiB7IGtleTogXCJGIyAvIEdibVwiLCBzY2FsZTogXCJtaW5vclwiIH0sXG4gICAgXCIxMkFcIjogeyBrZXk6IFwiQyMgLyBEYm1cIiwgc2NhbGU6IFwibWlub3JcIiB9LFxuICB9O1xuICByZXR1cm4gbWFwW2NhbWVsb3RdO1xufVxuXG4vKiogUmV0dXJuIHRoZSBzZXQgb2YgaGFybW9uaWNhbGx5IGNvbXBhdGlibGUgQ2FtZWxvdCBrZXlzLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldENvbXBhdGlibGVLZXlzKGN1cnJlbnQ6IENhbWVsb3RLZXkpOiBDYW1lbG90S2V5W10ge1xuICBjb25zdCBudW0gPSBwYXJzZUludChjdXJyZW50LnNsaWNlKDAsIC0xKSwgMTApOyAvLyBcIjZBXCIgXHUyMTkyIDZcbiAgY29uc3QgbGV0dGVyID0gY3VycmVudC5zbGljZSgtMSk7IC8vIFwiNkFcIiBcdTIxOTIgXCJBXCJcbiAgY29uc3QgY29tcGF0aWJsZTogQ2FtZWxvdEtleVtdID0gW107XG5cbiAgLy8gU2FtZSBudW1iZXIsIG9wcG9zaXRlIGxldHRlciAobWFqb3IgXHUyMTk0IG1pbm9yIHJlbGF0aXZlKVxuICBjb21wYXRpYmxlLnB1c2goYCR7bnVtfSR7bGV0dGVyID09PSBcIkFcIiA/IFwiQlwiIDogXCJBXCJ9YCBhcyBDYW1lbG90S2V5KTtcblxuICAvLyBTYW1lIGxldHRlciwgXHUwMEIxMSBudW1iZXIgKHdpdGggd3JhcClcbiAgY29uc3QgcHJldiA9IG51bSA9PT0gMSA/IDEyIDogbnVtIC0gMTtcbiAgY29uc3QgbmV4dCA9IG51bSA9PT0gMTIgPyAxIDogbnVtICsgMTtcbiAgY29tcGF0aWJsZS5wdXNoKGAke3ByZXZ9JHtsZXR0ZXJ9YCBhcyBDYW1lbG90S2V5LCBgJHtuZXh0fSR7bGV0dGVyfWAgYXMgQ2FtZWxvdEtleSk7XG5cbiAgLy8gQ3Jvc3MtbGV0dGVyIFx1MDBCMTEgKGVuZXJneSBib29zdC9kcm9wKVxuICBjb21wYXRpYmxlLnB1c2goYCR7cHJldn0ke2xldHRlciA9PT0gXCJBXCIgPyBcIkJcIiA6IFwiQVwifWAgYXMgQ2FtZWxvdEtleSk7XG4gIGNvbXBhdGlibGUucHVzaChgJHtuZXh0fSR7bGV0dGVyID09PSBcIkFcIiA/IFwiQlwiIDogXCJBXCJ9YCBhcyBDYW1lbG90S2V5KTtcblxuICByZXR1cm4gY29tcGF0aWJsZTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDYW1lbG90V2hlZWxDb25maWcge1xuICBjdXJyZW50OiBDYW1lbG90S2V5IHwgdW5kZWZpbmVkO1xuICBvbktleUNsaWNrOiAoY2FtZWxvdDogQ2FtZWxvdEtleSwgZHZRdWVyeTogc3RyaW5nKSA9PiB2b2lkO1xufVxuXG4vKiogU2VsZi1jb250YWluZWQgU1ZHIHJlbmRlcmluZyBvZiB0aGUgQ2FtZWxvdCB3aGVlbC5cbiAqICBOb2RlcyBhcmUgcG9zaXRpb25lZCBwcmVjaXNlbHkgdmlhIHRyaWcgaW5zaWRlIGEgZml4ZWQgdmlld0JveC5cbiAqICBUaGUgY2FsbGVyIGp1c3QgbmVlZHMgYSBjb250YWluZXIgKGJsb2NrIG9yIGZsZXgpIHRvIGRyb3AgaXQgaW4uXG4gKi9cbmV4cG9ydCBjbGFzcyBDYW1lbG90V2hlZWwge1xuICBwcml2YXRlIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XG4gIHByaXZhdGUgY29uZmlnOiBDYW1lbG90V2hlZWxDb25maWc7XG5cbiAgY29uc3RydWN0b3IocGFyZW50OiBIVE1MRWxlbWVudCwgY29uZmlnOiBDYW1lbG90V2hlZWxDb25maWcpIHtcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB0aGlzLmNvbnRhaW5lciA9IHBhcmVudC5jcmVhdGVEaXYoeyBjbHM6IFwibWFtLWNhbWVsb3RcIiB9KTtcbiAgfVxuXG4gIG1vdW50KCk6IHZvaWQge1xuICAgIHRoaXMuY29udGFpbmVyLmVtcHR5KCk7XG5cbiAgICAvLyBTVkcgY2FudmFzIFx1MjAxNCAyNjBcdTAwRDcyNjAgdmlld0JveCBnaXZlcyBjbGVhbiBjb29yZGluYXRlcy5cbiAgICAvLyBUaGUgQ1NTIGNvbnN1bWVyIGNhbiBzZXQgd2lkdGgvaGVpZ2h0IG9uIC5tYW0tY2FtZWxvdFxuICAgIGNvbnN0IG5zID0gXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiO1xuICAgIGNvbnN0IHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgXCJzdmdcIik7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZShcInZpZXdCb3hcIiwgXCIwIDAgMjYwIDI2MFwiKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJtYW0tY2FtZWxvdC13aGVlbFwiKTtcbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChzdmcpO1xuXG4gICAgY29uc3QgY3ggPSAxMzA7XG4gICAgY29uc3QgY3kgPSAxMzA7XG4gICAgY29uc3Qgb3V0ZXJSID0gMTAwO1xuICAgIGNvbnN0IGlubmVyUiA9IDYwO1xuXG4gICAgLy8gRHJhdyBhbGwgMTIgcG9zaXRpb25zIGFyb3VuZCB0aGUgY2xvY2tcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEyOyBpKyspIHtcbiAgICAgIC8vIFN0YXJ0IGF0IDEyIG8nY2xvY2sgYW5kIGdvIGNsb2Nrd2lzZVxuICAgICAgY29uc3QgYW5nbGUgPSBpICogMzAgLSA5MDsgLy8gZGVncmVlc1xuICAgICAgY29uc3QgYW5nbGVSYWQgPSAoYW5nbGUgKiBNYXRoLlBJKSAvIDE4MDtcblxuICAgICAgY29uc3QgbWFqb3JLZXkgPSBNQUpPUl9LRVlTW2ldO1xuICAgICAgY29uc3QgbWlub3JLZXkgPSBNSU5PUl9LRVlTW2ldO1xuXG4gICAgICAvLyBNYWpvciAob3V0ZXIgcmluZylcbiAgICAgIHRoaXMucmVuZGVyS2V5KHN2ZywgY3gsIGN5LCBvdXRlclIsIGFuZ2xlUmFkLCBtYWpvcktleSwgXCJtYWpvclwiKTtcbiAgICAgIC8vIE1pbm9yIChpbm5lciByaW5nKVxuICAgICAgdGhpcy5yZW5kZXJLZXkoc3ZnLCBjeCwgY3ksIGlubmVyUiwgYW5nbGVSYWQsIG1pbm9yS2V5LCBcIm1pbm9yXCIpO1xuICAgIH1cblxuICAgIC8vIExlZ2VuZCAoSFRNTCBiZWxvdyBTVkcsIG5vdCBpbnNpZGUgaXQpXG4gICAgY29uc3QgbGVnZW5kID0gdGhpcy5jb250YWluZXIuY3JlYXRlRGl2KHsgY2xzOiBcIm1hbS1jYW1lbG90LWxlZ2VuZFwiIH0pO1xuICAgIGxlZ2VuZC5jcmVhdGVTcGFuKHsgY2xzOiBcIm1hbS1jYW1lbG90LWN1cnJlbnRcIiwgdGV4dDogXCJcdTI1Q0YgY3VycmVudCBcIiB9KTtcbiAgICBsZWdlbmQuY3JlYXRlU3Bhbih7IGNsczogXCJtYW0tY2FtZWxvdC1jb21wYXRpYmxlXCIsIHRleHQ6IFwiXHUyNUU2IGNvbXBhdGlibGUgXCIgfSk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlcktleShcbiAgICBzdmc6IFNWR1NWR0VsZW1lbnQsXG4gICAgY3g6IG51bWJlcixcbiAgICBjeTogbnVtYmVyLFxuICAgIHJhZGl1czogbnVtYmVyLFxuICAgIGFuZ2xlUmFkOiBudW1iZXIsXG4gICAga2V5OiBDYW1lbG90S2V5LFxuICAgIHR5cGU6IFwibWFqb3JcIiB8IFwibWlub3JcIixcbiAgKTogdm9pZCB7XG4gICAgY29uc3QgbnMgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI7XG5cbiAgICBjb25zdCB4ID0gY3ggKyByYWRpdXMgKiBNYXRoLmNvcyhhbmdsZVJhZCk7XG4gICAgY29uc3QgeSA9IGN5ICsgcmFkaXVzICogTWF0aC5zaW4oYW5nbGVSYWQpO1xuXG4gICAgY29uc3QgZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgXCJnXCIpO1xuICAgIGcuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgYG1hbS1jYW1lbG90LWtleSBtYW0tY2FtZWxvdC1rZXktJHt0eXBlfWApO1xuICAgIGcuc2V0QXR0cmlidXRlKFwiZGF0YS1jYW1lbG90XCIsIGtleSk7XG5cbiAgICAvLyBIaWdobGlnaHRpbmdcbiAgICBjb25zdCBjb21wYXRpYmxlID0gdGhpcy5jb25maWcuY3VycmVudCA/IGdldENvbXBhdGlibGVLZXlzKHRoaXMuY29uZmlnLmN1cnJlbnQpIDogW107XG4gICAgaWYgKHRoaXMuY29uZmlnLmN1cnJlbnQgPT09IGtleSkge1xuICAgICAgZy5jbGFzc0xpc3QuYWRkKFwibWFtLWNhbWVsb3QtY3VycmVudFwiKTtcbiAgICB9IGVsc2UgaWYgKGNvbXBhdGlibGUuaW5jbHVkZXMoa2V5KSkge1xuICAgICAgZy5jbGFzc0xpc3QuYWRkKFwibWFtLWNhbWVsb3QtY29tcGF0aWJsZVwiKTtcbiAgICB9XG5cbiAgICAvLyBUZXh0IGxhYmVsIChTVkcgdGV4dCwgY2VudGVyZWQgb24gdGhlIGNpcmNsZSBwb2ludClcbiAgICBjb25zdCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCBcInRleHRcIik7XG4gICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcIm1hbS1jYW1lbG90LWxhYmVsXCIpO1xuICAgIHRleHQuc2V0QXR0cmlidXRlKFwieFwiLCBTdHJpbmcoeCkpO1xuICAgIHRleHQuc2V0QXR0cmlidXRlKFwieVwiLCBTdHJpbmcoeSkpO1xuICAgIHRleHQuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIik7XG4gICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKTtcbiAgICB0ZXh0LnRleHRDb250ZW50ID0ga2V5O1xuXG4gICAgZy5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICBzdmcuYXBwZW5kQ2hpbGQoZyk7XG5cbiAgICAvLyBDbGljayBoYW5kbGVyXG4gICAgZy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgY29uc3QgbWF0Y2ggPSBjYW1lbG90VG9LZXlOYW1lKGtleSk7XG4gICAgICBpZiAoIW1hdGNoKSByZXR1cm47XG4gICAgICAvLyBQcmVmZXIgdGhlIHNoYXJwIHNwZWxsaW5nIGZvciBEYXRhdmlldyBjb25zaXN0ZW5jeVxuICAgICAgY29uc3QgZHZLZXkgPSBtYXRjaC5rZXkuc3BsaXQoXCIgLyBcIilbMF07XG4gICAgICBjb25zdCBkdlF1ZXJ5ID0gYFxcYFxcYFxcYGRhdGF2aWV3XFxuTElTVFxcbkZST00gI211c2ljXFxuV0hFUkUga2V5ID0gXCIke2R2S2V5fVwiXFxuU09SVCB0ZW1wbyBBU0NcXG5cXGBcXGBcXGBgO1xuICAgICAgdGhpcy5jb25maWcub25LZXlDbGljayhrZXksIGR2UXVlcnkpO1xuICAgIH0pO1xuICB9XG5cbiAgZGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmNvbnRhaW5lci5yZW1vdmUoKTtcbiAgfVxufVxuIiwgIi8vIE11c2ljRGFzaGJvYXJkUHJvY2Vzc29yIFx1MjAxNCBPYnNpZGlhbiBjb2RlLWJsb2NrIHJlbmRlcmVyIGZvciBgbXVzaWMtZGFzaGJvYXJkYFxuLy8gRHJpdmVuIGVudGlyZWx5IGJ5IGZyb250bWF0dGVyICh6ZXJvIGFuYWx5c2lzIGF0IHJlbmRlciB0aW1lKS5cbi8vXG4vLyBDU1MgY2xhc3MgaG9va3MgKGZvciB0aGVtaW5nIGJ5IHVzZXIpOlxuLy8gIC5tYW0tZGFzaGJvYXJkICAgICAgICAgICAgIFx1MjAxNCByb290IGNvbnRhaW5lclxuLy8gIC5tYW0tZGFzaGJvYXJkLWhlYWRlciAgICAgIFx1MjAxNCB0b3AgdGl0bGUgYmFyXG4vLyAgLm1hbS1kYXNoYm9hcmQtbWV0YSAgICAgICAgXHUyMDE0IEJQTSArIGtleSByb3dcbi8vICAubWFtLWRhc2hib2FyZC1zZWN0aW9uICAgICBcdTIwMTQgc3ViLXN1cmZhY2Ugd3JhcHBlclxuLy8gIC5tYW0tZGFzaGJvYXJkLXNlY3Rpb24tbGFiZWxcbi8vICAubWFtLWRhc2hib2FyZC1jb250cm9scyAgICBcdTIwMTQgQlBNICsga2V5IHJldXNhYmxlIGNvbnRyb2xzIGFyZWFcbi8vICAubWFtLWRhc2hib2FyZC10aW1lbGluZSAgICBcdTIwMTQgc3RydWN0dXJlIHRpbWVsaW5lIGNvbnRhaW5lclxuLy8gIC5tYW0tZGFzaGJvYXJkLXR1bmVyICAgICAgIFx1MjAxNCB0dW5lciBnYXVnZSBjb250YWluZXJcbi8vICAubWFtLWRhc2hib2FyZC1jYW1lbG90ICAgICBcdTIwMTQgQ2FtZWxvdCB3aGVlbCBjb250YWluZXJcblxuaW1wb3J0IHsgTWFya2Rvd25Qb3N0UHJvY2Vzc29yQ29udGV4dCB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgQnBtQ29udHJvbCwgQnBtQ29udHJvbFN0YXRlLCBCcG1Db250cm9sQ2FsbGJhY2tzIH0gZnJvbSBcIi4vYnBtLWNvbnRyb2xcIjtcbmltcG9ydCB7IEtleUNvbnRyb2wsIEtleUNvbnRyb2xTdGF0ZSwgS2V5Q29udHJvbENhbGxiYWNrcyB9IGZyb20gXCIuL2tleS1jb250cm9sXCI7XG5pbXBvcnQgeyBTdHJ1Y3R1cmVUaW1lbGluZSwgU3RydWN0dXJlU2VnbWVudCB9IGZyb20gXCIuL3N0cnVjdHVyZS10aW1lbGluZVwiO1xuaW1wb3J0IHsgVHVuZXJOZWVkbGUgfSBmcm9tIFwiLi90dW5lci1uZWVkbGVcIjtcbmltcG9ydCB7IENhbWVsb3RXaGVlbCwga2V5TmFtZVRvQ2FtZWxvdCB9IGZyb20gXCIuL2NhbWVsb3Qtd2hlZWxcIjtcbmltcG9ydCB7IGluamVjdEZyb250bWF0dGVyIH0gZnJvbSBcIi4uL3lhbWwtaW5qZWN0b3JcIjtcblxuZXhwb3J0IGludGVyZmFjZSBEYXNoYm9hcmRGcm9udG1hdHRlciB7XG4gIHNvdXJjZUZpbGU6IHN0cmluZzsgICAgICAgICAgLy8gYWN0aXZlIGZpbGUgcGF0aFxuICB0ZW1wbzogbnVtYmVyO1xuICByYXdfdGVtcG8/OiBudW1iZXI7XG4gIGFsdGVybmF0ZV90ZW1wbz86IG51bWJlcjtcbiAgdGVtcG9fY29uZmlybWVkOiBib29sZWFuO1xuICBrZXk6IHN0cmluZztcbiAga2V5X2NvbmZpcm1lZDogYm9vbGVhbjtcbiAgZHVyYXRpb24/OiBzdHJpbmc7ICAgICAgICAgICAvLyBcIjI6MzRcIlxuICBhdWRpb19zdGFydF9vZmZzZXQ/OiBudW1iZXI7IC8vIGJhcnMgdG8gdHJpbSBsZWFkLWluXG4gIHN0cnVjdHVyZT86IEFycmF5PHtcbiAgICBzZWdtZW50OiBzdHJpbmc7XG4gICAgYmFyczogW251bWJlciwgbnVtYmVyXTtcbiAgICB0aW1lPzogW3N0cmluZywgc3RyaW5nXTtcbiAgfT47XG59XG5cbmV4cG9ydCBjbGFzcyBNdXNpY0Rhc2hib2FyZFByb2Nlc3NvciB7XG4gIHByaXZhdGUgdmF1bHRBY3Rpb25zOiB7XG4gICAgcmVhZEZpbGU6IChwYXRoOiBzdHJpbmcpID0+IFByb21pc2U8c3RyaW5nPjtcbiAgICBtb2RpZnlGaWxlOiAocGF0aDogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcpID0+IFByb21pc2U8dm9pZD47XG4gICAgZ2V0RmlsZUJ5UGF0aDogKHBhdGg6IHN0cmluZykgPT4geyBwYXRoOiBzdHJpbmcgfSB8IG51bGw7XG4gIH07XG5cbiAgY29uc3RydWN0b3IodmF1bHRBY3Rpb25zOiBNdXNpY0Rhc2hib2FyZFByb2Nlc3NvcltcInZhdWx0QWN0aW9uc1wiXSkge1xuICAgIHRoaXMudmF1bHRBY3Rpb25zID0gdmF1bHRBY3Rpb25zO1xuICB9XG5cbiAgYXN5bmMgcHJvY2VzcyhcbiAgICBzb3VyY2U6IHN0cmluZyxcbiAgICBlbDogSFRNTEVsZW1lbnQsXG4gICAgY3R4OiBNYXJrZG93blBvc3RQcm9jZXNzb3JDb250ZXh0LFxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAvLyBzb3VyY2UgaXMgaWdub3JlZCBcdTIwMTQgdGhlIHByb2Nlc3NvciByZWFkcyB0aGUgcGFyZW50IG5vdGUncyBmcm9udG1hdHRlclxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGVsLmNyZWF0ZURpdih7IGNsczogXCJtYW0tZGFzaGJvYXJkXCIgfSk7XG5cbiAgICAvLyBSZXNvbHZlIHRoZSBzb3VyY2UgZmlsZVxuICAgIGNvbnN0IGZpbGVQYXRoID0gY3R4LnNvdXJjZVBhdGg7XG5cbiAgICAvLyBSZWFkIGZyb250bWF0dGVyIGZyb20gdGhlIHZhdWx0XG4gICAgbGV0IGZtOiBEYXNoYm9hcmRGcm9udG1hdHRlcjtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmF3ID0gYXdhaXQgdGhpcy52YXVsdEFjdGlvbnMucmVhZEZpbGUoZmlsZVBhdGgpO1xuICAgICAgZm0gPSB0aGlzLnBhcnNlRnJvbnRtYXR0ZXIocmF3LCBmaWxlUGF0aCk7XG4gICAgfSBjYXRjaCB7XG4gICAgICBjb250YWluZXIuY3JlYXRlRWwoXCJwXCIsIHtcbiAgICAgICAgY2xzOiBcIm1hbS1kYXNoYm9hcmQtZW1wdHlcIixcbiAgICAgICAgdGV4dDogXCJObyBtdXNpYyBhbmFseXNpcyBkYXRhIGZvdW5kIGluIHRoaXMgbm90ZS4gUnVuIFxcdTIwMWNBbmFseXplIGF1ZGlvXFx1MjAxZCBmaXJzdC5cIixcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFx1MjUwMFx1MjUwMCBIZWFkZXIgXHUyNTAwXHUyNTAwXG4gICAgY29uc3QgaGVhZGVyID0gY29udGFpbmVyLmNyZWF0ZURpdih7IGNsczogXCJtYW0tZGFzaGJvYXJkLWhlYWRlclwiIH0pO1xuICAgIGhlYWRlci5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogZm0uc291cmNlRmlsZS5zcGxpdChcIi9cIikucG9wKCkgfHwgXCJVbnRpdGxlZFwiIH0pO1xuICAgIGlmIChmbS5kdXJhdGlvbikge1xuICAgICAgaGVhZGVyLmNyZWF0ZVNwYW4oeyBjbHM6IFwibWFtLWRhc2hib2FyZC1kdXJhdGlvblwiLCB0ZXh0OiBmbS5kdXJhdGlvbiB9KTtcbiAgICB9XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgTWV0YSByb3cgKEJQTSArIGtleSwgY29tcGFjdCkgXHUyNTAwXHUyNTAwXG4gICAgY29uc3QgbWV0YSA9IGNvbnRhaW5lci5jcmVhdGVEaXYoeyBjbHM6IFwibWFtLWRhc2hib2FyZC1tZXRhXCIgfSk7XG4gICAgY29uc3QgYnBtRWwgPSBtZXRhLmNyZWF0ZVNwYW4oe1xuICAgICAgY2xzOiBmbS50ZW1wb19jb25maXJtZWQgPyBcIm1hbS1tZXRhLWNvbmZpcm1lZFwiIDogXCJtYW0tbWV0YS11bmNvbmZpcm1lZFwiLFxuICAgIH0pO1xuICAgIGJwbUVsLnNldFRleHQoYCR7Zm0udGVtcG99IEJQTWApO1xuICAgIGlmIChmbS5hbHRlcm5hdGVfdGVtcG8pIHtcbiAgICAgIGJwbUVsLnNldFRleHQoYCR7Zm0udGVtcG99IEJQTSAob3IgJHtmbS5hbHRlcm5hdGVfdGVtcG99PylgKTtcbiAgICB9XG4gICAgbWV0YS5jcmVhdGVTcGFuKHsgdGV4dDogXCIgXFx1MjAyMiBcIiB9KTtcbiAgICBjb25zdCBrZXlFbCA9IG1ldGEuY3JlYXRlU3Bhbih7XG4gICAgICBjbHM6IGZtLmtleV9jb25maXJtZWQgPyBcIm1hbS1tZXRhLWNvbmZpcm1lZFwiIDogXCJtYW0tbWV0YS11bmNvbmZpcm1lZFwiLFxuICAgIH0pO1xuICAgIGtleUVsLnNldFRleHQoZm0ua2V5KTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBDb250cm9scyAocmV1c2FibGUgQlBNICsgS2V5KSBcdTI1MDBcdTI1MDBcbiAgICBjb25zdCBjb250cm9sc1NlY3Rpb24gPSBjb250YWluZXIuY3JlYXRlRGl2KHsgY2xzOiBcIm1hbS1kYXNoYm9hcmQtc2VjdGlvblwiIH0pO1xuICAgIGNvbnRyb2xzU2VjdGlvbi5jcmVhdGVFbChcImg0XCIsIHsgY2xzOiBcIm1hbS1kYXNoYm9hcmQtc2VjdGlvbi1sYWJlbFwiLCB0ZXh0OiBcIkNvbnRyb2xzXCIgfSk7XG4gICAgY29uc3QgY29udHJvbHNBcmVhID0gY29udHJvbHNTZWN0aW9uLmNyZWF0ZURpdih7IGNsczogXCJtYW0tZGFzaGJvYXJkLWNvbnRyb2xzXCIgfSk7XG5cbiAgICBjb25zdCBpc01pbm9yID0gZm0ua2V5LmVuZHNXaXRoKFwibVwiKTtcbiAgICBjb25zdCBiYXNlS2V5ID0gaXNNaW5vciA/IGZtLmtleS5zbGljZSgwLCAtMSkgOiBmbS5rZXk7XG5cbiAgICBjb25zdCBicG1TdGF0ZTogQnBtQ29udHJvbFN0YXRlID0ge1xuICAgICAgYnBtOiBmbS50ZW1wbyxcbiAgICAgIHJhd0JwbTogZm0ucmF3X3RlbXBvID8/IGZtLnRlbXBvLFxuICAgICAgYWx0ZXJuYXRlQnBtOiBmbS5hbHRlcm5hdGVfdGVtcG8sXG4gICAgICBjb25maXJtZWQ6IGZtLnRlbXBvX2NvbmZpcm1lZCxcbiAgICB9O1xuICAgIGNvbnN0IGtleVN0YXRlOiBLZXlDb250cm9sU3RhdGUgPSB7XG4gICAgICBrZXk6IGJhc2VLZXksXG4gICAgICBzY2FsZTogaXNNaW5vciA/IFwibWlub3JcIiA6IFwibWFqb3JcIixcbiAgICAgIHJlbGF0aXZlS2V5OiB1bmRlZmluZWQsXG4gICAgICBjb25maXJtZWQ6IGZtLmtleV9jb25maXJtZWQsXG4gICAgfTtcblxuICAgIGNvbnN0IHNhdmVUb0ZtID0gYXN5bmMgKHBhcnRpYWw6IFJlY29yZDxzdHJpbmcsIHVua25vd24+KSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByYXcgPSBhd2FpdCB0aGlzLnZhdWx0QWN0aW9ucy5yZWFkRmlsZShmaWxlUGF0aCk7XG4gICAgICAgIGNvbnN0IHVwZGF0ZWQgPSBpbmplY3RGcm9udG1hdHRlcihyYXcsIHBhcnRpYWwgYXMgYW55KTtcbiAgICAgICAgYXdhaXQgdGhpcy52YXVsdEFjdGlvbnMubW9kaWZ5RmlsZShmaWxlUGF0aCwgdXBkYXRlZCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIFNpbGVudCBmYWlsIFx1MjAxNCB2YXVsdCB3cml0ZXMgYXJlIGJlc3QtZWZmb3J0IGluIGRhc2hib2FyZFxuICAgICAgICBjb25zb2xlLndhcm4oXCJbTUFNXSBEYXNoYm9hcmQgc2F2ZSBmYWlsZWQ6XCIsIGUpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBicG1Db250cm9sID0gbmV3IEJwbUNvbnRyb2woY29udHJvbHNBcmVhLCBicG1TdGF0ZSwge1xuICAgICAgb25DaGFuZ2U6IGFzeW5jIChicG0pID0+IHtcbiAgICAgICAgYXdhaXQgc2F2ZVRvRm0oeyB0ZW1wbzogYnBtLCB0ZW1wb19jb25maXJtZWQ6IHRydWUgfSk7XG4gICAgICB9LFxuICAgICAgb25Db25maXJtZWQ6IGFzeW5jIChjb25maXJtZWQpID0+IHtcbiAgICAgICAgYXdhaXQgc2F2ZVRvRm0oeyB0ZW1wb19jb25maXJtZWQ6IGNvbmZpcm1lZCB9KTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgYnBtQ29udHJvbC5tb3VudChjb250cm9sc0FyZWEpO1xuXG4gICAgY29uc3Qga2V5Q29udHJvbCA9IG5ldyBLZXlDb250cm9sKGNvbnRyb2xzQXJlYSwga2V5U3RhdGUsIHtcbiAgICAgIG9uQ2hhbmdlOiBhc3luYyAoa2V5LCBzY2FsZSkgPT4ge1xuICAgICAgICBjb25zdCBkaXNwbGF5ID0gc2NhbGUgPT09IFwibWlub3JcIiA/IGAke2tleX1tYCA6IGtleTtcbiAgICAgICAgYXdhaXQgc2F2ZVRvRm0oeyBrZXk6IGRpc3BsYXksIGtleV9jb25maXJtZWQ6IHRydWUgfSk7XG4gICAgICB9LFxuICAgICAgb25Db25maXJtZWQ6IGFzeW5jIChjb25maXJtZWQpID0+IHtcbiAgICAgICAgYXdhaXQgc2F2ZVRvRm0oeyBrZXlfY29uZmlybWVkOiBjb25maXJtZWQgfSk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIGtleUNvbnRyb2wubW91bnQoY29udHJvbHNBcmVhKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBTdHJ1Y3R1cmUgdGltZWxpbmUgXHUyNTAwXHUyNTAwXG4gICAgY29uc3QgdGltZWxpbmVTZWN0aW9uID0gY29udGFpbmVyLmNyZWF0ZURpdih7IGNsczogXCJtYW0tZGFzaGJvYXJkLXNlY3Rpb25cIiB9KTtcbiAgICB0aW1lbGluZVNlY3Rpb24uY3JlYXRlRWwoXCJoNFwiLCB7IGNsczogXCJtYW0tZGFzaGJvYXJkLXNlY3Rpb24tbGFiZWxcIiwgdGV4dDogXCJTdHJ1Y3R1cmVcIiB9KTtcblxuICAgIGNvbnN0IHNlZ21lbnRzOiBTdHJ1Y3R1cmVTZWdtZW50W10gPSAoZm0uc3RydWN0dXJlIHx8IFtdKS5tYXAoKHMpID0+ICh7XG4gICAgICBpZDogcy5zZWdtZW50LFxuICAgICAgbGFiZWw6IHMuc2VnbWVudCxcbiAgICAgIHN0YXJ0QmFyOiBzLmJhcnNbMF0sXG4gICAgICBlbmRCYXI6IHMuYmFyc1sxXSxcbiAgICAgIGNvbG9yOiB0aGlzLmNvbG9yRm9yU2VnbWVudChzLnNlZ21lbnQpLFxuICAgIH0pKTtcblxuICAgIGNvbnN0IHRpbWVsaW5lID0gbmV3IFN0cnVjdHVyZVRpbWVsaW5lKFxuICAgICAgdGltZWxpbmVTZWN0aW9uLFxuICAgICAgc2VnbWVudHMsXG4gICAgICBmbS50ZW1wbyxcbiAgICAgIGZtLmF1ZGlvX3N0YXJ0X29mZnNldCA/PyAwLFxuICAgICk7XG4gICAgdGltZWxpbmUub25PZmZzZXRDaGFuZ2UgPSBhc3luYyAob2Zmc2V0KSA9PiB7XG4gICAgICBhd2FpdCBzYXZlVG9GbSh7IGF1ZGlvX3N0YXJ0X29mZnNldDogb2Zmc2V0IH0pO1xuICAgIH07XG4gICAgdGltZWxpbmUubW91bnQoKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBUdW5lciBuZWVkbGUgXHUyNTAwXHUyNTAwXG4gICAgY29uc3QgdHVuZXJTZWN0aW9uID0gY29udGFpbmVyLmNyZWF0ZURpdih7IGNsczogXCJtYW0tZGFzaGJvYXJkLXNlY3Rpb25cIiB9KTtcbiAgICB0dW5lclNlY3Rpb24uY3JlYXRlRWwoXCJoNFwiLCB7IGNsczogXCJtYW0tZGFzaGJvYXJkLXNlY3Rpb24tbGFiZWxcIiwgdGV4dDogXCJUdW5lclwiIH0pO1xuICAgIGNvbnN0IHR1bmVyQ29udGFpbmVyID0gdHVuZXJTZWN0aW9uLmNyZWF0ZURpdih7IGNsczogXCJtYW0tZGFzaGJvYXJkLXR1bmVyXCIgfSk7XG4gICAgY29uc3QgdHVuZXIgPSBuZXcgVHVuZXJOZWVkbGUodHVuZXJDb250YWluZXIsIHtcbiAgICAgIGtleTogYmFzZUtleSxcbiAgICAgIHNjYWxlOiBpc01pbm9yID8gXCJtaW5vclwiIDogXCJtYWpvclwiLFxuICAgICAgY29uZmlybWVkOiBmbS5rZXlfY29uZmlybWVkLFxuICAgIH0pO1xuICAgIHR1bmVyLm1vdW50KCk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgQ2FtZWxvdCB3aGVlbCBcdTI1MDBcdTI1MDBcbiAgICBjb25zdCBjYW1lbG90U2VjdGlvbiA9IGNvbnRhaW5lci5jcmVhdGVEaXYoeyBjbHM6IFwibWFtLWRhc2hib2FyZC1zZWN0aW9uXCIgfSk7XG4gICAgY2FtZWxvdFNlY3Rpb24uY3JlYXRlRWwoXCJoNFwiLCB7IGNsczogXCJtYW0tZGFzaGJvYXJkLXNlY3Rpb24tbGFiZWxcIiwgdGV4dDogXCJDYW1lbG90XCIgfSk7XG4gICAgY29uc3QgY2FtZWxvdENvbnRhaW5lciA9IGNhbWVsb3RTZWN0aW9uLmNyZWF0ZURpdih7IGNsczogXCJtYW0tZGFzaGJvYXJkLWNhbWVsb3RcIiB9KTtcbiAgICBjb25zdCBjYW1lbG90ID0gbmV3IENhbWVsb3RXaGVlbChjYW1lbG90Q29udGFpbmVyLCB7XG4gICAgICBjdXJyZW50OiBrZXlOYW1lVG9DYW1lbG90KGJhc2VLZXksIGlzTWlub3IgPyBcIm1pbm9yXCIgOiBcIm1ham9yXCIpLFxuICAgICAgb25LZXlDbGljazogKF9jYW1lbG90S2V5LCBkdlF1ZXJ5KSA9PiB0aGlzLmhhbmRsZUNhbWVsb3RDbGljayhkdlF1ZXJ5KSxcbiAgICB9KTtcbiAgICBjYW1lbG90Lm1vdW50KCk7XG4gIH1cblxuICBwcml2YXRlIHBhcnNlRnJvbnRtYXR0ZXIocmF3OiBzdHJpbmcsIHNvdXJjZVBhdGg6IHN0cmluZyk6IERhc2hib2FyZEZyb250bWF0dGVyIHtcbiAgICBjb25zdCBmbTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gPSB7fTtcbiAgICBjb25zdCBtYXRjaCA9IC9eLS0tXFxzKlxcbihbXFxzXFxTXSo/KVxcbi0tLVxccypcXG4/Ly5leGVjKHJhdyk7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICBmb3IgKGNvbnN0IGxpbmUgb2YgbWF0Y2hbMV0uc3BsaXQoXCJcXG5cIikpIHtcbiAgICAgICAgY29uc3QgaWR4ID0gbGluZS5pbmRleE9mKFwiOlwiKTtcbiAgICAgICAgaWYgKGlkeCA+IDApIHtcbiAgICAgICAgICBjb25zdCBrID0gbGluZS5zbGljZSgwLCBpZHgpLnRyaW0oKTtcbiAgICAgICAgICBjb25zdCB2ID0gbGluZS5zbGljZShpZHggKyAxKS50cmltKCk7XG4gICAgICAgICAgaWYgKCFpc05hTihOdW1iZXIodikpICYmIHYgIT09IFwiXCIgJiYgIXYuaW5jbHVkZXMoXCIgXCIpKSB7XG4gICAgICAgICAgICAoZm0gYXMgYW55KVtrXSA9IE51bWJlcih2KTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHYgPT09IFwidHJ1ZVwiIHx8IHYgPT09IFwiZmFsc2VcIikge1xuICAgICAgICAgICAgKGZtIGFzIGFueSlba10gPSB2ID09PSBcInRydWVcIjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgKGZtIGFzIGFueSlba10gPSB2LnJlcGxhY2UoL15bXCInXXxbXCInXSQvZywgXCJcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFmbS50ZW1wbyAmJiAhZm0ua2V5KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBhbmFseXNpcyBkYXRhIGluIGZyb250bWF0dGVyXCIpO1xuICAgIH1cblxuICAgIGxldCBzdHJ1Y3R1cmU6IERhc2hib2FyZEZyb250bWF0dGVyW1wic3RydWN0dXJlXCJdID0gdW5kZWZpbmVkO1xuICAgIGlmIChBcnJheS5pc0FycmF5KGZtLnN0cnVjdHVyZSkpIHtcbiAgICAgIHN0cnVjdHVyZSA9IGZtLnN0cnVjdHVyZSBhcyBhbnk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZm0uc3RydWN0dXJlID09PSBcInN0cmluZ1wiICYmIGZtLnN0cnVjdHVyZS5zdGFydHNXaXRoKFwiW1wiKSAmJiBmbS5zdHJ1Y3R1cmUuZW5kc1dpdGgoXCJdXCIpKSB7XG4gICAgICB0cnkge1xuICAgICAgICBzdHJ1Y3R1cmUgPSBKU09OLnBhcnNlKGZtLnN0cnVjdHVyZSk7XG4gICAgICB9IGNhdGNoIHsgLyogbm8tb3AgKi8gfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBzb3VyY2VGaWxlOiBzb3VyY2VQYXRoLFxuICAgICAgdGVtcG86IE51bWJlcihmbS50ZW1wbyA/PyAwKSxcbiAgICAgIHJhd190ZW1wbzogZm0ucmF3X3RlbXBvID8gTnVtYmVyKGZtLnJhd190ZW1wbykgOiB1bmRlZmluZWQsXG4gICAgICBhbHRlcm5hdGVfdGVtcG86IGZtLmFsdGVybmF0ZV90ZW1wbyA/IE51bWJlcihmbS5hbHRlcm5hdGVfdGVtcG8pIDogdW5kZWZpbmVkLFxuICAgICAgdGVtcG9fY29uZmlybWVkOiAhIWZtLnRlbXBvX2NvbmZpcm1lZCxcbiAgICAgIGtleTogU3RyaW5nKGZtLmtleSA/PyBcIlwiKSxcbiAgICAgIGtleV9jb25maXJtZWQ6ICEhZm0ua2V5X2NvbmZpcm1lZCxcbiAgICAgIGR1cmF0aW9uOiBmbS5kdXJhdGlvbiA/IFN0cmluZyhmbS5kdXJhdGlvbikgOiB1bmRlZmluZWQsXG4gICAgICBhdWRpb19zdGFydF9vZmZzZXQ6IE51bWJlcihmbS5hdWRpb19zdGFydF9vZmZzZXQgPz8gMCksXG4gICAgICBzdHJ1Y3R1cmUsXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgY29sb3JGb3JTZWdtZW50KG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgY29sb3JzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAgICAgSW50cm86IFwidmFyKC0tY29sb3ItYWNjZW50KVwiICxcbiAgICAgIFZlcnNlOiBcInZhcigtLWludGVyYWN0aXZlLWFjY2VudClcIixcbiAgICAgIENob3J1czogXCJ2YXIoLS1jb2xvci1ncmVlbilcIiAsXG4gICAgICBCcmlkZ2U6IFwidmFyKC0tY29sb3IteWVsbG93KVwiICxcbiAgICAgIFwiUHJlLWNob3J1c1wiOiBcInZhcigtLWNvbG9yLW9yYW5nZSlcIiAsXG4gICAgICBIb29rOiBcInZhcigtLWNvbG9yLXJlZClcIiAsXG4gICAgICBPdXRybzogXCJ2YXIoLS1jb2xvci1wdXJwbGUpXCIgLFxuICAgICAgQnJlYWtkb3duOiBcInZhcigtLWNvbG9yLWN5YW4pXCIgLFxuICAgIH07XG4gICAgcmV0dXJuIGNvbG9yc1tuYW1lXSB8fCBcInZhcigtLXRleHQtbXV0ZWQpXCI7XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZUNhbWVsb3RDbGljayhkdlF1ZXJ5OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBuYXZpZ2F0b3IuY2xpcGJvYXJkPy53cml0ZVRleHQoZHZRdWVyeSkuY2F0Y2goKCkgPT4geyAvKiBuby1vcCAqLyB9KTtcbiAgICBjb25zb2xlLmxvZyhcIltNQU1dIENhbWVsb3Qga2V5IGNsaWNrZWQgXHUyMDE0IERhdGF2aWV3IHF1ZXJ5IGNvcGllZCB0byBjbGlwYm9hcmRcIik7XG4gIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0EsSUFBQUEsbUJBQW9EOzs7QUNHcEQsZUFBc0IsT0FBTyxRQUFzQztBQUNqRSxRQUFNLGFBQWEsTUFBTSxPQUFPLE9BQU8sT0FBTyxXQUFXLE1BQU07QUFDL0QsUUFBTSxZQUFZLE1BQU0sS0FBSyxJQUFJLFdBQVcsVUFBVSxDQUFDO0FBQ3ZELFNBQU8sVUFBVSxJQUFJLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxFQUFFLFNBQVMsR0FBRyxHQUFHLENBQUMsRUFBRSxLQUFLLEVBQUU7QUFDdEU7OztBQzBCQSxTQUFTLGVBQWUsS0FBYyxTQUFTLEdBQVc7QUFDeEQsUUFBTSxNQUFNLEtBQUssT0FBTyxNQUFNO0FBRTlCLE1BQUksTUFBTSxRQUFRLEdBQUcsR0FBRztBQUN0QixRQUFJLElBQUksV0FBVyxFQUFHLFFBQU87QUFFN0IsUUFBSSxJQUFJLE1BQU0sQ0FBQyxNQUFNLE1B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S0FBSyxRQUFRO0FBRWhCLFlBQU0sYUFBYSxLQUFLLElBQUksTUFBTSxRQUFRO0FBQUEsUUFDeEMsR0FBRyxLQUFLLFNBQVMsR0FBRztBQUFBLE1BQ3RCO0FBQ0EsV0FBSyxTQUFTLElBQUksT0FBTyxVQUFVO0FBQUEsSUFDckM7QUFFQSxXQUFPLElBQUksUUFBUSxDQUFDLFNBQVMsV0FBVztBQUN0QyxZQUFNLEtBQUssR0FBRyxRQUFRLElBQUksS0FBSyxJQUFJLENBQUM7QUFDcEMsWUFBTSxVQUFVLENBQUMsTUFBb0I7QUFDbkMsWUFBSSxFQUFFLEtBQUssT0FBTyxHQUFJO0FBQ3RCLGFBQUssT0FBUSxvQkFBb0IsV0FBVyxPQUFPO0FBQ25ELFlBQUksRUFBRSxLQUFLLFNBQVMsUUFBUyxRQUFPLElBQUksTUFBTSxFQUFFLEtBQUssS0FBSyxDQUFDO0FBQUEsWUFDdEQsU0FBUSxFQUFFLEtBQUssTUFBTTtBQUFBLE1BQzVCO0FBQ0EsV0FBSyxPQUFRLGlCQUFpQixXQUFXLE9BQU87QUFDaEQsV0FBSyxPQUFRLFlBQVksRUFBRSxJQUFJLE1BQU0sV0FBVyxZQUFZLENBQUM7QUFBQSxJQUMvRCxDQUFDO0FBQUEsRUFDSDtBQUFBLEVBRUEsTUFBYyxVQUFVLE1BQWMsUUFBd0IsWUFBb0I7QUFDaEYsVUFBTSxjQUFjLEtBQUssZUFBZSxPQUFPLFFBQVE7QUFDdkQsVUFBTSxhQUFhLE9BQU8sY0FBYyxHQUFHLE9BQU8sR0FBRyxNQUFNLE9BQU8sV0FBVyxLQUFLLE9BQU87QUFFekYsVUFBTSxVQUFVLGtCQUFrQixJQUFJO0FBQUEsTUFDcEMsY0FBYztBQUFBLE1BQ2QsS0FBSztBQUFBLE1BQ0wsZUFBZTtBQUFBLE1BQ2YsT0FBTyxPQUFPO0FBQUEsTUFDZCxXQUFXLE9BQU87QUFBQSxNQUNsQixpQkFBaUIsT0FBTztBQUFBLE1BQ3hCLGlCQUFpQjtBQUFBLE1BQ2pCLFVBQVU7QUFBQSxJQUNaLENBQUM7QUFFRCxVQUFNLFdBQVcsS0FBSyxJQUFJLE1BQU0sY0FBYyxJQUFJO0FBQ2xELFFBQUksVUFBVTtBQUNaLFlBQU0sS0FBSyxJQUFJLE1BQU0sT0FBTyxVQUFVLE9BQU87QUFBQSxJQUMvQyxPQUFPO0FBQ0wsWUFBTSxLQUFLLElBQUksTUFBTSxPQUFPLE1BQU0sT0FBTztBQUFBLElBQzNDO0FBQUEsRUFDRjtBQUFBLEVBRVEsZUFBZSxLQUFxQjtBQUMxQyxVQUFNLElBQUksS0FBSyxNQUFNLE1BQU0sRUFBRTtBQUM3QixVQUFNLElBQUksS0FBSyxNQUFNLE1BQU0sRUFBRTtBQUM3QixXQUFPLEdBQUcsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLFNBQVMsR0FBRyxHQUFHLENBQUM7QUFBQSxFQUM5QztBQUNGOyIsCiAgIm5hbWVzIjogWyJpbXBvcnRfb2JzaWRpYW4iXQp9Cg==
