// src/app/services/livros.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Livro, LivroUpsert } from '../models/livro';

@Injectable({ providedIn: 'root' })
export class LivrosService {
  private readonly apiRoot = `${environment.apiBase}/${environment.apiVersion}`;
  private readonly baseUrl = `${this.apiRoot}/livros`;

  constructor(private http: HttpClient) {}

  list(): Observable<Livro[]> {
    return this.http.get<Livro[]>(this.baseUrl);
  }

  create(dto: LivroUpsert): Observable<Livro> {
    return this.http.post<Livro>(this.baseUrl, dto);
  }

  update(id: number, dto: LivroUpsert): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, dto);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
