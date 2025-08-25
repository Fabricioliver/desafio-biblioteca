export interface Genero {
  id: number;
  nome: string;
  createdAt?: string;
  updatedAt?: string;
}

export type GeneroUpsert = {
  nome: string;
};

// Alias para manter compatibilidade com as pages
export type CreateGenero = GeneroUpsert;
