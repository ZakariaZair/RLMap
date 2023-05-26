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
  private fabricCanvas!: fabric.Canvas;
  private mapWidth: number;
  private mapHeight: number;
  private objects: Map<string, fabric.Image>;
  private optionChosen: number;

  constructor(private renderer: Renderer2) {
    this.mapWidth = 0;
    this.mapHeight = 0;
    this.objects = new Map<string, fabric.Image>();
    this.optionChosen = 3;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    this.setupInputs(event.key);
  }

  ngAfterViewInit() {
    this.setUpCanvas();
    this.createMap();
    this.createObjects();
    this.fabricCanvas.renderAll();
  }

  createMap() {
    const pathData = `
    M ${(this.fabricCanvas.width as number) / 6} 10
    L 10 ${(this.fabricCanvas.height as number) / 5}
    L 10 ${((this.fabricCanvas.height as number) * 2) / 5}
    L 0 ${((this.fabricCanvas.height as number) * 2) / 5}
    L 0 ${((this.fabricCanvas.height as number) * 3) / 5}
    L 10 ${((this.fabricCanvas.height as number) * 3) / 5}
    L 10 ${((this.fabricCanvas.height as number) * 4) / 5}
    L ${(this.fabricCanvas.width as number) / 6} ${
      (this.fabricCanvas.height as number) - 10
    }
    L ${((this.fabricCanvas.width as number) * 5) / 6} ${
      (this.fabricCanvas.height as number) - 10
    }
    L ${(this.fabricCanvas.width as number) - 10} ${
      ((this.fabricCanvas.height as number) * 4) / 5
    }
    L ${(this.fabricCanvas.width as number) - 10} ${
      ((this.fabricCanvas.height as number) * 3) / 5
    }
    L ${this.fabricCanvas.width as number} ${
      ((this.fabricCanvas.height as number) * 3) / 5
    }
    L ${this.fabricCanvas.width as number} ${
      ((this.fabricCanvas.height as number) * 2) / 5
    }
    L ${(this.fabricCanvas.width as number) - 10} ${
      ((this.fabricCanvas.height as number) * 2) / 5
    }
    L ${(this.fabricCanvas.width as number) - 10} ${
      (this.fabricCanvas.height as number) / 5
    }
    L ${((this.fabricCanvas.width as number) * 5) / 6} 10
    L ${(this.fabricCanvas.width as number) / 6} 10
    Z
  `;
    const path = new fabric.Path(pathData, {
      left: -2.75,
      top: 10,
      fill: 'transparent',
      stroke: 'black',
      strokeWidth: 5,
      selectable: false,
      evented: false,
    });

    this.fabricCanvas.add(path);
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
    this.fabricCanvas.renderAll();
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
    this.fabricCanvas.renderAll();
  }

  option3() {
    this.centerBall();
    this.objects.forEach((obj) => {
      obj.set('visible', true);
    });
    this.optionChosen = 3;
    this.fabricCanvas.renderAll();
  }

  toggleBall() {
    this.objects.forEach((obj) => {
      if (obj.get('type') === 'ball') {
        obj.set('visible', !obj.get('visible'));
      }
    });
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
    this.fabricCanvas.renderAll();
  }

  private centerBall() {
    this.objects.get('ball')?.set({
      left: (this.fabricCanvas.width as number) / 2,
      top: (this.fabricCanvas.height as number) / 2,
      originX: 'center',
      originY: 'center',
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
  }
}
