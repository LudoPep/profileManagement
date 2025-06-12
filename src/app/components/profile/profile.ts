import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Modal } from '../modal/modal';
import { MatTableModule } from '@angular/material/table';
import { ProfileService } from '../../services/profile';
import { ProfileForm } from '../forms/profile-form/profile-form';
import { ScopeService } from '../../services/scope';
import { Profile } from '../../interfaces/profile';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    MatTooltipModule,
    TranslateModule,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfileComponent {
  dialog = inject(MatDialog);
  profileService = inject(ProfileService);
  scopeService = inject(ScopeService);
  translate = inject(TranslateService);

  displayedColumns = ['code', 'description', 'scopeName', 'scopeRank', 'creationDate', 'updateDate', 'actions'];

  profiles = this.profileService.profilesSignal;
  scopes = this.scopeService.scopes;

  openCreateModal() {
    this.dialog.open(Modal, {
      data: {
        title: this.translate.instant('profile.form.createTitle'),
        mode: 'create',
        formComponent: ProfileForm
      }
    });
  }

  refreshProfiles() {
    this.profileService.getProfiles();
  }

  openEditModal(profile: Profile) {
    const dialogRef = this.dialog.open(Modal, {
      data: {
        title: this.translate.instant('profile.form.updateTitle'),
        mode: 'edit',
        profile: profile,
        formComponent: ProfileForm
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.profileService.getProfiles();
      }
    });
  }
  
}
