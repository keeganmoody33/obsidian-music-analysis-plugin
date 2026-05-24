// TunerNeedle — key-position gauge. Styled by confirmed state, NOT confidence.
//
// CSS class hooks (for theming by user):
//  .mam-tuner             — root container
//  .mam-tuner-dial        — circular background
//  .mam-tuner-tick        — major/minor position marks
//  .mam-tuner-needle      — animated pointer
//  .mam-tuner-needle-confirmed   — confirmed style
//  .mam-tuner-needle-unconfirmed — unconfirmed style
//  .mam-tuner-label       — key display below dial
//  .mam-tuner-label-confirmed
//  .mam-tuner-label-unconfirmed

const CHROMATIC_ORDER = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
];

export interface TunerNeedleState {
  key: string;      // e.g. "C#"
  scale: string;    // "minor" | "major"
  confirmed: boolean;
}

export class TunerNeedle {
  private container: HTMLElement;
  private state: TunerNeedleState;
  private needleEl: HTMLElement | null = null;

  constructor(parent: HTMLElement, initial: TunerNeedleState) {
    this.state = { ...initial };
    this.container = parent.createDiv({ cls: "mam-tuner" });
  }

  mount(): void {
    this.container.empty();

    const dial = this.container.createDiv({ cls: "mam-tuner-dial" });

    // Render position ticks for each chromatic note
    CHROMATIC_ORDER.forEach((note, i) => {
      const angle = (i / 12) * 360;
      const tick = dial.createDiv({ cls: "mam-tuner-tick" });
      // CSS transform handles positioning via transform: rotate(angle) translateY(radius)
      tick.setAttribute("data-note", note);
      tick.style.transform = `rotate(${angle}deg) translateY(-45px)`;
    });

    // Needle
    this.needleEl = dial.createDiv({
      cls: `mam-tuner-needle ${
        this.state.confirmed
          ? "mam-tuner-needle-confirmed"
          : "mam-tuner-needle-unconfirmed"
      }`,
    });
    this.setNeedleAngle(this.state.key);

    // Label
    const label = this.container.createDiv({
      cls: `mam-tuner-label ${
        this.state.confirmed
          ? "mam-tuner-label-confirmed"
          : "mam-tuner-label-unconfirmed"
      }`,
      text: this.formatKeyDisplay(),
    });
  }

  update(state: TunerNeedleState): void {
    this.state = { ...state };
    this.setNeedleAngle(this.state.key);
    if (this.needleEl) {
      this.needleEl.className = `mam-tuner-needle ${
        this.state.confirmed
          ? "mam-tuner-needle-confirmed"
          : "mam-tuner-needle-unconfirmed"
      }`;
    }
    const label = this.container.querySelector(".mam-tuner-label");
    if (label) {
      label.className = `mam-tuner-label ${
        this.state.confirmed
          ? "mam-tuner-label-confirmed"
          : "mam-tuner-label-unconfirmed"
      }`;
      label.textContent = this.formatKeyDisplay();
    }
  }

  private setNeedleAngle(key: string): void {
    const idx = CHROMATIC_ORDER.indexOf(key);
    if (idx === -1) return;
    const angle = (idx / 12) * 360;
    if (this.needleEl) {
      this.needleEl.style.transform = `rotate(${angle}deg)`;
    }
  }

  private formatKeyDisplay(): string {
    return this.state.scale === "minor"
      ? `${this.state.key}m`
      : this.state.key;
  }

  destroy(): void {
    this.container.remove();
  }
}
