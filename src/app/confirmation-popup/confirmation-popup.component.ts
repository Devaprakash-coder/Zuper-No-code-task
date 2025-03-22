import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirmation-popup',
  imports: [MatDialogModule, MatButtonModule, MatButtonModule],
  templateUrl: './confirmation-popup.component.html',
  styleUrl: './confirmation-popup.component.css'
})
export class ConfirmationPopupComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  
    onCancel(): void {
      this.dialogRef.close(false);
    }
  
    onConfirm(): void {
      this.dialogRef.close(true);
    }
}


