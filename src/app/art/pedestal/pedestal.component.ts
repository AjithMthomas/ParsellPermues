import { Component, input, computed } from "@angular/core";

export type PedestalKind = "rock" | "moon" | "basalt" | "marble";

interface PedTheme {
  top: string;
  base: string;
  deep: string;
  edge: string;
  vein?: string;
}

const THEMES: Record<PedestalKind, PedTheme> = {
  rock: {
    top: "#f0ead9",
    base: "#ded2bc",
    deep: "#c8b99d",
    edge: "#ffffff",
  },
  moon: {
    top: "#e9eadb",
    base: "#cdd1b4",
    deep: "#aab08c",
    edge: "#f6f7e6",
  },
  basalt: {
    top: "#33261b",
    base: "#221810",
    deep: "#120c07",
    edge: "#57402c",
  },
  marble: {
    top: "#f7f3ea",
    base: "#e4dbc9",
    deep: "#cfc3ab",
    edge: "#ffffff",
    vein: "#a89b8b",
  },
};

let uidSeq = 0;

/**
 * Natural materials: sculptural boulders and a marble pedestal.
 * Every pedestal is drawn with its bearing surface along the TOP edge of the
 * viewBox (y ≈ 8–24) so scenes can align the flacon's base to a single line.
 */
@Component({
  selector: "bdp-pedestal",
  imports: [],
  template: `@if (kind() !== 'marble') {
    <svg class="ped" viewBox="0 0 320 250" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <defs>
        <linearGradient [attr.id]="gid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" [attr.stop-color]="t().top" />
          <stop offset="0.55" [attr.stop-color]="t().base" />
          <stop offset="1" [attr.stop-color]="t().deep" />
        </linearGradient>
      </defs>
      <path
        d="M38 30 C30 96 30 160 38 222 C48 234 70 240 96 240 L236 240 C262 240 278 234 284 222 C290 160 292 96 284 32 C250 20 118 16 38 30 Z"
        [attr.fill]="'url(#' + gid + ')'"
      />
      <path d="M46 40 C44 96 46 150 54 196" stroke="#ffffff" stroke-width="2" opacity="0.28" fill="none" />
      <path d="M268 46 C272 96 272 150 266 190" stroke="#ffffff" stroke-width="1.6" opacity="0.14" fill="none" />
      <!-- upper plateau, catching the light -->
      <path
        d="M54 26 C100 18 180 18 268 26"
        [attr.stroke]="t().edge"
        stroke-width="1.6"
        opacity="0.8"
        fill="none"
      />
    </svg>
  } @else {
    <svg class="ped" viewBox="0 0 200 340" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <defs>
        <linearGradient [attr.id]="gid" x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0" [attr.stop-color]="t().base" />
          <stop offset="0.5" [attr.stop-color]="t().top" />
          <stop offset="1" [attr.stop-color]="t().deep" />
        </linearGradient>
      </defs>
      <!-- capital -->
      <rect x="52" y="16" width="96" height="34" rx="3" [attr.fill]="'url(#' + gid + ')'" />
      <rect x="52" y="16" width="96" height="2" rx="1" fill="#ffffff" opacity="0.85" />
      <!-- shaft -->
      <rect x="76" y="46" width="48" height="254" [attr.fill]="'url(#' + gid + ')'" />
      <path d="M88 60 C84 130 86 210 90 290" [attr.stroke]="t().vein" stroke-width="0.8" opacity="0.3" fill="none" />
      <path d="M116 90 C120 160 118 230 114 290" [attr.stroke]="t().vein" stroke-width="0.7" opacity="0.22" fill="none" />
      <path d="M100 70 C108 130 106 200 102 280" stroke="#b89452" stroke-width="0.5" opacity="0.2" fill="none" />
      <rect x="76" y="46" width="7" height="254" fill="#ffffff" opacity="0.18" />
      <line x1="80.5" y1="46" x2="80.5" y2="300" stroke="#ffffff" stroke-width="1.1" opacity="0.7" />
      <!-- base -->
      <rect x="16" y="300" width="168" height="38" rx="3" [attr.fill]="'url(#' + gid + ')'" />
      <rect x="16" y="300" width="168" height="2" fill="#ffffff" opacity="0.6" />
    </svg>
  }`,
  styles: `
    :host {
      display: block;
      width: 100%;
      height: 100%;
      line-height: 0;
    }
    .ped {
      width: 100%;
      height: 100%;
      overflow: visible;
    }
  `,
})
export class PedestalComponent {
  readonly kind = input<PedestalKind>("rock");
  private readonly uid = `ped${++uidSeq}-body`;

  t = computed(() => THEMES[this.kind()]);
  get gid(): string {
    return this.uid;
  }
}
