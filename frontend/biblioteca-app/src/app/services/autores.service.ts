import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Autor, CreateAutor } from '../models/autor';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AutoresService {
  private base = `${environment.api}/autores`;
  constructor(private http: HttpClient) {}

  list(): Observable<Autor[]> { return this.http.get<Autor[]>(this.base); }
  get(id: number): Observable<Autor> { return this.http.get<Autor>(`${this.base}/${id}`); }
  create(dto: CreateAutor): Observable<Autor> { return this.http.post<Autor>(this.base, dto); }
  update(id: number, dto: CreateAutor) { return this.http.put(`${this.base}/${id}`, dto); }
  remove(id: number) { return this.http.delete(`${this.base}/${id}`); }
  // alias pra compatibilidade com código antigo:
  delete(id: number) { return this.remove(id); }
}
