import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { profilesMock as initialProfilesMock } from '../services/mocks/mock-profiles';
import { scopesMock as initialScopesMock } from '../services/mocks/mock-scopes';
import { partnersMock as initialPartnersMock } from '../services/mocks/mock-partner';

export const mockApiInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const { url, method, body } = req;
  let scopesMock = [...initialScopesMock];
  let profilesMock = [...initialProfilesMock];
  let partnersMock = [...initialPartnersMock];

  // Simuler GET /api/profiles
  if (url.endsWith('/profiles') && method === 'GET') {
    return of(new HttpResponse({
      status: 200,
      body: profilesMock
    })).pipe(delay(500));
  }

  // Simuler POST /api/profiles
  if (url.endsWith('/profiles') && method === 'POST') {
    const newProfile = {
      ...body,
      id: Math.random().toString(36).substring(2),
      createdAt: new Date(),
      updatedAt: new Date(),
      lastModifiedBy: 'admin'
    };
    profilesMock = [...profilesMock, newProfile];
    return of(new HttpResponse({
      status: 201,
      body: newProfile
    })).pipe(delay(500));
  }

   // Simuler PUT /api/profiles/:id
  if (url.match(/\/profiles\/[^\/]+$/) && method === 'PUT') {
    const id = url.split('/').pop();
    const idNumber = Number(id);
    const index = profilesMock.findIndex(p => p.id === idNumber);
    if (index !== -1) {
      const updated = {
        ...profilesMock[index],
        ...body,
        updatedAt: new Date()
      };
      profilesMock[index] = updated;

      return of(new HttpResponse({
        status: 200,
        body: updated
      })).pipe(delay(500));
    }
    return of(new HttpResponse({ status: 404 })).pipe(delay(500));
  }

  // Simuler GET /api/scopes
  if (url.endsWith('/scopes') && method === 'GET') {
    return of(new HttpResponse({
      status: 200,
      body: scopesMock
    })).pipe(delay(500));
  }

  // Simuler POST /api/scopes
  if (url.endsWith('/scopes') && method === 'POST') {
    const newScope = {
      ...body,
      rank: body.rank ?? scopesMock.length + 1,
    };
    scopesMock = [...scopesMock, newScope];
    return of(new HttpResponse({
      status: 201,
      body: newScope
    })).pipe(delay(500));
  }

  // Simuler GET /api/partners
  if (url.endsWith('/partners') && method === 'GET') {
    return of(new HttpResponse({
      status: 200,
      body: partnersMock
    })).pipe(delay(500));
  }

  // Simuler POST /api/partners
    if (url.endsWith('/partners') && method === 'POST') {
      const newPartner = {
        id: Math.floor(Math.random() * 1000),
        ...body,
      };
      partnersMock = [...scopesMock, newPartner];

      return of(new HttpResponse({ 
        status: 201, 
        body: newPartner 
      })).pipe(delay(500));
    }

  return next(req);
};
