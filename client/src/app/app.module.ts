import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { ReplayPageComponent } from './pages/replay-page/replay-page.component';
import { MapPageComponent } from './pages/map-page/map-page.component';

@NgModule({
  declarations: [AppComponent, MainPageComponent, ReplayPageComponent, MapPageComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
