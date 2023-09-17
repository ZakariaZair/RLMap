import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-bakkes-info-dialog',
  templateUrl: './bakkes-info-dialog.component.html',
  styleUrls: ['./bakkes-info-dialog.component.scss'],
})
export class BakkesInfoDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    
  }
}
