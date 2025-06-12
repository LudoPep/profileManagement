import { Routes } from '@angular/router';

export const routes: Routes = [
    {   
        path: '', redirectTo: 'profile', pathMatch: 'full' 
    },
    {
        path: 'profile',
        loadComponent: () => import('./components/profile/profile').then((m) => m.ProfileComponent),
    },
    {
        path: 'settings/scopes',
        loadComponent: () => import('./components/settings/scopes/scopes').then((m) => m.Scopes),
    },
    {
        path: 'settings/partners',
        loadComponent: () => import('./components/settings/partners/partners').then((m) => m.Partners),
    },
];
