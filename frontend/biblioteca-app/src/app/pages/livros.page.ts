import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LivrosService } from '../services/livros.service';
import { Livro, CreateLivro } from '../models/livro';

@Component({
  standalone: true,
  selector: 'app-livros',
  imports: [CommonModule, FormsModule],
  template: `
  <section style="max-width:960px;margin:2rem auto;padding:1rem">
    <h2>Livros</h2>

    <form (ngSubmit)="save()" style="display:grid;grid-template-columns:1fr 140px 140px 180px auto auto;gap:.5rem;margin:.75rem 0;align-items:center">
      <input [(ngModel)]="titulo" name="titulo" required placeholder="Título" style="padding:.5rem;border:1px solid #ccc;border-radius:6px;" />
      <input [(ngModel)]="autorId" name="autorId" type="number" placeholder="AutorId" style="padding:.5rem;border:1px solid #ccc;border-radius:6px;" />
      <input [(ngModel)]="generoId" name="generoId" type="number" placeholder="GeneroId" style="padding:.5rem;border:1px solid #ccc;border-radius:6px;" />
      <input [(ngModel)]="publicacao" name="publicacao" type="date" placeholder="Publicação" style="padding:.5rem;border:1px solid #ccc;border-radius:6px;" />
      <button class="btn">{{ editId === null ? 'Adicionar' : 'Atualizar' }}</button>
      <button type="button" class="btn-outline" *ngIf="editId !== null" (click)="cancel()">Cancelar</button>
    </form>

    <table *ngIf="livros().length; else vazio" style="width:100%;border-collapse:collapse">
      <thead>
        <tr>
          <th style="text-align:left;padding:.5rem;border-bottom:1px solid #eee">Título</th>
          <th style="text-align:left;padding:.5rem;border-bottom:1px solid #eee">Autor</th>
          <th style="text-align:left;padding:.5rem;border-bottom:1px solid #eee">Gênero</th>
          <th style="text-align:left;padding:.5rem;border-bottom:1px solid #eee">Publicação</th>
          <th style="width:160px;padding:.5rem;border-bottom:1px solid #eee">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let l of livros(); trackBy: trackId">
          <td style="padding:.5rem;border-bottom:1px solid #f3f3f3">{{ l.titulo }}</td>
          <td style="padding:.5rem;border-bottom:1px solid #f3f3f3">{{ l.autorNome || l.autorId || '-' }}</td>
          <td style="padding:.5rem;border-bottom:1px solid #f3f3f3">{{ l.generoNome || l.generoId || '-' }}</td>
          <td style="padding:.5rem;border-bottom:1px solid #f3f3f3">{{ l.publicacao ? (l.publicacao | date:'yyyy-MM-dd') : '-' }}</td>
          <td style="padding:.5rem;border-bottom:1px solid #f3f3f3">
            <button class="btn-sm" (click)="startEdit(l)">Editar</button>
            <button class="btn-sm" (click)="remove(l.id)">Excluir</button>
          </td>
        </tr>
      </tbody>
    </table>
    <ng-template #vazio><div style="color:#777">Nenhum livro ainda.</div></ng-template>
  </section>
  `
})
export default class LivrosPage implements OnInit {
  livros = signal<Livro[]>([]);

  titulo = '';
  autorId: number | null = null;
  generoId: number | null = null;
  publicacao: string = ''; // yyyy-MM-dd

  editId: number | null = null;

  constructor(private api: LivrosService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.api.list().subscribe({
      next: (d: Livro[]) => this.livros.set(d),
      error: (err: unknown) => console.error('Erro list()', err)
    });
  }

  save(): void {
    const t = this.titulo.trim();
    if (!t) return;

    const payload: CreateLivro = { titulo: t };
    if (this.autorId != null) payload.autorId = this.autorId;
    if (this.generoId != null) payload.generoId = this.generoId;
    if (this.publicacao) payload.publicacao = this.publicacao;

    if (this.editId == null) {
      this.api.create(payload).subscribe({
        next: () => { this.cancel(); this.load(); },
        error: (err: unknown) => console.error('Erro create()', err)
      });
    } else {
      this.api.update(this.editId, payload).subscribe({
        next: () => { this.cancel(); this.load(); },
        error: (err: unknown) => console.error('Erro update()', err)
      });
    }
  }

  startEdit(l: Livro): void {
    this.editId = l.id;
    this.titulo = l.titulo ?? '';
    this.autorId = l.autorId ?? null;
    this.generoId = l.generoId ?? null;
    this.publicacao = l.publicacao ? l.publicacao.substring(0,10) : '';
  }

  cancel(): void {
    this.editId = null;
    this.titulo = '';
    this.autorId = null;
    this.generoId = null;
    this.publicacao = '';
  }

  remove(id: number): void {
    if (!confirm('Excluir livro?')) return;
    this.api.remove(id).subscribe({
      next: () => this.load(),
      error: (err: unknown) => console.error('Erro remove()', err)
    });
  }

  trackId = (_: number, it: Livro) => it.id;
}
