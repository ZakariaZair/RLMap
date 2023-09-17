import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketCommService {
  ws!: WebSocket;
  connection: Subject<MessageEvent>;
  private subject!: Subject<MessageEvent>;

  constructor() {
    this.connection = new Subject<MessageEvent>();
  }

  public connect(url: string): Subject<MessageEvent> {
    this.ws = new WebSocket(url);

    this.subject = new Subject<MessageEvent>();

    this.ws.addEventListener('message', (event) => {
      this.subject.next(event);
    });
    this.connection = this.subject;

    return this.subject;
  }

  send(data: string): void {
    this.ws.send(data);
  }
}
