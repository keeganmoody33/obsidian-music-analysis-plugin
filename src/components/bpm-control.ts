// BPMControl — reusable tempo widget for modal + dashboard.
// CSS class hooks (for theming by user):
//  .bpm-control          — root container
//  .bpm-value            — current displayed BPM
//  .bpm-raw              — raw detect (small, muted)
//  .bpm-alternate        — half/double alternate value
//  .bpm-btn-halve        — halve button
//  .bpm-btn-double       — double button
//  .bpm-btn-tap          — tap-tempo button
//  .bpm-btn-tap-active   — tapped recently (brief flash)
//  .bpm-input            — manual BPM input (inline edit)
//  .bpm-confirmed        — confirmed state flag
//  .bpm-unconfirmed      — unconfirmed state flag

import { TapTempoController } from "./tap-tempo";

export interface BpmControlCallbacks {
  onChange?: (bpm: number) => void;
  onConfirmed?: (confirmed: boolean) => void;
}

export interface BpmControlState {
  bpm: number;
  rawBpm: number;
  alternateBpm?: number;
  confirmed: boolean;
}

export class BpmControl {
  private container: HTMLElement;
  private state: BpmControlState;
  private callbacks: BpmControlCallbacks;
  private tapController: TapTempoController;
  private tapFlashTimeout?: ReturnType<typeof setTimeout>;

  constructor(
    parent: HTMLElement,
    initial: BpmControlState,
    callbacks: BpmControlCallbacks = {},
  ) {
    this.state = { ...initial };
    this.callbacks = callbacks;
    this.tapController = new TapTempoController({ maxTaps: 8 });
    this.container = this.build(parent);
  }

  private build(parent: HTMLElement): HTMLElement {
    const root = parent.createDiv({ cls: "bpm-control" });

    // Value row: current BPM + raw BPM
    const valueRow = root.createDiv({ cls: "bpm-value-row" });
    this.renderValue(valueRow);

    // Alternate suggestion
    if (this.state.alternateBpm) {
      const alt = root.createDiv({ cls: "bpm-alternate-row" });
      const altBtn = alt.createEl("button", {
        cls: "bpm-alternate",
        text: `or ${this.state.alternateBpm}?`,
      });
      altBtn.addEventListener("click", () => this.acceptAlternate());
    }

    // Action row: halve | double | tap
    const actions = root.createDiv({ cls: "bpm-actions" });

    const btnHalve = actions.createEl("button", { cls: "bpm-btn-halve", text: "½" });
    btnHalve.addEventListener("click", () => this.setBpm(Math.round(this.state.bpm / 2)));

    const btnDouble = actions.createEl("button", { cls: "bpm-btn-double", text: "×2" });
    btnDouble.addEventListener("click", () => this.setBpm(this.state.bpm * 2));

    const btnTap = actions.createEl("button", { cls: "bpm-btn-tap", text: "Tap tempo" });
    btnTap.addEventListener("click", () => this.onTap(btnTap));

    // Confirm toggle
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

  private renderValue(container: HTMLElement) {
    container.empty();
    const display = container.createSpan({ cls: "bpm-value", text: String(this.state.bpm) });
    display.addEventListener("click", () => this.startInlineEdit(display));

    container.createSpan({ cls: "bpm-raw", text: ` (raw ${this.state.rawBpm})` });
  }

  private startInlineEdit(el: HTMLElement) {
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

  private refreshValue() {
    const row = this.container.querySelector(".bpm-value-row") as HTMLElement;
    if (row) this.renderValue(row);
  }

  private setBpm(bpm: number) {
    this.state.bpm = bpm;
    // Recompute alternate from new displayed value
    const doubled = bpm * 2;
    const halved = Math.round(bpm / 2);
    if (doubled <= 200 && doubled !== bpm) {
      this.state.alternateBpm = doubled;
    } else if (halved >= 60 && halved !== bpm) {
      this.state.alternateBpm = halved;
    } else {
      this.state.alternateBpm = undefined;
    }
    this.refreshValue();
    this.refreshAlternate();
    this.callbacks.onChange?.(this.state.bpm);
  }

  private acceptAlternate() {
    if (this.state.alternateBpm) {
      this.setBpm(this.state.alternateBpm);
    }
  }

  private refreshAlternate() {
    const existing = this.container.querySelector(".bpm-alternate-row");
    if (existing) existing.remove();

    if (this.state.alternateBpm) {
      const actions = this.container.querySelector(".bpm-actions") as HTMLElement;
      const alt = this.container.createDiv({ cls: "bpm-alternate-row" });
      if (actions) this.container.insertBefore(alt, actions);
      else this.container.appendChild(alt);

      const btn = alt.createEl("button", {
        cls: "bpm-alternate",
        text: `or ${this.state.alternateBpm}?`,
      });
      btn.addEventListener("click", () => this.acceptAlternate());
    }
  }

  private onTap(btn: HTMLButtonElement) {
    const bpm = this.tapController.tap();

    // Flash the button
    btn.classList.add("bpm-btn-tap-active");
    clearTimeout(this.tapFlashTimeout);
    this.tapFlashTimeout = setTimeout(() => btn.classList.remove("bpm-btn-tap-active"), 150);

    if (bpm !== null) {
      this.setBpm(bpm);
    }
  }

  private refreshConfirmedState(root: HTMLElement) {
    root.classList.toggle("bpm-confirmed", this.state.confirmed);
    root.classList.toggle("bpm-unconfirmed", !this.state.confirmed);
  }

  getState(): BpmControlState {
    return { ...this.state };
  }

  mount(parent: HTMLElement): void {
    parent.appendChild(this.container);
  }

  destroy(): void {
    this.container.remove();
    clearTimeout(this.tapFlashTimeout);
  }
}
