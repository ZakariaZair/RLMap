import { ElementRef, Injectable } from '@angular/core';
import { fabric } from 'fabric';

@Injectable({
  providedIn: 'root',
})
export class MapManagerService {
  mapWidth: number = 0;
  mapheight: number = 0;
  objects: Map<string, fabric.Image>;
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
      this.objects.set('mapBackground', img);

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
    this.objects.get('mapBackground')
      ? this.objects.get('mapBackground')?.set('visible', gridMode)
      : null;
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
    this.ensureObjChanges();
  }

  option3() {
    this.centerBall();
    this.objects.get('blue1')?.set('visible', true);
    this.objects.get('blue2')?.set('visible', true);
    this.objects.get('blue3')?.set('visible', true);
    this.objects.get('orange4')?.set('visible', true);
    this.objects.get('orange5')?.set('visible', true);
    this.objects.get('orange6')?.set('visible', true);
    this.ensureObjChanges();
  }

  private loadImage(url: string): Promise<fabric.Image> {
    return new Promise((resolve) => {
      fabric.Image.fromURL(url, (img) => {
        resolve(img);
      });
    });
  }
}
