// src/app/models/autor.ts
export interface Autor {
  id: number;
  nome: string;
  dataNascimento?: string | null;
  nacionalidade?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// payload para criar/atualizar
export type AutorUpsert = {
  nome: string;
  dataNascimento?: string | null;
  nacionalidade?: string | null;
};
