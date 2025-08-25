// src/app/services/generos.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Genero, GeneroUpsert } from '../models/genero';

@Injectable({ providedIn: 'root' })
export class GenerosService {
  private readonly apiRoot = `${environment.apiBase}/${environment.apiVersion}`;
  private readonly baseUrl = `${this.apiRoot}/generos`;

  constructor(private http: HttpClient) {}

  list(): Observable<Genero[]> {
    return this.http.get<Genero[]>(this.baseUrl);
  }

  create(dto: GeneroUpsert): Observable<Genero> {
    return this.http.post<Genero>(this.baseUrl, dto);
  }

  update(id: number, dto: GeneroUpsert): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, dto);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
