import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ReplayFetcherService } from 'src/app/services/replay-fetcher-service/replay-fetcher.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('myVideo') myVideo!: ElementRef;
  videoPlayed: boolean = false;

  constructor(
    private readonly replayFetcherService: ReplayFetcherService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    this.myVideo.nativeElement.play();
  }

  createNewMap(): void {
    this.router.navigate(['/map-editor']);
  }

  playVideo() {
    if (!this.videoPlayed) {
      this.myVideo.nativeElement.play();
      this.videoPlayed = true;  
    }
  }

  async runReplay(): Promise<void> {
    // await this.replayFetcherService.runScript();
    // this.router.navigate(['/replay']);
  }

  donate(): void {
    const width = 900;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    window.open(
      'https://donate.stripe.com/7sIaHhcgE9bhh20144',
      'Popup',
      `width=${width},height=${height},left=${left},top=${top}`
    );
  }

  ngOnDestroy(): void {}
}
