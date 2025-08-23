import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'autores' },
  { path: 'autores', loadComponent: () => import('./pages/autores.page').then(m => m.default) },
  { path: 'livros',  loadComponent: () => import('./pages/livros.page').then(m => m.default) },
  { path: 'generos', loadComponent: () => import('./pages/generos.page').then(m => m.default) },
  { path: '**', redirectTo: 'autores' },
];
