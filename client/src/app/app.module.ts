import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './pages/main/main.component';
import { ReplayPageComponent } from './pages/replay/replay.component';
import { MapPageComponent } from './pages/map/map.component';
import { BoardMapComponent } from './components/board/board.component';
import { ReplayFetcherService } from './services/replay-fetcher-service/replay-fetcher.service';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GifDialogComponent } from './components/gif-dialog/gif-dialog.component';
import { BakkesInfoDialogComponent } from './components/bakkes-info-dialog/bakkes-info-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    ReplayPageComponent,
    MapPageComponent,
    BoardMapComponent,
    GifDialogComponent,
    BakkesInfoDialogComponent,
  ],
  imports: [
    BrowserModule,
    MatDialogModule,
    AppRoutingModule,
    HttpClientModule,
    MatSliderModule,
    FormsModule,
    BrowserAnimationsModule,
  ],
  providers: [ReplayFetcherService],
  bootstrap: [AppComponent],
})
export class AppModule {}
