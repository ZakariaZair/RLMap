import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MapManagerService } from 'src/app/services/map-manager-service/map-manager.service';

@Component({
  selector: 'app-gif-dialog',
  templateUrl: './gif-dialog.component.html',
  styleUrls: ['./gif-dialog.component.scss'],
})
export class GifDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  download() {
    this.data.click();
  }
}
