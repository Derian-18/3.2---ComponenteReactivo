import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription, Subject, BehaviorSubject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';


interface LoggedEvent {
  id: number;
  value: number;
  timestamp: string;
}

@Component({
  selector: 'app-reactive-event-monitor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-monitor.component.html',
  styleUrls: ['./event-monitor.component.css']
})
export class EventMonitorComponent implements OnDestroy {
  isActive: boolean = false;
  private counterSubject = new BehaviorSubject<number>(0);
  currentValue$ = this.counterSubject.asObservable();
  eventLogs: LoggedEvent[] = [];

  private eventSubscription?: Subscription;
  private destroy$ = new Subject<void>();
  private logIdCounter = 0;

  startMonitoring(): void {
    if (this.isActive) return;

    this.isActive = true;

    this.eventSubscription = interval(1000)
      .pipe(
        takeUntil(this.destroy$),
        tap(() => {
          const newValue = this.counterSubject.value + 1;
          this.counterSubject.next(newValue);
          this.addLog(newValue);
        })
      )
      .subscribe();
  }

  stopMonitoring(): void {
    if (!this.isActive) return;

    this.isActive = false;
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
      this.eventSubscription = undefined;
    }
  }

  resetMonitoring(): void {
    this.stopMonitoring();
    this.counterSubject.next(0);
    this.eventLogs = [];
    this.logIdCounter = 0;
  }

  private addLog(val: number): void {
    const newLog: LoggedEvent = {
      id: ++this.logIdCounter,
      value: val,
      timestamp: new Date().toLocaleTimeString()
    };

    this.eventLogs = [newLog, ...this.eventLogs].slice(0, 10);
  }

  ngOnDestroy(): void {
    this.stopMonitoring();
    this.destroy$.next();
    this.destroy$.complete();
  }
}