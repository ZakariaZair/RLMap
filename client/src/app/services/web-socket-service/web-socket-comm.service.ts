import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketCommService {
  private ws!: WebSocket;
  private subject!: Subject<MessageEvent>;

  constructor() {}

  public connect(url: string): Subject<MessageEvent> {
    this.ws = new WebSocket(url);

    this.subject = new Subject<MessageEvent>();

    this.ws.addEventListener('message', (event) => {
      this.subject.next(event);
    });

    return this.subject;
  }

  send(data: string): void {
    this.ws.send(data);
  }
}
