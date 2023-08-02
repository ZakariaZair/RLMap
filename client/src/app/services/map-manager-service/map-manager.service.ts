import { ElementRef, Injectable } from '@angular/core';
import { fabric } from 'fabric';

@Injectable({
  providedIn: 'root',
})
export class MapManagerService {
  mapWidth: number = 0;
  mapheight: number = 0;
  private imageUrls = [
    '../../../assets/ball1.png',
    '../../../assets/blue1.png',
    '../../../assets/blue1.png',
    '../../../assets/blue1.png',
    '../../../assets/orange1.png',
    '../../../assets/orange1.png',
    '../../../assets/orange1.png',
  ];

  constructor() {}

  createMap(mapPath: string, fabricCanvas: fabric.Canvas) {
    fabric.loadSVGFromURL(mapPath, (objects, options) => {
      const obj = fabric.util.groupSVGElements(objects, options);
      obj.scaleToHeight(fabricCanvas.height as number);
      obj.set({
        opacity: 0.04,
        originX: 'center',
        originY: 'center',
        stroke: 'black',
        strokeWidth: 5,
        selectable: false,
        evented: false,
        scaleX: 3,
      });
      const img = obj as fabric.Image;

      fabricCanvas.add(img).centerObject(img).renderAll();
    });
  }

  createObjects(
    fabricCanvas: fabric.Canvas,
    objects: Map<string, fabric.Image>
  ) {
    const imagePromises = this.imageUrls.map((url) => this.loadImage(url));

    Promise.all(imagePromises).then((images) => {
      images.forEach((img, index) => {
        img.set({
          left: ((fabricCanvas.width as number) * (index + 1)) / 8,
          top: (fabricCanvas.height as number) / 2,
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

        fabricCanvas.add(img);
        if (img.getSrc().includes('ball')) {
          objects.set('ball', img);
        } else if (img.getSrc().includes('blue')) {
          objects.set('blue' + index, img);
        } else if (img.getSrc().includes('orange')) {
          objects.set('orange' + index, img);
        }
      });

      fabricCanvas.renderAll();
    });
  }

  toggleDrawingMode(fabricCanvas: fabric.Canvas, drawingMode: boolean) {
    drawingMode = !drawingMode;
    fabricCanvas.isDrawingMode = drawingMode;
  }

  toggleGrid(
    fabricCanvas: fabric.Canvas,
    mapBackground: fabric.Image,
    gridMode: boolean
  ) {
    gridMode = !gridMode;
    mapBackground.set('visible', !gridMode);
    fabricCanvas.renderAll();
    // this.saveState();
  }

  addFrame(frames: number[]) {
    frames.push(frames.length);
    // this.saveState();
  }

  changeBrushColor(
    color: string,
    fabricCanvas: fabric.Canvas,
    brushColor: string
  ) {
    fabricCanvas.freeDrawingBrush.color = color;
    brushColor = color;
    fabricCanvas.renderAll();
  }

  changeBrushWidth(
    width: number,
    fabricCanvas: fabric.Canvas,
    brushSize: number
  ) {
    fabricCanvas.freeDrawingBrush.width = width;
    brushSize = width;
    fabricCanvas.renderAll();
    // this.saveState();
  }

  centerBall(fabricCanvas: fabric.Canvas, objects: Map<string, fabric.Image>) {
    objects.get('ball')?.set({
      left: (fabricCanvas.width as number) / 2,
      top: (fabricCanvas.height as number) / 2,
    });
    fabricCanvas.renderAll();
  }

  ensureObjChanges(
    fabricCanvas: fabric.Canvas,
    objects: Map<string, fabric.Image>
  ) {
    objects.forEach((obj) => {
      obj.setCoords();
    });
    fabricCanvas.renderAll();
  }

  private loadImage(url: string): Promise<fabric.Image> {
    return new Promise((resolve) => {
      fabric.Image.fromURL(url, (img) => {
        resolve(img);
      });
    });
  }
}
