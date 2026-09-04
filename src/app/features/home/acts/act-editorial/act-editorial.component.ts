import { Component } from "@angular/core";
import { RevealDirective } from "../../../../core/reveal.directive";
import { ParallaxDirective } from "../../../../core/parallax.directive";
import { ProductArtComponent } from "../../../../art/product-art/product-art.component";
import { PedestalComponent } from "../../../../art/pedestal/pedestal.component";
import { BotanicalComponent } from "../../../../art/botanical/botanical.component";
import { DustComponent } from "../../../../art/dust/dust.component";
import { FRAGRANCES } from "../../../../data/fragrances";

const NO1 = FRAGRANCES[0];

interface Belief {
  numeral: string;
  title: string;
  copy: string;
}

@Component({
  selector: "bdp-act-editorial",
  imports: [
    RevealDirective,
    ParallaxDirective,
    ProductArtComponent,
    PedestalComponent,
    BotanicalComponent,
    DustComponent,
  ],
  templateUrl: "./act-editorial.component.html",
  styleUrl: "./act-editorial.component.css",
})
export class ActEditorialComponent {
  protected no1 = NO1;

  protected beliefs: Belief[] = [
    {
      numeral: "I",
      title: "The art of scent",
      copy: "Perfume is composition — light, held in balance, the way a facade holds a square of morning.",
    },
    {
      numeral: "II",
      title: "The beauty of nature",
      copy: "Every bottle begins as a field, a branch, a single petal at dawn — distilled, never hurried.",
    },
    {
      numeral: "III",
      title: "The signature of elegance",
      copy: "True luxury is quiet. It does not ask to be noticed; it asks to be remembered.",
    },
  ];
}
