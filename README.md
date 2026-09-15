# André Araújo Advogados — Site institucional

Site do escritório André Araújo Advogados (sede em Formiga, MG, atendimento
em todo o Brasil), que substitui o site antigo em Wix. Visual editorial
(referência: cadmus.io) adaptado ao universo jurídico, com a sobriedade que o
Provimento 205/2021 da OAB exige.

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · Tailwind CSS 4 ·
Framer Motion · lucide-react · react-markdown · Vercel Blob · TypeScript

## Como rodar

```bash
npm install
npm run dev              # http://localhost:3000
npm run build            # build de produção
npm start                # serve o build
npm run lint             # ESLint
npm run redirects:export # regenera redirects/ a partir de src/lib/redirects.ts
```

### Variáveis de ambiente

Nenhuma é necessária para o site público. Elas servem ao painel `/admin`:

| Variável | Para quê |
|---|---|
| `ADMIN_PASSWORD` | Senha única do painel |
| `ADMIN_SESSION_SECRET` | Assina o cookie de sessão (qualquer string longa e aleatória, ex.: `openssl rand -base64 48`) |
| `BLOB_READ_WRITE_TOKEN` | Token do Vercel Blob, onde os posts e as imagens de capa ficam gravados |

Sem `ADMIN_PASSWORD` ou `ADMIN_SESSION_SECRET`, o painel fica fechado: o login
responde dizendo qual variável falta e nenhuma sessão é aceita. Só no
`next dev` existe um segredo de fallback. Sem `BLOB_READ_WRITE_TOKEN`, o blog
usa a semente de `src/data/posts.ts` e o painel entra em modo demonstração
(nada é salvo). Localmente, coloque as variáveis num `.env.local` (ignorado
pelo git).

## Estrutura de pastas

```
src/
  app/
    (site)/                Páginas públicas, todas com o mesmo chrome
      layout.tsx           Header + rodapé + botão do WhatsApp (SiteChrome)
      page.tsx             Home
      areas-de-atuacao/    Índice das áreas + [slug] das 9 áreas cíveis
      servidores-publicos/ Hub do Direito do Servidor Público + [slug] das 4 subpáginas
      o-escritorio/        História, missão, valores e galeria de fotos
      equipe/              Grid + [slug] dos advogados com perfil
      blog/                Listagem com filtro + [slug] dos posts (dinâmicos)
      faq/                 FAQ consolidado (schema FAQPage)
      contato/             Formulário, canais, endereço e mapa
      politica-de-privacidade/
    admin/                 Painel do blog (login, lista, novo, editar)
    api/admin/             Login/logout, CRUD de posts e upload de imagem
    layout.tsx             Raiz: fontes, metadata padrão
    not-found.tsx          404 customizada
    sitemap.ts / robots.ts SEO
  components/              Header, Footer, SiteChrome, AreaCard, TeamCard,
                           PostCard, GoogleReviews, StatCounter, Reveal,
                           ParallaxBackdrop, Photo, Markdown, ContactForm...
                           admin/: AdminHeader, PostEditor, DeletePostButton
  data/                    TODO O CONTEÚDO EDITÁVEL (ver abaixo)
  lib/                     blog.ts (Blob), auth.ts, admin-guard.ts, seo.ts,
                           jsonld.ts, redirects.ts
  proxy.ts                 Barreira de autenticação do /admin
scripts/export-redirects.mjs  Gera os arquivos de redirects/ a partir do mapa
redirects/                 Arquivos de redirect por plataforma (gerados)
```

## Navegação e áreas de atuação

O site tem um menu único, no padrão dos escritórios de advocacia: **Áreas de
Atuação** (submenu com todas as áreas), O Escritório, Equipe, Publicações e
Contato. A lista de áreas que o cliente vê está em `src/data/atuacao.ts`: as
9 áreas de `areas.ts` mais o Direito do Servidor Público, que tem hub e
subpáginas próprias em `/servidores-publicos`. Home, menu, rodapé e o índice
de áreas leem dessa lista.

## Onde trocar textos

Todo o conteúdo vive em `src/data/`; nenhum texto exige mexer em componente:

| Arquivo | Conteúdo |
|---|---|
| `site.ts` | Nome, telefones, e-mail, endereço (só aparece no Contato), redes sociais, horário, menu e barra de credibilidade da home |
| `atuacao.ts` | Ordem e lista das 10 áreas de atuação exibidas ao cliente |
| `areas.ts` | As 9 áreas cíveis (texto, listas, FAQ de cada área) |
| `servidores.ts` | Hub e as 4 subpáginas do Direito do Servidor Público |
| `team.ts` | Os 12 integrantes da equipe (nome, função, foto; OAB, bio e perfil só para advogados) |
| `reviews.ts` | Nota, quantidade e avaliações do Google exibidas na home |
| `posts.ts` | Tipos, categorias e a semente de 6 posts (o blog em produção vem do Blob, ver abaixo) |
| `faq.ts` | Perguntas gerais de atendimento (as demais vêm de areas/servidores) |

Os textos das páginas institucionais (home, O Escritório) ficam nos próprios
`page.tsx`, em constantes no topo do arquivo.

## Blog e painel /admin

O blog é publicado pelo escritório em `/admin` (o endereço não aparece em
lugar nenhum do site; é digitado). A senha é `ADMIN_PASSWORD`. O painel
lista, cria, edita e exclui posts, com corpo em Markdown, pré-visualização e
upload de imagem de capa (JPG, PNG, WebP ou AVIF até 8 MB).

Como funciona por baixo (`src/lib/blog.ts`): a fonte de verdade em produção
é um único JSON no Vercel Blob (`blog/posts.json`). Quando o Blob está vazio
ou sem token, entra a semente de `src/data/posts.ts`; a primeira gravação
migra a semente para o Blob. As páginas do blog, a home e o sitemap leem o
Blob a cada requisição, então publicar reflete na hora.

Segurança: sessão em cookie assinado (HMAC, 12 horas), checada no
`proxy.ts` e de novo em cada rota e página do painel. O login não limita
tentativas; a senha deve ser longa.

## Fotos

As fotos reais já estão no lugar: 12 fotos do escritório em
`public/images/escritorio/` (hero da home, seção O Escritório e galeria) e
retratos quadrados da equipe em `public/equipe/<slug>.jpg`. O componente
`Photo` (next/image com proporção fixa, CLS zero) é o padrão; as capas dos
posts semente vêm do Unsplash, com crédito. `PhotoPlaceholder` só entra
quando um integrante da equipe não tem foto.

## Formulário de contato

Validação client-side em português com máscara de celular, estados de
sucesso e erro. O envio ainda é um **stub** em
`src/components/ContactForm.tsx` (função `submitContact`): mostra
"Mensagem enviada", mas nada é enviado. Para ativar:

1. **API própria:** crie `src/app/api/contato/route.ts` com um `POST` que
   encaminhe por e-mail (Resend, SES) ou para o CRM, e faça `fetch` nela em
   `submitContact`.
2. **Serviço externo:** aponte `submitContact` para Formspree, Getform ou
   similar.

## Redirects 301 (site antigo → novo)

Fonte única do mapa: `src/lib/redirects.ts` (URLs de origem mantidas
exatamente como no Wix, inclusive acentuadas). Cobre as páginas e os 65
posts `/post/...` do blog antigo, com um curinga final `/post/*` → `/blog`.
Depois de alterar o mapa, rode `npm run redirects:export` para regenerar os
arquivos em `redirects/`.

- **Vercel (deploy atual):** já funciona; o `next.config.ts` aplica os
  redirects no build. Nada a fazer.
- **Netlify / Cloudflare Pages:** use `redirects/_redirects`.
- **Vercel com export estático:** use `redirects/vercel.json` como
  `vercel.json` na raiz.

Atenção: o painel `/admin` e o blog dinâmico dependem de servidor (rotas de
API e Blob), então o export estático (`output: 'export'`) só é viável se o
painel for abandonado.

Depois de apontar o domínio, valide com
`curl -I https://www.andrearaujoadvogados.com.br/direitotribut%C3%A1rio`
(deve responder `301` para `/areas-de-atuacao/direito-tributario`).

## SEO

- Metadata única por página (title ≤ 60, description ≤ 155), Open Graph e
  canonical via `src/lib/seo.ts`
- `sitemap.xml` (inclui os posts do Blob) e `robots.txt` (bloqueia `/admin` e
  `/api`) gerados por `src/app/sitemap.ts` e `robots.ts`
- JSON-LD `LegalService` na home e no contato, `BlogPosting` nos posts e
  `FAQPage` no FAQ (`src/lib/jsonld.ts`)

## Deploy

O site roda no Vercel (projeto `site-andre-araujo`, time
`fernando89-projects`). **O Vercel não está ligado ao GitHub:** um `git push`
não publica nada. Para publicar, com o CLI autenticado:

```bash
vercel --prod
```

As três variáveis de ambiente estão definidas no ambiente Production do
Vercel. Enquanto o domínio `andrearaujoadvogados.com.br` não for apontado
para o Vercel, o site novo responde só em `site-andre-araujo.vercel.app` e o
domínio continua servido pelo Wix.

## Pendências (TODO) para o cliente

Buscar por `TODO` no código lista tudo. Resumo:

- Número real de casos acompanhados na barra de credibilidade (hoje "1.000+",
  placeholder) em `src/data/site.ts`
- Número de OAB e bio da Jade e da Débora em `src/data/team.ts`
- Horário de atendimento (`src/data/site.ts`)
- URLs exatas de Facebook, LinkedIn e YouTube
- Registro da sociedade na OAB/MG (rodapé)
- Marcos da história do escritório em `src/app/(site)/o-escritorio/page.tsx`
- Revisão da política de privacidade pelo escritório
- Coordenada exata do escritório no JSON-LD (`src/lib/jsonld.ts`)
- Integração real do formulário de contato
- Migração dos 65 posts do blog antigo (hoje têm redirect; podem ser
  republicados pelo painel `/admin`)
