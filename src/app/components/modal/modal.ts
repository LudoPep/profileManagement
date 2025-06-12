import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ProfileService } from '../../services/profile';
import { Profile } from '../../interfaces/profile';
import { Scope } from '../../interfaces/scope';
import { ComponentType } from '@angular/cdk/overlay';
import { Partner } from '../../interfaces/partner';

@Component({
  selector: 'app-modal',
  imports: [
    CommonModule,
    MatDialogModule
  ],
  templateUrl: './modal.html',
  styleUrl: './modal.scss'
})
export class Modal {
  dialogRef = inject(MatDialogRef<Modal>);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { 
      title?: string,
      mode: 'create' | 'edit', 
      profile?: Profile,
      partner?: Partner,
      userRank?: number,
      formComponent: ComponentType<unknown>;
     },
  ) {}

}
