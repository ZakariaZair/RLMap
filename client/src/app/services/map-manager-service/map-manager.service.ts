import { ElementRef, Injectable } from '@angular/core';
import { fabric } from 'fabric';
import { START_POSITIONS } from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class MapManagerService {
  mapWidth: number;
  mapHeight: number;
  objects: Map<string, fabric.Image>;
  mapBackground!: fabric.Image;
  fabricCanvas!: fabric.Canvas;
  private imageUrls = [
    '../../../assets/ball1.png',
    '../../../assets/blue1.png',
    '../../../assets/blue1.png',
    '../../../assets/blue1.png',
    '../../../assets/orange1.png',
    '../../../assets/orange1.png',
    '../../../assets/orange1.png',
  ];

  constructor() {
    this.objects = new Map<string, fabric.Image>();
    this.mapWidth = 5102 * 2;
    this.mapHeight = 4079 * 2;
  }

  createMap(mapPath: string) {
    fabric.loadSVGFromURL(mapPath, (objects, options) => {
      const obj = fabric.util.groupSVGElements(objects, options);
      obj.scaleToHeight(this.fabricCanvas.height as number);
      obj.set({
        opacity: 0.08,
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false,
        scaleX: 3.1,
      });
      const img = obj as fabric.Image;
      this.mapBackground = img;

      this.fabricCanvas.add(img).centerObject(img).renderAll();
    });
  }

  createObjects() {
    const imagePromises = this.imageUrls.map((url) => this.loadImage(url));

    Promise.all(imagePromises).then((images) => {
      images.forEach((img, index) => {
        img.set({
          originX: 'center',
          originY: 'center',
          hasRotatingPoint: true,
          hasBorders: false,
          scaleX: img.getSrc().includes('ball') ? 0.15 : 0.1,
          scaleY: img.getSrc().includes('ball') ? 0.15 : 0.1,
        });

        img.on('mouseover', () => {
          img.set(
            'shadow',
            new fabric.Shadow({
              color: img.getSrc().includes('orange')
                ? 'orange'
                : img.getSrc().includes('ball')
                ? 'grey'
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

        if (img.getSrc().includes('ball')) {
          this.objects.set('ball', img);
          this.fabricCanvas.add(img).centerObject(img).renderAll();
        } else if (img.getSrc().includes('blue')) {
          this.objects.set('blue' + index, img);
          this.fabricCanvas.add(img).renderAll();
        } else if (img.getSrc().includes('orange')) {
          this.objects.set('orange' + index, img);
          this.fabricCanvas.add(img).renderAll();
        }
      });
    });
  }

  toggleDrawingMode(drawingMode: boolean) {
    this.fabricCanvas.isDrawingMode = !drawingMode;
    this.ensureObjChanges();
  }

  toggleGrid(gridMode: boolean) {
    this.mapBackground.set('visible', gridMode);
    this.ensureObjChanges();
  }

  addFrame(frames: number[]) {
    frames.push(frames.length);
  }

  changeBrushColor(color: string) {
    this.fabricCanvas.freeDrawingBrush.color = color;
    this.fabricCanvas.renderAll();
  }

  changeBrushSize(width: number) {
    this.fabricCanvas.freeDrawingBrush.width = width;
    this.fabricCanvas.renderAll();
  }

  centerBall() {
    this.objects.get('ball')?.set({
      left: (this.fabricCanvas.width as number) / 2,
      top: (this.fabricCanvas.height as number) / 2,
    });
    this.fabricCanvas.renderAll();
  }

  ensureObjChanges() {
    this.objects.forEach((obj) => {
      obj.setCoords();
    });
    this.fabricCanvas.renderAll();
  }

  option1() {
    this.centerBall();
    this.objects.get('blue1')?.set('visible', true);
    this.objects.get('blue2')?.set('visible', false);
    this.objects.get('blue3')?.set('visible', false);
    this.objects.get('orange4')?.set('visible', true);
    this.objects.get('orange5')?.set('visible', false);
    this.objects.get('orange6')?.set('visible', false);
    this.changeStartPositions();
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
    this.changeStartPositions();
    this.ensureObjChanges();
  }

  option3() {
    this.centerBall();
    this.objects.forEach((obj) => {
      obj.set('visible', true);
    });
    this.changeStartPositions();
    this.ensureObjChanges();
  }

  changeStartPositions() {
    if (!this.fabricCanvas.width) return;
    if (!this.fabricCanvas.height) return;
    const fCW = this.fabricCanvas.width;
    const fCH = this.fabricCanvas.height;
    const k: keyof typeof START_POSITIONS = Math.floor(
      Math.random() * 10
    ) + 1 as keyof typeof START_POSITIONS ; // Random composition combination
    const randomOrder = this.generateRandomOrder(); // Random order combination
    const oppTeamOrder: number[] = [];
    this.objects.forEach((obj) => {
      if (obj.getSrc().includes('blue')) {
        let i: keyof (typeof START_POSITIONS)[typeof k] =
          randomOrder[0] as keyof (typeof START_POSITIONS)[typeof k];
          obj.set('left', (START_POSITIONS[k][i].x * fCW) / this.mapWidth);
          obj.set('top', (START_POSITIONS[k][i].y * fCH) / this.mapHeight);
          obj.set('angle', START_POSITIONS[k][i].a );
          randomOrder.shift();
          oppTeamOrder.push(i);
      }
    });
    this.objects.forEach((obj) => {
      if (obj.getSrc().includes('orange')) {
        let i: keyof (typeof START_POSITIONS)[typeof k] =
          oppTeamOrder[0] as keyof (typeof START_POSITIONS)[typeof k];
          obj.set('left', ((this.mapWidth - START_POSITIONS[k][i].x) * fCW) / this.mapWidth);
          obj.set('top', ((this.mapHeight - START_POSITIONS[k][i].y) * fCH) / this.mapHeight);
          obj.set('angle', START_POSITIONS[k][i].a + 180 );
          oppTeamOrder.shift();
      }
    });

    this.ensureObjChanges();
  }

  private generateRandomOrder(): number[] {
    const array = [1, 2, 3];
    const shuffledArray = array.sort(() => 0.5 - Math.random());
    return shuffledArray;
  }

  private loadImage(url: string): Promise<fabric.Image> {
    return new Promise((resolve) => {
      fabric.Image.fromURL(url, (img) => {
        resolve(img);
      });
    });
  }
}
