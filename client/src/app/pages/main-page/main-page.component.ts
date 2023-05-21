import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ReplayLoaderService } from 'src/app/services/replay-loader-service/replay-loader.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit, OnDestroy {
  constructor(
    private readonly replayLoaderService: ReplayLoaderService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  createNewMap(): void {
    this.router.navigate(['/map-editor']);
  }

  async runReplay(): Promise<void> {
    await this.replayLoaderService.runScript();
    this.router.navigate(['/replay']);
  }

  ngOnDestroy(): void {}
}
