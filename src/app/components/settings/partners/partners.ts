import { CommonModule } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Partner } from '../../../interfaces/partner';
import { MatDialog } from '@angular/material/dialog';
import { Modal } from '../../modal/modal';
import { PartnerForm } from '../../forms/partner-form/partner-form';
import { PartnerService } from '../../../services/partner';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { HighlightPipe } from '../../../utils/highlightPipe';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-partners',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatButtonModule,
    FormsModule,
    HighlightPipe,
    TranslateModule
  ],
  templateUrl: './partners.html',
  styleUrl: './partners.scss'
})
export class Partners {
  dialog = inject(MatDialog);
  partnerService = inject(PartnerService);
  translate = inject(TranslateService);

  form: FormGroup;
  hostingTypes = ['MQ', 'DIRECTORY', 'PRINTER', 'S3'];
  searchTerm: string = '';

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      hostingType: [''],
      queueName: [''],
      alias: [''],
      description: [''],
      application: [''],
    });
  }

  displayedColumns = ['status', 'hostingType', 'alias', 'queueName', 'application', 'description', 'actions'];

  partners: Signal<Partner[]> = this.partnerService.partnersSignal;

  get filteredPartners(): Partner[] {
    return this.partners().filter(partner =>
      Object.values(partner).some(value =>
        value?.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );
  }

  openCreateModal() {
      this.dialog.open(Modal, {
        data: {
          title: this.translate.instant('partner.form.createTitle'),
          mode: 'create',
          formComponent: PartnerForm
        }
      });
  }

  refreshPartners() {
    this.partnerService.getPartners();
  }

  openEditModal(partner: Partner) {
    const dialogRef = this.dialog.open(Modal, {
      data: {
        title: this.translate.instant('partner.form.updateTitle'),
        mode: 'edit',
        partner: partner,
        formComponent: PartnerForm
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.partnerService.getPartners();
      }
    });
  }

  
}
