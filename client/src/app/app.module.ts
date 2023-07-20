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

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    ReplayPageComponent,
    MapPageComponent,
    BoardMapComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [ReplayFetcherService],
  bootstrap: [AppComponent],
})
export class AppModule {}
