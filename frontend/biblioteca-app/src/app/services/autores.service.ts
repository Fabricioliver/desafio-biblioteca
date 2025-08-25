// src/app/services/autores.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Autor, AutorUpsert } from '../models/autor';

@Injectable({ providedIn: 'root' })
export class AutoresService {
  private readonly apiRoot = `${environment.apiBase}/${environment.apiVersion}`;
  private readonly baseUrl = `${this.apiRoot}/autores`;

  constructor(private http: HttpClient) {}

  list(): Observable<Autor[]> {
    return this.http.get<Autor[]>(this.baseUrl);
  }

  create(dto: AutorUpsert): Observable<Autor> {
    return this.http.post<Autor>(this.baseUrl, dto);
  }

  update(id: number, dto: AutorUpsert): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, dto);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
