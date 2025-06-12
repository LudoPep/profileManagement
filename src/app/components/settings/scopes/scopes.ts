import { CommonModule } from '@angular/common';
import { Component, computed, inject, Input, OnInit, Signal, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Scope } from '../../../interfaces/scope';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Modal } from '../../modal/modal';
import { ScopeForm } from '../../forms/scope-form/scope-form';
import { MatButtonModule } from '@angular/material/button';
import { ScopeService } from '../../../services/scope';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-scopes',
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    MatTooltipModule,
    TranslateModule,
  ],
  templateUrl: './scopes.html',
  styleUrl: './scopes.scss'
})
export class Scopes {
  dialog = inject(MatDialog);
  scopeService = inject(ScopeService);
  translate = inject(TranslateService);

  displayedColumns = ['rank', 'name', 'description', 'comment', 'condition'];
  
  scopes = computed(() => this.scopeService.scopes());

  openCreateModal() {
    this.dialog.open(Modal, {
      data: {
        title: this.translate.instant('scope.form.createTitle'),
        formComponent: ScopeForm,
        inputs: {
          existingScopes: this.scopes
        }
      }
    });
  }

  refreshScopes() {
    this.scopeService.loadScopes();
  }

}
