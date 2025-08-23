import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Genero, CreateGenero } from '../models/genero';

@Injectable({ providedIn: 'root' })
export class GenerosService {
  private readonly base = `${environment.api}/generos`;
  constructor(private http: HttpClient) {}

  list(): Observable<Genero[]> { return this.http.get<Genero[]>(this.base); }
  get(id: number): Observable<Genero> { return this.http.get<Genero>(`${this.base}/${id}`); }
  create(dto: CreateGenero): Observable<Genero> { return this.http.post<Genero>(this.base, dto); }
  update(id: number, dto: CreateGenero): Observable<void> { return this.http.put<void>(`${this.base}/${id}`, dto); }
  remove(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/${id}`); }
  // alias compat com código que use delete():
  delete(id: number): Observable<void> { return this.remove(id); }
}
