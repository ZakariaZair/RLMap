import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { BakkesInfoDialogComponent } from "src/app/components/bakkes-info-dialog/bakkes-info-dialog.component";
import { WebSocketCommService } from "src/app/services/web-socket-service/web-socket-comm.service";

@Component({
  selector: "app-main-page",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
})
export class MainPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild("myVideo") myVideo!: ElementRef;
  @ViewChild("ee") myEE!: ElementRef;
  @ViewChild("buttonRef", { static: true }) buttonRef!: ElementRef;
  videoPlayed: boolean = false;
  isEe: boolean = false;
  isConnected: number = 0;

  constructor(
    private router: Router,
    private readonly WS: WebSocketCommService,
    public dialog: MatDialog,
  ) {}

  async ngAfterViewInit(): Promise<void> {
    this.checkConnection();
    // this.myVideo.nativeElement.play();
  }

  openInfo() {
    const rect = this.buttonRef.nativeElement.getBoundingClientRect();
    this.dialog.open(BakkesInfoDialogComponent, {
      data: {},
      position: {
        top: `${rect.top - 200}px`,
        left: `${rect.right + 10}px`,
      },
    });
  }

  checkConnection() {
    this.isConnected = 0; // Connecting
    this.WS.connect("ws://localhost:49152");
    this.WS.ws.addEventListener("open", () => {
      this.isConnected = 1; // Connection is open
    });
    this.WS.ws.addEventListener("close", () => {
      this.isConnected = 2; // Connection is closed
    });
    this.WS.ws.addEventListener("error", () => {
      this.isConnected = 2;
    });
  }

  createNewMap(): void {
    this.router.navigate(["/map-editor"]);
  }

  playVideo() {
    // if (!this.videoPlayed) {
    //   this.myVideo.nativeElement.play();
    //   this.videoPlayed = true;
    // }
  }

  runReplay(): void {
    // if (!this.isEe) {
    //   this.isEe = true;
    //   this.myEE.nativeElement.play();
    // }
    // await this.replayFetcherService.runScript();
    this.router.navigate(["/replay"]);
  }

  onVideoEnded() {
    // alert('https://www.youtube.com/shorts/u12od4njDZk');
    // alert('Bravo! You found the first easter egg!');
    // this.isEe = false;
  }

  donate(): void {
    const width = 900;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    window.open(
      "https://donate.stripe.com/7sIaHhcgE9bhh20144",
      "Popup",
      `width=${width},height=${height},left=${left},top=${top}`,
    );
  }

  ngOnDestroy(): void {}
}
