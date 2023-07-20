import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Player } from 'src/app/interfaces/interfaces';
import { ReplayFetcherService } from 'src/app/services/replay-fetcher-service/replay-fetcher.service';

@Component({
  selector: 'app-replay-page',
  templateUrl: './replay.component.html',
  styleUrls: ['./replay.component.scss'],
})
export class ReplayPageComponent implements OnInit {
  @ViewChild('mapCanvas', { static: true })
  mapCanvas!: ElementRef<HTMLCanvasElement>;
  replayValue: number;
  player1: Player;

  private ctx!: CanvasRenderingContext2D;
  private replayFrames: any;

  constructor(private readonly replayFetcherService: ReplayFetcherService) {
    this.player1 = { position: { x: 0, y: 0 } };
    this.replayValue = 0;
  }

  ngOnInit(): void {
    this.ctx = this.mapCanvas.nativeElement.getContext(
      '2d'
    ) as CanvasRenderingContext2D;
  }

  constructMap() {
    this.ctx.beginPath();
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

  changeReplayValue(event: Event): void {
    this.replayValue = (event.target as HTMLInputElement)
      .value as unknown as number;
  }

  getReplayLength(): number {
    return 115;
    // return this.replayFrames.length ? this.replayFrames.length : 0;
  }

  searchOnePlayer(): void {}
}
