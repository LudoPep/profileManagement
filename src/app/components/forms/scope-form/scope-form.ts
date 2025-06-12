import { Component, Input, Signal, computed, signal, AfterViewInit, effect } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ScopeService } from '../../../services/scope';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';
import { Modal } from '../../modal/modal';
import { CommonModule } from '@angular/common';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Scope } from '../../../interfaces/scope';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-scope-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatError,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TranslateModule
  ],
  templateUrl: './scope-form.html',
  styleUrl: './scope-form.scss'
})
export class ScopeForm {
  @Input() existingScopes: Signal<Scope[]> = signal([]);

  scopeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private scopeService: ScopeService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<Modal>,
    private translate: TranslateService,
  ) {
    this.scopeForm = this.fb.group({
      rank: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
      name: ['', Validators.required],
      description: ['', Validators.required],
      comment: [''],
      condition: ['']
    });

    effect(() => {
      const scopes = this.existingScopes();
      if (scopes.length > 0) {
        this.scopeForm.get('rank')?.setValue(this.autoRank());
      }
    });
  }

  autoRank = computed(() => {
    const ranks = this.existingScopes().map(scope => scope.rank || 0);
    return Math.max(...ranks, 0) + 1;
  });

  onPasteRank(event: ClipboardEvent) {
    event.preventDefault();
    const pasted = (event.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, 3);
    const rankValue = parseInt(pasted, 10).toString();
    this.scopeForm.get('rank')?.setValue(rankValue);
  }

  onKeydownRank(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
    if (!allowedKeys.includes(event.key) && !/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }

  submit() {
    if (this.scopeForm.valid) {
      const newRank = +this.scopeForm.get('rank')!.value;
      const existing = this.existingScopes().find(s => s.rank === newRank);
      if (existing) {
        this.toastr.error(this.translate.instant('scope.form.toastr.alreadyExists'));
        return;
      }

      this.scopeService.createNewScope(this.scopeForm.value).subscribe({
        next: (scopeCreated) => {
          this.toastr.success(this.translate.instant('scope.form.toastr.creationSuccess'));
          this.dialogRef.close(scopeCreated);
        },
        error: () => {
          this.toastr.error(this.translate.instant('scope.form.toastr.creationError'));
        }
      });
    }
  }
}