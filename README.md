#Desafio Biblioteca

Projeto foi desenvolvido como parte de um desafio técnico, com foco em boas práticas de desenvolvimento **.NET (C#)** e **Angular**.

---

#Tecnologias Utilizadas

- **Backend**: .NET 8 (C#) + Entity Framework Core + Swagger
- **Banco de Dados**: PostgreSQL
- **Frontend**: Angular (SPA) com SCSS
- **Infra**: Docker Compose para orquestração

---

#Regras de Negócio

- Um **gênero** pode possuir **N livros**  
- Um **autor** pode possuir **N livros**  
- Cada **livro** pertence a apenas **um autor** e **um gênero**  

---

#Estrutura do Projeto
desafio-biblioteca/
│── backend/ # API REST .NET
│ └── src/
│ ├── Biblioteca.Api/ # Camada de apresentação (Controllers, Swagger)
│ ├── Biblioteca.Application/ # Casos de uso, DTOs, ViewModels
│ ├── Biblioteca.Domain/ # Entidades e regras de negócio
│ └── Biblioteca.Infrastructure/ # Acesso a dados (EF Core, Migrations, Repositórios)
│
│── frontend/ # Aplicação Angular
│ └── biblioteca-app/ # SPA com routing e SCSS
│
│── docker-compose.yml # Orquestração de containers
│── README.md # Este arquivo
│── .gitignore