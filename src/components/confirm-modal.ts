// AnalysisConfirmModal — opens on-demand when user clicks an unconfirmed value.
// Uses BpmControl + KeyControl (reusable in dashboard later).
//
// CSS class hooks:
//  .mam-confirm-modal       — Modal root
//  .mam-modal-header        — Title area
//  .mam-modal-body          — Controls container
//  .mam-modal-section       — BPM / Key section wrapper
//  .mam-modal-section-label — "Tempo" / "Key" label
//  .mam-modal-footer        — Save / Cancel actions
//  .mam-btn-save            — Commit changes
//  .mam-btn-cancel          — Discard changes

import { Modal, App } from "obsidian";
import { BpmControl, BpmControlState } from "../components/bpm-control";
import { KeyControl, KeyControlState } from "../components/key-control";

export interface ConfirmModalData {
  fileName: string;
  bpm: BpmControlState;
  key: KeyControlState;
}

export interface ConfirmModalCallbacks {
  onSave: (data: { bpm: BpmControlState; key: KeyControlState }) => void;
  onCancel?: () => void;
}

export class AnalysisConfirmModal extends Modal {
  private data: ConfirmModalData;
  private callbacks: ConfirmModalCallbacks;
  private bpmControl?: BpmControl;
  private keyControl?: KeyControl;

  constructor(app: App, data: ConfirmModalData, callbacks: ConfirmModalCallbacks) {
    super(app);
    this.data = data;
    this.callbacks = callbacks;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.addClass("mam-confirm-modal");

    // Header
    const header = contentEl.createDiv({ cls: "mam-modal-header" });
    header.createEl("h2", { text: `Confirm analysis: ${this.data.fileName}` });
    header.createEl("p", {
      text: "Tap or edit values below. Mark confirmed only when they match your ears.",
      cls: "setting-item-description",
    });

    const body = contentEl.createDiv({ cls: "mam-modal-body" });

    // BPM section
    const bpmSection = body.createDiv({ cls: "mam-modal-section" });
    bpmSection.createEl("h3", { cls: "mam-modal-section-label", text: "Tempo" });
    this.bpmControl = new BpmControl(bpmSection, this.data.bpm, {
      onChange: (bpm) => {
        // Live update if needed (e.g., sync with note preview)
      },
      onConfirmed: () => {
        // Optional: auto-enable key confirm when both are close
      },
    });

    // Key section
    const keySection = body.createDiv({ cls: "mam-modal-section" });
    keySection.createEl("h3", { cls: "mam-modal-section-label", text: "Key" });
    this.keyControl = new KeyControl(keySection, this.data.key, {
      onChange: (key, scale) => {
        // Live update
      },
    });

    // Footer: Save / Cancel
    const footer = contentEl.createDiv({ cls: "mam-modal-footer" });

    const btnSave = footer.createEl("button", { cls: "mam-btn-save mod-cta", text: "Save" });
    btnSave.addEventListener("click", () => {
      if (this.bpmControl && this.keyControl) {
        this.callbacks.onSave({
          bpm: this.bpmControl.getState(),
          key: this.keyControl.getState(),
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
}
