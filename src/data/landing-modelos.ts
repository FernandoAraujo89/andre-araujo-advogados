/**
 * Modelos de landing page oferecidos em /admin/landing/nova. Cada modelo é
 * uma página completa no layout do Figma, pronta para revisar e publicar no
 * editor visual. Importado também no navegador.
 */

import {
  emptyLandingPage,
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
      button: { label: "Quero analisar meu caso", link: { tipo: "contato" } },
      // Recorte com fundo transparente (gerado no Magnific), no lugar da
      // estátua do modelo padrão: mostra para quem é o direito.
      image: {
        src: `${FP}/hero-professora-aposentada.webp`,
        alt: "Professora aposentada sorrindo, com uma pasta de documentos nos braços",
      },
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
        button: { label: "Falar com o escritório", link: { tipo: "contato" } },
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

const PP = "/images/landing/progressao-promocao";

/**
 * Progressão e promoção de professores da rede estadual de Minas Gerais:
 * retroativos quando o Estado publica o ato depois da data em que o servidor
 * cumpriu os requisitos. Conteúdo a partir da página de campanha do
 * escritório (progressaoepromocao.netlify.app), sem "consulta gratuita" nem
 * "especialista" e sem citar decisão entre aspas (Provimento 205/2021 da
 * OAB). Prazos com "em regra": a prescrição alcança cada parcela mensal.
 */
function progressaoPromocao(): LandingPageInput {
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
    slug: "progressao-e-promocao",
    status: "rascunho",
    name: "Progressão e promoção",
    tagline:
      "Professor de MG com progressão ou promoção publicada em atraso pode ter diferenças salariais a receber.",
    seo: {
      title: "Progressão atrasada? Retroativos para professores de MG",
      description:
        "Professor da rede estadual de MG com progressão ou promoção publicada em atraso pode ter retroativos a receber. Veja quem tem direito e como pedir.",
    },
    whatsappMessage:
      "Olá! Vim pela página de progressão e promoção. Sou professor(a) da rede estadual de Minas Gerais e gostaria de saber se tenho retroativos a receber.",
    hero: {
      eyebrow: "Professores da rede estadual de Minas Gerais",
      title: "Sua progressão saiu atrasada? Você pode ter",
      highlight: "dinheiro a receber",
      text: "Quando o Estado publica a progressão ou a promoção depois da data em que você cumpriu os requisitos, a diferença do período pode ser cobrada. Muitos professores ainda não conferiram essa situação.",
      button: { label: "Verificar minha situação", link: { tipo: "contato" } },
      image: {
        src: `${PP}/hero-professora.webp`,
        alt: "Professora sorrindo, com livros e uma pasta nos braços",
      },
      ornament: true,
    },
    sections: [
      {
        ...cards,
        title: "Você se encaixa em alguma destas situações?",
        text: "Progressão e promoção são direitos previstos no plano de carreira. Quando o reconhecimento oficial demora, o período sem o novo valor pode gerar diferenças a receber.",
        items: [
          {
            image: {
              src: `${PP}/professor-carta.webp`,
              alt: "Professor sentado na sala de aula vazia lendo um comunicado oficial",
            },
            title: "Progressão publicada com atraso",
          },
          {
            image: {
              src: `${PP}/professora-diploma.webp`,
              alt: "Professora segurando o diploma de pós-graduação no corredor da escola",
            },
            title: "Promoção por titulação demorou",
          },
          {
            image: {
              src: `${PP}/professora-contracheques.webp`,
              alt: "Professora comparando contracheques com uma calculadora à mesa da cozinha",
            },
            title: "O novo valor veio muito depois",
          },
          {
            image: {
              src: `${PP}/sala-de-aula.webp`,
              alt: "Professor escrevendo no quadro enquanto alunos levantam a mão",
            },
            title: "Aconteceu nos últimos 5 anos",
          },
        ],
      },
      {
        ...numeros,
        title: "O que muda no seu contracheque",
        text: "O direito nasce na data em que os requisitos foram cumpridos, e não na data em que o Estado decide publicar o ato.",
        items: [
          {
            value: "2",
            label: "caminhos na carreira: progressão, por tempo e avaliação, e promoção, por titulação",
          },
          { value: "R$", label: "de diferença em cada mês entre a data de vigência e a publicação do ato" },
          { value: "5", label: "anos de diferenças, em regra, podem ser cobrados; as parcelas mais antigas prescrevem" },
          {
            value: googleReviews.rating.toLocaleString("pt-BR", { minimumFractionDigits: 1 }),
            label: `é a nota do escritório no Google, com ${googleReviews.count} avaliações`,
          },
        ],
      },
      {
        ...destaque,
        eyebrow: "O que diz a Justiça",
        title: "O direito nasce quando você cumpre os requisitos,",
        highlight: "não quando o Estado publica",
        text: "Em decisões sobre o tema, a Justiça mineira tem reconhecido que, quando a progressão ou a promoção é concedida com atraso, o servidor tem direito às diferenças desde a data de vigência, respeitada a prescrição de cinco anos.\n\nProgressão não é favor: é um direito conquistado com tempo de serviço, formação e avaliações. O Estado não pode se beneficiar do seu trabalho sem pagar o que é devido.",
        button: { label: "Falar com o escritório", link: { tipo: "contato" } },
        image: {
          src: "/images/escritorio/reuniao-andamento.jpg",
          alt: "Equipe do escritório reunida na sala de reuniões",
        },
      },
      {
        ...depoimentos,
        title: "Quem confiou no escritório recomenda",
      },
      {
        ...equipe,
        title: "Quem vai cuidar do seu caso",
        text: "Advogados com experiência em Direito do Servidor Público, que conhecem os planos de carreira da educação de Minas Gerais e acompanham cada etapa com você.",
      },
      {
        ...perguntas,
        title: "Perguntas sobre progressão e promoção",
        items: [
          {
            question: "Qual é a diferença entre progressão e promoção?",
            answer:
              "Na carreira da educação de Minas Gerais, a progressão é o avanço de grau dentro do mesmo nível, ligado ao tempo de efetivo exercício e às avaliações de desempenho. A promoção é a mudança de nível, ligada à titulação, como uma pós-graduação, um mestrado ou um doutorado.",
          },
          {
            question: "Minha progressão saiu atrasada. Tenho direito a retroativos?",
            answer:
              "Se você cumpriu os requisitos e o ato foi publicado depois, em regra existe diferença salarial no período entre a data de vigência e a data da publicação. A análise da ficha funcional confirma as datas e o valor aproximado.",
          },
          {
            question: "Até quanto tempo para trás dá para cobrar?",
            answer:
              "Em regra, as diferenças dos últimos cinco anos. As parcelas mais antigas que isso prescrevem, por isso vale verificar o quanto antes.",
          },
          {
            question: "Entreguei o diploma e a promoção demorou. Também vale?",
            answer:
              "Sim. A promoção por titulação segue a mesma lógica: se a titulação exigida já tinha sido apresentada e o reconhecimento demorou, pode haver diferenças a receber, desde que os demais requisitos do plano de carreira estejam cumpridos.",
          },
          {
            question: "Sou designado ou contratado. Tenho esse direito?",
            answer:
              "A progressão e a promoção fazem parte da carreira dos servidores efetivos. Quem atua como designado ou contratado, em regra, não tem esse tipo de movimentação, mas outras situações podem ser analisadas.",
          },
          {
            question: "Aposentados também podem pedir?",
            answer:
              "Sim, se a progressão ou a promoção atrasada aconteceu quando ainda estavam na ativa e as diferenças estão dentro do prazo de cinco anos. O atraso também pode ter reflexos nos proventos da aposentadoria.",
          },
          {
            question: "Quais documentos preciso separar?",
            answer:
              "Documento de identidade, contracheques do período, a publicação da progressão ou da promoção no Diário Oficial e, se tiver, a ficha funcional ou o comprovante de entrega da titulação. Se faltar algum, o escritório orienta como solicitar.",
          },
        ],
      },
      { ...blog, title: "Conteúdos para servidores", category: "Tributário e Servidor Público" },
      galeria,
      {
        ...contato,
        title: "Verifique sua situação",
        text: "Conte rapidamente quando você cumpriu os requisitos e quando a progressão ou a promoção foi publicada. O escritório analisa a sua ficha funcional e explica, com clareza, se há retroativos a receber.",
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
  {
    id: "progressao-e-promocao",
    nome: "Progressão e promoção de professores",
    descricao:
      "Página pronta para professores da rede estadual de Minas Gerais com progressão ou promoção publicada em atraso.",
    criar: progressaoPromocao,
  },
];

export function getLandingModelo(id: string | undefined): LandingModelo | undefined {
  return landingModelos.find((m) => m.id === id);
}
