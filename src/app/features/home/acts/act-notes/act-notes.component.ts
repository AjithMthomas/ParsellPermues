import { Component, inject, signal } from "@angular/core";
import { FRAGRANCES } from "../../../../data/fragrances";
import { RevealDirective } from "../../../../core/reveal.directive";
import { ParallaxDirective } from "../../../../core/parallax.directive";
import { BotanicalComponent } from "../../../../art/botanical/botanical.component";
import { DustComponent } from "../../../../art/dust/dust.component";
import { AssetArtService } from "../../../../services/asset-art.service";
import type { BotanicalKind } from "../../../../art/botanical/botanical.component";

const NO1 = FRAGRANCES[0];

type NoteKey = "top" | "heart" | "base";

interface NoteFamily {
  key: NoteKey;
  numeral: string;
  title: string;
  poem: string;
  list: string[];
  botanical: BotanicalKind;
  side: "l" | "r";
  tone: string;
}

@Component({
  selector: "bdp-act-notes",
  imports: [RevealDirective, ParallaxDirective, BotanicalComponent, DustComponent],
  templateUrl: "./act-notes.component.html",
  styleUrl: "./act-notes.component.css",
})
export class ActNotesComponent {
  private assets = inject(AssetArtService);

  /** Real macro photograph for each family, or null until/unless one exists. */
  protected photos = {
    top: signal<string | null>(null),
    heart: signal<string | null>(null),
    base: signal<string | null>(null),
  };

  protected families: NoteFamily[] = [
    {
      key: "top",
      numeral: "I",
      title: "Top notes",
      poem: "The first breath — bright, brief, awake.",
      list: NO1.topNotes,
      botanical: "citrus",
      side: "l",
      tone: "top",
    },
    {
      key: "heart",
      numeral: "II",
      title: "Heart notes",
      poem: "The soul of the scent — floral, luminous, unhurried.",
      list: NO1.heartNotes,
      botanical: "peony",
      side: "r",
      tone: "heart",
    },
    {
      key: "base",
      numeral: "III",
      title: "Base notes",
      poem: "What remains — warm, quiet, unforgettable.",
      list: NO1.baseNotes,
      botanical: "amber",
      side: "l",
      tone: "base",
    },
  ];

  constructor() {
    for (const key of ["top", "heart", "base"] as NoteKey[]) {
      const path = `/assets/products/laube/notes-${key}.png`;
      this.assets.available(path).then((ok) => this.photos[key].set(ok ? path : null));
    }
  }
}
