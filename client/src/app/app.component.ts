import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketCommService } from './services/web-socket-service/web-socket-comm.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Rocket League Bird View';

  constructor(
    private router: Router
  ) {}

  ngOnInit() {
    this.router.navigate(['/home']);
  }
}
