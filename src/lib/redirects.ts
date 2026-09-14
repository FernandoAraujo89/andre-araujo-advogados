/**
 * Mapa de redirecionamentos 301 das URLs do site antigo (Wix) para o novo.
 *
 * As URLs de origem são mantidas EXATAMENTE como existem hoje, inclusive as
 * acentuadas e as com erro de digitação — é assim que estão indexadas.
 *
 * Este mapa é a fonte única: alimenta o next.config.ts (deploy com servidor,
 * ex.: Vercel) e, via `npm run redirects:export`, os arquivos de exemplo em
 * redirects/ para outros hosts. Instruções de aplicação por plataforma no
 * README, seção "Redirects 301".
 */

type Redirect = { source: string; destination: string };

/** Páginas do site antigo (pages-sitemap.xml do Wix). */
const legacyPages: Redirect[] = [
  { source: "/direitocondominal", destination: "/areas-de-atuacao/direito-condominial" },
  { source: "/direitodoconsumidor", destination: "/areas-de-atuacao/direito-do-consumidor" },
  { source: "/direitoimobiliário", destination: "/areas-de-atuacao/direito-imobiliario" },
  { source: "/direitotributário", destination: "/areas-de-atuacao/direito-tributario" },
  { source: "/direitoempresarial", destination: "/areas-de-atuacao/direito-empresarial" },
  { source: "/direito-trabalhista", destination: "/areas-de-atuacao/direito-trabalhista" },
  { source: "/recuperaçãodecrédito", destination: "/areas-de-atuacao/recuperacao-de-credito" },
  { source: "/institucional", destination: "/o-escritorio" },
  { source: "/escritorio", destination: "/o-escritorio" },
  { source: "/profissionais", destination: "/equipe" },
  { source: "/noticias", destination: "/blog" },
  { source: "/andrearaujo", destination: "/equipe/andre-augusto-de-araujo" },
  // Sávio deixou o escritório — a URL antiga cai na página geral da equipe
  { source: "/saviooliveira", destination: "/equipe" },
  { source: "/lp", destination: "/servidores-publicos/ferias-premio" },
  { source: "/copy-of-lp", destination: "/servidores-publicos/progressao-e-promocao" },
  { source: "/cópia-policial-penal-do-estado-de-mi", destination: "/servidores-publicos/adicional-noturno" },
  { source: "/policialpenalminasgerais", destination: "/servidores-publicos/adicional-noturno" },
  { source: "/valetransporte", destination: "/servidores-publicos/vale-transporte" },
  // Landing de servidão administrativa: o post de desapropriação cobre o tema
  { source: "/servidaoadministrativa", destination: "/blog/desapropriacao" },
  // Página de "obrigado" do formulário antigo
  { source: "/agradecimento", destination: "/contato" },
];

const IMOBILIARIO = "/areas-de-atuacao/direito-imobiliario";
const EMPRESARIAL = "/areas-de-atuacao/direito-empresarial";
const CONSUMIDOR = "/areas-de-atuacao/direito-do-consumidor";
const TRIBUTARIO = "/areas-de-atuacao/direito-tributario";
const CONDOMINIAL = "/areas-de-atuacao/direito-condominial";
const CREDITO = "/areas-de-atuacao/recuperacao-de-credito";
const LOCACAO_COMERCIAL = "/blog/locacao-comercial-direitos-do-lojista";
const REVISAO_CONTRATUAL = "/blog/a-importancia-da-revisao-contratual";
const DESAPROPRIACAO = "/blog/desapropriacao";

/**
 * Posts do blog antigo: as 65 URLs /post/... do blog-posts-sitemap.xml do
 * Wix em 14/09/2026. Os três artigos migrados apontam para o post novo; os
 * demais, para a página do mesmo assunto (post novo, área de atuação,
 * servidor público ou O Escritório), que é o equivalente mais próximo — vale
 * mais para o leitor e para o Google do que cair na listagem geral. Só o que
 * não tem assunto no site novo vai para /blog.
 */
const legacyPosts: Redirect[] = [
  // Migrados para o blog novo
  { source: "/post/desapropriação", destination: DESAPROPRIACAO },
  { source: "/post/a-importância-da-revisão-contratual", destination: REVISAO_CONTRATUAL },
  { source: "/post/cancelamento-de-pacotes-de-viagem-descubra-seus-direitos", destination: "/blog/cancelamento-de-pacotes-de-viagem" },

  // Mesmo assunto de um post novo
  { source: "/post/a-requisição-adminsitrativa-e-o-direito-à-justa-indenização", destination: DESAPROPRIACAO },
  { source: "/post/da-possibilidade-de-revisão-de-contrato-de-aluguel-comercial-em-razão-da-pandemia-de-covid-19", destination: LOCACAO_COMERCIAL },
  { source: "/post/possibilidade-de-renovação-compulsória-de-contrato-de-locação-de-imóvel-comercial", destination: LOCACAO_COMERCIAL },
  { source: "/post/você-pode-renovar-o-contrato-de-aluguel-da-sua-empresa-sem-que-o-locador-concorde-com-a-renovação", destination: LOCACAO_COMERCIAL },
  { source: "/post/cuidados-para-renovação-de-contrato-comercial", destination: LOCACAO_COMERCIAL },
  { source: "/post/posso-sublocar-uma-sala-comercial", destination: LOCACAO_COMERCIAL },
  { source: "/post/a-vida-cotidiana-e-os-contratos-melhor-prevenir-do-que-remediar", destination: REVISAO_CONTRATUAL },
  { source: "/post/7-cuidados-que-você-deve-ter-antes-de-assinar-qualquer-contrato", destination: REVISAO_CONTRATUAL },
  { source: "/post/disney-faz-acordo-de-r-200-milhões-para-a-scarlat-johansson-por-um-detalhe-no-contrato", destination: REVISAO_CONTRATUAL },
  { source: "/post/tem-um-contrato-na-minha-gaveta", destination: REVISAO_CONTRATUAL },

  // Direito Imobiliário: compra e venda, registro e locação residencial
  { source: "/post/o-que-deve-constar-em-um-contrato-de-compra-e-venda-de-imóvel-entre-particulares", destination: IMOBILIARIO },
  { source: "/post/pontos-relevantes-de-um-contrato-de-compra-e-venda-de-imóvel-entre-particulares", destination: IMOBILIARIO },
  { source: "/post/o-que-deve-constar-em-um-contrato-de-compra-e-venda-de-imóvel-entre-particulares-parte-3", destination: IMOBILIARIO },
  { source: "/post/pontos-relevantes-de-um-contrato-de-compra-e-venda-de-imóvel-entre-particulares-parte-final", destination: IMOBILIARIO },
  { source: "/post/pontos-relevantes-de-um-contrato-de-compra-e-venda-de-imóvel-entre-particulares-parte-04", destination: IMOBILIARIO },
  { source: "/post/o-que-você-precisa-saber-sobre-o-índice-de-variação-de-alugueis-residenciais", destination: IMOBILIARIO },
  { source: "/post/opinião-a-importância-do-registro-e-averbação-da-matrícula-de-bem-imóvel", destination: IMOBILIARIO },
  { source: "/post/o-que-você-deve-observar-ao-fazer-um-contrato-de-compra-e-venda-de-imóvel", destination: IMOBILIARIO },
  { source: "/post/o-preço-do-aluguel-ficou-defasado-o-que-posso-fazer", destination: IMOBILIARIO },
  { source: "/post/o-aluguel-pode-ser-cobrado-de-forma-antecipada", destination: IMOBILIARIO },
  { source: "/post/meu-inquilino-não-paga-o-aluguel-posso-despejá-lo", destination: IMOBILIARIO },
  { source: "/post/lembre-se-disso-antes-de-comprar-um-imóvel", destination: IMOBILIARIO },
  { source: "/post/quero-pagar-os-alugueis-mas-o-locador-não-quer-receber-e-agora", destination: IMOBILIARIO },
  { source: "/post/é-constitucional-a-penhora-de-bem-de-família-de-fiador-em-contrato-de-aluguel-comercial", destination: IMOBILIARIO },
  { source: "/post/você-sabe-diferenciar-locação-por-temporada-de-hospedagem", destination: IMOBILIARIO },
  { source: "/post/quem-é-o-responsável-pelo-pagamento-do-iptu", destination: IMOBILIARIO },
  { source: "/post/você-sabe-quais-são-as-garantias-do-contrato-de-locação", destination: IMOBILIARIO },
  { source: "/post/moro-de-aluguel-posso-sublocar-o-imóvel", destination: IMOBILIARIO },
  { source: "/post/o-que-fazer-logo-após-comprar-imóvel", destination: IMOBILIARIO },
  { source: "/post/é-melhor-prevenir-do-que-remediar-na-hora-de-comprar-um-imóvel", destination: IMOBILIARIO },
  { source: "/post/fiz-reparos-no-imóvel-alugado-posso-ser-ressarcido", destination: IMOBILIARIO },
  { source: "/post/posso-receber-de-volta-o-valor-pago-como-sinal-do-imóvel", destination: IMOBILIARIO },
  { source: "/post/o-meu-inquilino-entregou-o-imóvel-destruído-e-agora", destination: IMOBILIARIO },
  { source: "/post/o-que-você-precisa-saber-sobre-a-promessa-de-compra-e-venda", destination: IMOBILIARIO },
  { source: "/post/moro-de-aluguel-tenho-preferência-para-comprar-o-imóvel", destination: IMOBILIARIO },
  { source: "/post/evite-esses-erros-em-seu-contrato-de-locação", destination: IMOBILIARIO },
  { source: "/post/meu-inquilino-não-paga-o-aluguel-posso-negativa-o-nome-dele", destination: IMOBILIARIO },
  { source: "/post/guia-de-como-cobrar-o-inquilino-da-forma-correta", destination: IMOBILIARIO },
  { source: "/post/a-importância-da-regularização-de-imóveis-junto-aos-cartórios-e-prefeituras", destination: IMOBILIARIO },

  // Direito Empresarial: assessoria, contrato social, LGPD
  { source: "/post/desconsideração-da-personalidade-jurídica", destination: EMPRESARIAL },
  { source: "/post/a-importância-da-assessoria-jurídica-para-as-empresas", destination: EMPRESARIAL },
  { source: "/post/assessoria-jurídica-muitos-acreditam-que-não-seja-importante-para-empresas-até-serem-surpreendidos", destination: EMPRESARIAL },
  { source: "/post/o-que-você-precisa-saber-antes-de-abrir-sua-empresa", destination: EMPRESARIAL },
  { source: "/post/o-que-não-pode-falta-no-contrato-social-da-sua-empresa", destination: EMPRESARIAL },
  { source: "/post/proteção-de-dados-pessoais-é-reconhecida-como-direito-fundamental", destination: EMPRESARIAL },
  { source: "/post/você-sabe-quais-são-as-sanções-administrativas-da-lgpd", destination: EMPRESARIAL },

  // Direito do Consumidor e bancário
  { source: "/post/opinião-condenação-em-danos-morais-por-descontos-indevidos-e-perda-do-tempo-útil", destination: CONSUMIDOR },
  { source: "/post/notícia-tarifa-cobrada-sobre-cheque-especial-não-utilizado-é-declarada-inconstitucional-pelo-stf", destination: CONSUMIDOR },
  { source: "/post/pagamentos-via-whatsapp-11-medidas-para-utilização-segura", destination: CONSUMIDOR },
  { source: "/post/banco-indenizará-aposentado-por-empréstimo-fraudulento", destination: CONSUMIDOR },
  { source: "/post/banco-deve-restituir-cliente-em-dobro-por-empréstimo-consignado-fraudulento", destination: CONSUMIDOR },
  { source: "/post/imagina-perder-r-318-000-00-em-segundos", destination: CONSUMIDOR },
  { source: "/post/fez-um-pagamento-indevido", destination: CONSUMIDOR },

  // Demais áreas
  { source: "/post/prorrogado-prazo-para-pagamento-de-tributos-no-âmbito-do-simples-nacional", destination: TRIBUTARIO },
  { source: "/post/condomínio-pode-proibir-locações-por-temporada-segundo-stj", destination: CONDOMINIAL },
  { source: "/post/se-você-tem-dificuldades-de-receber-um-dívida-pode-ser-porque-ainda-não-tentou-isso", destination: CREDITO },
  { source: "/post/entenda-como-usar-o-protesto-de-título-de-crédito", destination: CREDITO },
  { source: "/post/estado-não-pode-exigir-curso-de-direito-para-ingresso-na-pm-decide-stf", destination: "/servidores-publicos" },
  // História do escritório ("em agosto de 2019, com apenas dois membros...")
  { source: "/post/tudo-que-é-grande-um-dia-foi-pequeno", destination: "/o-escritorio" },

  // Sem assunto equivalente no site novo
  { source: "/post/antigo-dono-que-não-comunicou-venda-de-veículo-responde-por-eventuais-infrações", destination: "/blog" },
  { source: "/post/por-que-é-melhor-resolver-um-conflito-de-forma-amigável", destination: "/blog" },
  { source: "/post/tribunal-de-justiça-do-estado-de-minas-gerais-mantém-decisões-que-determinam-à-cemig-que-execute-obr", destination: "/blog" },
];

export const legacyRedirects: Redirect[] = [
  ...legacyPages,
  ...legacyPosts,
  // Qualquer outro /post/... (URL fora do sitemap, variação de slug) cai na
  // listagem do blog em vez de 404. Fica por último: a primeira regra que
  // casar é a aplicada.
  { source: "/post/:path*", destination: "/blog" },
];
