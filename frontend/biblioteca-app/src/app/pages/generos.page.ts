import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GenerosService } from '../services/generos.service';
import { Genero, CreateGenero } from '../models/genero';

@Component({
  standalone: true,
  selector: 'app-generos',
  imports: [CommonModule, FormsModule],
  template: `
  <section style="max-width:720px;margin:2rem auto;padding:1rem">
    <h2>Gêneros</h2>

    <form (ngSubmit)="save()" style="display:flex;gap:.5rem;margin:.75rem 0">
      <input [(ngModel)]="nome" name="nome" required placeholder="Nome do gênero"
             style="flex:1;padding:.5rem;border:1px solid #ccc;border-radius:6px;" />
      <button class="btn">{{ editId === null ? 'Adicionar' : 'Atualizar' }}</button>
      <button type="button" class="btn-outline" *ngIf="editId !== null" (click)="cancel()">Cancelar</button>
    </form>

    <table *ngIf="generos().length; else vazio" style="width:100%;border-collapse:collapse">
      <thead>
        <tr>
          <th style="text-align:left;padding:.5rem;border-bottom:1px solid #eee">Nome</th>
          <th style="width:160px;padding:.5rem;border-bottom:1px solid #eee">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let g of generos(); trackBy: trackId">
          <td style="padding:.5rem;border-bottom:1px solid #f3f3f3">{{ g.nome }}</td>
          <td style="padding:.5rem;border-bottom:1px solid #f3f3f3">
            <button class="btn-sm" (click)="startEdit(g)">Editar</button>
            <button class="btn-sm" (click)="remove(g.id)">Excluir</button>
          </td>
        </tr>
      </tbody>
    </table>
    <ng-template #vazio><div style="color:#777">Nenhum gênero ainda.</div></ng-template>
  </section>
  `
})
export default class GenerosPage implements OnInit {
  generos = signal<Genero[]>([]);
  nome = '';
  editId: number | null = null;

  constructor(private api: GenerosService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.api.list().subscribe({
      next: (d: Genero[]) => this.generos.set(d),
      error: (err: unknown) => console.error('Erro list()', err)
    });
  }

  save(): void {
    const n = this.nome.trim();
    if (!n) return;

    // If/else explícito para evitar união de Observables (TS2349)
    if (this.editId == null) {
      this.api.create({ nome: n } as CreateGenero).subscribe({
        next: () => { this.cancel(); this.load(); },
        error: (err: unknown) => console.error('Erro create()', err)
      });
    } else {
      this.api.update(this.editId, { nome: n } as CreateGenero).subscribe({
        next: () => { this.cancel(); this.load(); },
        error: (err: unknown) => console.error('Erro update()', err)
      });
    }
  }

  startEdit(g: Genero): void { this.editId = g.id; this.nome = g.nome; }
  cancel(): void { this.editId = null; this.nome = ''; }

  remove(id: number): void {
    if (!confirm('Excluir gênero?')) return;
    this.api.remove(id).subscribe({
      next: () => this.load(),
      error: (err: unknown) => console.error('Erro remove()', err)
    });
  }

  trackId = (_: number, it: Genero) => it.id;
}
