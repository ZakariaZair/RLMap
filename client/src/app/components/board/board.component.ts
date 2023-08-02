import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { fabric } from 'fabric';
import { MapManagerService } from 'src/app/services/map-manager-service/map-manager.service';

@Component({
  selector: 'app-board-map',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardMapComponent implements AfterViewInit {
  @ViewChild('map', { static: true }) mapCanvas!: ElementRef<HTMLCanvasElement>;
  private fabricCanvas!: fabric.Canvas;
  private objects: Map<string, fabric.Image>;
  private mapPath: string = '../../../assets/q6NlCWk01.svg';
  
  constructor(private readonly mapManagerService: MapManagerService) {
    this.objects = new Map<string, fabric.Image>();
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
    this.setUpCanvas();
    this.mapManagerService.createMap(this.mapPath, this.fabricCanvas);
    this.mapManagerService.createObjects(this.fabricCanvas, this.objects);
  }

  private setUpCanvas(
  ) {
    const canvasEl: HTMLCanvasElement = this.mapCanvas.nativeElement;
    const parentDiv = canvasEl.parentElement
      ? canvasEl.parentElement
      : canvasEl;
    canvasEl.width = parentDiv.offsetWidth;
    canvasEl.height = parentDiv.offsetHeight;

    this.fabricCanvas = new fabric.Canvas(canvasEl, {
      renderOnAddRemove: false,
    });
    this.fabricCanvas.freeDrawingBrush.color = 'red';
    this.fabricCanvas.freeDrawingBrush.width = 2;

    // fabricCanvas.on('path:created', () => {
    //   this.saveState();
    // });

    // this.fabricCanvas.on('object:modified', () => {
    //   this.saveState();
    // });
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

}
