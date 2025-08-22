export interface Livro {
  id: number;
  titulo: string;
  autorId: number;
  autorNome: string;
  generoId: number;
  generoNome: string;
  publicacao: string;
}
export interface CreateLivro {
  titulo: string;
  autorId: number;
  generoId: number;
  publicacao: string;
}
