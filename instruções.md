BASE DO PROJETO
npm init
git init
new file plan.txt
npm i -D typescript tsx prisma @types/node @types/cors @types/express @types/jsonwebtoken @types/multer @types/slug && npm i express cors jsonwebtoken multer slug uuid zod body-parser bcryptjs

(se isto vai se um template resume-se a npm i)

new file .gitignore
-- .env
-- node_modules/
-- tmp/*
-- public/images/covers/*
new file .env
new folder tmp
new folders public/images/covers
new file .env.example (Colocar aqui tudo o que coloco no .env apenas para saber as variaveis de ambiente que tenho de colocar se colonar o projeto, nao colocar dados sensiveis, podem ser as variaveis vazias)
new folder src
new file src/server.ts
new folder src/routes
new folder libs
POSTMAN new collection project and test ping request

CRIAR API NO POSTMAN
criar environment variables
colocar todas as requisições que a API vai ter

PRISMA
npx prisma init
configurar variavel .env.example no .env ambiente: DATABASE_URL="postgresql://USERNAME_PG:PASSWORD_PG@localhost:5432/NOME_BD_PG?schema=public"
new file libs/prisma.ts
Fazer models de tabelas em prisma/schema.prisma
EX: model Post {
  id Int @id @default(autoincrement())
  slug String @unique
  authorId Int
  status PostStatus @default(DRAFT)
  title String
  body String
  createdAt DateTime @default(now())
  updatedAt DateTime @default(now())
  cover String
  tags String @default("")
  author User? @relation(fields: [authorId], references: [id])
}

model User {
  id Int @id @default(autoincrement())
  status Boolean @default(true)
  name String 
  email String @unique
  password String
  posts Post[]
}

enum PostStatus {
  PUBLISHED
  DRAFT
}

npx prisma migrate dev

criar rotas em src/routes
