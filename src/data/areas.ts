/**
 * Áreas de atuação — conteúdo editável sem tocar em componentes.
 */

export type AreaBlock = {
  heading: string;
  intro?: string;
  items?: string[];
};

export type AreaFaq = {
  question: string;
  answer: string;
};

export type Area = {
  slug: string;
  name: string;
  tagline: string;
  metaDescription: string;
  intro: string;
  blocks: AreaBlock[];
  faq: AreaFaq[];
};

export const areas: Area[] = [
  {
    slug: "direito-tributario",
    name: "Direito Tributário",
    tagline:
      "Orientação sobre tributos para empresas e pessoas físicas, do planejamento à defesa.",
    metaDescription:
      "Atuação em direito tributário em Formiga, MG: planejamento, defesas administrativas e judiciais e recuperação de tributos.",
    intro:
      "A carga tributária brasileira é complexa e muda com frequência. O escritório orienta empresas e pessoas físicas de Formiga e região a compreender suas obrigações, evitar autuações e discutir cobranças indevidas.",
    blocks: [
      {
        heading: "Como o escritório atua",
        items: [
          "Planejamento tributário preventivo para empresas e produtores rurais",
          "Defesas em execuções fiscais e autuações municipais, estaduais e federais",
          "Pedidos de restituição e compensação de tributos pagos indevidamente",
          "Parcelamentos e regularização de débitos fiscais",
          "Consultoria sobre regimes de tributação e enquadramento",
        ],
      },
      {
        heading: "Para quem é",
        intro:
          "Empresas de todos os portes, produtores rurais, profissionais liberais e pessoas físicas que receberam cobranças, autuações ou desejam organizar sua vida fiscal de forma preventiva.",
      },
    ],
    faq: [
      {
        question: "Recebi uma execução fiscal. O que devo fazer?",
        answer:
          "O primeiro passo é verificar a origem, o valor e a regularidade da cobrança, pois há prazos curtos para apresentar defesa. Leve a citação e os documentos relacionados a um atendimento para análise da situação concreta.",
      },
      {
        question: "É possível recuperar tributos pagos a mais?",
        answer:
          "Em determinadas situações, valores recolhidos indevidamente podem ser objeto de pedido de restituição ou compensação, observados os prazos legais. Cada caso exige análise da documentação fiscal para verificar essa possibilidade.",
      },
    ],
  },
  {
    slug: "direito-condominial",
    name: "Direito Condominial",
    tagline:
      "Assessoria a condomínios, síndicos e condôminos em cobranças, assembleias e convenções.",
    metaDescription:
      "Assessoria em direito condominial em Formiga, MG: cobrança de taxas, assembleias, convenções e conflitos entre condôminos.",
    intro:
      "Condomínios reúnem interesses diversos e exigem regras claras. O escritório assessora síndicos, administradoras e condôminos na prevenção e na solução de conflitos condominiais.",
    blocks: [
      {
        heading: "Como o escritório atua",
        items: [
          "Cobrança judicial e extrajudicial de taxas condominiais",
          "Elaboração e revisão de convenções e regimentos internos",
          "Assessoria em assembleias e na gestão do síndico",
          "Conflitos entre condôminos, uso de áreas comuns e obras",
          "Responsabilidade civil do condomínio",
        ],
      },
      {
        heading: "Para quem é",
        intro:
          "Síndicos, administradoras de condomínio e condôminos de edifícios residenciais e comerciais de Formiga e região.",
      },
    ],
    faq: [
      {
        question: "O condomínio pode cobrar judicialmente taxas em atraso?",
        answer:
          "Sim. A legislação prevê meios ágeis de cobrança das contribuições condominiais, incluindo a via judicial. A escolha do caminho adequado depende do histórico do débito e da situação do condômino.",
      },
    ],
  },
  {
    slug: "direito-do-consumidor",
    name: "Direito do Consumidor",
    tagline:
      "Defesa dos seus direitos em compras, serviços, planos, bancos e cobranças indevidas.",
    metaDescription:
      "Atuação em direito do consumidor em Formiga, MG: cobranças indevidas, negativação, vícios de produtos e serviços e contratos bancários.",
    intro:
      "Relações de consumo fazem parte do dia a dia, e nem sempre fornecedores cumprem o que prometem. O escritório orienta consumidores de Formiga e região na defesa dos direitos previstos no Código de Defesa do Consumidor.",
    blocks: [
      {
        heading: "Como o escritório atua",
        items: [
          "Cobranças indevidas e negativação irregular do nome",
          "Vícios e defeitos em produtos e serviços",
          "Problemas com pacotes de viagem, transporte aéreo e hotelaria",
          "Revisão de contratos bancários e de financiamento",
          "Planos de saúde, telefonia e serviços essenciais",
        ],
      },
      {
        heading: "Para quem é",
        intro:
          "Consumidores pessoas físicas e pequenas empresas que, na condição de destinatárias finais, enfrentam problemas com fornecedores de produtos e serviços.",
      },
    ],
    faq: [
      {
        question: "Meu nome foi negativado por uma dívida que não reconheço. E agora?",
        answer:
          "Reúna comprovantes e registre a contestação junto à empresa. Caso a negativação seja indevida, é possível buscar a exclusão do registro e a reparação de eventuais danos. Um atendimento permite avaliar a documentação e o melhor caminho.",
      },
    ],
  },
  {
    slug: "direito-imobiliario",
    name: "Direito Imobiliário",
    tagline:
      "Segurança jurídica na compra, venda, locação e regularização de imóveis.",
    metaDescription:
      "Atuação em direito imobiliário em Formiga, MG: compra e venda, locação, usucapião, regularização e desapropriação.",
    intro:
      "O imóvel costuma ser o bem mais valioso de uma família ou empresa. O escritório acompanha negociações e resolve pendências para que cada operação imobiliária tenha segurança jurídica.",
    blocks: [
      {
        heading: "Como o escritório atua",
        items: [
          "Assessoria em compra, venda e permuta de imóveis",
          "Contratos de locação residencial e comercial e ações de despejo",
          "Usucapião e regularização de imóveis",
          "Desapropriação e indenizações",
          "Incorporação, loteamentos e condomínios de lotes",
        ],
      },
      {
        heading: "Para quem é",
        intro:
          "Proprietários, compradores, locadores, locatários, construtoras e investidores de Formiga e região.",
      },
    ],
    faq: [
      {
        question: "Comprei um imóvel sem escritura. É possível regularizar?",
        answer:
          "Em muitos casos, sim: por meio de usucapião, adjudicação ou outros instrumentos de regularização, conforme a origem da posse e a documentação existente. A análise dos documentos define o procedimento adequado.",
      },
    ],
  },
  {
    slug: "direito-empresarial",
    name: "Direito Empresarial",
    tagline:
      "Suporte jurídico para a rotina e as decisões estratégicas da sua empresa.",
    metaDescription:
      "Atuação em direito empresarial em Formiga, MG: contratos, sociedades, assessoria preventiva e contencioso empresarial.",
    intro:
      "Pequenas e médias empresas precisam de suporte jurídico acessível, que acompanhe o negócio de perto. O escritório atua de forma preventiva e contenciosa ao lado de empresários de Formiga e região.",
    blocks: [
      {
        heading: "Como o escritório atua",
        items: [
          "Elaboração e revisão de contratos empresariais",
          "Constituição de sociedades, alterações e acordos de sócios",
          "Assessoria jurídica preventiva mensal",
          "Contencioso cível e empresarial",
          "Negociação e solução extrajudicial de conflitos",
        ],
      },
      {
        heading: "Para quem é",
        intro:
          "Empresários individuais, sociedades limitadas, comércios, indústrias e prestadores de serviço da região centro-oeste de Minas Gerais.",
      },
    ],
    faq: [
      {
        question: "Minha empresa é pequena. Vale a pena ter assessoria jurídica?",
        answer:
          "A atuação preventiva costuma custar menos do que resolver litígios depois que surgem. Contratos bem redigidos e orientação nas decisões do dia a dia reduzem riscos independentemente do porte da empresa.",
      },
    ],
  },
  {
    slug: "direito-trabalhista",
    name: "Direito Trabalhista",
    tagline:
      "Atuação para empregadores e trabalhadores em demandas e rotinas trabalhistas.",
    metaDescription:
      "Atuação em direito trabalhista em Formiga, MG: defesa de empregadores, orientação a trabalhadores e rotinas trabalhistas.",
    intro:
      "As relações de trabalho pedem equilíbrio entre a proteção do trabalhador e a segurança do empregador. O escritório atua nos dois lados da relação, sempre com orientação clara e realista.",
    blocks: [
      {
        heading: "Como o escritório atua",
        items: [
          "Defesa de empresas em reclamações trabalhistas",
          "Orientação a trabalhadores sobre verbas e direitos",
          "Consultoria preventiva em rotinas e contratos de trabalho",
          "Acordos e negociações coletivas",
          "Auditoria de passivos trabalhistas",
        ],
      },
      {
        heading: "Para quem é",
        intro:
          "Empresas que desejam prevenir passivos trabalhistas e trabalhadores que precisam de orientação sobre seus direitos.",
      },
    ],
    faq: [
      {
        question: "Fui demitido e não recebi as verbas rescisórias. O que fazer?",
        answer:
          "Guarde o contrato, os holerites e o termo de rescisão e procure orientação o quanto antes, pois há prazos para reclamar verbas trabalhistas. Um atendimento permite calcular o que é devido e definir a melhor estratégia.",
      },
    ],
  },
  {
    slug: "recuperacao-de-credito",
    name: "Recuperação de Crédito",
    tagline:
      "Cobrança estratégica para transformar dívidas em recebimentos, com respeito ao devedor.",
    metaDescription:
      "Recuperação de crédito em Formiga, MG: cobrança extrajudicial e judicial, execução de títulos e negociação de dívidas.",
    intro:
      "Inadimplência compromete o caixa de qualquer negócio. O escritório estrutura a cobrança de forma profissional, priorizando a negociação e recorrendo ao Judiciário quando necessário.",
    blocks: [
      {
        heading: "Como o escritório atua",
        items: [
          "Cobrança extrajudicial com notificações e negociação",
          "Execução de títulos como cheques, notas promissórias e duplicatas",
          "Ações de cobrança e monitórias",
          "Protesto de títulos e negativação regular",
          "Renegociação e formalização de acordos",
        ],
      },
      {
        heading: "Para quem é",
        intro:
          "Empresas, comércios, prestadores de serviço, condomínios e pessoas físicas com valores a receber em Formiga e região.",
      },
    ],
    faq: [
      {
        question: "Tenho cheques e promissórias antigos. Ainda posso cobrar?",
        answer:
          "Depende do prazo decorrido: títulos têm prazos de prescrição distintos conforme o tipo e a data. Mesmo títulos prescritos podem, em certos casos, ser cobrados por outras vias. Vale analisar cada documento.",
      },
    ],
  },
  {
    slug: "direito-das-sucessoes",
    name: "Direito das Sucessões",
    tagline:
      "Inventário, partilha e planejamento sucessório para organizar a transmissão do patrimônio.",
    metaDescription:
      "Direito das sucessões em Formiga, MG: inventário judicial e extrajudicial, partilha de bens, testamento e planejamento sucessório.",
    intro:
      "A transmissão do patrimônio após o falecimento segue regras próprias e prazos a observar. O escritório conduz inventários e partilhas e orienta famílias no planejamento sucessório, buscando reduzir conflitos e custos.",
    blocks: [
      {
        heading: "Como o escritório atua",
        items: [
          "Inventário e partilha nas vias judicial e extrajudicial (em cartório)",
          "Elaboração e cumprimento de testamentos",
          "Planejamento sucessório para organizar a transmissão do patrimônio em vida",
          "Defesa dos interesses de herdeiros, do cônjuge e do companheiro",
          "Regularização de bens e sobrepartilha",
        ],
      },
      {
        heading: "Para quem é",
        intro:
          "Famílias e herdeiros que precisam formalizar a transmissão de bens, e pessoas que desejam planejar a sucessão do seu patrimônio de forma preventiva.",
      },
    ],
    faq: [
      {
        question: "Todo inventário precisa ir para a Justiça?",
        answer:
          "Não. Havendo consenso entre herdeiros capazes e não existindo testamento, em regra o inventário pode ser feito por escritura pública em cartório, de forma mais rápida. A via adequada depende da análise do caso.",
      },
      {
        question: "Existe prazo para abrir o inventário?",
        answer:
          "Sim. Há prazo para a abertura a partir do falecimento, e o atraso pode gerar multa sobre o imposto de transmissão. O ideal é buscar orientação assim que possível.",
      },
    ],
  },
  {
    slug: "direito-de-familia",
    name: "Direito de Família",
    tagline:
      "Divórcio, guarda, pensão e união estável conduzidos com técnica e sensibilidade.",
    metaDescription:
      "Direito de família em Formiga, MG: divórcio, guarda de filhos, pensão alimentícia, união estável e partilha de bens.",
    intro:
      "Questões de família exigem cuidado técnico e humano. O escritório atua em divórcios, guarda, alimentos e reconhecimento de união, buscando soluções que preservem os vínculos e os direitos de cada parte.",
    blocks: [
      {
        heading: "Como o escritório atua",
        items: [
          "Divórcio consensual e litigioso, com partilha de bens",
          "Guarda, convivência e regulamentação de visitas",
          "Pensão alimentícia: fixação, revisão e execução",
          "Reconhecimento e dissolução de união estável",
          "Investigação de paternidade e demais questões filiatórias",
        ],
      },
      {
        heading: "Para quem é",
        intro:
          "Pessoas que enfrentam a separação, precisam definir a guarda e o sustento dos filhos ou desejam formalizar a união e organizar o patrimônio do casal.",
      },
    ],
    faq: [
      {
        question: "Divórcio precisa de processo judicial?",
        answer:
          "Nem sempre. Havendo acordo e não existindo filhos menores ou incapazes, o divórcio pode ser feito por escritura em cartório. Com filhos menores ou litígio, segue pela via judicial.",
      },
      {
        question: "Como é definido o valor da pensão alimentícia?",
        answer:
          "O valor considera a necessidade de quem recebe e a possibilidade de quem paga, dentro do princípio da proporcionalidade. Pode ser revisto quando essas condições mudam.",
      },
    ],
  },
];

export function getArea(slug: string): Area | undefined {
  return areas.find((a) => a.slug === slug);
}
