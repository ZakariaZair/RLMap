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
  animSpeed: number = 1;
  frameSelected: number = 0;
  private mediaRecorder?: MediaRecorder;
  private chunks: any[] = [];
  private videoName: string = 'Frame 1';
  labels: Map<string, fabric.Text>;
  isTags: boolean = false;
  FOVs: Map<string, fabric.Polygon>;
  isFOVs: boolean = false;
  distanceFOV: number = 1500;

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
    this.labels = new Map<string, fabric.Text>();
    this.FOVs = new Map<string, fabric.Polygon>();
  }

  setOn() {
    // this.fabricCanvas.on('path:created', () => {
    //   this.saveState();
    // });
    // this.fabricCanvas.on('object:modified', () => {
    //   this.saveState();
    // });

    this.fabricCanvas.on('object:moving', (e) => {
      const object: any = e.target;
      this.FOVs.get(object.data.label)?.set({
        left: object?.getCenterPoint().x,
        top: object?.getCenterPoint().y,
        angle: object?.angle,
      });
    });

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
      obj.scaleToHeight((this.fabricCanvas.height as number) - 10);
      obj.set({
        opacity: 0.08,
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false,
        scaleX: 0.42,
        data: {
          path: true,
        },
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
          scaleX: img.getSrc().includes('ball') ? 0.12 : 0.1,
          scaleY: img.getSrc().includes('ball') ? 0.12 : 0.1,
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

        
        // Calculate the points for the field of view triangle based on the player's center
        const centerPoint = img.getCenterPoint();

        const FOV = new fabric.Polygon([
          centerPoint,
          { x: img.getCenterPoint().x + this.distanceFOV, 
            y: img.getCenterPoint().y - Math.tan( (90 - 110/2) * Math.PI / 180 ) * this.distanceFOV },
          { x: img.getCenterPoint().x - this.distanceFOV, 
            y: img.getCenterPoint().y - Math.tan( (90 - 110/2) * Math.PI / 180 ) * this.distanceFOV },
        ],
        {
          fill: 'rgba(0,0,0,0.2)',
          opacity: 0.3,
          selectable: false,
          evented: false,
          visible: false,
          originX: 'center',
          originY: 'bottom'
        });

        const text = new fabric.Text('Label', {
          fontSize: 16,
          textAlign: 'center',
          fontFamily: 'Kanit',
        });
        let textLabel;

        if (img.getSrc().includes('ball')) {
          textLabel = 'ball';
          this.objects.set('ball', img);
        } else if (img.getSrc().includes('blue')) {
          textLabel = 'blue';
          this.objects.set('blue' + index, img);
        } else if (img.getSrc().includes('orange')) {
          textLabel = 'orange';
          this.objects.set('orange' + index, img);
        }
        this.fabricCanvas.add(img).centerObject(img).renderAll();

        if (img.getSrc().includes('blue')) {
          this.FOVs.set('blue' + index, FOV);
        } else if (img.getSrc().includes('orange')) {
          this.FOVs.set('orange' + index, FOV);
        }
        this.fabricCanvas.add(FOV).renderAll();

        FOV.set({
          left: img.left,
          top: img.top
        });

        text.set({
          text: textLabel,
          left:
            (img as any).left + ((img as any).width * (img as any).scaleX) / 2,
          top:
            (img as any).top -
            ((img as any).height * (img as any).scaleY) / 2 +
            50,
          visible: false,
        });
        if (img.getSrc().includes('ball')) {
          this.labels.set('ball', text);
        } else if (img.getSrc().includes('blue')) {
          this.labels.set('blue' + index, text);
        } else if (img.getSrc().includes('orange')) {
          this.labels.set('orange' + index, text);
        }
        this.fabricCanvas.add(text).renderAll();

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
    this.labels.forEach((obj) => {
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

    if (this.isTags) {
      this.labels.get('blue1')?.set('visible', true);
      this.labels.get('blue2')?.set('visible', false);
      this.labels.get('blue3')?.set('visible', false);
      this.labels.get('orange4')?.set('visible', true);
      this.labels.get('orange5')?.set('visible', false);
      this.labels.get('orange6')?.set('visible', false);
    }
    this.changeStartPositions();
    this.updateTagPosition();
    this.updateFOVsPosition();
    this.ensureObjChanges();
  }

  option2() {
    this.updateTagPosition();
    this.updateFOVsPosition();
    this.centerBall();
    this.objects.get('blue1')?.set('visible', true);
    this.objects.get('blue2')?.set('visible', true);
    this.objects.get('blue3')?.set('visible', false);
    this.objects.get('orange4')?.set('visible', true);
    this.objects.get('orange5')?.set('visible', true);
    this.objects.get('orange6')?.set('visible', false);

    if (this.isTags) {
      this.labels.get('blue1')?.set('visible', true);
      this.labels.get('blue2')?.set('visible', true);
      this.labels.get('blue3')?.set('visible', false);
      this.labels.get('orange4')?.set('visible', true);
      this.labels.get('orange5')?.set('visible', true);
      this.labels.get('orange6')?.set('visible', false);
    }
    this.changeStartPositions();
    this.updateTagPosition();
    this.updateFOVsPosition();
    this.ensureObjChanges();
  }

  option3() {
    this.centerBall();
    this.objects.forEach((obj) => {
      obj.set('visible', true);
    });
    if (this.isTags) {
      this.labels.forEach((obj) => {
        obj.set('visible', true);
      });
    }
    this.changeStartPositions();
    this.updateTagPosition();
    this.updateFOVsPosition();
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

  hideEverything() {
    this.objects.forEach((obj) => {
      obj.set('visible', false);
    });
    this.ensureObjChanges();
  }

  changePlayer(key: string, pos: Coord, angle: number) {
    this.objects.get(key)?.set({
      left: this.filterPos(pos)[0],
      top: this.filterPos(pos)[1],
      angle: ((angle / 200) * 360) / 325,
    });
    this.ensureObjChanges();
  }

  private filterPos(pos: Coord): number[] {
    const fCW = this.fabricCanvas.width;
    const fCH = this.fabricCanvas.height;
    return [
      ((this.mapWidth / 2 + pos.Y) * (fCW ? fCW : 0)) / this.mapWidth,
      ((this.mapHeight / 2 + -pos.X) * (fCH ? fCH : 0)) / this.mapHeight,
    ];
  }

  changeVideoName(name: string) {
    this.videoName = name;
  }

  clear() {
    this.fabricCanvas.forEachObject((obj) => {
      if (
        (obj instanceof fabric.Path || obj instanceof fabric.PencilBrush) &&
        !obj.data?.path
      ) {
        this.fabricCanvas.remove(obj);
      }
    });
    this.fabricCanvas.renderAll(); // Refresh the canvas
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
    this.stopRecording();
    await this.animateFrame(this.cloneObjects);
  }

  startRecording() {
    this.chunks = [];
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

  changeTag(label: string, tag: string) {
    const labelObj = this.labels.get(label);
    if (labelObj) {
      labelObj.set('text', tag);
      this.fabricCanvas.renderAll();
    }
  }

  toggleFOVs(index: number) {
    let playerKeys : string[] = ["blue1", "orange4", "blue2", "orange5", "blue3", "orange6"];
    playerKeys = playerKeys.slice(0, index);
    this.isFOVs = !this.isFOVs;
    this.FOVs.forEach((fov, key) => {
      if( playerKeys.includes(key) ) {
        fov.set('visible', this.isFOVs);
      } else if (!this.isFOVs) {
        fov.set('visible', false);
      }
    });
    this.updateFOVsPosition();
    this.ensureObjChanges();
  }

  updateFOVsPosition() {
    if (!this.isFOVs) {
      return;
    }
    this.objects.forEach((obj) => {
      const fov = this.FOVs.get(obj.data.label);
      if (fov && !obj.data?.path && fov.height) {
        this.FOVs.get(obj.data.label)?.set({
          left: obj?.getCenterPoint().x,
          top: obj?.getCenterPoint().y,
          angle: obj?.angle,
        });
        this.fabricCanvas.renderAll();
      }
    });
  }

  toggleTags(index: number) {
    let playerKeys : string[] = ["blue1", "orange4", "blue2", "orange5", "blue3", "orange6"];
    playerKeys = playerKeys.slice(0, index);
    this.isTags = !this.isTags;
    this.labels.forEach((label, key) => {
      if( playerKeys.includes(key) ) {
        label.set('visible', this.isTags);
      }
    });
    this.updateTagPosition();
    this.ensureObjChanges();
  }

  updateTagPosition() {
    if (!this.isTags) {
      return;
    }
    this.objects.forEach((obj) => {
      const label = this.labels.get(obj.data.label);
      if (label && !label.data?.path) {
        label.set({
          left:
            (obj as any).left +
            ((obj as any).width * (obj as any).scaleX) / 2 +
            5,
          top:
            (obj as any).top - ((obj as any).height * (obj as any).scaleY) / 2,
        });
        this.fabricCanvas.renderAll();
      }
    });
  }

  downloadRecording() {
    let blob = new Blob(this.chunks, { type: 'video/webm' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = this.videoName.replace(/\s+/g, '_') + '.webm';
    return a;
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
              easing: fabric.util.ease.easeInOutSine,
              onComplete: () => {
                animationsCompleted++;
                if (animationsCompleted === this.objects.size) {
                  resolve();
                  this.frameSelected++;
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
