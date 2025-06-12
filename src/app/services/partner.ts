import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Partner, HostingType } from '../interfaces/partner';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {
  private partners = signal<Partner[]>([]);
  endpoint = 'api/partners';
  queueNames = ['MQ_FROM_PAP_MSG', 'DIR_FLXTW094', 'MQ_FROM_KEMM_WWIL_MSG', 'CUSTOM_QUEUE'];

  constructor(private http: HttpClient) {
    this.getPartners();
  }

  get partnersSignal() {
    return this.partners;
  }

  getPartners() {
    this.http.get<Partner[]>(this.endpoint).subscribe(data => {
      const parsed = data.map(p => ({
        ...p,
      }));
      this.partners.set(parsed);
    });
  }

  refreshPartners() {
    this.getPartners();
  }

  getQueueNames(): Observable<string[]> {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(this.queueNames);
        observer.complete();
      }, 300);
    });
  }

  getAllowedHostingTypes(queueName: string): HostingType[] {
    if (queueName === 'MQ_FROM_PAP_MSG' || queueName === 'DIR_FLXTW094') {
      return [HostingType.DIRECTORY, HostingType.MQ];
    }
    if (queueName === 'MQ_FROM_KEMM_WWIL_MSG') {
      return [HostingType.S3];
    }
    return [
      HostingType.MQ,
      HostingType.DIRECTORY,
      HostingType.PRINTER,
      HostingType.S3
    ];
  }

  getAvailableQueueNames(): Observable<string[]> {
    return of([
      'MQ_FROM_PAP_MSG',
      'DIR_FLXTW094',
      'MQ_FROM_KEMM_WWIL_MSG',
      'OTHER_QUEUE_1',
      'OTHER_QUEUE_2'
    ]);
  }

  createNewPartner(partner: Partial<Partner>, userRank: number): Observable<Partner> {
    const newPartner = {
      ...partner,
      status: userRank === 3 ? 'ACTIVE' : 'INACTIVE',
    } as Partner;

    return this.http.post<Partner>(this.endpoint, newPartner).pipe(
      tap(created => {
        this.partners.update(current => [...current, created]);
      })
    );
  }

  updatePartner(id: number, updatedPartner: Partial<Partner>): Observable<Partner> {
    return this.http.put<Partner>(`${this.endpoint}/${id}`, updatedPartner).pipe(
      tap(updated => {
        this.partners.update(current =>
          current.map(p => p.id === id ? { ...p, ...updated } : p)
        );
      })
    );
  }

  isValid(partner: Partial<Partner>): boolean {
    const allowedTypes = this.getAllowedHostingTypes(partner.queueName || '');
    const validHost = allowedTypes.includes(partner.hostingType as HostingType);
    const hasAppIfNeeded = ['PRINTER', 'S3'].includes(partner.hostingType as HostingType)
      ? !!partner.application
      : true;

    return !!partner.queueName && validHost && hasAppIfNeeded;
  }
}