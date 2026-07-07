/**
 * Dados institucionais do escritório — fonte única para todo o site.
 * Edite aqui para refletir em header, footer, contato e SEO.
 */

const WHATSAPP_MESSAGE =
  "Olá, vim pelo site e gostaria de agendar um atendimento.";

export const site = {
  name: "André Araújo Advogados",
  shortName: "André Araújo",
  url: "https://www.andrearaujoadvogados.com.br",
  description:
    "Escritório de advocacia em Formiga, MG, com duas vertentes de atuação: Direito do Servidor Público e Direito Cível e Empresarial.",

  phone: "(37) 3322-5265",
  phoneHref: "tel:+553733225265",

  whatsapp: "+55 37 99860-7180",
  whatsappHref: `https://wa.me/5537998607180?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,

  email: "contato@andrearaujoadvogados.com.br",
  emailHref: "mailto:contato@andrearaujoadvogados.com.br",

  address: {
    street: "Rua João Vaz, nº 2",
    neighborhood: "Centro",
    city: "Formiga",
    state: "MG",
    zip: "35570-116",
    full: "Rua João Vaz, nº 2, Centro, Formiga, MG, CEP 35570-116",
  },

  // TODO: confirmar horário de atendimento com o escritório
  openingHours: "Segunda a sexta, das 8h às 18h",

  social: {
    facebook: "https://www.facebook.com/andrearaujoadvogados", // TODO: confirmar URL exata
    instagram: "https://www.instagram.com/andrearaujoadvogados",
    linkedin: "https://www.linkedin.com/company/andrearaujoadvogados", // TODO: confirmar URL exata
    youtube: "https://www.youtube.com/@andrearaujoadvogados", // TODO: confirmar URL exata
  },

  mapsQuery: "Rua João Vaz, 2, Centro, Formiga, MG, 35570-116",
} as const;

/**
 * O escritório se organiza em duas macro vertentes — elas abrem o menu
 * global. `shortLabel` é usado na barra desktop, onde o espaço é curto.
 */
export const navMain = [
  {
    label: "Direito do Servidor Público",
    shortLabel: "Servidor Público",
    href: "/servidores-publicos",
  },
  {
    label: "Direito Cível e Empresarial",
    shortLabel: "Cível e Empresarial",
    href: "/areas-de-atuacao",
  },
  { label: "O Escritório", href: "/o-escritorio" },
  { label: "Equipe", href: "/equipe" },
  { label: "Blog", href: "/blog" },
  { label: "Contato", href: "/contato" },
] as const;

export const navSecondary = [
  { label: "Perguntas Frequentes", href: "/faq" },
] as const;

/**
 * Barra de credibilidade da home.
 * TODO: confirmar o número real de casos acompanhados antes de publicar
 * (placeholder). Anos de história (7) e equipe (12) confirmados.
 */
export const stats = [
  { value: 7, suffix: "", label: "anos de história" },
  { value: 1000, suffix: "+", label: "casos acompanhados" }, // TODO: confirmar número real
  { value: 12, suffix: "", label: "profissionais na equipe" },
  { value: null, display: "Formiga", suffix: "", label: "e região, atendimento próximo" },
] as const;
