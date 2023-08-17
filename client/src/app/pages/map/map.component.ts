import { AfterViewInit, Component } from '@angular/core';
import { fabric } from 'fabric';
import { MapManagerService } from 'src/app/services/map-manager-service/map-manager.service';

@Component({
  selector: 'app-map-page',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapPageComponent implements AfterViewInit {
  drawingMode: boolean = false;
  gridMode: boolean = false;
  playersMode: boolean = false;
  optionChosen: number = 4;
  ballMode: boolean = false;
  brushSize: number = 2;
  brushColor: string = 'red';
  frames: number[];

  constructor(public mapManagerService: MapManagerService) {
    this.frames = [0];
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.option3();
    }, 500);
  }

  option1() {
    if (!this.playersMode) {
      this.mapManagerService.option1();
    }
    this.optionChosen = 1;
  }

  option2() {
    if (!this.playersMode) {
      this.mapManagerService.option2();
    }
    this.optionChosen = 2;
  }

  option3() {
    if (!this.playersMode) {
      this.mapManagerService.option3();
    }
    this.optionChosen = 3;
  }

  toggleBall() {
    this.mapManagerService.objects.get('ball')
      ? this.mapManagerService.objects
          .get('ball')
          ?.set('visible', this.ballMode)
      : null;
    this.ballMode = !this.ballMode;
    this.mapManagerService.ensureObjChanges();
  }

  togglePlayers() {
    this.mapManagerService.objects
      .get('blue1')
      ?.set('visible', this.playersMode);
    this.mapManagerService.objects
      .get('blue2')
      ?.set('visible', this.playersMode);
    this.mapManagerService.objects
      .get('blue3')
      ?.set('visible', this.playersMode);
    this.mapManagerService.objects
      .get('orange4')
      ?.set('visible', this.playersMode);
    this.mapManagerService.objects
      .get('orange5')
      ?.set('visible', this.playersMode);
    this.mapManagerService.objects
      .get('orange6')
      ?.set('visible', this.playersMode);
    if (this.optionChosen === 1) {
      this.mapManagerService.objects.get('blue2')?.set('visible', false);
      this.mapManagerService.objects.get('blue3')?.set('visible', false);
      this.mapManagerService.objects.get('orange5')?.set('visible', false);
      this.mapManagerService.objects.get('orange6')?.set('visible', false);
    } else if (this.optionChosen === 2) {
      this.mapManagerService.objects.get('blue3')?.set('visible', false);
      this.mapManagerService.objects.get('orange6')?.set('visible', false);
    }
    this.playersMode = !this.playersMode;
    this.mapManagerService.ensureObjChanges();
  }

  // private saveState() {
  //   if (this.currentStateIndex + 1 < this.states.length) {
  //     this.states = this.states.slice(0, this.currentStateIndex + 1);
  //   }
  //   this.states.push(this.fabricCanvas.toJSON());
  //   this.currentStateIndex++;
  // }

  donate(): void {
    const width = 900;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    window.open(
      'https://donate.stripe.com/7sIaHhcgE9bhh20144',
      'Popup',
      `width=${width},height=${height},left=${left},top=${top}`
    );
  }
}
