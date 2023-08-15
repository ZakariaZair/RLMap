import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Player } from 'src/app/interfaces/interfaces';
import { MapManagerService } from 'src/app/services/map-manager-service/map-manager.service';
import { ReplayFetcherService } from 'src/app/services/replay-fetcher-service/replay-fetcher.service';

@Component({
  selector: 'app-replay-page',
  templateUrl: './replay.component.html',
  styleUrls: ['./replay.component.scss'],
})
export class ReplayPageComponent implements OnInit {
  replayValue: number;
  replayDelta: number;
  replayPaused: boolean;
  replayLength: number;
  constructor(
    private readonly replayFetcherService: ReplayFetcherService,
    private readonly mapManagerService: MapManagerService
  ) {
    this.replayValue = 0;
    this.replayDelta = 0;
    this.replayLength = 0;
    this.replayPaused = false;
  }

  async ngOnInit(): Promise<void> {
    this.setInitial();
  }

  async setInitial() {
    const replayData = await this.replayFetcherService.readJsonFromAssets();
    this.replayFetcherService.replayData = replayData;
    this.replayLength = replayData.Frames.length;
    console.log(replayData);
    this.replayFetcherService.replayData.Frames[0].ActorUpdates.forEach(
      (actor) => {
        if (
          actor.InitialPosition &&
          actor.TypeName == 'Archetypes.Car.Car_Default'
        ) {
          
        }
      }
    );
    this.setDelta();
  }

  changeReplayTime(event: any): void {
    this.replayValue = event.target.value;
    this.setDelta();
    console.log(
      this.replayFetcherService.replayData.Frames[this.replayValue]
        .ActorUpdates[0]
    );
    const pos =
      this.replayFetcherService.replayData.Frames[this.replayValue]
        .ActorUpdates[0]['TAGame.RBActor_TA:ReplicatedRBState'].Position;
    this.mapManagerService.changePlayer('blue1', pos);
  }

  play() {
    let actor =
      this.replayFetcherService.replayData.Frames[this.replayValue]
        .ActorUpdates;
    setTimeout(() => {
      if (
        this.replayFetcherService.replayData.Frames[this.replayValue]
          .ActorUpdates.length > 0 &&
        this.replayFetcherService.replayData.Frames[this.replayValue]
          .ActorUpdates[0]['TAGame.RBActor_TA:ReplicatedRBState']
      ) {
        const pos =
          this.replayFetcherService.replayData.Frames[this.replayValue]
            .ActorUpdates[0]['TAGame.RBActor_TA:ReplicatedRBState'].Position;
        this.mapManagerService.changePlayer('blue1', pos);
      }
      this.replayValue++;
      this.setDelta();
      if (!this.replayPaused) {
        this.play();
      }
    }, this.replayDelta * 1000);
  }

  pause() {}

  replay() {}

  getReplayLength(): number {
    return this.replayLength;
  }

  private setDelta() {
    this.replayDelta =
      this.replayFetcherService.replayData.Frames[this.replayValue].Delta;
  }
}
