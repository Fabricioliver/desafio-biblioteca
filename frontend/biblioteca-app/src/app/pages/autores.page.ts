import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoresService } from '../services/autores.service';
import { Autor } from '../models/autor';

@Component({
  standalone: true,
  selector: 'app-autores',
  imports: [CommonModule, FormsModule],
  template: `
  <section style="max-width:720px;margin:2rem auto;padding:1rem">
    <h2>Autores</h2>

    <form (ngSubmit)="save()" style="display:flex;gap:.5rem;margin:.75rem 0">
      <input [(ngModel)]="nome" name="nome" required placeholder="Nome do autor" style="flex:1;padding:.5rem;border:1px solid #ccc;border-radius:6px;" />
      <button class="btn">{{ editId === null ? 'Adicionar' : 'Atualizar' }}</button>
      <button type="button" class="btn-outline" *ngIf="editId !== null" (click)="cancel()">Cancelar</button>
    </form>

    <table *ngIf="autores().length; else vazio" style="width:100%;border-collapse:collapse">
      <thead>
        <tr><th style="text-align:left;padding:.5rem;border-bottom:1px solid #eee">Nome</th>
            <th style="width:160px;padding:.5rem;border-bottom:1px solid #eee">Ações</th></tr>
      </thead>
      <tbody>
        <tr *ngFor="let a of autores(); trackBy: trackId">
          <td style="padding:.5rem;border-bottom:1px solid #f3f3f3">{{ a.nome }}</td>
          <td style="padding:.5rem;border-bottom:1px solid #f3f3f3">
            <button class="btn-sm" (click)="startEdit(a)">Editar</button>
            <button class="btn-sm" (click)="remove(a.id)">Excluir</button>
          </td>
        </tr>
      </tbody>
    </table>
    <ng-template #vazio><div style="color:#777">Nenhum autor ainda.</div></ng-template>
  </section>
  `
})
export default class AutoresPage implements OnInit {
  autores = signal<Autor[]>([]);
  nome = '';
  editId: number | null = null;

  constructor(private api: AutoresService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.api.list().subscribe({
      next: (d: Autor[]) => this.autores.set(d),
      error: (err: unknown) => console.error('Erro list()', err)
    });
  }

save(): void {
  const n = this.nome?.trim();
  if (!n) return;

  if (this.editId == null) {
    // create(): Observable<Autor>
    this.api.create({ nome: n }).subscribe({
      next: () => { this.cancel(); this.load(); },
      error: (err: unknown) => console.error(err)
    });
  } else {
    // update(): Observable<void>
    this.api.update(this.editId, { nome: n }).subscribe({
      next: () => { this.cancel(); this.load(); },
      error: (err: unknown) => console.error(err)
    });
  }
}

  startEdit(a: Autor): void { this.editId = a.id; this.nome = a.nome; }
  cancel(): void { this.editId = null; this.nome = ''; }

  remove(id: number): void {
    if (!confirm('Excluir autor?')) return;
    this.api.remove(id).subscribe({
      next: () => this.load(),
      error: (err: unknown) => console.error('Erro remove()', err)
    });
  }

  trackId = (_: number, it: Autor) => it.id;
}
