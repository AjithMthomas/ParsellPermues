import { Component, inject, signal } from "@angular/core";
import { RevealDirective } from "../../../../core/reveal.directive";
import { WhatsAppService } from "../../../../services/whatsapp.service";

@Component({
  selector: "bdp-act-contact",
  imports: [RevealDirective],
  templateUrl: "./act-contact.component.html",
  styleUrl: "./act-contact.component.css",
})
export class ActContactComponent {
  protected sent = signal(false);
  private readonly wa = inject(WhatsAppService);

  protected send(e: Event): void {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const read = (name: string): string =>
      (form.elements.namedItem(name) as HTMLInputElement | null)?.value?.trim() ?? "";
    const name = read("name");
    const subject = read("subject");
    const message = read("message");
    if (!message) return;
    this.wa.open(this.wa.enquiry(name || "A visitor", subject, message));
    this.sent.set(true);
  }
}
