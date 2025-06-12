import { Component, computed, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HostingType, Partner } from '../../../interfaces/partner';
import { PartnerService } from '../../../services/partner';
import { ToastrService } from 'ngx-toastr';
import { Modal } from '../../modal/modal';
import { Observable } from 'rxjs';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-partner-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatOptionModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    TranslateModule
  ],
  templateUrl: './partner-form.html',
  styleUrl: './partner-form.scss'
})
export class PartnerForm {
  partnerForm!: FormGroup;
  queueNames$!: Observable<string[]>;
  allowedHostingTypes: HostingType[] = [];
  hostingTypes = () => Object.values(HostingType);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'create' | 'edit', partner?: Partner, userRank?: number },
    private fb: FormBuilder,
    private partnerService: PartnerService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<Modal>,
    private translate: TranslateService
  ) {
    this.partnerForm = this.fb.group({
      alias: [''],
      queueName: [''],
      hostingType: [''],
      status: [{ value: '', disabled: this.data.mode === 'edit' }],
      application: [''],
      description: [''],
    });

    if (data.mode === 'edit' && data.partner) {
      this.partnerForm.patchValue(data.partner);
      this.allowedHostingTypes = this.partnerService.getAllowedHostingTypes(data.partner.queueName);
    };

    if (this.data.mode === 'create') {
      const autoStatus = this.data.userRank === 3 ? 'ACTIVE' : 'INACTIVE';
      this.partnerForm.get('status')?.setValue(autoStatus);
    }

    this.partnerForm.get('queueName')?.valueChanges.subscribe(queue => {
      this.allowedHostingTypes = this.partnerService.getAllowedHostingTypes(queue);
      this.partnerForm.get('hostingType')?.setValue('');
    });

    this.queueNames$ = this.partnerService.getAvailableQueueNames();
  }

  submit() {
    if (this.partnerForm.valid) {
      const value = this.partnerForm.value;

    if (!this.partnerService.isValid(value)) {
      return alert('Conditions non remplies.');
    }

    if (this.data.mode === 'create') {
      this.partnerService.createNewPartner(value, this.data.userRank ?? 0).subscribe({
        next: () => {
            this.dialogRef.close();
            this.toastr.success(this.translate.instant('partner.form.toastr.creationSuccess'));
          },
          error: () => {
            this.toastr.error(this.translate.instant('partner.form.toastr.creationError'));
          }
      });
    } else {
      const id = this.data.partner?.id;
      if (id !== undefined) {
        this.partnerService.updatePartner(id, value).subscribe({
          next: () => {
              this.dialogRef.close();
              this.toastr.success(this.translate.instant('partner.form.toastr.updateSuccess'));
            },
            error: () => {
              this.toastr.error(this.translate.instant('partner.form.toastr.updateError'));
            }
        });
      }
    }
    }
  }

}
