import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

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
