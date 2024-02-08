# Polls

Este é um projeto de enquetes onde os usuários podem criar e votar em pesquisas.

## Funcionalidades

- Criação de enquetes
- Votação em enquetes
- Visualização dos resultados das enquetes em tempo real

## Instalação

1. Clone o repositório: `git clone https://github.com/caiobrian/polls.git`
2. Navegue até o diretório do projeto: `cd polls`
3. Instale as dependências: `npm install`

## Uso

1. Crie um arquivo `.env` na raiz do projeto com a seguinte variável de ambiente:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/polls?schema=public"
```
2. Inicie o docker para subir o Postgres e o Redis: `docker compose up -d`
3. Execute as migrações do banco de dados: `npx prisma migrate dev`
4. Inicie o servidor: `npm run dev`

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.

## Licença

Este projeto está licenciado sob a [MIT License](https://opensource.org/licenses/MIT).
