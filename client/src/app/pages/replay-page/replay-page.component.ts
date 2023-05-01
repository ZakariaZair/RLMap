import { Component, OnInit } from '@angular/core';
import { ReplayLoaderService } from 'src/app/services/replay-loader-service/replay-loader.service';

@Component({
  selector: 'app-replay-page',
  templateUrl: './replay-page.component.html',
  styleUrls: ['./replay-page.component.scss'],
})
export class ReplayPageComponent implements OnInit {
  test: number = 0;

  constructor(private readonly replayLoaderService: ReplayLoaderService) {}

  ngOnInit(): void {
    this.test = this.replayLoaderService.getReplayData().network_frames.frames[0];
  }
}
