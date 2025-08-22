import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GenerosService } from '../services/generos.service';
import { Genero } from '../models/genero';

@Component({
  standalone: true,
  selector: 'app-generos-page',
  imports: [CommonModule, FormsModule],
  template: `
  <section class="card">
    <h2>Gêneros</h2>

    <form (ngSubmit)="save()" class="row">
      <input [(ngModel)]="nome" name="nome" placeholder="Novo gênero" required/>
      <button type="submit">{{ editId ? 'Salvar' : 'Adicionar' }}</button>
      <button type="button" class="ghost" *ngIf="editId" (click)="cancel()">Cancelar</button>
    </form>

    <table>
      <thead><tr><th>Nome</th><th style="width:160px">Ações</th></tr></thead>
      <tbody>
        <tr *ngFor="let g of generos()">
          <td>{{ g.nome }}</td>
          <td class="actions">
            <button (click)="startEdit(g)">Editar</button>
            <button class="danger" (click)="remove(g.id)">Excluir</button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
  `,
  styles: [`
    .card{max-width:900px;margin:auto;padding:16px;border:1px solid #eee;border-radius:12px;box-shadow:0 4px 14px rgba(0,0,0,.04);}
    h2{margin-top:0}
    .row{display:flex;gap:8px;margin-bottom:12px}
    input{flex:1;padding:10px;border:1px solid #ddd;border-radius:8px}
    button{padding:8px 12px;border-radius:8px;border:1px solid #ddd;background:#111;color:#fff;border-color:#111}
    button.ghost{background:#fff;color:#111}
    button.danger{background:#b3261e;border-color:#b3261e}
    table{width:100%;border-collapse:collapse}
    th,td{padding:10px;border-bottom:1px solid #eee}
    .actions{display:flex;gap:8px}
  `]
})
export class GenerosPage implements OnInit {
  generos = signal<Genero[]>([]);
  nome = '';
  editId: number | null = null;

  constructor(private api: GenerosService) {}
  ngOnInit(){ this.load(); }

  load(){ this.api.list().subscribe(d => this.generos.set(d)); }
  save(){
    if(!this.nome.trim()) return;
    if(this.editId){
      this.api.update(this.editId, { nome: this.nome }).subscribe(() => { this.cancel(); this.load(); });
    }else{
      this.api.create({ nome: this.nome }).subscribe(() => { this.nome=''; this.load(); });
    }
  }
  startEdit(g: Genero){ this.editId = g.id; this.nome = g.nome; }
  cancel(){ this.editId=null; this.nome=''; }
  remove(id: number){ this.api.delete(id).subscribe(() => this.load()); }
}
