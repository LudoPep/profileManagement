import { computed, Injectable, signal } from '@angular/core';
import { Scope } from '../interfaces/scope';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScopeService {
  private _scopes = signal<Scope[]>([]);
  endpoint = 'api/scopes';

  constructor(
    private http: HttpClient
  ) {
    this.loadScopes();
  }

  readonly scopes = computed(() => this._scopes());

  loadScopes() {
    this.http.get<Scope[]>(this.endpoint).subscribe(data => {
      this._scopes.set(data);
    });
  }

  createNewScope(scope: Partial<Scope>) {
    return this.http.post<Scope>(this.endpoint, scope).pipe(
      tap(newScope => {
        this._scopes.update(current => [...current, newScope]);
      })
    );
  }
}
