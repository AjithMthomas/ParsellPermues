import { Directive, ElementRef, inject, input, AfterViewInit, OnDestroy } from "@angular/core";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CapabilitiesService } from "./capabilities.service";

/**
 * Gentle editorial parallax for non-filmic sections.
 * [bdpParallax]="0.12" — element travels 12% of the viewport slower than the page.
 */
@Directive({
  selector: "[bdpParallax]",
  standalone: true,
})
export class ParallaxDirective implements AfterViewInit, OnDestroy {
  readonly bdpParallax = input(0.1);

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly caps = inject(CapabilitiesService);
  private st?: ScrollTrigger;

  ngAfterViewInit(): void {
    const host = this.el.nativeElement;
    if (this.caps.rm || this.caps.mobile) return;
    const px = (host.offsetHeight || 100) * this.bdpParallax();
    this.st = ScrollTrigger.create({
      trigger: host,
      start: "top bottom",
      end: "bottom top",
      scrub: 0.6,
      onUpdate: (self) => {
        const y = (self.progress - 0.5) * 2 * px;
        gsap.set(host, { y });
      },
    });
  }

  ngOnDestroy(): void {
    this.st?.kill();
  }
}
