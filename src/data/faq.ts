/**
 * FAQ consolidado — reúne as dúvidas das antigas landing pages de nicho
 * e perguntas gerais de atendimento, agrupadas por tema.
 */

import { areas } from "./areas";
import { servidorPages } from "./servidores";
import type { AreaFaq } from "./areas";

export type FaqGroup = {
  theme: string;
  items: AreaFaq[];
};

const atendimento: AreaFaq[] = [
  {
    question: "Como agendo um atendimento?",
    answer:
      "Você pode falar com o escritório pelo WhatsApp (37) 99860-7180, ligar para (37) 3322-5265 ou enviar o formulário da página de contato. Retornaremos para agendar o melhor horário.",
  },
  {
    question: "O escritório atende apenas em Formiga?",
    answer:
      "O escritório fica em Formiga, MG, e atende clientes de toda a região centro-oeste de Minas Gerais. Em muitos casos, o atendimento pode ser feito também de forma remota.",
  },
  {
    question: "A primeira conversa tem custo?",
    answer:
      "As condições do atendimento são informadas de forma transparente no momento do agendamento, conforme o tipo de demanda. Entre em contato para entender como funciona no seu caso.",
  },
  {
    question: "Quais documentos devo levar ao atendimento?",
    answer:
      "Depende da demanda, mas em geral: documentos pessoais, contratos, comprovantes e qualquer comunicação relacionada ao caso. Ao agendar, orientamos exatamente o que reunir.",
  },
];

export const faqGroups: FaqGroup[] = [
  { theme: "Atendimento", items: atendimento },
  {
    theme: "Direito do Servidor Público",
    items: servidorPages.flatMap((p) => p.faq),
  },
  ...areas
    .filter((a) => a.faq.length > 0)
    .map((a) => ({ theme: a.name, items: a.faq })),
];
