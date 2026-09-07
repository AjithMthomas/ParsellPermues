import { Component, inject } from "@angular/core";
import { AudioService } from "../../core/audio.service";

@Component({
  selector: "app-audio-toggle",
  standalone: true,
  template: `
    <button
      class="audio-toggle-btn"
      [class.muted]="audio.isMuted()"
      [class.playing]="audio.isPlaying() && !audio.isMuted()"
      (click)="audio.toggleMute()"
      [attr.aria-label]="audio.isMuted() ? 'Unmute luxury sound' : 'Mute luxury sound'"
      [title]="audio.isMuted() ? 'Unmute luxury sound' : 'Mute luxury sound'"
    >
      @if (!audio.isMuted()) {
        <div class="sound-wave">
          <span class="bar bar-1"></span>
          <span class="bar bar-2"></span>
          <span class="bar bar-3"></span>
        </div>
      } @else {
        <svg class="mute-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke-linejoin="round"/>
          <line x1="23" y1="9" x2="17" y2="15"/>
          <line x1="17" y1="9" x2="23" y2="15"/>
        </svg>
      }
      
      <span class="label">{{ audio.isMuted() ? 'SOUND OFF' : (audio.isPlaying() ? 'AMBIENT SOUND' : 'SOUND ON') }}</span>
    </button>
  `,
  styleUrl: "./audio-toggle.component.css",
})
export class AudioToggleComponent {
  readonly audio = inject(AudioService);
}
