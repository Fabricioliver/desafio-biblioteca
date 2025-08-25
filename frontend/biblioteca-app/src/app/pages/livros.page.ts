import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LivrosService } from '../services/livros.service';
import { AutoresService } from '../services/autores.service';
import { GenerosService } from '../services/generos.service';

import { Livro } from '../models/livro';
import { Autor } from '../models/autor';
import { Genero } from '../models/genero';

type LivroView = Livro & {
  publicacao?: string | null;
  autorNome?: string | null;
  generoNome?: string | null;
};

@Component({
  selector: 'app-livros',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [DatePipe],
  template: `
  <h1>Livros</h1>

  <div class="card">
    <form (ngSubmit)="save()" #form="ngForm">
      <div class="row">
        <label>Título</label>
        <input name="titulo" [(ngModel)]="titulo" required />
      </div>

      <div class="row">
        <label>Autor</label>
        <select name="autorId" [(ngModel)]="autorId" required>
          <option [ngValue]="''">Selecione...</option>
          <option *ngFor="let a of autores" [ngValue]="a.id">{{ a.nome }}</option>
        </select>
      </div>

      <div class="row">
        <label>Gênero</label>
        <select name="generoId" [(ngModel)]="generoId" required>
          <option [ngValue]="''">Selecione...</option>
          <option *ngFor="let g of generos" [ngValue]="g.id">{{ g.nome }}</option>
        </select>
      </div>

      <div class="row">
        <label>Publicação</label>
        <input type="date" name="publicacao" [(ngModel)]="publicacao" />
      </div>

      <div class="actions">
        <button type="submit" [disabled]="form.invalid || loading">{{ id ? 'Salvar' : 'Adicionar' }}</button>
        <button type="button" (click)="cancel()" [disabled]="loading">Cancelar</button>
      </div>
    </form>
  </div>

  <div class="card">
    <table class="grid">
      <thead>
        <tr>
          <th>#</th>
          <th>Título</th>
          <th>Autor</th>
          <th>Gênero</th>
          <th>Publicação</th>
          <th style="width:160px">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let l of livros">
          <td>{{ l.id }}</td>
          <td>{{ l.titulo }}</td>
          <td>{{ l.autorNome ?? findAutorNome(l.autorId) }}</td>
          <td>{{ l.generoNome ?? findGeneroNome(l.generoId) }}</td>
          <td>{{ formatDate(l.publicacao) }}</td>
          <td>
            <button (click)="edit(l)">Editar</button>
            <button class="danger" (click)="remove(l.id!)">Excluir</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  `,
  styles: [`
  h1{margin:0 0 16px}
  .card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:16px;margin:16px 0;box-shadow:0 2px 6px rgba(0,0,0,.04)}
  .row{display:flex;gap:12px;align-items:center;margin:8px 0}
  .row label{width:120px;color:#374151}
  input,select,button{padding:8px 10px;border-radius:8px;border:1px solid #d1d5db}
  button{cursor:pointer}
  button.danger{background:#fee2e2;border-color:#fecaca}
  .grid{width:100%;border-collapse:collapse}
  .grid th,.grid td{border-bottom:1px solid #eee;padding:8px 10px;text-align:left}
  `]
})
export default class LivrosPage {
  private livrosApi = inject(LivrosService);
  private autoresApi = inject(AutoresService);
  private generosApi = inject(GenerosService);
  private datePipe = inject(DatePipe);

  // tabela
  livros: LivroView[] = [];
  autores: Autor[] = [];
  generos: Genero[] = [];
  loading = false;

  // form
  id: number | null = null;
  titulo = '';
  autorId: number | '' = '';
  generoId: number | '' = '';
  publicacao = ''; // yyyy-MM-dd

  // ---------- adapters para lidar com nomes diferentes nos services ----------
  private autoresList$(): any {
    const s: any = this.autoresApi as any;
    return s.getAll?.() ?? s.list?.() ?? s.all?.() ?? s.index?.();
  }
  private generosList$(): any {
    const s: any = this.generosApi as any;
    return s.getAll?.() ?? s.list?.() ?? s.all?.() ?? s.index?.();
  }
  private livrosList$(): any {
    const s: any = this.livrosApi as any;
    return s.getAll?.() ?? s.list?.() ?? s.all?.() ?? s.index?.();
  }
  private livrosCreate$(payload: any): any {
    const s: any = this.livrosApi as any;
    return s.create?.(payload) ?? s.add?.(payload) ?? s.post?.(payload) ?? s.insert?.(payload);
  }
  private livrosUpdate$(id: number, payload: any): any {
    const s: any = this.livrosApi as any;
    return s.update?.(id, payload) ?? s.put?.(id, payload) ?? s.patch?.(id, payload);
  }
  private livrosDelete$(id: number): any {
    const s: any = this.livrosApi as any;
    return s.delete?.(id) ?? s.remove?.(id) ?? s.del?.(id);
  }
  // --------------------------------------------------------------------------

  ngOnInit() {
    this.load();

    this.autoresList$()?.subscribe({
      next: (data: Autor[]) => this.autores = data,
      error: (err: any) => console.error(err)
    });

    this.generosList$()?.subscribe({
      next: (data: Genero[]) => this.generos = data,
      error: (err: any) => console.error(err)
    });
  }

  load() {
    this.loading = true;
    this.livrosList$()?.subscribe({
      next: (data: any[]) => {
        this.livros = data.map(l => ({
          ...l,
          publicacao: l?.publicacao ?? null,
          autorNome: l?.autorNome ?? null,
          generoNome: l?.generoNome ?? null
        })) as LivroView[];
        this.loading = false;
      },
      error: (err: any) => { console.error(err); this.loading = false; }
    });
  }

  private toIsoOrNull(dateStr: string): string | null {
    if (!dateStr) return null;
    return new Date(dateStr + 'T00:00:00').toISOString();
  }

  save() {
    const payload = {
      titulo: this.titulo.trim(),
      autorId: this.autorId === '' ? null : Number(this.autorId),
      generoId: this.generoId === '' ? null : Number(this.generoId),
      publicacao: this.toIsoOrNull(this.publicacao)
    };

    if (this.id) {
      this.livrosUpdate$(this.id, payload)?.subscribe({
        next: (_: any) => { this.cancel(); this.load(); },
        error: (err: any) => console.error('Erro save() [update]', err)
      });
    } else {
      this.livrosCreate$(payload)?.subscribe({
        next: (_: any) => { this.cancel(); this.load(); },
        error: (err: any) => console.error('Erro save() [create]', err)
      });
    }
  }

  edit(l: LivroView) {
    this.id = l.id ?? null;
    this.titulo = l.titulo ?? '';
    this.autorId = (l.autorId ?? '') as any;
    this.generoId = (l.generoId ?? '') as any;
    const iso = (l.publicacao ?? '').toString();
    this.publicacao = iso ? iso.substring(0, 10) : '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  remove(id: number) {
    if (!confirm('Excluir este livro?')) return;
    this.livrosDelete$(id)?.subscribe({
      next: (_: any) => this.load(),
      error: (err: any) => console.error(err)
    });
  }

  cancel() {
    this.id = null;
    this.titulo = '';
    this.autorId = '';
    this.generoId = '';
    this.publicacao = '';
  }

  findAutorNome(id?: number | null) {
    return this.autores.find(a => a.id === id)?.nome ?? '';
  }
  findGeneroNome(id?: number | null) {
    return this.generos.find(g => g.id === id)?.nome ?? '';
  }

  formatDate(v?: string | null): string {
    if (!v) return '';
    return this.datePipe.transform(v, 'yyyy-MM-dd') ?? '';
  }
}
