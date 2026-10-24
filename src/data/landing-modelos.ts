/**
 * Modelos de landing page oferecidos em /admin/landing/nova. Cada modelo é
 * uma página completa no layout do Figma, pronta para revisar e publicar no
 * editor visual. Importado também no navegador.
 */

import {
  emptyLandingPage,
  heroImageDefault,
  newSection,
  type LandingPageInput,
  type LpSectionOf,
} from "@/data/landing";
import { googleReviews } from "@/data/reviews";

export type LandingModelo = {
  id: string;
  nome: string;
  descricao: string;
  criar: () => LandingPageInput;
};

const FP = "/images/landing/ferias-premio";

/**
 * Férias-prêmio de servidores aposentados de Minas Gerais. Texto a partir da
 * publicação "Férias-prêmio" do escritório (out/2026), ampliado com as
 * dúvidas que mais aparecem: prazo, imposto de renda, herdeiros e documentos.
 * Tom informativo, sem promessa de resultado (Provimento 205/2021 da OAB).
 */
function feriasPremio(): LandingPageInput {
  const cards = newSection("cards") as LpSectionOf<"cards">;
  const numeros = newSection("numeros") as LpSectionOf<"numeros">;
  const destaque = newSection("destaque") as LpSectionOf<"destaque">;
  const depoimentos = newSection("depoimentos") as LpSectionOf<"depoimentos">;
  const equipe = newSection("equipe") as LpSectionOf<"equipe">;
  const perguntas = newSection("perguntas") as LpSectionOf<"perguntas">;
  const blog = newSection("blog") as LpSectionOf<"blog">;
  const galeria = newSection("galeria") as LpSectionOf<"galeria">;
  const contato = newSection("contato") as LpSectionOf<"contato">;

  return {
    version: 2,
    slug: "ferias-premio-aposentados",
    status: "rascunho",
    name: "Férias-prêmio de aposentados",
    tagline:
      "Servidor de Minas Gerais que se aposentou sem usufruir as férias-prêmio pode ter valores a receber.",
    seo: {
      title: "Férias-prêmio não usufruídas: servidor aposentado de MG",
      description:
        "Aposentou sem usufruir as férias-prêmio? A Justiça reconhece a conversão em dinheiro. Veja quem pode ter direito, o prazo e como pedir.",
    },
    whatsappMessage:
      "Olá! Vim pela página de férias-prêmio. Sou servidor(a) aposentado(a) de Minas Gerais e gostaria de saber se tenho valores a receber.",
    hero: {
      eyebrow: "Servidores aposentados de Minas Gerais",
      title: "Aposentou sem usufruir as férias-prêmio? Você pode ter",
      highlight: "valores a receber",
      text: "A Justiça reconhece a conversão em dinheiro das férias-prêmio que o servidor adquiriu e não usufruiu antes de se aposentar. Muitos aposentados nunca conferiram essa situação. Descubra se é o seu caso.",
      button: { label: "Quero analisar meu caso", link: { tipo: "whatsapp" } },
      image: heroImageDefault,
      ornament: true,
    },
    sections: [
      {
        ...cards,
        title: "Você se reconhece em alguma destas situações?",
        text: "A cada 5 anos de efetivo exercício, o servidor estadual adquire 3 meses de férias-prêmio. Quando esses períodos ficam para trás, o direito não desaparece com a aposentadoria.",
        items: [
          {
            image: {
              src: `${FP}/aposentada-documentos.webp`,
              alt: "Servidora aposentada lendo documentos funcionais à mesa da cozinha",
            },
            title: "Me aposentei sem tirar as férias-prêmio",
          },
          {
            image: {
              src: `${FP}/aposentado-calendario.webp`,
              alt: "Servidor aposentado consultando um calendário de parede com seus registros de trabalho",
            },
            title: "Usufruí só parte dos períodos",
          },
          {
            image: {
              src: `${FP}/servidora-pastas.webp`,
              alt: "Servidora pública organizando pastas em sua mesa de trabalho",
            },
            title: "Vou me aposentar em breve",
          },
          {
            image: {
              src: `${FP}/mae-e-filha-documentos.webp`,
              alt: "Mãe idosa e filha conferindo documentos da família à mesa",
            },
            title: "Sou herdeiro de um servidor",
          },
        ],
      },
      {
        ...numeros,
        title: "Um direito que costuma passar despercebido",
        text: "As férias-prêmio fazem parte da carreira do servidor estadual. Quando não são usufruídas, o Estado não pode simplesmente deixar de pagar por elas.",
        items: [
          { value: "3", label: "meses de férias-prêmio a cada 5 anos de efetivo exercício" },
          { value: "5", label: "anos é o prazo, em regra, para pedir a conversão depois da aposentadoria" },
          { value: "0%", label: "de imposto de renda sobre a indenização, em regra, por ser verba indenizatória" },
          {
            value: googleReviews.rating.toLocaleString("pt-BR", { minimumFractionDigits: 1 }),
            label: `é a nota do escritório no Google, com ${googleReviews.count} avaliações`,
          },
        ],
      },
      {
        ...destaque,
        eyebrow: "Por que verificar agora",
        title: "O tempo corre contra quem",
        highlight: "não confere o próprio histórico",
        text: "Em regra, o pedido de conversão das férias-prêmio deve ser feito em até cinco anos contados da aposentadoria. Depois disso, o direito pode se perder.\n\nA análise do escritório começa pelo seu histórico funcional: quantos períodos foram adquiridos, quantos foram usufruídos e se algum foi contado para a aposentadoria. Com isso, você sabe exatamente o que pode pedir e qual o melhor caminho.",
        button: { label: "Falar com o escritório", link: { tipo: "whatsapp" } },
        image: {
          src: "/images/escritorio/apresentacao.jpg",
          alt: "André Araújo conduzindo uma reunião com a equipe na sala de reuniões do escritório",
        },
      },
      {
        ...depoimentos,
        title: "Quem confiou no escritório recomenda",
      },
      {
        ...equipe,
        title: "Quem vai cuidar do seu caso",
        text: "Advogados com experiência em Direito do Servidor Público, que conhecem a legislação de Minas Gerais e acompanham cada etapa com você.",
      },
      {
        ...perguntas,
        title: "Perguntas sobre férias-prêmio",
        items: [
          {
            question: "Quem pode ter direito à conversão das férias-prêmio em dinheiro?",
            answer:
              "Servidores efetivos do Estado de Minas Gerais que adquiriram períodos de férias-prêmio e se aposentaram sem usufruí-los. As regras mudaram para quem ingressou no serviço público estadual a partir de 2003, por isso a data de ingresso e o histórico funcional de cada servidor precisam ser analisados.",
          },
          {
            question: "Me aposentei há alguns anos. Ainda dá tempo?",
            answer:
              "Em regra, o prazo para pedir a conversão é de cinco anos, contados da data da aposentadoria. Se você se aposentou dentro desse período, vale verificar o quanto antes. Fora dele, ainda assim é importante analisar o caso concreto.",
          },
          {
            question: "Usei as férias-prêmio para contar tempo de aposentadoria. Posso pedir mesmo assim?",
            answer:
              "Os períodos que já foram contados em dobro para a aposentadoria, em geral, não podem ser convertidos em dinheiro. Os demais, adquiridos e não usufruídos, podem ser objeto do pedido. A certidão de contagem de tempo mostra essa diferença.",
          },
          {
            question: "Como é feito o cálculo do valor?",
            answer:
              "O cálculo costuma considerar a última remuneração do servidor e o número de meses de férias-prêmio não usufruídos. Por isso, dependendo do caso, os valores podem ser relevantes. A análise do histórico funcional mostra o que pode ser pedido.",
          },
          {
            question: "Há desconto de imposto de renda?",
            answer:
              "Por ter natureza indenizatória, a conversão das férias-prêmio não usufruídas, em regra, não sofre desconto de imposto de renda, conforme o entendimento consolidado do Superior Tribunal de Justiça.",
          },
          {
            question: "O servidor faleceu. A família pode pedir?",
            answer:
              "Em determinadas situações, herdeiros e pensionistas podem pedir a conversão dos períodos que o servidor adquiriu e não usufruiu. Cada caso depende dos documentos funcionais e da data da aposentadoria e do falecimento.",
          },
          {
            question: "Quais documentos preciso separar?",
            answer:
              "Documento de identidade, ato de aposentadoria, último contracheque e, se tiver, a certidão de contagem de tempo ou a ficha funcional. Se faltar algum, o escritório orienta como solicitar ao órgão.",
          },
        ],
      },
      { ...blog, title: "Conteúdos para servidores", category: "Tributário e Servidor Público" },
      galeria,
      {
        ...contato,
        title: "Descubra se você tem valores a receber",
        text: "Conte rapidamente a sua situação. O escritório analisa o seu histórico funcional e explica, com clareza, se há períodos de férias-prêmio a converter e qual o melhor caminho.",
      },
    ],
  };
}

export const landingModelos: LandingModelo[] = [
  {
    id: "padrao",
    nome: "Modelo padrão",
    descricao:
      "O layout completo, com textos e imagens de exemplo para adaptar ao tema da campanha.",
    criar: emptyLandingPage,
  },
  {
    id: "ferias-premio",
    nome: "Férias-prêmio de aposentados",
    descricao:
      "Página pronta para servidores aposentados de Minas Gerais que não usufruíram as férias-prêmio.",
    criar: feriasPremio,
  },
];

export function getLandingModelo(id: string | undefined): LandingModelo | undefined {
  return landingModelos.find((m) => m.id === id);
}
