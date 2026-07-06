/**
 * Blog — posts em dados locais.
 * Os 6 posts abaixo são seeds (3 com títulos reais do blog atual).
 * Estrutura pronta para receber a migração dos 65 posts existentes:
 * basta adicionar novos objetos Post a este array.
 */

export const categories = [
  "Imobiliário e Locação",
  "Empresarial e Contratos",
  "Consumidor e Bancário",
  "Tributário e Servidor Público",
] as const;

export type Category = (typeof categories)[number];

export type PostSection = {
  heading?: string;
  paragraphs: string[];
};

export type PostImage = {
  src: string;
  alt: string;
  /** Crédito obrigatório do Unsplash */
  credit: string;
  creditUrl: string;
};

export type Post = {
  slug: string;
  title: string;
  category: Category;
  date: string; // ISO yyyy-mm-dd
  excerpt: string;
  image: PostImage;
  sections: PostSection[];
};

export const posts: Post[] = [
  {
    slug: "cancelamento-de-pacotes-de-viagem",
    image: {
      src: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=1600&q=80",
      alt: "Viajante sentado no aeroporto com a mala, observando um avião",
      credit: "Foto: JESHOOTS.COM / Unsplash",
      creditUrl: "https://unsplash.com/@jeshoots?utm_source=site_andre_araujo&utm_medium=referral",
    },
    title: "Cancelamento de pacotes de viagem: descubra seus direitos",
    category: "Consumidor e Bancário",
    date: "2026-05-18", // TODO: ajustar para a data original na migração
    excerpt:
      "Precisou cancelar uma viagem ou teve o pacote cancelado pela agência? Entenda o que o Código de Defesa do Consumidor garante em cada situação.",
    sections: [
      {
        paragraphs: [
          "Imprevistos acontecem — e, quando envolvem um pacote de viagem já contratado, surgem dúvidas sobre reembolso, remarcação e multas. O Código de Defesa do Consumidor traz regras que equilibram a relação entre viajante e agência.",
        ],
      },
      {
        heading: "Quando o consumidor cancela",
        paragraphs: [
          "O consumidor pode desistir da viagem, mas a agência pode reter valores proporcionais aos custos já incorridos, desde que previstos em contrato de forma clara. Multas abusivas, que retêm a quase totalidade do valor pago, podem ser questionadas.",
        ],
      },
      {
        heading: "Quando a agência ou a companhia cancela",
        paragraphs: [
          "Se o cancelamento parte do fornecedor, o consumidor tem direito à devolução integral do que pagou ou à remarcação sem custo adicional, além de eventual reparação por danos comprovados.",
          "Guarde contratos, comprovantes de pagamento e todas as conversas com a empresa: essa documentação é essencial para buscar seus direitos.",
        ],
      },
    ],
  },
  {
    slug: "a-importancia-da-revisao-contratual",
    image: {
      src: "https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=1600&q=80",
      alt: "Duas pessoas assinando um contrato sobre a mesa",
      credit: "Foto: Cytonn Photography / Unsplash",
      creditUrl: "https://unsplash.com/@cytonn_photography?utm_source=site_andre_araujo&utm_medium=referral",
    },
    title: "A importância da revisão contratual",
    category: "Empresarial e Contratos",
    date: "2026-04-27", // TODO: ajustar para a data original na migração
    excerpt:
      "Assinar sem ler sai caro. Veja por que a revisão de contratos evita litígios e protege empresas e pessoas físicas antes de qualquer assinatura.",
    sections: [
      {
        paragraphs: [
          "Grande parte dos litígios nasce de contratos mal redigidos ou assinados sem análise. Cláusulas ambíguas, obrigações desequilibradas e omissões importantes só aparecem quando o problema já existe.",
        ],
      },
      {
        heading: "O que a revisão contratual verifica",
        paragraphs: [
          "A revisão analisa o equilíbrio entre as obrigações das partes, as penalidades previstas, as condições de rescisão, os prazos e as garantias. Também confere se o contrato reflete o que foi de fato negociado.",
        ],
      },
      {
        heading: "Prevenção custa menos que litígio",
        paragraphs: [
          "Ajustar um contrato antes da assinatura é significativamente mais simples do que discuti-lo em juízo. Para empresas, a revisão periódica dos modelos utilizados no dia a dia é uma medida de gestão de risco básica.",
        ],
      },
    ],
  },
  {
    slug: "desapropriacao",
    image: {
      src: "https://images.unsplash.com/photo-1561592390-ec0391c9c723?auto=format&fit=crop&w=1600&q=80",
      alt: "Vista aérea de quarteirões urbanos com edifícios",
      credit: "Foto: Lucas Marcomini / Unsplash",
      creditUrl: "https://unsplash.com/@lucasmarcomini?utm_source=site_andre_araujo&utm_medium=referral",
    },
    title: "Desapropriação",
    category: "Imobiliário e Locação",
    date: "2026-03-30", // TODO: ajustar para a data original na migração
    excerpt:
      "O poder público pode tomar um imóvel particular? Entenda como funciona a desapropriação e o direito do proprietário à justa indenização.",
    sections: [
      {
        paragraphs: [
          "A desapropriação é o procedimento pelo qual o poder público adquire compulsoriamente um bem particular, por necessidade ou utilidade pública, ou por interesse social. A Constituição exige, como regra, indenização justa e prévia.",
        ],
      },
      {
        heading: "O que o proprietário pode discutir",
        paragraphs: [
          "Na maioria dos casos, a discussão judicial gira em torno do valor da indenização: avaliações do poder público frequentemente ficam abaixo do valor de mercado do imóvel, das benfeitorias e das perdas decorrentes.",
          "O proprietário pode contestar o valor ofertado, apresentar avaliação própria e discutir juros, correção e honorários. O acompanhamento técnico desde a fase administrativa faz diferença no resultado.",
        ],
      },
    ],
  },
  {
    slug: "ferias-premio-do-servidor-estadual",
    image: {
      src: "https://images.unsplash.com/photo-1636652966850-5ac4d02370e9?auto=format&fit=crop&w=1600&q=80",
      alt: "Fachada de prédio público com colunas clássicas",
      credit: "Foto: Colin Lloyd / Unsplash",
      creditUrl: "https://unsplash.com/@onthesearchforpineapples?utm_source=site_andre_araujo&utm_medium=referral",
    },
    title: "Férias-prêmio do servidor estadual: o que diz a lei em Minas Gerais",
    category: "Tributário e Servidor Público",
    date: "2026-03-09", // Seed de exemplo — TODO: revisar conteúdo com o escritório
    excerpt:
      "Servidores públicos de Minas Gerais têm direito às férias-prêmio. Saiba como funciona o benefício e o que fazer quando ele não é reconhecido.",
    sections: [
      {
        paragraphs: [
          "As férias-prêmio são um direito dos servidores públicos estaduais de Minas Gerais previsto na legislação estadual: períodos de descanso remunerado adquiridos a cada ciclo de efetivo exercício.",
        ],
      },
      {
        heading: "Gozo, conversão e pendências",
        paragraphs: [
          "Em determinadas situações — como a aposentadoria sem o gozo integral do benefício — discute-se a conversão dos períodos em indenização. Cada caso depende do histórico funcional do servidor e das normas aplicáveis à sua carreira.",
          "Servidores que identificam períodos não reconhecidos devem reunir sua contagem de tempo e buscar orientação para avaliar as vias administrativa e judicial.",
        ],
      },
    ],
  },
  {
    slug: "locacao-comercial-direitos-do-lojista",
    image: {
      src: "https://images.unsplash.com/photo-1774845334998-616e157ec181?auto=format&fit=crop&w=1600&q=80",
      alt: "Fachada de loja comercial de rua",
      credit: "Foto: Owen Wei / Unsplash",
      creditUrl: "https://unsplash.com/@owen_wei?utm_source=site_andre_araujo&utm_medium=referral",
    },
    title: "Locação comercial: o que todo lojista precisa saber antes de assinar",
    category: "Imobiliário e Locação",
    date: "2026-02-16", // Seed de exemplo — TODO: revisar conteúdo com o escritório
    excerpt:
      "Ponto comercial é patrimônio. Conheça as cláusulas mais importantes do contrato de locação comercial e os direitos que protegem o seu negócio.",
    sections: [
      {
        paragraphs: [
          "Para o comerciante, o ponto é parte do valor do negócio. A Lei do Inquilinato traz proteções específicas para a locação não residencial — mas muitas delas dependem de condições contratuais que precisam ser observadas desde a assinatura.",
        ],
      },
      {
        heading: "Cláusulas que merecem atenção",
        paragraphs: [
          "Prazo do contrato, condições de renovação, índice de reajuste, responsabilidade por reformas e garantias locatícias são pontos que costumam gerar conflito. A ação renovatória, por exemplo, exige contrato escrito com prazo determinado e requisitos específicos.",
          "Revisar o contrato antes de assinar — e guardar toda a documentação da locação — evita surpresas na renovação ou na devolução do imóvel.",
        ],
      },
    ],
  },
  {
    slug: "restituicao-de-tributos-pagos-indevidamente",
    image: {
      src: "https://images.unsplash.com/photo-1625225233840-695456021cde?auto=format&fit=crop&w=1600&q=80",
      alt: "Calculadora e caneta sobre documentos em uma mesa",
      credit: "Foto: Mediamodifier / Unsplash",
      creditUrl: "https://unsplash.com/@mediamodifier?utm_source=site_andre_araujo&utm_medium=referral",
    },
    title: "Pagou tributo a mais? Entenda como funciona a restituição",
    category: "Tributário e Servidor Público",
    date: "2026-01-26", // Seed de exemplo — TODO: revisar conteúdo com o escritório
    excerpt:
      "Empresas e pessoas físicas recolhem tributos indevidos com mais frequência do que imaginam. Veja em que situações é possível pedir a devolução.",
    sections: [
      {
        paragraphs: [
          "Erros de enquadramento, cobranças em duplicidade e normas declaradas inconstitucionais fazem com que contribuintes paguem mais tributo do que devem. Nesses casos, a legislação prevê a restituição ou a compensação dos valores.",
        ],
      },
      {
        heading: "Prazos e caminho",
        paragraphs: [
          "Como regra, o pedido de restituição observa o prazo de cinco anos contados do pagamento indevido. O caminho pode ser administrativo ou judicial, conforme o tributo e a origem do erro.",
          "O ponto de partida é uma análise da documentação fiscal do período: guias de recolhimento, declarações e o regime de tributação adotado.",
        ],
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
