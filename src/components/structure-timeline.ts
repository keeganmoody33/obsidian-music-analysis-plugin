// StructureTimeline — manual segment bars with hover tooltip and offset slider.
//
// CSS class hooks (for theming by user):
//  .mam-timeline              — root container
//  .mam-timeline-track        — horizontal bar track
//  .mam-timeline-segment      — individual colored bar
//  .mam-timeline-segment-label
//  .mam-timeline-offset-row   — slider + label wrapper
//  .mam-timeline-offset-label
//  .mam-timeline-slider       — HTML range input
//  .mam-timeline-tooltip      — floating hover tooltip (abs positioned)
//  .mam-timeline-empty        — no-segments state

export interface StructureSegment {
  id: string;
  label: string;
  startBar: number;
  endBar: number;
  color: string; // CSS color value (Obsidian var or literal)
}

export class StructureTimeline {
  private container: HTMLElement;
  private segments: StructureSegment[];
  private bpm: number;
  private offsetBars: number;
  private trackEl: HTMLElement | null = null;
  private tooltipEl: HTMLElement | null = null;

  onOffsetChange?: (offsetBars: number) => void;

  constructor(
    parent: HTMLElement,
    segments: StructureSegment[],
    bpm: number,
    offsetBars = 0,
  ) {
    this.container = parent.createDiv({ cls: "mam-timeline" });
    this.segments = segments;
    this.bpm = bpm;
    this.offsetBars = offsetBars;
  }

  mount(): void {
    this.container.empty();

    if (this.segments.length === 0) {
      this.container.createDiv({
        cls: "mam-timeline-empty",
        text: "No structure defined. Add segments to frontmatter: structure: [...]",
      });
      this.buildOffsetRow();
      return;
    }

    // Compute total span (accounting for offset lead-in)
    const totalBars = Math.max(...this.segments.map((s) => s.endBar));
    const effectiveTotal = totalBars + this.offsetBars;

    // Track container
    this.trackEl = this.container.createDiv({ cls: "mam-timeline-track" });

    // Render each segment as an absolutely-positioned proportional bar
    this.segments.forEach((seg) => {
      const leftPct = ((seg.startBar + this.offsetBars) / effectiveTotal) * 100;
      const widthPct = ((seg.endBar - seg.startBar) / effectiveTotal) * 100;

      const bar = this.trackEl!.createDiv({ cls: "mam-timeline-segment" });
      bar.style.left = `${leftPct}%`;
      bar.style.width = `${widthPct}%`;
      bar.style.backgroundColor = seg.color;
      bar.style.setProperty("--mam-segment-color", seg.color);

      bar.createSpan({
        cls: "mam-timeline-segment-label",
        text: seg.label,
      });

      bar.addEventListener("mouseenter", () => this.showTooltip(seg, bar));
      bar.addEventListener("mouseleave", () => this.hideTooltip());
    });

    this.buildOffsetRow();
  }

  private buildOffsetRow(): void {
    const row = this.container.createDiv({ cls: "mam-timeline-offset-row" });
    row.createSpan({
      cls: "mam-timeline-offset-label",
      text: `Trim lead-in: ${this.offsetBars} bar${this.offsetBars === 1 ? "" : "s"}`,
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
      // Update label
      const label = row.querySelector(".mam-timeline-offset-label");
      if (label) {
        label.textContent = `Trim lead-in: ${val} bar${val === 1 ? "" : "s"}`;
      }
      this.onOffsetChange?.(val);
      // Re-render with new offset
      this.mount();
    });
  }

  private showTooltip(seg: StructureSegment, anchor: HTMLElement): void {
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

    // Position tooltip above the hovered bar, centered
    const trackRect = this.trackEl.getBoundingClientRect();
    const barRect = anchor.getBoundingClientRect();
    const left = barRect.left - trackRect.left + barRect.width / 2 - 60;
    const top = -40;
    this.tooltipEl.style.left = `${left}px`;
    this.tooltipEl.style.top = `${top}px`;
  }

  private hideTooltip(): void {
    if (this.tooltipEl) {
      this.tooltipEl.remove();
      this.tooltipEl = null;
    }
  }

  private formatTime(sec: number): string {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 100);
    return `${m}:${s.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
  }

  destroy(): void {
    this.container.remove();
  }
}
