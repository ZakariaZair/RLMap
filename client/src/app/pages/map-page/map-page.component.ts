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
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.scss'],
})
export class MapPageComponent implements AfterViewInit {
  @ViewChild('map', { static: true }) mapCanvas!: ElementRef<HTMLCanvasElement>;
  drawingMode: boolean = false;
  gridMode: boolean = false;
  playersMode: boolean = false;
  ballMode: boolean = false;
  frames: number[];
  private fabricCanvas!: fabric.Canvas;
  private mapWidth: number;
  private mapHeight: number;
  private objects: Map<string, fabric.Image>;
  private mapBackground: fabric.Image;
  private optionChosen: number;
  private configurationIterator: number;

  constructor(private renderer: Renderer2) {
    this.mapWidth = 0;
    this.mapHeight = 0;
    this.objects = new Map<string, fabric.Image>();
    this.mapBackground = {} as fabric.Image;
    this.optionChosen = 3;
    this.frames = [0];
    this.configurationIterator = 0;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    this.setupInputs(event.key);
  }

  ngAfterViewInit() {
    this.setUpCanvas();
    this.createMap();
    this.createObjects();
  }

  createMap() {
    fabric.loadSVGFromURL(
      '../../../assets/q6NlCWk01.svg',
      (objects, options) => {
        const obj = fabric.util.groupSVGElements(objects, options);
        obj.set({
          opacity: 0.2,
          left: -112,
          top: 0,
          fill: 'transparent',
          stroke: 'black',
          strokeWidth: 5,
          selectable: false,
          evented: false,
          scaleX:
            obj && obj.width
              ? ((this.fabricCanvas.width as number) / obj.width) * 1.21
              : 1,
          scaleY:
            obj && obj.height
              ? ((this.fabricCanvas.height as number) / obj.height) * 0.98
              : 1,
        });

        this.fabricCanvas.add(obj).renderAll();
        this.mapBackground = this.fabricCanvas.getObjects()[0] as fabric.Image;
      }
    );
  }

  createObjects() {
    const imageUrls = [
      '../../../assets/ball1.png',
      '../../../assets/blue1.png',
      '../../../assets/blue1.png',
      '../../../assets/blue1.png',
      '../../../assets/orange1.png',
      '../../../assets/orange1.png',
      '../../../assets/orange1.png',
    ];

    const imagePromises = imageUrls.map((url) => this.loadImage(url));

    Promise.all(imagePromises).then((images) => {
      images.forEach((img, index) => {
        img.set({
          left: ((this.fabricCanvas.width as number) * (index + 1)) / 8,
          top: (this.fabricCanvas.height as number) / 2,
          originX: 'center',
          originY: 'center',
          hasRotatingPoint: true,
          hasBorders: false,
          scaleX: img.getSrc().includes('ball') ? 0.15 : 0.1,
          scaleY: img.getSrc().includes('ball') ? 0.15 : 0.1,
          type: img.getSrc().includes('ball') ? 'ball' : 'player',
        });

        img.on('mouseover', () => {
          img.set(
            'shadow',
            new fabric.Shadow({
              color: img.getSrc().includes('orange')
                ? 'orange'
                : img.getSrc().includes('ball')
                ? 'white'
                : 'blue',
              blur: 30,
              offsetX: 0,
              offsetY: 0,
            })
          );
        });

        img.on('mouseout', () => {
          img.set('shadow', undefined);
        });

        img.setControlsVisibility({
          bl: false,
          br: false,
          mb: false,
          ml: false,
          mr: false,
          mt: false,
          tl: false,
          tr: false,
          mtr: false,
        });

        this.fabricCanvas.add(img);
        if (img.getSrc().includes('ball')) {
          this.objects.set('ball', img);
        } else if (img.getSrc().includes('blue')) {
          this.objects.set('blue' + index, img);
        } else if (img.getSrc().includes('orange')) {
          this.objects.set('orange' + index, img);
        }
      });

      this.fabricCanvas.renderAll();
    });
  }

  option1() {
    this.centerBall();
    this.objects.get('blue1')?.set('visible', true);
    this.objects.get('blue2')?.set('visible', false);
    this.objects.get('blue3')?.set('visible', false);
    this.objects.get('orange4')?.set('visible', true);
    this.objects.get('orange5')?.set('visible', false);
    this.objects.get('orange6')?.set('visible', false);
    this.optionChosen = 1;
    this.ensureObjChanges();
  }

  option2() {
    this.centerBall();
    this.objects.get('blue1')?.set('visible', true);
    this.objects.get('blue2')?.set('visible', true);
    this.objects.get('blue3')?.set('visible', false);
    this.objects.get('orange4')?.set('visible', true);
    this.objects.get('orange5')?.set('visible', true);
    this.objects.get('orange6')?.set('visible', false);
    this.optionChosen = 2;
    this.ensureObjChanges();
  }

  option3() {
    this.centerBall();
    this.objects.forEach((obj) => {
      obj.set('visible', true);
    });
    this.optionChosen = 3;
    this.ensureObjChanges();
  }

  toggleBall() {
    this.objects.forEach((obj) => {
      if (obj.get('type') === 'ball') {
        obj.set('visible', !obj.get('visible'));
      }
    });
    this.ballMode = !this.ballMode;
    this.fabricCanvas.renderAll();
  }

  togglePlayers() {
    this.objects.forEach((obj) => {
      if (obj.get('type') === 'player') {
        obj.set('visible', !obj.get('visible'));
      }
    });
    if (this.optionChosen === 1) {
      this.objects.get('blue2')?.set('visible', false);
      this.objects.get('blue3')?.set('visible', false);
      this.objects.get('orange5')?.set('visible', false);
      this.objects.get('orange6')?.set('visible', false);
    } else if (this.optionChosen === 2) {
      this.objects.get('blue3')?.set('visible', false);
      this.objects.get('orange6')?.set('visible', false);
    }
    this.playersMode = !this.playersMode;
    this.fabricCanvas.renderAll();
  }

  toggleDrawingMode() {
    this.drawingMode = !this.drawingMode;
    this.fabricCanvas.isDrawingMode = this.drawingMode;
  }

  toggleGrid() {
    this.gridMode = !this.gridMode;
    this.mapBackground.set('visible', !this.gridMode);
    this.fabricCanvas.renderAll();
  }

  addFrame() {
    this.frames.push(this.frames.length);
  }

  private centerBall() {
    this.objects.get('ball')?.set({
      left: (this.fabricCanvas.width as number) / 2,
      top: (this.fabricCanvas.height as number) / 2,
    });
    this.fabricCanvas.renderAll();
  }

  private ensureObjChanges(){
    this.objects.forEach((obj) => {
      obj.setCoords();
    });
    this.fabricCanvas.renderAll();
  }

  private loadImage(url: string): Promise<fabric.Image> {
    return new Promise((resolve) => {
      fabric.Image.fromURL(url, (img) => {
        resolve(img);
      });
    });
  }

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

  private setUpCanvas() {
    const canvasEl: HTMLCanvasElement = this.mapCanvas.nativeElement;
    const parentDiv = canvasEl.parentElement
      ? canvasEl.parentElement
      : canvasEl;
    canvasEl.width = parentDiv.offsetWidth;
    canvasEl.height = parentDiv.offsetHeight;
    this.mapWidth = canvasEl.width;
    this.mapHeight = canvasEl.height;

    this.fabricCanvas = new fabric.Canvas(canvasEl, {
      renderOnAddRemove: false,
    });
    this.fabricCanvas.freeDrawingBrush.color = "red";
    this.fabricCanvas.freeDrawingBrush.width = 5;
  }
}
