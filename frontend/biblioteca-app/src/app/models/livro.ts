export interface Livro {
  id: number;
  titulo: string;
  autorId: number;
  generoId: number;
  publicacao?: string | null;
  autorNome?: string;
  generoNome?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type LivroUpsert = {
  titulo: string;
  autorId: number;
  generoId: number;
  publicacao?: string | null;
};

export type CreateLivro = LivroUpsert;
