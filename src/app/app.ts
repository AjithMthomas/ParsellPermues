import { Component, inject, afterNextRender } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ScrollService } from "./core/scroll.service";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { MenuOverlayComponent } from "./components/menu-overlay/menu-overlay.component";
import { CartDrawerComponent } from "./components/cart-drawer/cart-drawer.component";
import { SearchOverlayComponent } from "./components/search-overlay/search-overlay.component";
import { FinderOverlayComponent } from "./components/finder-overlay/finder-overlay.component";
import { CursorComponent } from "./components/cursor/cursor.component";
import { FooterComponent } from "./components/footer/footer.component";

@Component({
  selector: "app-root",
  imports: [
    RouterOutlet,
    NavbarComponent,
    MenuOverlayComponent,
    CartDrawerComponent,
    SearchOverlayComponent,
    FinderOverlayComponent,
    CursorComponent,
    FooterComponent,
  ],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App {
  private readonly scroll = inject(ScrollService);

  constructor() {
    afterNextRender(() => {
      // refresh trigger positions once fonts/images settle
      this.scroll.refresh();
      window.addEventListener("load", () => this.scroll.refresh());
      if (typeof document !== "undefined") {
        document.fonts?.ready.then(() => this.scroll.refresh()).catch(() => {});
      }
    });
  }
}
