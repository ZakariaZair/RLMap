import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReplayLoaderService } from 'src/app/services/replay-loader-service/replay-loader.service';

@Component({
  selector: 'app-replay-page',
  templateUrl: './replay-page.component.html',
  styleUrls: ['./replay-page.component.scss'],
})
export class ReplayPageComponent implements OnInit {
  @ViewChild('mapCanvas', { static: true })
  mapCanvas!: ElementRef<HTMLCanvasElement>;
  test: number = 0;

  constructor(private readonly replayLoaderService: ReplayLoaderService) {}

  ngOnInit(): void {
    
  }

  constructMap() {
    this.test =
      this.replayLoaderService.getReplayData().network_frames.frames[0].new_actors[1].initial_trajectory.location.x;
    console.log(
      this.replayLoaderService.getReplayData().network_frames.frames[0]
        .new_actors[1].initial_trajectory.location.x
    );
  }
}
