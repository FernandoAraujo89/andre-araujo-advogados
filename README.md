# André Araújo Advogados — Site institucional

Novo site do escritório André Araújo Advogados (Formiga, MG), substituindo o
site em Wix. Visual editorial premium (referência: cadmus.io) adaptado ao
universo jurídico, com sobriedade conforme o Provimento 205/2021 da OAB.

**Stack:** Next.js 16 (App Router) · Tailwind CSS 4 · Framer Motion · lucide-react · TypeScript

## Como rodar

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de produção
npm start        # serve o build
```

## Estrutura de pastas

```
src/
  app/                       Rotas (App Router)
    page.tsx                 Home
    o-escritorio/            História, missão e valores
    areas-de-atuacao/        Índice + [slug] das 7 áreas
    equipe/                  Grid + [slug] dos 13 advogados
    blog/                    Listagem com filtro + [slug] dos posts
    servidores-publicos/     Hub + [slug] das 4 subpáginas de nicho
    faq/                     FAQ consolidado (schema FAQPage)
    contato/                 Formulário, canais e mapa
    politica-de-privacidade/
    not-found.tsx            404 customizada
    sitemap.ts / robots.ts   SEO
  components/                Header, Footer, Breadcrumbs, Button,
                             SectionHeading, AreaCard, TeamCard, PostCard,
                             FaqAccordion, WhatsAppFloat, ContactForm,
                             StatCounter, Reveal, PhotoPlaceholder...
  data/                      TODO O CONTEÚDO EDITÁVEL (ver abaixo)
  lib/                       seo.ts, jsonld.ts, redirects.ts
redirects/                   Arquivos de redirect por plataforma
```

## Onde trocar textos

Todo o conteúdo vive em `src/data/` — nenhum texto exige mexer em componente:

| Arquivo | Conteúdo |
|---|---|
| `site.ts` | Nome, telefones, e-mail, endereço, redes sociais, horário, números da barra de credibilidade |
| `areas.ts` | As 7 áreas de atuação (texto, listas, FAQ de cada área) |
| `team.ts` | Os 13 advogados (nome, OAB, bio, áreas) |
| `posts.ts` | Posts do blog — para migrar os 65 posts do site antigo, adicione objetos `Post` ao array |
| `servidores.ts` | Hub e as 4 páginas de servidores públicos |
| `faq.ts` | Perguntas gerais de atendimento (as demais vêm de areas/servidores) |

## Onde trocar fotos

Enquanto não há fotos reais, o componente `PhotoPlaceholder` reserva o espaço
com a proporção correta (CLS zero) e uma etiqueta dizendo qual foto entra ali.
Para trocar: coloque a foto em `public/images/` e substitua o
`<PhotoPlaceholder ...>` por `<Image>` do `next/image` com `fill` ou
`width/height`, mantendo a mesma proporção. Pontos com placeholder:

- Hero da home (`src/app/page.tsx`) — foto do escritório ou da equipe, 4:5
- O Escritório (`src/app/o-escritorio/page.tsx`) — fachada/recepção, 4:3
- Cards da equipe (`src/components/TeamCard.tsx`) — retratos padronizados 4:5
- Perfil do advogado (`src/app/equipe/[slug]/page.tsx`) — retrato 4:5
- Capas de posts (`src/components/PostCard.tsx`) — 16:10
- Logotipo real no Header e no Footer (hoje é um wordmark tipográfico)

## Formulário de contato

Validação client-side em português com máscara de celular, estados de
sucesso e erro. O envio é um **stub** em
`src/components/ContactForm.tsx` (função `submitContact`). Para ativar:

1. **API própria:** crie `src/app/api/contato/route.ts` com um `POST` que
   encaminhe por e-mail (Resend, SES) ou para o CRM, e faça `fetch` nela em
   `submitContact`. (Indisponível com export estático.)
2. **Serviço externo:** aponte `submitContact` para Formspree, Getform ou
   similar — funciona também no export estático.

## Redirects 301 (site antigo → novo)

Fonte única do mapa: `src/lib/redirects.ts` (URLs de origem mantidas
exatamente como no Wix, inclusive acentuadas).

- **Vercel / deploy com servidor (recomendado):** já funciona — o
  `next.config.ts` aplica os redirects no build. Nada a fazer.
- **Netlify / Cloudflare Pages (export estático):** ative `output: 'export'`
  no `next.config.ts` (e remova a função `redirects`, incompatível com
  export), depois copie `redirects/_redirects` para a pasta `out/` publicada
  (ou para `public/`).
- **Vercel com export estático:** copie `redirects/vercel.json` para a raiz
  como `vercel.json`.
- **Outros hosts (Apache/Nginx):** gere as regras a partir de
  `src/lib/redirects.ts` (RewriteRule/return 301), atentando para o
  URL-encoding das origens acentuadas.

Depois de publicar, valide com `curl -I https://dominio/direitotribut%C3%A1rio`
(deve responder `301` para `/areas-de-atuacao/direito-tributario`).

## SEO

- Metadata única por página (title ≤ 60, description ≤ 155, padrão "em Formiga, MG"), Open Graph e canonical via `src/lib/seo.ts`
- `sitemap.xml` e `robots.txt` gerados por `src/app/sitemap.ts` e `robots.ts`
- JSON-LD `LegalService` na home e no contato; `FAQPage` no FAQ (`src/lib/jsonld.ts`)

## Pendências (TODO) para o cliente

Buscar por `TODO` no código lista tudo. Resumo:

- Números de OAB de André e Sávio; dados completos (nome, OAB, bio, foto) dos outros 11 advogados
- Valores reais da barra de credibilidade: anos de atuação e casos acompanhados (`src/data/site.ts`)
- Horário de atendimento (`src/data/site.ts`)
- URLs exatas de Facebook, LinkedIn e YouTube
- Fotos reais (lista na seção acima) e logotipo em SVG
- História do escritório (ano de fundação, marcos) em `src/app/o-escritorio/page.tsx`
- Revisão da política de privacidade pelo escritório
- Coordenada geográfica exata do escritório no JSON-LD (`src/lib/jsonld.ts`)
- Integração real do formulário de contato
- Migração dos 65 posts do blog antigo para `src/data/posts.ts` (3 seeds usam títulos reais; datas marcadas com TODO)
