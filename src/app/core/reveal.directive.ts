import {
  Directive,
  ElementRef,
  inject,
  input,
  AfterViewInit,
  OnDestroy,
} from "@angular/core";
import { gsap } from "gsap";
import { CapabilitiesService } from "./capabilities.service";

/**
 * One directive for all editorial reveals.
 *  'rise' — element glides up out of soft haze
 *  'fade' — a slow dissolve
 *  'lines' — staggered lift for stacked display words (wrap each word in [rv-line])
 * Children can opt into a stagger via the [rv-item] attribute.
 */
@Directive({
  selector: "[bdpReveal]",
  standalone: true,
})
export class RevealDirective implements AfterViewInit, OnDestroy {
  readonly bdpReveal = input<"rise" | "fade" | "lines">("rise");
  readonly delay = input(0);

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly caps = inject(CapabilitiesService);
  private io?: IntersectionObserver;
  private done = false;

  private qa(sel: string): HTMLElement[] {
    const host = this.el.nativeElement;
    return Array.prototype.slice.call(host.querySelectorAll(sel)) as HTMLElement[];
  }

  ngAfterViewInit(): void {
    const host = this.el.nativeElement;
    const kind = this.bdpReveal();

    if (this.caps.rm) {
      gsap.set(host, { clearProps: "all" });
      this.qa("[rv-line],[rv-item]").forEach((n) => gsap.set(n, { clearProps: "all" }));
      return;
    }

    const items =
      kind === "lines" ? this.qa("[rv-line]") : this.qa("[rv-item]");
    const targets: gsap.TweenTarget[] = items.length ? items : [host];

    // hide immediately (no flash) while we wait for the observer
    gsap.set(targets, { opacity: 0, y: kind === "lines" ? 46 : 34 });

    this.io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.done) {
            this.done = true;
            gsap.to(targets, {
              opacity: 1,
              y: 0,
              duration: 1.6,
              ease: "power3.out",
              stagger: kind === "lines" ? 0.1 : 0.12,
              delay: this.delay(),
            });
            this.io?.disconnect();
          }
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.06 },
    );
    this.io.observe(host);
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
  }
}
