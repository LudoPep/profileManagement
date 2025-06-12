import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { firstValueFrom, Observable, tap } from 'rxjs';
import { Profile } from '../interfaces/profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private profiles = signal<Profile[]>([]);
  endpoint = 'api/profiles';

  constructor(
    private http: HttpClient
  ) { 
    this.getProfiles();
  }

  get profilesSignal() {
    return this.profiles;
  }

  getProfiles() {
    this.http.get<Profile[]>(this.endpoint).subscribe(data => {
      const parsed = data.map(p => ({
        ...p,
        creationDate: new Date(p.creationDate),
        updateDate: new Date(p.updateDate)
      }));
      this.profiles.set(parsed);
    });
  }

  createNewProfile(profile: Partial<Profile>) {
    return this.http.post<Profile>(this.endpoint, profile).pipe(
      tap(newProfile => {
        this.profiles.update(current => [...current, newProfile]);
      })
    );
  }

  updateProfile(id: number, updatedData: Partial<Profile>): Observable<Profile> {
    return this.http.put<Profile>(`${this.endpoint}/${id}`, updatedData).pipe(
      tap(updated => {
        this.profiles.update(current =>
          current.map(p => p.id === Number(id) ? { ...p, ...updated } : p)
        );
      })
    );
  }

}
