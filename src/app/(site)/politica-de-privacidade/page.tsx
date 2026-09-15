import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Política de Privacidade",
  description:
    "Política de privacidade do site do André Araújo Advogados: como tratamos os dados pessoais informados pelos visitantes.",
  path: "/politica-de-privacidade",
});

/*
 * TODO: submeter este texto à revisão do escritório antes da publicação,
 * ajustando-o às práticas reais de tratamento de dados (LGPD).
 */
export default function PrivacidadePage() {
  return (
    <div className="px-5 pb-28 pt-36 md:px-10 xl:px-16 lg:pb-48 lg:pt-48">
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs items={[{ label: "Política de Privacidade" }]} />
        <SectionHeading
          as="h1"
          title="Política de Privacidade"
          description="Como o André Araújo Advogados trata os dados pessoais informados neste site, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018)."
        />

        <div className="mt-16 space-y-12 text-lg text-ink-soft lg:mt-20">
          <section>
            <h2 className="mb-4 text-card text-ink">
              Dados que coletamos
            </h2>
            <p>
              Ao utilizar o formulário de contato, você nos informa nome,
              telefone celular, assunto, mensagem e, se quiser, e-mail. Esses
              dados são fornecidos voluntariamente, ficam guardados em área
              restrita do escritório e são utilizados exclusivamente para
              responder ao seu contato.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-card text-ink">
              Como usamos os dados
            </h2>
            <p>
              Os dados informados são utilizados para retornar o seu contato,
              agendar atendimentos e prestar as informações solicitadas. Não
              vendemos, alugamos ou compartilhamos seus dados pessoais com
              terceiros para fins comerciais.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-card text-ink">
              Armazenamento e segurança
            </h2>
            <p>
              Adotamos medidas técnicas e organizacionais razoáveis para
              proteger os dados pessoais contra acesso não autorizado, perda ou
              alteração. Os dados são mantidos apenas pelo tempo necessário às
              finalidades desta política ou ao cumprimento de obrigações
              legais.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-card text-ink">
              Seus direitos
            </h2>
            <p>
              Nos termos da LGPD, você pode solicitar a confirmação do
              tratamento, o acesso, a correção ou a eliminação dos seus dados
              pessoais. Para exercer esses direitos, entre em contato pelo
              e-mail {site.email}.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-card text-ink">
              Cookies e serviços de terceiros
            </h2>
            <p>
              Este site pode utilizar cookies estritamente necessários ao seu
              funcionamento e incorpora serviços de terceiros, como o Google
              Maps, que possuem políticas de privacidade próprias.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-card text-ink">
              Contato
            </h2>
            <p>
              Dúvidas sobre esta política podem ser encaminhadas ao escritório
              pelo e-mail {site.email} ou pelo telefone {site.phone}, no
              endereço {site.address.full}.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
