# André Araújo Advogados — Site institucional

Site do escritório André Araújo Advogados (sede em Formiga, MG, atendimento
em todo o Brasil), que substitui o site antigo em Wix. Visual editorial
(referência: cadmus.io; tipografia e espaços vazios inspirados em
august-debouzy.com) adaptado ao universo jurídico, com a sobriedade que o
Provimento 205/2021 da OAB exige.

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · Tailwind CSS 4 ·
Framer Motion · lucide-react · react-markdown · Neon (Postgres, também para
as imagens do painel) · TypeScript

## Como rodar

```bash
npm install
npm run dev              # http://localhost:3000
npm run build            # build de produção
npm start                # serve o build
npm run lint             # ESLint
npm run db:setup         # cria as tabelas no Neon (scripts/schema.sql)
npm run redirects:export # regenera redirects/ a partir de src/lib/redirects.ts
```

### Variáveis de ambiente

Nenhuma é necessária para o site público. Elas servem ao painel `/admin`:

| Variável | Para quê |
|---|---|
| `ADMIN_PASSWORD` | Senha única do painel |
| `ADMIN_SESSION_SECRET` | Assina o cookie de sessão (qualquer string longa e aleatória, ex.: `openssl rand -base64 48`) |
| `DATABASE_URL` | Conexão com o Neon (Postgres): posts, equipe, landing pages, mensagens do formulário e as imagens enviadas pelo painel. Criada pelo Vercel ao conectar o Neon ao projeto (Storage → Connect Project) |
| `SES_ACCESS_KEY_ID` + `SES_SECRET_ACCESS_KEY` | Aviso por e-mail pelo Amazon SES, com chaves de um usuário IAM restrito a `ses:SendEmail` (ver abaixo) |
| `SES_ROLE_ARN` | Alternativa às chaves: ARN de uma role assumida via OIDC do Vercel, sem segredo fixo |
| `SES_REGION` | Opcional. Região do SES (padrão `us-east-2`, onde `mail.andrearaujoadvogados.com.br` está verificado) |
| `RESEND_API_KEY` | Alternativa ao SES: chave do Resend |
| `CONTACT_EMAIL_TO` | Opcional. Destinatário do aviso (padrão: contato@andrearaujoadvogados.com.br) |
| `CONTACT_EMAIL_FROM` | Opcional. Remetente do aviso. Padrão no SES: `André Araújo Advogados <site@mail.andrearaujoadvogados.com.br>`; precisa ser uma identidade verificada |

Sem `ADMIN_PASSWORD` ou `ADMIN_SESSION_SECRET`, o painel fica fechado: o login
responde dizendo qual variável falta e nenhuma sessão é aceita. Só no
`next dev` existe um segredo de fallback. Sem `DATABASE_URL`, o blog e a
equipe usam as sementes de `src/data/*` e o painel entra em modo demonstração
(nada é salvo). Localmente, `vercel env pull .env.local` traz as variáveis
(o arquivo é ignorado pelo git).

## Banco de dados (Neon)

Posts, equipe, landing pages, mensagens do formulário e as imagens enviadas
pelo painel ficam no Neon (Postgres), no plano gratuito, que não cobra por
operação. O projeto usava o Vercel Blob, que saiu em 24/10/2026 depois de a
cota do plano Hobby estourar; o conteúdo antigo já tinha sido migrado.

- **Tabelas** (`scripts/schema.sql`): `posts`, `team_members`,
  `landing_pages`, `contact_messages` e `images`. Cada linha guarda o objeto inteiro em
  `data` (jsonb), então os tipos de `src/data/*` continuam valendo sem mapear
  coluna por coluna; `team_members.position` é a ordem do site.
- **Camada de dados** em `src/lib/{blog,equipe,landing,contato}.ts`, com
  `src/lib/db.ts` (driver HTTP `@neondatabase/serverless`, uma requisição por
  query). Escritas são uma linha por vez (upsert/delete por slug). Na
  primeira escrita com a tabela vazia, a semente é gravada antes, para não
  sumir.
- **Visitas não consultam o banco.** As leituras públicas passam por
  `unstable_cache` com as tags `posts`, `equipe` e `landing`, e as páginas do
  blog e da equipe são estáticas (`generateStaticParams` + `dynamicParams`).
  Salvar no painel chama `revalidateTag(tag, { expire: 0 })` e os
  `revalidatePath` (`src/app/api/admin/**/_validate.ts`), então a próxima
  visita já lê o banco. Há ainda uma regeneração diária de segurança.
- **Alterou o banco por fora** (SQL direto com o site no ar)? O cache não
  sabe: salve qualquer item no painel ou publique de novo.

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
    admin/                 Painel: login, posts (lista, novo, editar) e mensagens
    api/admin/             Login/logout, CRUD de posts, upload e exclusão de mensagens
    api/contato/           Recebe o formulário de contato (público)
    layout.tsx             Raiz: fontes, metadata padrão
    not-found.tsx          404 customizada
    sitemap.ts / robots.ts SEO
  components/              Header, Footer, SiteChrome, AreaCard, TeamCard,
                           PostCard, GoogleReviews, StatCounter, Reveal,
                           ParallaxBackdrop, Photo, Markdown, ContactForm...
                           admin/: AdminHeader, PostEditor, DeletePostButton,
                           DeleteMessageButton
  data/                    TODO O CONTEÚDO EDITÁVEL (ver abaixo)
  lib/                     db.ts, blog.ts, equipe.ts, landing.ts, contato.ts,
                           imagens.ts (Neon), auth.ts, admin-guard.ts, seo.ts,
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
| `area-images.ts` | Foto de cada área exibida no card (slug → arquivo em `public/images/areas/`) |
| `servidores.ts` | Hub e as 4 subpáginas do Direito do Servidor Público |
| `team.ts` | Semente da equipe (nome, cargo, setor, ramal, foto; OAB, bio e perfil próprio para advogados). A partir da primeira alteração em /admin → Equipe, vale o que está no banco |
| `reviews.ts` | Nota, quantidade e avaliações do Google exibidas na home |
| `posts.ts` | Tipos, categorias e a semente de 6 posts (o blog em produção vem do banco, ver acima) |
| `faq.ts` | Perguntas gerais de atendimento (as demais vêm de areas/servidores) |

Os textos das páginas institucionais (home, O Escritório) ficam nos próprios
`page.tsx`, em constantes no topo do arquivo.

## Blog e painel /admin

O blog é publicado pelo escritório em `/admin` (o endereço não aparece em
lugar nenhum do site; é digitado). A senha é `ADMIN_PASSWORD`. O painel
lista as mensagens do formulário de contato e lista, cria, edita e exclui posts, com corpo em Markdown, pré-visualização e
upload de imagem de capa (JPG, PNG, WebP ou AVIF até 8 MB).

Como funciona por baixo (`src/lib/blog.ts`): a fonte de verdade em produção
é a tabela `posts` no Neon. Sem `DATABASE_URL` ou com a tabela vazia, entra
a semente de `src/data/posts.ts`; a primeira gravação migra a semente para o
banco. As páginas do blog, a home e o sitemap leem um cache que publicar,
editar ou excluir revalida na hora (ver "Banco de dados").

Segurança: sessão em cookie assinado (HMAC, 12 horas), checada no
`proxy.ts` e de novo em cada rota e página do painel. O login não limita
tentativas; a senha deve ser longa.

## Landing pages de campanha

O escritório cria páginas de campanha (tráfego pago) em `/admin/landing`,
sem mexer em código, num editor visual: a página aparece como no site e
cada elemento é editado no lugar. Textos: clique e digite. Imagens: clique
(ou arraste o arquivo por cima) e troque no painel lateral. Botões: texto no
lugar, destino no painel (WhatsApp com a mensagem da página, formulário da
página ou outro endereço). Cada seção tem uma barra para subir, descer,
ocultar, duplicar e excluir, e "Adicionar seção" aparece entre elas. Há
desfazer e refazer (⌘Z / ⇧⌘Z), salvar com ⌘S e prévia de computador e de
celular.

O layout é o do arquivo do Figma "Landing page" no sistema visual do site:
topo escuro com imagem recortada e louros, cards com foto em carrossel,
números, faixa de destaque com foto, depoimentos (as avaliações do Google),
equipe (escolhida no painel), publicações do blog (automáticas, por
categoria) e galeria. Além dos blocos do Figma, há perguntas frequentes (com
schema FAQPage) e o formulário de contato já marcado com o nome da página; as
mensagens desse formulário chegam ao painel com a origem (slug da página).

Ao criar uma página, o escritório escolhe um modelo
(`src/data/landing-modelos.ts`): o padrão, com textos de exemplo, ou
"Férias-prêmio de aposentados", pronto para revisar e publicar. As imagens
do template ficam em `public/images/landing/` (as do modelo de férias-prêmio
foram geradas no Magnific e otimizadas em WebP).

- Publicadas, entram em `/areas-de-atuacao/<slug>` e na lista de áreas
  (dropdown do menu, sanfona no celular, índice de áreas, rodapé e sitemap),
  depois das 10 áreas fixas. A home mantém só as fixas.
- Rascunhos ficam fora do ar; a pré-visualização com o chrome do site fica em
  `/admin/preview/<slug>` (só logado).
- Dados na tabela `landing_pages` do Neon (`src/lib/landing.ts`): rascunhos
  não têm URL pública. As imagens enviadas pelo editor também vão para o
  banco e são servidas por `/imagens/<id>`. Páginas no formato anterior ao
  layout do Figma são convertidas na leitura.
- Em `next dev` sem `DATABASE_URL`, as páginas ficam em
  `.data/landing-pages.json` (fora do git), para testar o editor localmente.
  Para entrar no painel local, defina `ADMIN_PASSWORD` no `.env.local`.
- Tipos, conteúdo inicial e conversão em `src/data/landing.ts`; a página em
  `src/components/landing/LandingPageView.tsx`, que serve ao site e ao
  editor (o editor troca as peças estáticas de `kit.tsx` pelas editáveis de
  `src/components/admin/landing-editor/`). As medidas usam consultas de
  contêiner, por isso a prévia de celular do editor é fiel. Slugs das áreas
  fixas e das rotas do site são reservados.
- Salvar revalida a própria página e o layout raiz (o menu está em todas as
  páginas).

## Google Ads (tag e conversões)

A tag do Google Ads (`gtag.js`, conta `AW-17574475028`) entra em todas as
páginas públicas pelo layout raiz (`src/components/GoogleAds.tsx`), inclusive
na 404; o painel `/admin` fica de fora. O ID e os rótulos das conversões estão
em `src/data/google-ads.ts`, e todo disparo passa por `src/lib/gtag.ts`, que
enfileira os comandos em `window.dataLayer` como a tag oficial faz.

| Conversão | Quando dispara | Onde |
|---|---|---|
| Visualização de página | A cada página vista, inclusive nas navegações dentro do site, que não recarregam a página. Rótulo próprio nas landing pages de Progressão e de Férias-prêmio; geral nas demais | `GoogleAds.tsx` |
| Lead | Quando o formulário de contato é enviado e a API confirma. Rótulo próprio nas duas landing pages (pela `origem` do formulário, que é o slug da página); geral nos demais formulários | `ContactForm.tsx` |
| Contato WhatsApp | Clique em qualquer link que abre o WhatsApp (cabeçalho, rodapé, botão flutuante, páginas e landing pages), por delegação no documento, sem marcar botão por botão | `GoogleAds.tsx` |

- As landing pages são reconhecidas pelo slug em `/areas-de-atuacao/<slug>`
  (`campaigns` em `src/data/google-ads.ts`). **Se o endereço de uma delas
  mudar no painel, atualize o slug ali**; até lá, a página conta como geral.
- Em `next dev` o script do Google não é carregado, para os testes não
  virarem visitas e conversões reais; os comandos ficam em `window.dataLayer`
  e dá para conferir no console. Em produção o script carrega e processa a
  fila, inclusive o que foi disparado antes de ele terminar de carregar.
- Para conferir no ar: DevTools → Rede, filtrando por
  `googleads.g.doubleclick.net` (cada conversão gera uma requisição com o
  rótulo em `label=`), ou a extensão Google Tag Assistant.

## Equipe (/admin → Equipe)

A página /equipe é gerenciada pelo escritório, com CRUD completo: incluir,
editar, remover e reordenar (setas ↑ ↓ na lista). Mesmo desenho do blog e das
landing pages — tabela `team_members` no Neon (`src/lib/equipe.ts`), com
`src/data/team.ts` de semente enquanto ninguém salvar nada.

- **Setor** (Cível, Escala, Controladoria…) agrupa as pessoas na página
  pública. Quem fica sem setor aparece no fim, sem título de grupo.
- **Ramal** é dado interno: aparece só na lista do painel, **nunca no site**.
- **Página própria** (`/equipe/<slug>`) exige minibiografia — o painel recusa
  publicar um perfil vazio. As áreas marcadas viram links na página do perfil.
- Sem foto, o card mostra as iniciais (`PhotoPlaceholder`); a foto enviada
  vai para o banco, como as demais imagens do painel.
- A ordem da lista no painel é a ordem do site.

Quem tinha perfil publicado e sai da equipe deixa uma URL órfã: acrescente uma
regra em `perfisAposentados`, em `src/lib/redirects.ts`, para o link antigo
cair em /equipe em vez de 404.

## Fotos

As fotos reais já estão no lugar: 12 fotos do escritório em
`public/images/escritorio/` (hero da home, seção O Escritório e galeria) e
retratos quadrados da equipe em `public/equipe/<slug>.jpg`. O componente
`Photo` (next/image com proporção fixa, CLS zero) é o padrão; as capas dos
posts semente vêm do Unsplash, com crédito. `PhotoPlaceholder` só entra
quando um integrante da equipe não tem foto.

### Upload pelo painel

O upload (`src/app/api/admin/upload/route.ts`) recebe capas de posts, fotos
da equipe e imagens das landing pages:

- **No navegador**, antes de enviar, a foto é reduzida a 1600px no maior
  lado e recomprimida (`src/lib/imagem-cliente.ts`): foto de celular de 6 MB
  vira algumas centenas de KB, e as funções da Vercel recusam requisições
  acima de 4,5 MB.
- **No servidor**, o `sharp` corrige a orientação, limita a 1600px de novo e
  grava em WebP (`src/lib/imagens.ts`).
- **Destino:** a tabela `images` do Neon. A imagem é servida por
  `/imagens/<id>` (`src/app/imagens/[id]/route.ts`) com cache de um ano, no
  navegador e na borda da Vercel, e o `next/image` gera os tamanhos a partir
  dali. Sem `DATABASE_URL`, o upload responde com erro claro e o editor
  aceita colar a URL de uma imagem.

Cada uma das 10 áreas tem uma foto própria em `public/images/areas/<slug>.webp`
(1200x800, imagens autorais geradas para o site: cena silenciosa de objetos e
ambientes, luz natural quente, sem pessoas nem texto). No card elas aparecem em
monocromático quente e só ganham cor no hover — o mapa slug → arquivo está em
`src/data/area-images.ts`, e área sem entrada ali (landing page do /admin) fica
com o card sem foto.

## Tipografia

Linguagem da referência august-debouzy.com: títulos grandes em sans no peso
regular, com tracking negativo; palavras-chave em serifa itálica; muito
espaço em branco entre as seções.

- **Fontes:** Instrument Sans (texto e títulos) + Instrument Serif itálico
  (acentos), carregadas em `src/app/layout.tsx` via `next/font/google`
  (auto-hospedadas, licença OFL). São os equivalentes livres mais próximos
  das fontes da referência, Akzidenz-Grotesk e Ivyora Display, que são
  comerciais.
- **Escala:** tokens `text-display` (h1), `text-heading` (h2 de seção),
  `text-title` e `text-card` em `src/app/globals.css`. Cada token já traz
  tamanho, entrelinha e tracking.
- **Acento em itálico:** envolva o trecho em `<em>` dentro do título, por
  exemplo `<SectionHeading title={<>Quem conduz <em>o seu caso</em></>} />`.
  O estilo vem do `globals.css`.
- **Usar as fontes originais:** depois de licenciar Akzidenz-Grotesk
  (Berthold) e Ivyora Display (Ivy Foundry, disponível no Adobe Fonts),
  aponte os tokens `--font-sans` e `--font-serif` do `globals.css` para elas.

## Formulário de contato

Validação client-side em português com máscara de celular, e-mail opcional,
estados de sucesso e erro e um campo oculto anti-spam (honeypot + tempo
mínimo de preenchimento). O envio vai para `src/app/api/contato/route.ts`,
que:

1. grava a mensagem na tabela `contact_messages` do Neon (uma linha por
   envio) e a exibe na aba **Mensagens** do painel `/admin`, com links de
   WhatsApp, telefone e e-mail e botão de excluir;
2. avisa o escritório por e-mail, pelo Amazon SES (variáveis `SES_*`) ou,
   na falta dele, pelo Resend (`RESEND_API_KEY`); tudo em `src/lib/contato.ts`.

Basta um dos dois dar certo para o visitante ver "Mensagem enviada". Sem
banco nem e-mail (dev local), a mensagem é registrada no console.

### Aviso por e-mail pelo Amazon SES

O SES é o mesmo do sistema de campanhas do escritório (projeto
`andre_campanhas_home`): região `us-east-2`, identidade de domínio
`mail.andrearaujoadvogados.com.br` com DKIM verificado. O aviso sai de
`site@mail.andrearaujoadvogados.com.br`, sem Configuration Set, para não
entrar nas métricas nem no rastreamento de links das campanhas.

1. **Credencial.** Crie um usuário IAM só para o site (ex.: `site-contato`),
   sem acesso ao console, com a política abaixo, e gere uma chave de acesso.
   Troque `<CONTA>` pelo ID da conta que hospeda a identidade.

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [{
       "Effect": "Allow",
       "Action": ["ses:SendEmail"],
       "Resource": ["arn:aws:ses:us-east-2:<CONTA>:identity/*"]
     }]
   }
   ```

   `identity/*` em vez de só o domínio: enquanto a conta estiver em sandbox,
   o SES também autoriza a identidade do **destinatário**, e uma política
   restrita ao remetente falha com `AccessDenied` apontando o destinatário.

   Sem chave fixa: crie no IAM um provedor OIDC para o Vercel
   (`https://oidc.vercel.com/<time>`, audience `https://vercel.com/<time>`),
   uma role com a mesma política e confiança nesse provedor, e defina
   `SES_ROLE_ARN` em vez das chaves.

2. **Sandbox.** Enquanto a AWS não liberar produção para a conta, o SES só
   entrega a identidades verificadas: verifique
   `contato@andrearaujoadvogados.com.br` como identidade de e-mail em
   `us-east-2` (o escritório recebe um link de confirmação). Depois da
   liberação, isso deixa de ser necessário.

3. Defina `SES_ACCESS_KEY_ID` e `SES_SECRET_ACCESS_KEY` (ou `SES_ROLE_ARN`)
   no ambiente Production do Vercel e publique de novo. O painel
   `/admin/mensagens` deixa de mostrar o aviso de "e-mail desativado".

Estado atual (setembro de 2026): configurado pelo caminho OIDC. Provedor
`oidc.vercel.com/fernando89-projects` e role `site-andre-araujo-ses-contato`
(só `ses:SendEmail`) na conta que hospeda a identidade; `SES_ROLE_ARN` em
Production. A conta SES tem acesso de produção, então o passo 2 não se
aplica. Testado: o aviso chegou em contato@andrearaujoadvogados.com.br.

Alternativa sem AWS: conta no resend.com, domínio verificado lá e
`RESEND_API_KEY`.

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

Atenção: o painel `/admin` e as landing pages dependem de servidor (rotas de
API e banco), então o export estático (`output: 'export'`) só é viável se o
painel for abandonado.

Depois de apontar o domínio, valide com
`curl -I https://www.andrearaujoadvogados.com.br/direitotribut%C3%A1rio`
(deve responder `301` para `/areas-de-atuacao/direito-tributario`).

## SEO

- Metadata única por página (title ≤ 60, description ≤ 155), Open Graph e
  canonical via `src/lib/seo.ts`
- `sitemap.xml` (inclui posts, perfis e landing pages do banco) e `robots.txt` (bloqueia `/admin` e
  `/api`) gerados por `src/app/sitemap.ts` e `robots.ts`
- JSON-LD `LegalService` na home e no contato, `BlogPosting` nos posts e
  `FAQPage` no FAQ (`src/lib/jsonld.ts`)

## Deploy

O site roda no Vercel (projeto `site-andre-araujo`, time
`fernando89-projects`). **Desde 24/10/2026 o Vercel está ligado ao GitHub:**
cada `git push` na `main` publica o site em produção, e outros branches geram
deploys de pré-visualização. Teste localmente (`npm run lint` e
`npm run build`) antes de enviar para a `main`.

Também dá para publicar pelo CLI, com ele autenticado:

```bash
vercel --prod --force
```

O `--force` publica sem o cache de build do deploy anterior. Sem ele, o
build restaurou um CSS compilado antigo (em 15/09/2026 o site foi ao ar com o
HTML novo e os tokens de fonte do tema anterior). Se algum estilo parecer
desatualizado no ar, é essa a primeira coisa a conferir; no painel do Vercel,
"Redeploy" sem "Use existing Build Cache" faz o mesmo.

As variáveis de ambiente estão definidas no ambiente Production do Vercel
(`vercel env ls production` lista os nomes). O build gera as páginas do blog
e da equipe a partir do banco, então precisa de `DATABASE_URL`.

Na primeira publicação com o Neon (ou num banco novo), antes do deploy:

```bash
vercel env pull .env.local   # traz DATABASE_URL para a máquina
npm run db:setup             # cria as tabelas
npm run build                # confere localmente
vercel --prod --force
```

Depois, no painel: crie e edite um integrante, crie um post e envie uma
mensagem pelo formulário; confira se o site público atualiza ao salvar.

## Domínio e DNS

Desde 22/09/2026 o site responde em `https://www.andrearaujoadvogados.com.br`
(o Wix saiu do caminho). O apex redireciona 308 para o `www`, que é a URL
canônica do código (`site.url` em `src/data/site.ts`).

**A zona DNS fica na HostGator** (`ns728`/`ns729.hostgator.com.br`), não no
Registro.br nem no Vercel — o Registro.br guarda só a delegação. Editor de
Zona do cPanel:

| Registro | Valor | Para quê |
|---|---|---|
| `@` A | `216.198.79.1` e `64.29.17.1` | site (Vercel) |
| `www` CNAME | `99971f92bd8e2cff.vercel-dns-017.com.` | site (Vercel, valor específico deste projeto) |
| `MX` | `0 mail.andrearaujoadvogados.com.br` | **e-mail do escritório (HostGator)** |
| `mail`, `webmail`, `cpanel`, `autodiscover` A | `108.179.193.163` | e-mail e painel (HostGator) |
| `TXT` | `v=spf1 a mx include:websitewelcome.com ~all` | autenticação de envio |
| `campanhas` CNAME | CloudFront | painel de campanhas (outro projeto, AWS) |

**Nunca apontar os nameservers para o Vercel.** Isso substitui a zona inteira
e derruba junto o e-mail do escritório, o webmail e o subdomínio de campanhas.
Mudança de hospedagem do site se faz trocando só os registros `@` e `www`.

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
- Migração dos 65 posts do blog antigo (hoje têm redirect; podem ser
  republicados pelo painel `/admin`)
