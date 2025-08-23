import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Autor, CreateAutor } from '../models/autor';

@Injectable({ providedIn: 'root' })
export class AutoresService {
  private readonly base = `${environment.api}/autores`;

  constructor(private http: HttpClient) {}

  list(): Observable<Autor[]> {
    return this.http.get<Autor[]>(this.base);
  }

  get(id: number): Observable<Autor> {
    return this.http.get<Autor>(`${this.base}/${id}`);
  }

  create(dto: CreateAutor): Observable<Autor> {
    return this.http.post<Autor>(this.base, dto);
  }

  update(id: number, dto: CreateAutor): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}`, dto);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  // Alias compatível com código antigo que chamava delete():
  delete(id: number): Observable<void> {
    return this.remove(id);
  }
}
