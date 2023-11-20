import { Component, HostListener } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private authService: AuthenticationService) {
    this.resetLogoutTimer();
  }

  @HostListener('window:mousemove')
  @HostListener('window:click')
  @HostListener('window:keypress')
  resetLogoutTimer() {
    this.authService.onUserActivity();
  }
}
