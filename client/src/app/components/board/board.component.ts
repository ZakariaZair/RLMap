import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { fabric } from 'fabric';
fabric.Object.prototype.objectCaching = false;
(fabric as any).perfLimitSizeTotal = 25000000;
(fabric as any).maxCacheSideLimit = 5000;

import { MapManagerService } from 'src/app/services/map-manager-service/map-manager.service';

@Component({
  selector: 'app-board-map',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardMapComponent implements AfterViewInit {
  @ViewChild('map', { static: true }) mapCanvas!: ElementRef<HTMLCanvasElement>;
  private mapPath: string = 'assets/LEloe101.svg';

  constructor(private readonly mapManagerService: MapManagerService) {}

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
    this.setUpCanvas();
    this.mapManagerService.createMap(this.mapPath);
    this.mapManagerService.createObjects();
  }

  private setUpCanvas() {
    const canvasEl: HTMLCanvasElement = this.mapCanvas.nativeElement;
    const parentDiv = canvasEl.parentElement
      ? canvasEl.parentElement
      : canvasEl;
    canvasEl.width = parentDiv.offsetWidth;
    canvasEl.height = parentDiv.offsetHeight;

    this.mapManagerService.fabricCanvas = new fabric.Canvas(canvasEl, {
      renderOnAddRemove: false,
      selection: false,
    });
    this.mapManagerService.fabricCanvas.freeDrawingBrush.color = 'red';
    this.mapManagerService.fabricCanvas.freeDrawingBrush.width = 2;
    this.mapManagerService.setOn();
    fabric.Object.prototype.selectable = false;
    this.mapManagerService.fabricCanvas.setBackgroundColor(
      'white',
      this.mapManagerService.fabricCanvas.renderAll.bind(
        this.mapManagerService.fabricCanvas
      )
    );

    //this.secureBoudaries(canvasEl);
  }

  private setupInputs(eventKey: string) {
    const selectedObject =
      this.mapManagerService.fabricCanvas.getActiveObject() as fabric.Image;
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
          positionChange.x = -10;
          break;
        case 'd':
          positionChange.x = 10;
          break;
        case 'w':
          positionChange.y = -10;
          break;
        case 's':
          positionChange.y = 10;
          break;
      }

      selectedObject.set({
        angle: currentAngle + angleChange,
        left: position.x + positionChange.x,
        top: position.y + positionChange.y,
      });
      this.mapManagerService.playerSheet.angle = currentAngle + angleChange;

      this.mapManagerService.ensureObjChanges();
    }
  }

  private secureBoudaries(canvasEl: HTMLCanvasElement) {
    this.mapManagerService.fabricCanvas.on('object:modified', function (e) {
      if (e.target === undefined) return;
      var obj = e.target;
      var canvasTL = new fabric.Point(0, 0);
      var canvasBR = new fabric.Point(canvasEl.width, canvasEl.height);
      if (!obj.isContainedWithinRect(canvasTL, canvasBR)) {
        var objBounds = obj.getBoundingRect();
        obj.setCoords();
        var objTL = obj.getPointByOrigin('left', 'top');
        var left = objTL.x;
        var top = objTL.y;

        if (objBounds.left < canvasTL.x) left = 0;
        if (objBounds.top < canvasTL.y) top = 0;
        if (objBounds.top + objBounds.height > canvasBR.y)
          top = canvasBR.y - objBounds.height;
        if (objBounds.left + objBounds.width > canvasBR.x)
          left = canvasBR.x - objBounds.width;

        obj.setPositionByOrigin(new fabric.Point(left, top), 'left', 'top');
        obj.setCoords();
      }
    });
  }
}
