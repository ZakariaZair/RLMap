import {
  AfterViewInit,
  Component,
  Renderer2,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { MapManagerService } from 'src/app/services/map-manager-service/map-manager.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GifDialogComponent } from 'src/app/components/gif-dialog/gif-dialog.component';
@Component({
  selector: 'app-map-page',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapPageComponent implements AfterViewInit {
  @ViewChild('angleLine', { static: true }) angleLine!: ElementRef;
  @Output() angleChanged = new EventEmitter<number>();
  dragging = false;

  drawingMode: boolean = false;
  gridMode: boolean = false;
  playersMode: boolean = false;
  optionChosen: number = 4;
  ballMode: boolean = false;
  brushSize: number = 2;
  brushColor: string = 'red';
  frames: string[] = ['Frame 1'];
  frameSelected: number = 0;
  isEditing: boolean[] = [];
  isAnimated: boolean = false;
  lastGif: boolean = false;

  private mapPath: string = '../../../assets/q6NlCWk01.svg';

  constructor(
    public mapManagerService: MapManagerService,
    private renderer: Renderer2,
    private el: ElementRef,
    public dialog: MatDialog
  ) {
    this.frames.forEach(() => this.isEditing.push(false));
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.option3();
      this.mapManagerService.lastFrame(this.frameSelected);
      this.initializeLine();
      this.angleChanged.subscribe((newAngle: number) => {
        this.onAngleChanged(newAngle);
      });
    }, 500);
  }

  onMouseDown(event: MouseEvent): void {
    this.dragging = true;
  }

  onMouseMove(event: MouseEvent): void {
    if (this.dragging) {
      const circleCenterX = 50;
      const circleCenterY = 50;
      const radius = 30;

      const rect = this.el.nativeElement
        .querySelector('svg')
        .getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const angle = Math.atan2(y - circleCenterY, x - circleCenterX);

      const x2 = circleCenterX + radius * Math.cos(angle);
      const y2 = circleCenterY + radius * Math.sin(angle);

      this.renderer.setAttribute(
        this.angleLine.nativeElement,
        'x2',
        x2.toString()
      );
      this.renderer.setAttribute(
        this.angleLine.nativeElement,
        'y2',
        y2.toString()
      );

      this.angleChanged.emit((angle * 180) / Math.PI);
    }
  }

  onMouseUp(): void {
    this.dragging = false;
  }

  onAngleChanged(newAngle: number): void {
    this.mapManagerService.playerSheet.angle = newAngle;
    const selectedObject =
      this.mapManagerService.fabricCanvas.getActiveObject() as fabric.Image;
    selectedObject.set({
      angle: newAngle + 90,
    });
    this.mapManagerService.ensureObjChanges();
  }

  initializeLine(): void {
    const angle = this.mapManagerService.playerSheet.angle
      ? this.mapManagerService.playerSheet.angle
      : 0;
    const circleCenterX = 50;
    const circleCenterY = 50;
    const radius = 30;
    const x2 = circleCenterX + radius * Math.cos((angle * Math.PI) / 180);
    const y2 = circleCenterY + radius * Math.sin((angle * Math.PI) / 180);

    this.renderer.setAttribute(
      this.angleLine.nativeElement,
      'x2',
      x2.toString()
    );
    this.renderer.setAttribute(
      this.angleLine.nativeElement,
      'y2',
      y2.toString()
    );
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

  addFrame() {
    this.frames.push('Frame ' + (this.frames.length + 1));
    this.mapManagerService.lastFrame(this.frames.length - 1);
  }

  deleteFrame(index: number) {
    this.frames.splice(index, 1);
    this.mapManagerService.deleteFrame(index);
    this.frameSelected = 0;
    this.mapManagerService.nextFrame(0);
  }

  frame(index: number) {
    this.mapManagerService.lastFrame(this.frameSelected);
    this.frameSelected = index;
    this.mapManagerService.nextFrame(this.frameSelected);
  }

  nameFrame(event: any, index: number) {
    this.frames[index] = event.target.value;
    if (index === 0) {
      this.mapManagerService.changeVideoName(event.target.value);
    }
  }

  toggleEdit(index: number) {
    this.isEditing[index] = !this.isEditing[index];
  }

  clear() {
    this.mapManagerService.clear(this.mapPath);
  }

  async animate() {
    this.mapManagerService.nextFrame(0);
    this.frameSelected = -1;
    this.isAnimated = true;
    this.mapManagerService.startRecording();
    await this.mapManagerService.animate();
    this.isAnimated = false;
    this.frameSelected = 0;
    this.mapManagerService.stopRecording();
    this.lastGif = true;
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
