import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { fabric } from 'fabric';

@Component({
  selector: 'app-board-map',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardMapComponent implements AfterViewInit {
  @ViewChild('map', { static: true }) mapCanvas!: ElementRef<HTMLCanvasElement>;
  private fabricCanvas!: fabric.Canvas;
  constructor() {}

  ngAfterViewInit() {
    this.setUpCanvas();
    // this.createMap();
    // this.createObjects();
  }

  private setUpCanvas() {
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
    this.fabricCanvas.freeDrawingBrush.width = 5;
  }
}
