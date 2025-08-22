import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CreateLivro, Livro } from '../models/livro';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LivrosService {
  private base = `${environment.api}/livros`;
  constructor(private http: HttpClient) {}
  list(): Observable<Livro[]> { return this.http.get<Livro[]>(this.base); }
  get(id: number): Observable<Livro> { return this.http.get<Livro>(`${this.base}/${id}`); }
  create(dto: CreateLivro): Observable<Livro> { return this.http.post<Livro>(this.base, dto); }
  update(id: number, dto: CreateLivro) { return this.http.put(`${this.base}/${id}`, dto); }
  delete(id: number) { return this.http.delete(`${this.base}/${id}`); }
}
