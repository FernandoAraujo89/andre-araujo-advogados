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

/**
 * Perguntas que valem para as duas páginas de ADE (policiais penais e
 * militares): prazo, processo e efeitos na carreira.
 */
const adePrazo = {
  question: "Até quanto tempo para trás dá para cobrar?",
  answer:
    "Em regra, as diferenças dos últimos cinco anos. Como a prescrição alcança cada parcela mensal, a cada mês que passa uma parcela mais antiga deixa de poder ser cobrada. Por isso vale verificar o quanto antes.",
};

const adeProcesso = {
  question: "Como funciona o processo?",
  answer:
    "A cobrança costuma ser feita no Juizado Especial da Fazenda Pública, que tem um rito mais simples. Em primeira instância não há custas processuais nem honorários de sucumbência, e a prova é essencialmente documental, o que em muitos casos dispensa audiência.",
};

const AP = "/images/landing/ade-policiais-penais";

/**
 * ADE (Adicional de Desempenho) de policiais penais de Minas Gerais:
 * diferenças de janeiro a setembro quando o Estado só implanta a nova faixa
 * em 1º de outubro (art. 2º-A, § 4º, III, da Lei Estadual 14.693/2003).
 * Conteúdo a partir do material do escritório "Landing Page - ADE", da lei e
 * de sentença favorável de Juizado Especial da Fazenda Pública (nov/2026).
 * A sentença é citada sem nome das partes e como decisão de primeira
 * instância; nada de "pacífico", "consulta gratuita" ou promessa de
 * resultado (Provimento 205/2021 da OAB).
 */
function adePoliciaisPenais(): LandingPageInput {
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
    slug: "ade-policiais-penais",
    status: "rascunho",
    name: "ADE de policiais penais",
    tagline:
      "Policial penal de MG que mudou de faixa do ADE e só recebeu o novo percentual em outubro pode ter diferenças a receber.",
    seo: {
      title: "ADE só em outubro? Diferenças para policiais penais de MG",
      description:
        "Policial penal de MG que mudou de faixa do ADE e só recebeu em outubro pode ter diferenças de janeiro a setembro a receber. Veja como conferir.",
    },
    whatsappMessage:
      "Olá! Vim pela página de ADE. Sou policial penal de Minas Gerais e gostaria de saber se tenho diferenças do Adicional de Desempenho a receber.",
    hero: {
      eyebrow: "Policiais penais de Minas Gerais",
      title: "Seu ADE só aumentou em outubro? Você pode ter",
      highlight: "diferenças a receber",
      text: "Quem completa o número de avaliações satisfatórias em dezembro já cumpre, em janeiro, os requisitos para o novo percentual do Adicional de Desempenho. Quando o Estado só atualiza o contracheque em 1º de outubro, a diferença de janeiro a setembro pode ser cobrada.",
      button: { label: "Verificar meu contracheque", link: { tipo: "contato" } },
      image: {
        src: `${AP}/topo-policial-penal.webp`,
        alt: "Policial penal de uniforme preto, de braços cruzados e expressão confiante",
      },
      ornament: true,
    },
    sections: [
      {
        ...cards,
        title: "Você se reconhece em alguma destas situações?",
        text: "O ADE cresce conforme o número de avaliações de desempenho satisfatórias: 6% com 3 avaliações, 10% com 5, 20% com 10, e assim por diante. O problema aparece na hora de mudar de faixa.",
        items: [
          {
            image: {
              src: `${AP}/policial-contracheques.webp`,
              alt: "Policial penal comparando dois contracheques à mesa da copa",
            },
            title: "Mudei de faixa do ADE",
          },
          {
            image: {
              src: `${AP}/policial-calendario.webp`,
              alt: "Policial penal marcando uma data no calendário de parede",
            },
            title: "O novo percentual só veio em outubro",
          },
          {
            image: {
              src: `${AP}/policial-corredor.webp`,
              alt: "Policial penal em serviço no corredor de uma unidade prisional",
            },
            title: "Completei 3, 5 ou 10 avaliações",
          },
          {
            image: {
              src: `${AP}/policial-documentos-casa.webp`,
              alt: "Servidora organizando contracheques e documentos à mesa de casa",
            },
            title: "Aconteceu nos últimos 5 anos",
          },
        ],
      },
      {
        ...numeros,
        title: "Nove meses que fazem diferença no contracheque",
        text: "O ciclo anual de avaliação termina em dezembro. A partir de janeiro, o servidor já cumpre os requisitos para o novo percentual, calculado sobre o vencimento básico.",
        items: [
          {
            value: "9",
            label: "meses de diferença, de janeiro a setembro, quando a nova faixa só é implantada em outubro",
          },
          {
            value: "70%",
            label: "é o resultado mínimo na avaliação de desempenho para que ela conte para o ADE",
          },
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
        title: "Outubro é a data de atualização da folha,",
        highlight: "não a data em que o direito nasce",
        text: "Em decisões sobre o tema, a Justiça mineira tem reconhecido que o 1º de outubro previsto na Lei Estadual 14.693/2003 é um marco de organização administrativa, e não uma condição para adiar o pagamento de um direito que o servidor já conquistou ao concluir o ciclo de avaliação.\n\nEm sentença de primeira instância de um Juizado Especial da Fazenda Pública de Minas Gerais, um policial penal que completou a décima avaliação satisfatória em 2024 e só passou a receber os 20% em outubro de 2025 teve reconhecidas as diferenças de janeiro a setembro, com reflexos em férias e 13º salário. Cada caso depende da análise dos documentos do servidor.",
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
        text: "Advogados com experiência em Direito do Servidor Público, que conhecem a legislação de Minas Gerais e acompanham cada etapa com você.",
      },
      {
        ...perguntas,
        title: "Perguntas sobre o ADE do policial penal",
        items: [
          {
            question: "O que é o Adicional de Desempenho (ADE)?",
            answer:
              "É uma vantagem mensal criada pela Lei Estadual 14.693/2003 para o servidor do Poder Executivo de Minas Gerais que ingressou no serviço público depois de julho de 2003, ou que optou pelo adicional. Tem direito quem concluiu o estágio probatório e obteve resultado igual ou superior a 70% na avaliação de desempenho (ADI ou AED).",
          },
          {
            question: "Quais são os percentuais do ADE?",
            answer:
              "O percentual é calculado sobre o vencimento básico e sobe com o número de avaliações satisfatórias:\n\n3 avaliações: 6%\n5 avaliações: 10%\n10 avaliações: 20%\n15 avaliações: 30%\n20 avaliações: 40%\n25 avaliações: 50%\n30 avaliações: 60%\n35 avaliações: 70%\n\nA soma do ADE com os adicionais por tempo de serviço não pode passar de 90% do vencimento básico.",
          },
          {
            question: "O Estado pode pagar o aumento do meu ADE só em outubro?",
            answer:
              "A lei prevê o dia 1º de outubro para a atualização anual do valor do ADE, e é com base nisso que o Estado costuma implantar o novo percentual só nessa data. Em decisões sobre o tema, porém, a Justiça mineira tem entendido que o direito ao percentual maior se consolida com a conclusão do ciclo anual de avaliação, e que as diferenças são devidas desde janeiro.",
          },
          {
            question: "Quanto posso ter a receber?",
            answer:
              "Depende do seu vencimento básico, da faixa que você alcançou e de quantos meses o pagamento atrasou. A conta considera a diferença entre o percentual novo e o anterior em cada mês, de janeiro a setembro, mais os reflexos em 13º salário e no terço de férias. Com os contracheques em mãos, o escritório calcula o valor do seu caso.",
          },
          adePrazo,
          {
            question: "Entrar com a ação pode prejudicar a minha carreira?",
            answer:
              "Não. Cobrar na Justiça uma verba salarial devida é um direito do servidor e não interfere nas avaliações de desempenho, na lotação nem na estabilidade.",
          },
          adeProcesso,
          {
            question: "Quais documentos preciso separar?",
            answer:
              "O extrato das avaliações de desempenho, emitido pelo sistema funcional (SISAP), e os contracheques do período em que houve a mudança de faixa do ADE, para comprovar o percentual pago em cada mês. Se faltar algum, o escritório orienta como solicitar.",
          },
          {
            question: "O ADE pago com atraso vale só para policiais penais?",
            answer:
              "Não. A mesma lei alcança outras carreiras do Poder Executivo de Minas Gerais, e os militares estaduais têm o ADE previsto no Estatuto dos Militares. Se você é de outra carreira e também mudou de faixa com atraso, o caso pode ser analisado da mesma forma.",
          },
        ],
      },
      { ...blog, title: "Conteúdos para servidores", category: "Tributário e Servidor Público" },
      galeria,
      {
        ...contato,
        title: "Confira se o seu ADE foi pago com atraso",
        text: "Conte rapidamente em que ano você mudou de faixa e quando o novo percentual apareceu no contracheque. O escritório analisa as suas avaliações e os seus contracheques e explica, com clareza, se há diferenças a receber.",
      },
    ],
  };
}

const AM = "/images/landing/ade-policiais-militares";

/**
 * ADE de policiais militares de Minas Gerais. A tese é a mesma da página dos
 * policiais penais; muda a lei: arts. 59-A a 59-D do Estatuto dos Militares
 * (Lei 5.301/1969), incluídos pela Lei Complementar 109/2009. Diferenças em
 * relação aos civis, tiradas do texto da lei: percentuais até 60% (30 ADIs),
 * sobre a remuneração básica; requisito de estabilidade; e período anual de
 * avaliação contado do dia e mês do ingresso (não de janeiro a dezembro).
 * Por isso a página fala em "atraso" e "meses depois", sem fixar "janeiro a
 * setembro": o escritório ajusta no editor se a prática for a mesma.
 */
function adePoliciaisMilitares(): LandingPageInput {
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
    slug: "ade-policiais-militares",
    status: "rascunho",
    name: "ADE de policiais militares",
    tagline:
      "Policial militar de MG que subiu de faixa do ADE e recebeu o novo percentual com atraso pode ter diferenças a receber.",
    seo: {
      title: "ADE atrasado? Diferenças para policiais militares de MG",
      description:
        "Policial militar de MG que subiu de faixa do ADE e recebeu o novo percentual com atraso pode ter diferenças a receber. Veja quem tem direito.",
    },
    whatsappMessage:
      "Olá! Vim pela página de ADE. Sou policial militar de Minas Gerais e gostaria de saber se tenho diferenças do Adicional de Desempenho a receber.",
    hero: {
      eyebrow: "Policiais militares de Minas Gerais",
      title: "Seu ADE subiu de faixa com atraso? Você pode ter",
      highlight: "diferenças a receber",
      text: "O Adicional de Desempenho do militar está no Estatuto dos Militares e cresce com o número de avaliações satisfatórias. Quando o novo percentual demora meses para chegar ao contracheque, a diferença do período pode ser cobrada.",
      button: { label: "Verificar meu contracheque", link: { tipo: "contato" } },
      image: {
        src: `${AM}/topo-policial-militar.webp`,
        alt: "Policial militar de farda cáqui, com expressão serena e confiante",
      },
      ornament: true,
    },
    sections: [
      {
        ...cards,
        title: "Você se reconhece em alguma destas situações?",
        text: "O ADE do militar vai de 6% a 60% da remuneração básica, conforme o número de Avaliações de Desempenho Individual (ADIs) satisfatórias. O problema costuma aparecer na mudança de faixa.",
        items: [
          {
            image: {
              src: `${AM}/militar-contracheque.webp`,
              alt: "Policial militar lendo o contracheque em uma sala administrativa",
            },
            title: "Subi de faixa do ADE",
          },
          {
            image: {
              src: `${AM}/militar-celular.webp`,
              alt: "Policial militar conferindo o celular na rua, com uma viatura ao fundo",
            },
            title: "O novo percentual demorou a chegar",
          },
          {
            image: {
              src: `${AM}/militares-instrucao.webp`,
              alt: "Policiais militares em formação no pátio durante uma instrução",
            },
            title: "Completei 3, 5 ou 10 avaliações",
          },
          {
            image: {
              src: `${AM}/militar-documentos-casa.webp`,
              alt: "Homem conferindo contracheques com uma calculadora à mesa de casa",
            },
            title: "Aconteceu nos últimos 5 anos",
          },
        ],
      },
      {
        ...numeros,
        title: "O que o Estatuto dos Militares garante",
        text: "O ADE foi incluído na Lei 5.301/1969 pela Lei Complementar 109/2009, para o militar que ingressou depois de julho de 2003 ou que fez a opção pelo adicional.",
        items: [
          {
            value: "60%",
            label: "da remuneração básica é o percentual do ADE de quem alcança 30 avaliações satisfatórias",
          },
          {
            value: "70%",
            label: "é o resultado mínimo na Avaliação de Desempenho Individual para que ela conte para o ADE",
          },
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
        highlight: "não quando o Estado atualiza a folha",
        text: "Em decisões sobre o Adicional de Desempenho, a Justiça mineira tem reconhecido que o direito ao novo percentual se consolida com o cumprimento dos requisitos, e que a data usada pela Administração para atualizar a folha não pode adiar o pagamento.\n\nPara o militar, o que muda é a lei: os requisitos e os percentuais estão nos artigos 59-A a 59-D do Estatuto dos Militares. Se você completou o número de avaliações exigido e o novo percentual só apareceu meses depois, as diferenças do período, com reflexos em 13º salário e férias, podem ser cobradas. Cada caso depende da análise dos documentos do militar.",
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
        title: "Perguntas sobre o ADE do militar",
        items: [
          {
            question: "O que é o ADE do militar?",
            answer:
              "É uma vantagem remuneratória mensal prevista no Estatuto dos Militares de Minas Gerais (Lei 5.301/1969, artigos 59-A a 59-D, incluídos pela Lei Complementar 109/2009). É devida ao militar que ingressou nas instituições militares estaduais depois de julho de 2003, ou que optou pelo adicional, e que tem estabilidade e avaliações de desempenho satisfatórias.",
          },
          {
            question: "Quais são os percentuais do ADE do militar?",
            answer:
              "O percentual incide sobre a remuneração básica e sobe com o número de Avaliações de Desempenho Individual (ADIs) satisfatórias:\n\n3 avaliações: 6%\n5 avaliações: 10%\n10 avaliações: 20%\n15 avaliações: 30%\n20 avaliações: 40%\n25 avaliações: 50%\n30 avaliações: 60%\n\nA soma do ADE com os adicionais por tempo de serviço não pode passar de 90% da remuneração básica.",
          },
          {
            question: "Como funciona a avaliação de desempenho do militar?",
            answer:
              "A ADI considera a Avaliação Anual de Desempenho e Produtividade (AADP), o conceito disciplinar e o treinamento profissional básico. O resultado é satisfatório quando é igual ou superior a 70%. O período anual de avaliação começa no dia e mês do ingresso do militar, ou da opção pelo ADE.",
          },
          {
            question: "Subi de faixa e o novo percentual atrasou. Tenho direito às diferenças?",
            answer:
              "Em decisões sobre o ADE, a Justiça mineira tem entendido que o direito ao percentual maior nasce quando os requisitos são cumpridos. Se o novo percentual só foi implantado meses depois, em regra há diferença a receber em cada mês desse intervalo, com reflexos em 13º salário e férias. A análise das avaliações e dos contracheques confirma as datas.",
          },
          {
            question: "Bombeiros militares também têm esse direito?",
            answer:
              "Sim. O Estatuto dos Militares vale para as instituições militares estaduais, o que inclui a Polícia Militar e o Corpo de Bombeiros Militar de Minas Gerais.",
          },
          {
            question: "Quanto posso ter a receber?",
            answer:
              "Depende da sua remuneração básica, da faixa que você alcançou e de quantos meses o pagamento atrasou. Com os contracheques em mãos, o escritório calcula o valor do seu caso.",
          },
          adePrazo,
          {
            question: "Entrar com a ação pode prejudicar a minha carreira?",
            answer:
              "Não. Cobrar na Justiça uma verba remuneratória devida é um direito do militar, exercido perante o Poder Judiciário, e não interfere nas avaliações de desempenho nem na situação funcional.",
          },
          adeProcesso,
          {
            question: "Quais documentos preciso separar?",
            answer:
              "O registro das suas Avaliações de Desempenho Individual, com o resultado de cada ano, e os contracheques do período em que houve a mudança de faixa do ADE. Se faltar algum, o escritório orienta como solicitar à sua unidade.",
          },
          {
            question: "Estou na reserva. O ADE entra nos proventos?",
            answer:
              "O Estatuto prevê a incorporação do ADE aos proventos na transferência para a inatividade, em percentual que depende do número de avaliações satisfatórias obtidas na carreira. Diferenças do período da ativa também podem ser cobradas, se estiverem dentro do prazo de cinco anos.",
          },
        ],
      },
      { ...blog, title: "Conteúdos para servidores", category: "Tributário e Servidor Público" },
      galeria,
      {
        ...contato,
        title: "Confira se o seu ADE foi pago com atraso",
        text: "Conte rapidamente quando você completou as avaliações e quando o novo percentual apareceu no contracheque. O escritório analisa os seus documentos e explica, com clareza, se há diferenças a receber.",
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
  {
    id: "ade-policiais-penais",
    nome: "ADE de policiais penais",
    descricao:
      "Página pronta para policiais penais de Minas Gerais que mudaram de faixa do Adicional de Desempenho e só receberam em outubro.",
    criar: adePoliciaisPenais,
  },
  {
    id: "ade-policiais-militares",
    nome: "ADE de policiais militares",
    descricao:
      "Página pronta para policiais militares de Minas Gerais que subiram de faixa do Adicional de Desempenho com atraso.",
    criar: adePoliciaisMilitares,
  },
];

export function getLandingModelo(id: string | undefined): LandingModelo | undefined {
  return landingModelos.find((m) => m.id === id);
}
