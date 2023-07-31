import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { MainPageComponent } from './pages/main/main.component';
import { ReplayPageComponent } from './pages/replay/replay.component';
import { MapPageComponent } from './pages/map/map.component';
import { BoardMapComponent } from './components/board/board.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: BoardMapComponent },
  { path: 'replay', component: ReplayPageComponent },
  { path: 'map-editor', component: MapPageComponent },
  { path: 'map', component: BoardMapComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
