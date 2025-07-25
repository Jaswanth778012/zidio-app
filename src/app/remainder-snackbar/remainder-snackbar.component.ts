import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-remainder-snackbar',
  templateUrl: './remainder-snackbar.component.html',
  styleUrl: './remainder-snackbar.component.css'
})
export class RemainderSnackbarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}
}
