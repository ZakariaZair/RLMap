import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Coord, Player } from 'src/app/interfaces/interfaces';
import { MapManagerService } from 'src/app/services/map-manager-service/map-manager.service';
import { ReplayFetcherService } from 'src/app/services/replay-fetcher-service/replay-fetcher.service';
import { WebSocketCommService } from 'src/app/services/web-socket-service/web-socket-comm.service';

@Component({
  selector: 'app-replay-page',
  templateUrl: './replay.component.html',
  styleUrls: ['./replay.component.scss'],
})
export class ReplayPageComponent implements AfterViewInit {
  replayData: any;
  playerRelations: Map<string, Player>;
  private wsSubscription: Subscription;
  drawingMode: boolean = false;
  brushSize: number = 2;
  brushColor: string = 'red';
  isNameTag: boolean = false;

  constructor(
    private readonly replayFetcherService: ReplayFetcherService,
    public mapManagerService: MapManagerService,
    private readonly WS: WebSocketCommService
  ) {
    this.wsSubscription = new Subscription();
    this.playerRelations = new Map<string, Player>();
  }

  ngAfterViewInit(): void {
    this.setReplay();
    this.wsSubscription = this.WS.connection.subscribe(
      (event: MessageEvent) => {
        const parsedData = JSON.parse(event.data);
        this.replayData = parsedData.data;
        if (parsedData.type === 'update') {
          this.update();
        } else if (parsedData.type === 'gameStart') {
          this.setReplay();
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.wsSubscription.unsubscribe();
  }

  setReplay() {
    setTimeout(() => {
      this.mapManagerService.hideEverything();
      let blueIndex: number = 1;
      let orangeIndex: number = 4;
      for (const index in this.replayData) {
        const team = this.replayData[index].team;
        let key = 'ball';
        if (team !== undefined && team == 0) {
          key = 'blue' + blueIndex;
          blueIndex++;
        } else if (team !== undefined && team == 1) {
          key = 'orange' + orangeIndex;
          orangeIndex++;
        }
        this.mapManagerService.objects.get(key)?.set({
          visible: true,
        });
        this.mapManagerService.ensureObjChanges();
      }
    }, 1000);
  }

  update() {
    let blueIndex: number = 1;
    let orangeIndex: number = 4;
    for (const index in this.replayData) {
      const x = this.replayData[index].x;
      const y = this.replayData[index].y;
      const angle = this.replayData[index].angle;
      const team = this.replayData[index].team;
      const coord: Coord = { X: x, Y: y, Z: 0 };
      if (team !== undefined && team == 0) {
        this.mapManagerService.changePlayer('blue' + blueIndex, coord, angle);
        blueIndex++;
      } else if (team !== undefined && team == 1) {
        this.mapManagerService.changePlayer(
          'orange' + orangeIndex,
          coord,
          angle
        );
        orangeIndex++;
      } else {
        this.mapManagerService.changePlayer('ball', coord, 0);
      }
    }
  }

  // async ngOnInit(): Promise<void> {
  //   this.setInitial();
  // }

  // async setInitial() {
  //   const replayData = await this.replayFetcherService.readJsonFromAssets();
  //   this.replayFetcherService.replayData = replayData;
  //   this.replayLength = replayData.Frames.length;
  //   console.log(replayData);
  //   this.replayFetcherService.replayData.Frames[0].ActorUpdates.forEach(
  //     (actor) => {
  //       if (
  //         actor.InitialPosition &&
  //         actor.TypeName == 'Archetypes.Car.Car_Default'
  //       ) {

  //       }
  //     }
  //   );
  //   this.setDelta();
  // }

  // changeReplayTime(event: any): void {
  //   this.replayValue = event.target.value;
  //   this.setDelta();
  //   console.log(
  //     this.replayFetcherService.replayData.Frames[this.replayValue]
  //       .ActorUpdates[0]
  //   );
  //   const pos =
  //     this.replayFetcherService.replayData.Frames[this.replayValue]
  //       .ActorUpdates[0]['TAGame.RBActor_TA:ReplicatedRBState'].Position;
  //   this.mapManagerService.changePlayer('blue1', pos);
  // }

  // play() {
  //   let actor =
  //     this.replayFetcherService.replayData.Frames[this.replayValue]
  //       .ActorUpdates;
  //   setTimeout(() => {
  //     if (
  //       this.replayFetcherService.replayData.Frames[this.replayValue]
  //         .ActorUpdates.length > 0 &&
  //       this.replayFetcherService.replayData.Frames[this.replayValue]
  //         .ActorUpdates[0]['TAGame.RBActor_TA:ReplicatedRBState']
  //     ) {
  //       const pos =
  //         this.replayFetcherService.replayData.Frames[this.replayValue]
  //           .ActorUpdates[0]['TAGame.RBActor_TA:ReplicatedRBState'].Position;
  //       this.mapManagerService.changePlayer('blue1', pos);
  //     }
  //     this.replayValue++;
  //     this.setDelta();
  //     if (!this.replayPaused) {
  //       this.play();
  //     }
  //   }, this.replayDelta * 1000);
  // }

  // pause() {}

  // replay() {}

  // getReplayLength(): number {
  //   return this.replayLength;
  // }

  // private setDelta() {
  //   this.replayDelta =
  //     this.replayFetcherService.replayData.Frames[this.replayValue].Delta;
  // }
}
