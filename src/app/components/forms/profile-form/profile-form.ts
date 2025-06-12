import { CommonModule } from '@angular/common';
import { Component, computed, Inject, inject, Input, OnInit, signal, Signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Scope } from '../../../interfaces/scope';
import { ProfileService } from '../../../services/profile';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Modal } from '../../modal/modal';
import { ToastrService } from 'ngx-toastr';
import { ScopeService } from '../../../services/scope';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { Profile } from '../../../interfaces/profile';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatOptionModule,
    MatInputModule,
    MatButtonModule,
    TranslateModule,
  ],
  templateUrl: './profile-form.html',
  styleUrl: './profile-form.scss'
})
export class ProfileForm {
  profileForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'create' | 'edit', profile?: Profile },
    private fb: FormBuilder,
    private profileService: ProfileService,
    private scopeService: ScopeService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<Modal>,
    private translate: TranslateService,
  ) {
    this.profileForm = this.fb.group({
      code: ['', [Validators.required,
                  Validators.minLength(5),
                  Validators.maxLength(10),
                  Validators.pattern(/^(?!\d+$)[^\s"#!&_]+$/)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(30)]],
      scope: ['', Validators.required],
      creationDate: new Date(),
      updateDate: new Date(),
      lastUpdateUserId: ['']
    });

    if (data.mode === 'edit' && data.profile) {
      this.profileForm.patchValue(data.profile);
    };
  }

  readonly availableScopes = computed(() => this.scopeService.scopes());

  submit() {
    if (this.profileForm.valid) {
    const value = this.profileForm.value;

    if (this.data.mode === 'create') {
      this.profileService.createNewProfile(value).subscribe({
        next: () => {
          this.dialogRef.close();
          this.toastr.success(this.translate.instant('profile.form.toaster.creationSuccess'));
        },
        error: () => {
          this.toastr.error(this.translate.instant('profile.form.toaster.creationError'));
        }
      });
    } else if (this.data.mode === 'edit' && this.data.profile?.id !== undefined) {
      this.profileService.updateProfile(this.data.profile.id, value).subscribe({
        next: () => {
          this.dialogRef.close();
          this.toastr.success(this.translate.instant('profile.form.toaster.updateSuccess'));
        },
        error: () => {
          this.toastr.error(this.translate.instant('profile.form.toaster.updateError'));
        }
      });
    }
  }
  }


}
