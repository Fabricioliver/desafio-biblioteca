import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LivrosService } from '../services/livros.service';
import { GenerosService } from '../services/generos.service';
import { AutoresService } from '../services/autores.service';
import { Livro } from '../models/livro';
import { Autor } from '../models/autor';
import { Genero } from '../models/genero';

@Component({
  standalone: true,
  selector: 'app-livros-page',
  imports: [CommonModule, FormsModule],
  template: `
  <section class="card">
    <h2>Livros</h2>

    <form (ngSubmit)="save()" class="grid">
      <input [(ngModel)]="titulo" name="titulo" placeholder="Título" required/>
      <select [(ngModel)]="autorId" name="autorId" required>
        <option value="" disabled selected>Autor...</option>
        <option *ngFor="let a of autores()" [ngValue]="a.id">{{ a.nome }}</option>
      </select>
      <select [(ngModel)]="generoId" name="generoId" required>
        <option value="" disabled selected>Gênero...</option>
        <option *ngFor="let g of generos()" [ngValue]="g.id">{{ g.nome }}</option>
      </select>
      <input [(ngModel)]="publicacao" name="publicacao" type="date" required/>
      <div class="row">
        <button type="submit">{{ editId ? 'Salvar' : 'Adicionar' }}</button>
        <button type="button" class="ghost" *ngIf="editId" (click)="cancel()">Cancelar</button>
      </div>
    </form>

    <table>
      <thead>
        <tr><th>Título</th><th>Autor</th><th>Gênero</th><th>Publicação</th><th style="width:160px">Ações</th></tr>
      </thead>
      <tbody>
        <tr *ngFor="let l of livros()">
          <td>{{ l.titulo }}</td>
          <td>{{ l.autorNome }}</td>
          <td>{{ l.generoNome }}</td>
          <td>{{ l.publicacao | date:'yyyy-MM-dd' }}</td>
          <td class="actions">
            <button (click)="startEdit(l)">Editar</button>
            <button class="danger" (click)="remove(l.id)">Excluir</button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
  `,
  styles: [`
    .card{max-width:1100px;margin:auto;padding:16px;border:1px solid #eee;border-radius:12px;box-shadow:0 4px 14px rgba(0,0,0,.04);}
    h2{margin-top:0}
    .grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr auto;gap:8px;align-items:center;margin-bottom:12px}
    .row{display:flex;gap:8px}
    input, select{padding:10px;border:1px solid #ddd;border-radius:8px;width:100%}
    button{padding:8px 12px;border-radius:8px;border:1px solid #ddd;background:#111;color:#fff;border-color:#111}
    button.ghost{background:#fff;color:#111}
    button.danger{background:#b3261e;border-color:#b3261e}
    table{width:100%;border-collapse:collapse}
    th,td{padding:10px;border-bottom:1px solid #eee}
    .actions{display:flex;gap:8px}
  `]
})
export class LivrosPage implements OnInit {
  livros = signal<Livro[]>([]);
  autores = signal<Autor[]>([]);
  generos = signal<Genero[]>([]);

  titulo = '';
  autorId: number | '' = '';
  generoId: number | '' = '';
  publicacao = '';
  editId: number | null = null;

  constructor(
    private livrosApi: LivrosService,
    private autoresApi: AutoresService,
    private generosApi: GenerosService,
  ) {}

  ngOnInit(){ this.load(); }
  load(){
    this.livrosApi.list().subscribe(d => this.livros.set(d));
    this.autoresApi.list().subscribe(d => this.autores.set(d));
    this.generosApi.list().subscribe(d => this.generos.set(d));
  }

  save(){
    if(!this.titulo.trim() || !this.autorId || !this.generoId || !this.publicacao) return;
    const dto = {
      titulo: this.titulo,
      autorId: Number(this.autorId),
      generoId: Number(this.generoId),
      publicacao: new Date(this.publicacao).toISOString()
    };
    const done = () => { this.cancel(); this.load(); };

    if(this.editId){
      this.livrosApi.update(this.editId, dto).subscribe(done);
    }else{
      this.livrosApi.create(dto).subscribe(done);
    }
  }

  startEdit(l: Livro){
    this.editId = l.id;
    this.titulo = l.titulo;
    this.autorId = l.autorId;
    this.generoId = l.generoId;
    this.publicacao = l.publicacao?.substring(0,10) ?? '';
  }

  cancel(){
    this.editId = null;
    this.titulo = '';
    this.autorId = '';
    this.generoId = '';
    this.publicacao = '';
  }

  remove(id: number){ this.livrosApi.delete(id).subscribe(() => this.load()); }
}
