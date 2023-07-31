import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { fabric } from 'fabric';

@Component({
  selector: 'app-map-page',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapPageComponent implements AfterViewInit {
  @ViewChild('map', { static: true }) mapCanvas!: ElementRef<HTMLCanvasElement>;
  drawingMode: boolean = false;
  gridMode: boolean = false;
  playersMode: boolean = false;
  optionChosen: number;
  ballMode: boolean = false;
  brushSize: number = 2;
  brushColor: string = 'red';
  frames: number[];
  private fabricCanvas!: fabric.Canvas;

  constructor() {
    this.optionChosen = 3;
    this.frames = [0];
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    const eventKey = event.key.toLowerCase();
    if ((event.ctrlKey || event.metaKey) && eventKey === 'z') {
      // this.undo();
      event.preventDefault();
      return;
    }
    this.setupInputs(event.key);
  }

  ngAfterViewInit() {
  }

  // option1() {
  //   this.centerBall();
  //   this.objects.get('blue1')?.set('visible', true);
  //   this.objects.get('blue2')?.set('visible', false);
  //   this.objects.get('blue3')?.set('visible', false);
  //   this.objects.get('orange4')?.set('visible', true);
  //   this.objects.get('orange5')?.set('visible', false);
  //   this.objects.get('orange6')?.set('visible', false);
  //   this.optionChosen = 1;
  //   this.ensureObjChanges();
  //   this.saveState();
  // }

  // option2() {
  //   this.centerBall();
  //   this.objects.get('blue1')?.set('visible', true);
  //   this.objects.get('blue2')?.set('visible', true);
  //   this.objects.get('blue3')?.set('visible', false);
  //   this.objects.get('orange4')?.set('visible', true);
  //   this.objects.get('orange5')?.set('visible', true);
  //   this.objects.get('orange6')?.set('visible', false);
  //   this.optionChosen = 2;
  //   this.ensureObjChanges();
  //   this.saveState();
  // }

  // option3() {
  //   this.centerBall();
  //   this.objects.forEach((obj) => {
  //     obj.set('visible', true);
  //   });
  //   this.optionChosen = 3;
  //   this.ensureObjChanges();
  //   this.saveState();
  // }

  // toggleBall() {
  //   this.objects.forEach((obj) => {
  //     if (obj.getSrc().includes('ball')) {
  //       obj.set('visible', !obj.get('visible'));
  //     }
  //   });
  //   this.ballMode = !this.ballMode;
  //   this.fabricCanvas.renderAll();
  //   this.saveState();
  // }

  // togglePlayers() {
  //   this.objects.forEach((obj) => {
  //     if (obj.getSrc().includes('blue') || obj.getSrc().includes('orange')) {
  //       obj.set('visible', !obj.get('visible'));
  //     }
  //   });
  //   if (this.optionChosen === 1) {
  //     this.objects.get('blue2')?.set('visible', false);
  //     this.objects.get('blue3')?.set('visible', false);
  //     this.objects.get('orange5')?.set('visible', false);
  //     this.objects.get('orange6')?.set('visible', false);
  //   } else if (this.optionChosen === 2) {
  //     this.objects.get('blue3')?.set('visible', false);
  //     this.objects.get('orange6')?.set('visible', false);
  //   }
  //   this.playersMode = !this.playersMode;
  //   this.fabricCanvas.renderAll();
  //   this.saveState();
  // }

  // undo() {
  //   if (this.currentStateIndex > 0) {
  //     this.currentStateIndex--;
  //     this.fabricCanvas.loadFromJSON(
  //       this.states[this.currentStateIndex],
  //       () => {
  //         this.fabricCanvas.getObjects().forEach((obj, index) => {
  //           const img = obj as fabric.Image;
  //           let key: string | null = null;
  //           if (obj instanceof fabric.Image) {
  //             if (img.getSrc().includes('ball')) {
  //               key = 'ball';
  //             } else if (img.getSrc().includes('blue')) {
  //               key = 'blue' + (index - 1);
  //             } else if (img.getSrc().includes('orange')) {
  //               key = 'orange' + (index - 1);
  //             }

  //             console.log(key);

  //             if (key) {
  //               img.set({
  //                 originX: 'center',
  //                 originY: 'center',
  //                 hasRotatingPoint: true,
  //                 hasBorders: false,
  //                 scaleX: img.getSrc().includes('ball') ? 0.15 : 0.1,
  //                 scaleY: img.getSrc().includes('ball') ? 0.15 : 0.1,
  //               });

  //               img.on('mouseover', () => {
  //                 img.set(
  //                   'shadow',
  //                   new fabric.Shadow({
  //                     color: img.getSrc().includes('orange')
  //                       ? 'orange'
  //                       : img.getSrc().includes('ball')
  //                       ? 'white'
  //                       : 'blue',
  //                     blur: 30,
  //                     offsetX: 0,
  //                     offsetY: 0,
  //                   })
  //                 );
  //               });

  //               img.on('mouseout', () => {
  //                 img.set('shadow', undefined);
  //               });

  //               img.setControlsVisibility({
  //                 bl: false,
  //                 br: false,
  //                 mb: false,
  //                 ml: false,
  //                 mr: false,
  //                 mt: false,
  //                 tl: false,
  //                 tr: false,
  //                 mtr: false,
  //               });

  //               this.objects.set(key, img);
  //             }
  //           } else if (obj.type === 'group') {
  //             obj.set({
  //               opacity: 0.2,
  //               left: -112,
  //               top: 0,
  //               fill: 'transparent',
  //               stroke: 'black',
  //               strokeWidth: 5,
  //               selectable: false,
  //               evented: false,
  //             });
  //             this.mapBackground = obj as fabric.Image;
  //           }
  //         });
  //         this.fabricCanvas.renderAll();
  //       }
  //     );
  //   }
  // }

  // private saveState() {
  //   if (this.currentStateIndex + 1 < this.states.length) {
  //     this.states = this.states.slice(0, this.currentStateIndex + 1);
  //   }
  //   this.states.push(this.fabricCanvas.toJSON());
  //   this.currentStateIndex++;
  // }

  private setupInputs(eventKey: string) {
    const selectedObject = this.fabricCanvas.getActiveObject() as fabric.Image;
    if (selectedObject) {
      let position = selectedObject.getCenterPoint();
      let currentAngle = selectedObject.angle || 0;
      let angleChange = 0;
      let positionChange = new fabric.Point(0, 0);

      switch (eventKey) {
        case 'ArrowLeft':
          angleChange = -22.5;
          break;
        case 'ArrowRight':
          angleChange = 22.5;
          break;
        case 'ArrowUp':
          currentAngle = 0;
          break;
        case 'ArrowDown':
          currentAngle = 180;
          break;
        case 'a':
          positionChange.x = -10; // Move left by 10 pixels
          break;
        case 'd':
          positionChange.x = 10; // Move right by 10 pixels
          break;
        case 'w':
          positionChange.y = -10; // Move up by 10 pixels
          break;
        case 's':
          positionChange.y = 10; // Move down by 10 pixels
          break;
      }

      selectedObject.set({
        angle: currentAngle + angleChange,
        left: position.x + positionChange.x,
        top: position.y + positionChange.y,
      });

      this.fabricCanvas.renderAll();
    }
  }
}
