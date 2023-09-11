import { ElementRef, Injectable } from '@angular/core';
import { fabric } from 'fabric';

import {
  Coord,
  PlayerUi,
  START_POSITIONS,
} from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class MapManagerService {
  mapWidth: number;
  mapHeight: number;
  objects: Map<string, fabric.Image>;
  cloneObjects: Map<string, fabric.Image>;
  mapBackground!: fabric.Image;
  fabricCanvas!: fabric.Canvas;
  frameObjects: Map<string, fabric.Image>[];
  playerSheet: PlayerUi = { isSelected: false };
  animSpeed: number;
  private mediaRecorder?: MediaRecorder;
  private chunks: any[] = [];
  private videoName: string = 'Frame 1';

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
    this.cloneObjects = new Map<string, fabric.Image>();
    this.frameObjects = [new Map<string, fabric.Image>()];
    this.mapWidth = 5102 * 2;
    this.mapHeight = 4079 * 2;
    this.animSpeed = 1;
  }

  setOn() {
    // this.fabricCanvas.on('path:created', () => {
    //   this.saveState();
    // });
    // this.fabricCanvas.on('object:modified', () => {
    //   this.saveState();
    // });

    this.fabricCanvas.on('selection:created', (options) => {
      if (options.selected && options.selected.length > 0) {
        const selectedObject = options.selected[0] as fabric.Image;
        const objectName = selectedObject.data.label;

        if (this.objects.has(objectName)) {
          this.changePlayerSheet(objectName);
        }
      }
    });

    this.fabricCanvas.on('selection:updated', (options) => {
      if (options.selected && options.selected.length > 0) {
        const selectedObject = options.selected[0] as fabric.Image;
        const objectName = selectedObject.data.label;

        if (this.objects.has(objectName)) {
          this.changePlayerSheet(objectName);
        }
      }
    });

    this.fabricCanvas.on('selection:cleared', () => {
      this.playerSheet = {
        isSelected: false,
      };
    });
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
          selectable: true,
          data: {
            label: img.getSrc().includes('ball')
              ? 'ball'
              : img.getSrc().includes('blue')
              ? 'blue' + index
              : 'orange' + index,
            uiName: img.getSrc().includes('ball')
              ? 'ball'
              : img.getSrc().includes('blue')
              ? 'blue'
              : 'orange',
            uiColor: img.getSrc().includes('ball')
              ? 'grey'
              : img.getSrc().includes('blue')
              ? 'blue'
              : 'orange',
          },
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
              blur: img.getSrc().includes('orange') ? 150 : 50,
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
          mtr: img.getSrc().includes('ball') ? false : true,
        });

        (img as any).set({
          cornerStyle: 'circle',
          cornerColor: img.getSrc().includes('orange') ? 'orange' : 'blue',
          cornerSize: 25,
        });

        if (img.getSrc().includes('ball')) {
          this.objects.set('ball', img);
          this.fabricCanvas.add(img).centerObject(img).renderAll();
        } else if (img.getSrc().includes('blue')) {
          this.objects.set('blue' + index, img);
          this.fabricCanvas.add(img).centerObject(img).renderAll();
        } else if (img.getSrc().includes('orange')) {
          this.objects.set('orange' + index, img);
          this.fabricCanvas.add(img).centerObject(img).renderAll();
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
    //Juste pour faire en sorte d'enlever le selection avec le rond d'angle
    this.changePlayerSheet('ball');
    this.playerSheet = {
      isSelected: false,
    };
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
    const k: keyof typeof START_POSITIONS = (Math.floor(Math.random() * 10) +
      1) as keyof typeof START_POSITIONS;
    const randomOrder = this.generateRandomOrder();
    const oppTeamOrder: number[] = [];
    this.objects.forEach((obj) => {
      if (obj.getSrc().includes('blue')) {
        let i: keyof (typeof START_POSITIONS)[typeof k] =
          randomOrder[0] as keyof (typeof START_POSITIONS)[typeof k];
        obj.set('left', (START_POSITIONS[k][i].x * fCW) / this.mapWidth);
        obj.set('top', (START_POSITIONS[k][i].y * fCH) / this.mapHeight);
        obj.set('angle', START_POSITIONS[k][i].a);
        randomOrder.shift();
        oppTeamOrder.push(i);
      }
    });
    this.objects.forEach((obj) => {
      if (obj.getSrc().includes('orange')) {
        let i: keyof (typeof START_POSITIONS)[typeof k] =
          oppTeamOrder[0] as keyof (typeof START_POSITIONS)[typeof k];
        obj.set(
          'left',
          ((this.mapWidth - START_POSITIONS[k][i].x) * fCW) / this.mapWidth
        );
        obj.set(
          'top',
          ((this.mapHeight - START_POSITIONS[k][i].y) * fCH) / this.mapHeight
        );
        obj.set('angle', START_POSITIONS[k][i].a + 180);
        oppTeamOrder.shift();
      }
    });

    this.ensureObjChanges();
  }

  changePlayer(playerName: string, pos: Coord) {
    const fCW = this.fabricCanvas.width;
    const fCH = this.fabricCanvas.height;
    this.objects.get(playerName)?.set({
      left: ((this.mapWidth / 2 + pos.Y) * (fCW ? fCW : 0)) / this.mapWidth,
      top: ((this.mapHeight / 2 + pos.X) * (fCH ? fCH : 0)) / this.mapHeight,
    });
    this.ensureObjChanges();
  }

  changeVideoName(name: string) {
    this.videoName = name;
  }

  clear(mapPath: string) {
    this.cloneObj();
    this.fabricCanvas.clear();
    this.createMap(mapPath);
    this.cloneObjects.forEach((value, key) => {
      this.objects.get(key)?.set(value);
      this.fabricCanvas.add(this.objects.get(key) as fabric.Image);
    });
    this.ensureObjChanges();
  }

  lastFrame(index: number) {
    const clonedObjects = new Map<string, fabric.Image>();
    this.objects.forEach((value, key) => {
      clonedObjects.set(key, fabric.util.object.clone(value));
    });
    this.frameObjects[index] = clonedObjects;
  }

  nextFrame(index: number) {
    const recordedObjects = this.frameObjects[index];
    if (recordedObjects) {
      this.objects.forEach((obj) => {
        this.fabricCanvas.remove(obj);
      });
      this.objects.clear();
      recordedObjects.forEach((value, key) => {
        this.objects.set(key, value);
        this.fabricCanvas.add(value);
      });
    }
    this.ensureObjChanges();
  }

  deleteFrame(index: number) {
    this.frameObjects.splice(index, 1);
  }

  async animate() {
    this.cloneObjects = new Map<string, fabric.Image>();
    this.frameObjects[0].forEach((value, key) => {
      this.cloneObjects.set(key, fabric.util.object.clone(value));
    });
    for (const frame of this.frameObjects) {
      await this.animateFrame(frame);
    }
    await this.animateFrame(this.cloneObjects);
  }

  startRecording() {
    let canvas = this.fabricCanvas.getElement();
    let stream = canvas.captureStream(30);
    this.mediaRecorder = new MediaRecorder(stream);

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        this.chunks.push(event.data);
      }
    };

    this.mediaRecorder.start();
  }

  stopRecording() {
    this.mediaRecorder?.stop();
  }

  downloadRecording() {
    let blob = new Blob(this.chunks, { type: 'video/webm' });
    this.chunks = [];
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = '[RLBV] ' + this.videoName.replace(/\s+/g, '_') + '.webm';
    a.click();
  }

  private async animateFrame(frame: Map<string, fabric.Image>) {
    await new Promise<void>((resolve) => {
      let animationsCompleted = 0;
      this.objects.forEach((obj, key) => {
        const frameObj = frame.get(key);
        if (frameObj) {
          obj.animate(
            {
              left: frameObj.left as number,
              top: frameObj.top as number,
              angle: frameObj.angle as number,
            },
            {
              duration: 1000 / this.animSpeed,
              onChange: this.fabricCanvas.renderAll.bind(this.fabricCanvas),
              // easing: fabric.util.ease.easeOutExpo,
              onComplete: () => {
                animationsCompleted++;
                if (animationsCompleted === this.objects.size) {
                  resolve();
                }
              },
            }
          );
        }
      });
    });
  }

  private changePlayerSheet(objectName: string) {
    this.playerSheet = {
      name: this.objects.get(objectName)?.data.uiName,
      color: this.objects.get(objectName)?.data.uiColor,
      angle: this.objects.get(objectName)?.angle,
      image: this.objects.get(objectName)?.getSrc(),
      isSelected: true,
    };
  }

  private cloneObj() {
    this.cloneObjects = new Map<string, fabric.Image>();
    this.objects.forEach((value, key) => {
      this.cloneObjects.set(key, fabric.util.object.clone(value));
    });
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
