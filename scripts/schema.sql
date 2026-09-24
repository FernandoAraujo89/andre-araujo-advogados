-- Tabelas do site no Neon (Postgres). Cada uma guarda o objeto completo em
-- `data` (jsonb): os tipos de src/data/* (Post, TeamMember, LandingPage,
-- ContactMessage) continuam valendo sem mapear coluna por coluna.
-- Aplicado por `npm run db:setup` (scripts/db-setup.mjs); idempotente.

create table if not exists posts (
  slug        text primary key,
  data        jsonb not null,
  updated_at  timestamptz not null default now()
);

create table if not exists team_members (
  slug        text primary key,
  position    int  not null default 0,
  data        jsonb not null,
  updated_at  timestamptz not null default now()
);

create table if not exists landing_pages (
  slug        text primary key,
  data        jsonb not null,
  updated_at  timestamptz not null default now()
);

create table if not exists contact_messages (
  id          text primary key,
  data        jsonb not null,
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists contact_messages_created_idx on contact_messages (created_at desc);
