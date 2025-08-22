import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Genero, CreateGenero } from '../models/genero';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GenerosService {
  private base = `${environment.api}/generos`;
  constructor(private http: HttpClient) {}
  list(): Observable<Genero[]> { return this.http.get<Genero[]>(this.base); }
  get(id: number): Observable<Genero> { return this.http.get<Genero>(`${this.base}/${id}`); }
  create(dto: CreateGenero): Observable<Genero> { return this.http.post<Genero>(this.base, dto); }
  update(id: number, dto: CreateGenero) { return this.http.put(`${this.base}/${id}`, dto); }
  delete(id: number) { return this.http.delete(`${this.base}/${id}`); }
}
