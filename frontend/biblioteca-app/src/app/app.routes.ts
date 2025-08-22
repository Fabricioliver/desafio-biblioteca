import { Routes } from '@angular/router';
import { GenerosPage } from './pages/generos.page';
import { AutoresPage } from './pages/autores.page';
import { LivrosPage } from './pages/livros.page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'generos' },
  { path: 'generos', component: GenerosPage },
  { path: 'autores', component: AutoresPage },
  { path: 'livros', component: LivrosPage },
  { path: '**', redirectTo: 'generos' },
];
