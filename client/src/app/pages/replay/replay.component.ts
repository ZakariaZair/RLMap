import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Player } from 'src/app/interfaces/interfaces';
import { ReplayFetcherService } from 'src/app/services/replay-fetcher-service/replay-fetcher.service';

@Component({
  selector: 'app-replay-page',
  templateUrl: './replay.component.html',
  styleUrls: ['./replay.component.scss'],
})
export class ReplayPageComponent implements OnInit {

  constructor(private readonly replayFetcherService: ReplayFetcherService) {
  }

  async ngOnInit(): Promise<void> {
    const replayData = await this.replayFetcherService.readJsonFromAssets();
    console.log(replayData);
    this.replayFetcherService.replayData = replayData;
  }

  changeReplayValue(event: Event): void {
    this.replayFetcherService.loadReplay();
  }

  getReplayLength(): number {
    return 300;
    // return this.replayFrames.length ? this.replayFrames.length : 0;
  }
}
