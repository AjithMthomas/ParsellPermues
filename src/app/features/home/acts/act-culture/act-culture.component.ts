import { Component, inject } from "@angular/core";
import { RevealDirective } from "../../../../core/reveal.directive";
import { UiService } from "../../../../services/ui.service";

interface Entry {
  num: string;
  title: string;
  tag: string;
  abstract: string;
}

@Component({
  selector: "bdp-act-culture",
  imports: [RevealDirective],
  templateUrl: "./act-culture.component.html",
  styleUrl: "./act-culture.component.css",
})
export class ActCultureComponent {
  private readonly ui = inject(UiService);

  protected entries: Entry[] = [
    {
      num: "01",
      title: "The art of perfume",
      tag: "The house — 6 min",
      abstract:
        "How a fragrance is composed: light first, then flower, then the wood that carries both.",
    },
    {
      num: "02",
      title: "The language of scent",
      tag: "Notes — 4 min",
      abstract:
        "Top, heart and base are not layers but a sentence — the first word, the feeling, the echo.",
    },
    {
      num: "03",
      title: "Paris through fragrance",
      tag: "The city — 7 min",
      abstract:
        "A morning in the courtyards of the 8th arrondissement, and the scent it leaves behind.",
    },
  ];

  protected findYours(): void {
    this.ui.openFinder();
  }
}
