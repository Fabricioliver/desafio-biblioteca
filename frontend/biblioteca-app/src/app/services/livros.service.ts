import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Livro, CreateLivro } from '../models/livro';

@Injectable({ providedIn: 'root' })
export class LivrosService {
  private readonly base = `${environment.api}/livros`;
  constructor(private http: HttpClient) {}

  list(): Observable<Livro[]> { return this.http.get<Livro[]>(this.base); }
  get(id: number): Observable<Livro> { return this.http.get<Livro>(`${this.base}/${id}`); }
  create(dto: CreateLivro): Observable<Livro> { return this.http.post<Livro>(this.base, dto); }
  update(id: number, dto: CreateLivro): Observable<void> { return this.http.put<void>(`${this.base}/${id}`, dto); }
  remove(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/${id}`); }
  delete(id: number): Observable<void> { return this.remove(id); }
}
