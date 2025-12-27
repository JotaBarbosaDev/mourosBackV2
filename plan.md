enum Sexo {
  MASCULINO
  FEMININO
  OUTRO
}
enum TipoSangue {
  ND
  A_POSITIVO
  A_NEGATIVO
  B_POSITIVO
  B_NEGATIVO
  AB_POSITIVO
  AB_NEGATIVO
  O_POSITIVO
  O_NEGATIVO
}

enum StatusSocio {
  ATIVO
  INATIVO
  SUSPENSO
  HONORARIO
}

enum DescriptionReserva {
  OLD_PARTNER
  NO_PAY
  EXPELLED
  EVENT
  HONOR
  CUSTOM
}

model Socio {
  id Int @id @default(autoincrement())
  nSocio Int @unique
  nomeCompleto String
  sexo Sexo 
  email String @unique
  password String
  telemovel String
  tipoSangue TipoSangue @default(ND)
  rua String
  nPorta String
  codigoPostal String
  freguesia String
  concelho String
  distrito String
  dataEntrada DateTime @default(now())
  dataNascimento DateTime?
  responsavel String
  updatedAt DateTime @updatedAt
  avatar String @default("public/images/avatares/default.jpeg")
  kitSocio Boolean @default(false)
  kitDate DateTime?
  grupoWhatsApp Boolean @default(false)
  grupoWhatsAppDate DateTime?
  status StatusSocio @default(ATIVO)

  motas Mota[]
  quotas Quota[]
}

model Mota {
  id Int @id @default(autoincrement())
  marca String
  modelo String
  celindrada Int
  matricula String @unique
  ano DateTime
  avatar String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  socios Socio[]
}

model Quota{
  id Int @id @default(autoincrement())
  nSocio Int
  ano Int
  data DateTime @default(now())
  valor Int 
  payedAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  socio Socio @relation(fields: [id], references: [id])
}

model Reserva {
  id Int @id @default(autoincrement())
  nSocio Int @unique
  descricao DescriptionReserva
  note String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  }


Endpoints

ADMIN
SOCIO
[✅] Criar Sócio 
  - Verifica se o email já existe
  - Procura o proximo numero disponivel tendo em conta numeros já ocupados e numeros reservados
  - Se algum socio deixar de o ser o numero não fica disponivel
  - Se passar o nSocio, tenta usar esse numero, se não estiver disponivel nao prossegue, o sócio pode não querer outro numero
  - ⚠️ Falta rules
[❌] Editar Sócio
[✅] Apagar Sócio 
  - Ao apagar um sócio, cria uma reserva com a descrição OLD_PARTNER se não passar nenhuma, se passar uma descrição, usa a descrição passada
[✅] Listar Sócios 
  - ❌ Permite filtrar por status (ATIVO, INATIVO, SUSPENSO, HONORARIO)
  - ⚠️ Falta paginação
[✅] Pegar Sócio pelo numero de sócio
[✅] Têm Role



TO DO
- Organizar funções nos services
- Organizar requisições no Postman
- Criar autenticação com rules
- Criar schemas das REQs em todos os controllers

MOTA
[❌] Criar Mota
[❌] Editar Mota
[❌] Apagar Mota
[❌] Listar Motas
[❌] Pegar Mota

QUOTA
[❌] Criar Quota
[❌] Editar Quota
[❌] Apagar Quota
[❌] Listar Quotas
[❌] Pegar Quota

RESERVA
[✅] Criar Reserva 
  - Verifica se já existe uma reserva para o nSocio, se existir, não cria outra
[❌] Editar Reserva
[✅] Apagar Reserva 
  - Permite apagar uma reserva, caso um sócio volte a ser ativo, o admin pode apagar a reserva para que o numero fique disponivel novamente
[✅] Listar Reservas 
[✅] Pegar Reserva pelo numero de sócio










EXEMPLOS DE REQUISIÇÕES E RESPOSTAS para a API acima
- GET /socios (Listagem dos socios)
-- Requisição:
--- Querystring: ?page=4
-- Resposta:
{
    posts: [
        { id, title, createdAt, cover, authorName, tags, slug }
    ],
    page: 1
}

- GET /posts/:slug (Um post específico)
-- Resposta:
{
    post: { id, title, createdAt, cover, authorName, tags, body, slug }
}

- GET /posts/:slug/related (Posts relacionados = tags similares)
-- Resposta:
{
    posts: [
        { id, title, createdAt, cover, authorName, tags, slug }
    ]
}

- POST /auth/signup (Cadastro)
-- Requisição:
--- Body: { name, email, password }
-- Resposta: 201
{
    user: { id, name, email }
    token: 'abc'
}

- POST /auth/signin (Login)
-- Requisição:
--- Body: { email, password }
-- Resposta:
{
    user: { id, name, email },
    token: 'abc'
}

- POST /auth/validate (Validar JWT)
-- Requisição:
--- Header Authorization: Bearer abc
-- Resposta:
{
    user: { id, name, email }
}

- GET /admin/posts (Pegar posts, incluindo drafts, com paginação)
-- Requisição:
--- Header Authorization: Bearer abc
--- Querystring: ?page=4
-- Resposta:
{
    posts: [
        { id, status, title, createdAt, cover, authorName, tags, slug }
    ],
    page: 1
}

- GET /admin/posts/:slug (Pegar um post)
-- Requisição:
--- Header Authorization: Bearer abc
-- Resposta:
{
    post: { id, title, createdAt, cover, authorName, tags, body, slug}
}

- POST /admin/posts (Inserir um novo post)
-- Requisição:
--- FormData multipart/form-data
--- Header Authorization: Bearer abc
--- Body: { status, title, tags, body, cover: FILE }
-- Resposta: 201
{
    post: { id, status, title, createdAt, cover, authorName, tags, slug }
}

- PUT /admin/posts/:slug (Editar um post)
-- Requisição:
--- FormData multipart/form-data
--- Header Authorization: Bearer abc
--- Body: { status, title, tags, body, cover: FILE }
-- Resposta:
{
    post: { id, status, title, createdAt, cover, authorName, tags, slug }
}

- DELETE /admin/posts/:slug (Deletar um post)
-- Requisição:
--- Header Authorization: Bearer abc
-- Resposta:
{
    error: null
}



-----------Casos de uso-----------

-Sócio


Direção
  ADMIN
    --- SÓCIO ---
    GET Ver Todos Sócios
    GET Ver Sócio por Numero de Sócio
    PUT Editar Sócio
    DELETE Apagar Sócio

    --- MOTA ---
    GET Ver Todas as Mota
    GET Ver Mota por ID
    GET Ver Motas de Sócio por Numero de Sócio
    GET Ver Soócios de Mota por ID da Mota
    PUT Editar Motas
    DELETE Apagar Motas

    --- EVENTO ---
    GET Todos os Eventos
    PUT Editar Eventos
    DELETE Apagar Cursos

  Presidente
  Secretário
  Tesoureiro
  Outro

Convidado
  Acesso à Landing Page
    Ver Motas
    Ver Eventos
      Inscrever nos eventos
    Ver Bar
      Pedir coisas no bar

