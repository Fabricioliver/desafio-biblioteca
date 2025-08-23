import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoresService } from '../services/autores.service';
import { Autor } from '../models/autor';

@Component({
  standalone: true,
  selector: 'app-autores-page',
  imports: [CommonModule, FormsModule],
  template: `
  <section class="card">
    <h2>Autores</h2>

    <form (ngSubmit)="save()" class="row">
      <input [(ngModel)]="nome" name="nome" required placeholder="Nome do autor" />
      <button class="btn">{{ editId === null ? 'Adicionar' : 'Atualizar' }}</button>
      <button type="button" class="btn-outline" *ngIf="editId !== null" (click)="cancel()">Cancelar</button>
    </form>

    <table class="table" *ngIf="autores().length; else vazio">
      <thead><tr><th>Nome</th><th class="w-40">Ações</th></tr></thead>
      <tbody>
        <tr *ngFor="let a of autores(); trackBy: trackId">
          <td>{{ a.nome }}</td>
          <td>
            <button class="btn-sm" (click)="startEdit(a)">Editar</button>
            <button class="btn-sm" (click)="remove(a.id)">Excluir</button>
          </td>
        </tr>
      </tbody>
    </table>
    <ng-template #vazio><div class="muted">Nenhum autor ainda.</div></ng-template>
  </section>
  `
})
export default class AutoresPage {
  autores = signal<Autor[]>([]);
  nome = '';
  editId: number | null = null;

  constructor(private api: AutoresService) { this.load(); }

  load() {
    this.api.list().subscribe({
      next: (d: Autor[]) => this.autores.set(d),
      error: (err: unknown) => console.error(err)
    });
  }

  save() {
    const n = this.nome.trim();
    if (!n) return;

    const req = this.editId
      ? this.api.update(this.editId, { nome: n })
      : this.api.create({ nome: n });

    req.subscribe({
      next: () => { this.cancel(); this.load(); },
      error: (err: unknown) => console.error(err)
    });
  }

  startEdit(a: Autor) { this.editId = a.id; this.nome = a.nome; }
  cancel() { this.editId = null; this.nome = ''; }
  remove(id: number) {
    this.api.remove(id).subscribe({
      next: () => this.load(),
      error: (err: unknown) => console.error(err)
    });
  }

  trackId = (_: number, it: Autor) => it.id;
}
