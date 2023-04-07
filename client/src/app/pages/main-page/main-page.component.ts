import { AfterViewChecked, AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, OnDestroy {
  @ViewChild('gameCanvas', { static: true }) gameCanvas!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private tileSizeX = 128;
  private tileSizeY = 112;
  private mapWidth = 20;
  private mapHeight = 20;
  private characterX = 0;
  private characterY = 0;
  private animationFrameId: number = 0;
  private characterImage!: HTMLImageElement;

  constructor() {}

  @HostListener('window:keydown', ['$event'])
    keyboardEvent(event: KeyboardEvent) {
      this.handleKeyDown(event);
    }


    ngOnInit(): void {
      this.ctx = this.gameCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
      this.loadCharacterImage();
      this.gameLoop();
      document.addEventListener('keydown', this.handleKeyDown);
      this.updateCanvasSize();
    }
    
    loadCharacterImage(): void {
      this.characterImage = new Image();
      this.characterImage.src = './assets/soccer_ball.png';
      this.characterImage.onload = () => {
        this.gameLoop();
      };
    }


  gameLoop = () => {
    if (!this.ctx || !this.gameCanvas) return;
    this.ctx.clearRect(0, 0, this.gameCanvas.nativeElement.width, this.gameCanvas.nativeElement.height);


    for (let y = 0; y < this.mapHeight; y++) {
      for (let x = 0; x < this.mapWidth; x++) {
        const screenX = (x - y) * this.tileSizeX / 2 + this.gameCanvas.nativeElement.width / 2;
        const screenY = (x + y) * this.tileSizeY / 4;

        this.ctx.beginPath();
        this.ctx.moveTo(screenX, screenY);
        this.ctx.lineTo(screenX + this.tileSizeX / 2, screenY + this.tileSizeY / 4);
        this.ctx.lineTo(screenX, screenY + this.tileSizeY / 2);
        this.ctx.lineTo(screenX - this.tileSizeX / 2, screenY + this.tileSizeY / 4);
        this.ctx.closePath();
        this.ctx.fillStyle = '#FFE53D';
        if(x === 0 || y === 0 || x === this.mapWidth - 1 || y === this.mapHeight - 1) {
          this.ctx.fillStyle = '#ffffff';
        }
        this.ctx.fill();
        this.ctx.stroke();
      }
    }

    const characterScreenX = (this.characterX - this.characterY) * this.tileSizeY / 2 + this.gameCanvas.nativeElement.width / 2;
    const characterScreenY = (this.characterX + this.characterY) * this.tileSizeX / 4 - this.tileSizeY / 2;
    this.ctx.drawImage(this.characterImage, characterScreenX, characterScreenY, this.tileSizeX / 2, this.tileSizeY / 2);

    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  };

  handleKeyDown = (event: KeyboardEvent) => {
    if (event.code === 'ArrowUp' && this.characterY > 0) {
      this.characterY--;
    } else if (event.code === 'ArrowDown' && this.characterY < this.mapHeight - 1) {
      this.characterY++;
    } else if (event.code === 'ArrowLeft' && this.characterX > 0) {
      this.characterX--;
    } else if (event.code === 'ArrowRight' && this.characterX < this.mapWidth - 1) {
      this.characterX++;
    }
  };

  updateCanvasSize() {
    if (!this.gameCanvas) return;
  
    const canvas = this.gameCanvas.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationFrameId);
    document.removeEventListener('keydown', this.handleKeyDown);
  }
}
