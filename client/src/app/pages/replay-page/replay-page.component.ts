import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Player } from 'src/app/interfaces/interfaces';
import { ReplayLoaderService } from 'src/app/services/replay-loader-service/replay-loader.service';

@Component({
  selector: 'app-replay-page',
  templateUrl: './replay-page.component.html',
  styleUrls: ['./replay-page.component.scss'],
})
export class ReplayPageComponent implements OnInit {
  @ViewChild('mapCanvas', { static: true })
  mapCanvas!: ElementRef<HTMLCanvasElement>;
  player1: Player;

  private ctx!: CanvasRenderingContext2D;

  constructor(private readonly replayLoaderService: ReplayLoaderService) {
    this.player1 = {
      position: {
        x: 0,
        y: 0,
      },
    };
  }

  ngOnInit(): void {
    this.ctx = this.mapCanvas.nativeElement.getContext(
      '2d'
    ) as CanvasRenderingContext2D;
  }

  constructMap() {
    this.player1.position.x =
      this.replayLoaderService.getReplayData().network_frames.frames[0].new_actors[1].initial_trajectory.location.x;
    this.player1.position.y =
      this.replayLoaderService.getReplayData().network_frames.frames[0].new_actors[1].initial_trajectory.location.y;
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(200, 100);
    this.ctx.fillStyle = '#FFE53D';
    this.ctx.arc(
      Math.abs(this.player1.position.x) / 10,
      Math.abs(this.player1.position.y) / 10,
      10,
      0,
      2 * Math.PI
    );
    this.ctx.closePath();
    this.ctx.stroke();
  }

  getReplayLength(): number {
    return this.replayLoaderService.getReplayData().network_frames.frames
      .length;
  }
}
