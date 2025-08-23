export interface Livro {
  id: number;
  titulo: string;
  autorId?: number | null;
  generoId?: number | null;
  ano?: number | null;

  // Campos opcionais retornados pela API (se houver projeções/joins)
  autorNome?: string | null;
  generoNome?: string | null;

  // Data de publicação em ISO (yyyy-MM-dd ou yyyy-MM-ddTHH:mm:ss)
  publicacao?: string | null;
}

export interface CreateLivro {
  titulo: string;
  autorId?: number | null;
  generoId?: number | null;
  ano?: number | null;
  publicacao?: string | null;
}
