// KeyControl — reusable key widget for modal + dashboard.
// CSS class hooks (for theming by user):
//  .key-control            — root container
//  .key-value              — current displayed key (e.g. "C# minor")
//  .key-relative           — relative major/minor display
//  .key-btn-semitone-up    — +1 semitone button
//  .key-btn-semitone-down  — -1 semitone button
//  .key-btn-mode-toggle    — major/minor toggle
//  .key-btn-relative       — jump to relative key
//  .key-confirmed          — confirmed state flag
//  .key-unconfirmed        — unconfirmed state flag

const CHROMATIC = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// Minor → relative major
const RELATIVE_MAJOR: Record<string, string> = {
  Am: "C", Em: "G", Bm: "D", "F#m": "A", "C#m": "E",
  "G#m": "B", "D#m": "F#", "A#m": "C#", Dm: "F",
  Gm: "Bb", Cm: "Eb", Fm: "Ab",
};

// Major → relative minor
const RELATIVE_MINOR: Record<string, string> = Object.fromEntries(
  Object.entries(RELATIVE_MAJOR).map(([k, v]) => [v, k]),
);

export interface KeyControlCallbacks {
  onChange?: (key: string, scale: string) => void;
  onConfirmed?: (confirmed: boolean) => void;
}

export interface KeyControlState {
  key: string;    // e.g. "C#" (without m suffix)
  scale: string;  // "minor" | "major"
  relativeKey?: string;
  confirmed: boolean;
}

export class KeyControl {
  private container: HTMLElement;
  private state: KeyControlState;
  private callbacks: KeyControlCallbacks;

  constructor(
    parent: HTMLElement,
    initial: KeyControlState,
    callbacks: KeyControlCallbacks = {},
  ) {
    this.state = { ...initial };
    this.callbacks = callbacks;
    this.container = this.build(parent);
  }

  private build(parent: HTMLElement): HTMLElement {
    const root = parent.createDiv({ cls: "key-control" });

    // Value row
    const valueRow = root.createDiv({ cls: "key-value-row" });
    this.renderValue(valueRow);

    // Relative key hint
    this.renderRelative(root);

    // Action row: ♭ | ♯ | mode toggle | relative
    const actions = root.createDiv({ cls: "key-actions" });

    const btnDown = actions.createEl("button", { cls: "key-btn-semitone-down", text: "♭" });
    btnDown.addEventListener("click", () => this.shiftSemitone(-1));

    const btnUp = actions.createEl("button", { cls: "key-btn-semitone-up", text: "♯" });
    btnUp.addEventListener("click", () => this.shiftSemitone(1));

    const btnMode = actions.createEl("button", {
      cls: "key-btn-mode-toggle",
      text: this.state.scale === "minor" ? "major" : "minor",
    });
    btnMode.addEventListener("click", () => this.toggleMode());

    const btnRelative = actions.createEl("button", {
      cls: "key-btn-relative",
      text: "Relative",
    });
    btnRelative.addEventListener("click", () => this.jumpToRelative());

    // Confirm toggle
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

  private renderValue(container: HTMLElement) {
    container.empty();
    const displayKey = this.formatKeyDisplay(this.state.key, this.state.scale);
    const el = container.createSpan({ cls: "key-value", text: displayKey });
    el.addEventListener("click", () => this.startInlineEdit(el));
  }

  private renderRelative(root: HTMLElement) {
    const existing = root.querySelector(".key-relative-row");
    if (existing) existing.remove();

    const relative = this.computeRelative();
    if (!relative) return;

    const row = root.createDiv({ cls: "key-relative-row" });
    // Insert before actions
    const actions = root.querySelector(".key-actions");
    if (actions) root.insertBefore(row, actions);
    else root.appendChild(row);

    row.createSpan({ cls: "key-relative", text: `Relative: ${relative}` });
  }

  private formatKeyDisplay(key: string, scale: string): string {
    return scale === "minor" ? `${key}m` : key;
  }

  private parseKeyDisplay(display: string): { key: string; scale: string } {
    if (display.endsWith("m")) {
      return { key: display.slice(0, -1), scale: "minor" };
    }
    return { key: display, scale: "major" };
  }

  private startInlineEdit(el: HTMLElement) {
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

  private shiftSemitone(delta: number) {
    const idx = CHROMATIC.indexOf(this.state.key);
    if (idx === -1) return;
    const newIdx = (idx + delta + 12) % 12;
    this.state.key = CHROMATIC[newIdx];
    this.refresh();
    this.callbacks.onChange?.(this.state.key, this.state.scale);
  }

  private toggleMode() {
    this.state.scale = this.state.scale === "minor" ? "major" : "minor";
    this.refresh();
    this.callbacks.onChange?.(this.state.key, this.state.scale);
  }

  private jumpToRelative() {
    const relative = this.computeRelative(true);
    if (relative) {
      const parsed = this.parseKeyDisplay(relative);
      this.state.key = parsed.key;
      this.state.scale = parsed.scale;
      this.refresh();
      this.callbacks.onChange?.(this.state.key, this.state.scale);
    }
  }

  private computeRelative(forJump = false): string | undefined {
    const display = this.formatKeyDisplay(this.state.key, this.state.scale);
    if (this.state.scale === "minor") {
      const rel = RELATIVE_MAJOR[display];
      return rel || undefined;
    } else {
      const rel = RELATIVE_MINOR[display];
      return rel || undefined;
    }
  }

  private refresh() {
    const valRow = this.container.querySelector(".key-value-row") as HTMLElement;
    if (valRow) this.renderValue(valRow);
    this.renderRelative(this.container);

    const modeBtn = this.container.querySelector(".key-btn-mode-toggle") as HTMLElement;
    if (modeBtn) modeBtn.textContent = this.state.scale === "minor" ? "major" : "minor";
  }

  private refreshConfirmedState(root: HTMLElement) {
    root.classList.toggle("key-confirmed", this.state.confirmed);
    root.classList.toggle("key-unconfirmed", !this.state.confirmed);
  }

  getState(): KeyControlState {
    return { ...this.state };
  }

  mount(parent: HTMLElement): void {
    parent.appendChild(this.container);
  }

  destroy(): void {
    this.container.remove();
  }
}
