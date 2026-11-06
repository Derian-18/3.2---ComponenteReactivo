import { Component, signal } from '@angular/core';
import { EventMonitorComponent } from './event-monitor.component';

@Component({
  imports: [EventMonitorComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('3.2_reactivo');
}
