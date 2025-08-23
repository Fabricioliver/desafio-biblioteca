import { Routes } from '@angular/router';
import { GenerosPage } from './pages/generos.page';
import { LivrosPage } from './pages/livros.page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'autores' },
  { path: 'autores', loadComponent: () => import('./pages/autores.page').then(m => m.default) },
  { path: 'generos', component: GenerosPage },
  { path: 'livros', component: LivrosPage },
  { path: '**', redirectTo: 'autores' },
];
