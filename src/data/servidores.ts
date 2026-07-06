/**
 * Hub Servidores Públicos — nicho de aquisição via tráfego pago.
 * Conteúdo informativo e sóbrio, sem promessa de resultado (Provimento 205/2021 OAB).
 */

import type { AreaFaq } from "./areas";

export type ServidorPage = {
  slug: string;
  name: string;
  shortLabel: string;
  icon: string;
  metaDescription: string;
  headline: string;
  problem: {
    heading: string;
    paragraphs: string[];
  };
  how: {
    heading: string;
    paragraphs: string[];
    items: string[];
  };
  faq: AreaFaq[];
};

export const servidoresIntro = {
  eyebrow: "Servidores Públicos Estaduais",
  title: "Orientação jurídica para quem serve Minas Gerais",
  description:
    "O escritório atende servidores públicos do Estado de Minas Gerais — incluindo policiais penais — na análise de direitos da carreira, como férias-prêmio, progressões, adicional noturno e vale-transporte. Atendimento próximo, com linguagem clara e sem juridiquês.",
};

export const servidorPages: ServidorPage[] = [
  {
    slug: "ferias-premio",
    name: "Férias-Prêmio",
    shortLabel: "Férias-Prêmio",
    icon: "calendar",
    metaDescription:
      "Orientação a servidores estaduais de MG sobre férias-prêmio: aquisição, gozo e conversão em indenização. Escritório em Formiga, MG.",
    headline: "Férias-prêmio do servidor estadual",
    problem: {
      heading: "O benefício que muitos servidores deixam para trás",
      paragraphs: [
        "A legislação de Minas Gerais assegura aos servidores públicos estaduais períodos de férias-prêmio a cada ciclo de efetivo exercício. Na prática, porém, muitos servidores se aposentam ou se desligam sem usufruir integralmente o benefício — e sem saber que os períodos não gozados podem, em determinadas situações, gerar direito a indenização.",
        "Contagens de tempo incompletas, indeferimentos administrativos e dúvidas sobre a conversão em espécie são as situações mais comuns que chegam ao escritório.",
      ],
    },
    how: {
      heading: "Como o escritório atua",
      paragraphs: [
        "O trabalho começa pela análise do histórico funcional do servidor: contagem de tempo, períodos aquisitivos, afastamentos e registros de gozo.",
      ],
      items: [
        "Análise da contagem de tempo e dos períodos aquisitivos",
        "Requerimentos administrativos de reconhecimento e gozo",
        "Discussão da conversão de períodos não gozados em indenização, quando cabível",
        "Acompanhamento judicial quando a via administrativa se esgota",
      ],
    },
    faq: [
      {
        question: "Quem tem direito às férias-prêmio em Minas Gerais?",
        answer:
          "Servidores públicos estaduais efetivos, conforme as regras da legislação mineira e da carreira de cada servidor. As condições variam conforme a data de ingresso e o histórico funcional, por isso cada caso exige análise individual.",
      },
      {
        question: "Me aposentei sem gozar as férias-prêmio. Perdi o direito?",
        answer:
          "Não necessariamente. Em determinadas situações, os períodos adquiridos e não gozados podem ser objeto de pedido de conversão em indenização. É preciso analisar a contagem de tempo e a legislação aplicável ao seu caso.",
      },
      {
        question: "Policiais penais também têm esse direito?",
        answer:
          "Policiais penais são servidores estaduais e, como regra, sujeitam-se ao regime das férias-prêmio conforme as normas da sua carreira. Um atendimento permite verificar a situação concreta.",
      },
    ],
  },
  {
    slug: "progressao-e-promocao",
    name: "Progressão e Promoção",
    shortLabel: "Progressão e Promoção",
    icon: "trending",
    metaDescription:
      "Orientação a servidores estaduais de MG sobre progressão e promoção na carreira: requisitos, atrasos e efeitos financeiros. Formiga, MG.",
    headline: "Progressão e promoção na carreira",
    problem: {
      heading: "Quando a carreira não anda como a lei prevê",
      paragraphs: [
        "Os planos de carreira dos servidores estaduais de Minas Gerais preveem progressões e promoções mediante requisitos como tempo de exercício, avaliação de desempenho e titulação. Atrasos na concessão e critérios aplicados de forma equivocada afetam diretamente a remuneração do servidor — inclusive com reflexos na aposentadoria.",
      ],
    },
    how: {
      heading: "Como o escritório atua",
      paragraphs: [
        "A análise parte do plano de carreira aplicável e do histórico funcional, verificando se as movimentações ocorreram nos prazos e nos termos previstos.",
      ],
      items: [
        "Conferência das progressões e promoções concedidas e pendentes",
        "Requerimentos administrativos de reposicionamento na carreira",
        "Cobrança das diferenças remuneratórias decorrentes de atrasos, quando devidas",
        "Atuação judicial nos casos de indeferimento indevido",
      ],
    },
    faq: [
      {
        question: "Minha progressão está atrasada. O que posso fazer?",
        answer:
          "O primeiro passo é verificar, no plano de carreira, os requisitos e prazos aplicáveis, e reunir o histórico funcional. Constatado o atraso, é possível requerer o reposicionamento e discutir as diferenças salariais do período.",
      },
      {
        question: "Diferenças salariais retroativas podem ser cobradas?",
        answer:
          "Quando a progressão ou promoção deveria ter ocorrido antes, as diferenças remuneratórias do período podem ser discutidas, observado o prazo prescricional de cinco anos. A viabilidade depende da análise do caso concreto.",
      },
    ],
  },
  {
    slug: "adicional-noturno",
    name: "Adicional Noturno",
    shortLabel: "Adicional Noturno",
    icon: "moon",
    metaDescription:
      "Orientação a servidores estaduais de MG, incluindo policiais penais, sobre adicional noturno: direito, cálculo e valores em atraso.",
    headline: "Adicional noturno do servidor estadual",
    problem: {
      heading: "Trabalho noturno deve ser remunerado como tal",
      paragraphs: [
        "Servidores que trabalham à noite — como é rotina para policiais penais e outros plantonistas — têm direito à remuneração diferenciada pelo serviço noturno, conforme a Constituição e as normas aplicáveis a cada carreira.",
        "Nem sempre o adicional é pago, ou é pago com base de cálculo incorreta. Escalas de plantão, horas noturnas não computadas e ausência do pagamento retroativo são queixas frequentes.",
      ],
    },
    how: {
      heading: "Como o escritório atua",
      paragraphs: [
        "A verificação parte das escalas de serviço e dos contracheques do servidor, comparando o que foi trabalhado no período noturno com o que foi efetivamente pago.",
      ],
      items: [
        "Análise de escalas, plantões e contracheques",
        "Verificação da base de cálculo e dos reflexos do adicional",
        "Requerimentos administrativos de implantação e pagamento",
        "Cobrança judicial de valores em atraso, quando devidos",
      ],
    },
    faq: [
      {
        question: "Policial penal tem direito a adicional noturno?",
        answer:
          "O trabalho noturno do servidor deve ser remunerado de forma diferenciada, nos termos das normas aplicáveis à carreira. A existência e o valor do direito no caso concreto dependem da análise das escalas e da legislação da categoria.",
      },
      {
        question: "Posso cobrar o adicional dos últimos anos?",
        answer:
          "Valores não pagos podem ser discutidos observando-se, como regra, a prescrição de cinco anos. Reúna escalas e contracheques do período para viabilizar a análise.",
      },
    ],
  },
  {
    slug: "vale-transporte",
    name: "Vale-Transporte",
    shortLabel: "Vale-Transporte",
    icon: "bus",
    metaDescription:
      "Orientação a servidores estaduais de MG sobre auxílio e vale-transporte: direito ao benefício e valores não pagos. Formiga, MG.",
    headline: "Vale-transporte e auxílio-transporte",
    problem: {
      heading: "Um direito de deslocamento que nem sempre chega",
      paragraphs: [
        "O custeio do deslocamento entre a residência e o trabalho é assegurado a diversas categorias de servidores. Há casos em que o benefício não é implantado, é pago em valor inferior ao devido ou é negado com base em critérios questionáveis.",
      ],
    },
    how: {
      heading: "Como o escritório atua",
      paragraphs: [
        "O escritório verifica o enquadramento do servidor nas normas do benefício e o histórico de pagamentos.",
      ],
      items: [
        "Análise do direito ao benefício conforme a carreira e a lotação",
        "Requerimentos administrativos de implantação",
        "Discussão de valores retroativos não pagos, quando devidos",
        "Atuação judicial em caso de negativa indevida",
      ],
    },
    faq: [
      {
        question: "O benefício foi negado administrativamente. Ainda há o que fazer?",
        answer:
          "A negativa administrativa não encerra a discussão: é possível reapresentar o pedido com nova fundamentação ou levar a questão ao Judiciário, conforme o caso. A análise dos fundamentos da negativa indica o melhor caminho.",
      },
    ],
  },
];

export function getServidorPage(slug: string): ServidorPage | undefined {
  return servidorPages.find((p) => p.slug === slug);
}
