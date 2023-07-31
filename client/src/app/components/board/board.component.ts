import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
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

  ngAfterViewInit() {
    this.mapManagerService.setUpCanvas(this.fabricCanvas, this.mapCanvas);
    this.mapManagerService.createMap(this.mapPath, this.fabricCanvas);
  }

}
