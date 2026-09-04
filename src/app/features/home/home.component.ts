import { Component } from "@angular/core";
import { ActHeroComponent } from "./acts/act-hero/act-hero.component";
import { ActNotesComponent } from "./acts/act-notes/act-notes.component";
import { ActMistComponent } from "./acts/act-mist/act-mist.component";
import { ActCollectionComponent } from "./acts/act-collection/act-collection.component";
import { ActSignatureComponent } from "./acts/act-signature/act-signature.component";
import { ActEditorialComponent } from "./acts/act-editorial/act-editorial.component";
import { ActCultureComponent } from "./acts/act-culture/act-culture.component";
import { ActFinalComponent } from "./acts/act-final/act-final.component";
import { ActContactComponent } from "./acts/act-contact/act-contact.component";
import { QuoteComponent } from "./quote/quote.component";

/**
 * THE HOMEPAGE — one continuous scroll film.
 * The perfume travels: stone → air → glass → light → mist → marble → night.
 */
@Component({
  selector: "bdp-home",
  imports: [
    ActHeroComponent,
    ActNotesComponent,
    ActMistComponent,
    QuoteComponent,
    ActCollectionComponent,
    ActSignatureComponent,
    ActEditorialComponent,
    ActCultureComponent,
    ActFinalComponent,
    ActContactComponent,
  ],
  template: `
    <main id="main" class="home">
      <bdp-act-hero />
      <bdp-act-notes />
      <bdp-act-mist />
      <bdp-quote [lines]="['A scent', 'becomes', 'a memory.']" kicker="Interlude — I" />
      <bdp-act-collection />
      <bdp-act-signature />
      <bdp-quote [lines]="['Elegance', 'leaves', 'a trace.']" kicker="Interlude — II" />
      <bdp-act-editorial />
      <bdp-act-culture />
      <bdp-act-final />
      <bdp-act-contact />
    </main>
  `,
  styles: `
    :host {
      display: block;
      background: var(--color-ivory);
    }
  `,
})
export class HomeComponent {}
