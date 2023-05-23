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
  private objects: fabric.Image[];

  constructor(private renderer: Renderer2) {
    this.mapWidth = 0;
    this.mapHeight = 0;
    this.objects = [];
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    const selectedObject = this.fabricCanvas.getActiveObject() as fabric.Image;
    if (selectedObject) {
      let position = selectedObject.getCenterPoint();
      let currentAngle = selectedObject.angle || 0;
      let angleChange = 0;
      let positionChange = new fabric.Point(0, 0);

      switch (event.key) {
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
      '../../../assets/nobg_2.png',
      '../../../assets/nobg_2.png',
      '../../../assets/nobg_2.png',
      '../../../assets/nobg_1.png',
      '../../../assets/nobg_2.png',
      '../../../assets/nobg_2.png',
      '../../../assets/nobg_2.png',
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
          scaleX: 0.15,
          scaleY: 0.15,
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
        this.objects.push(img);
      });

      this.fabricCanvas.renderAll();
    });
  }

  loadImage(url: string): Promise<fabric.Image> {
    return new Promise((resolve) => {
      fabric.Image.fromURL(url, (img) => {
        resolve(img);
      });
    });
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
