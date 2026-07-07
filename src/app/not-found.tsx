import Link from "next/link";
import SiteChrome from "@/components/SiteChrome";
import Button from "@/components/Button";

const uteis = [
  { label: "Servidor Público", href: "/servidores-publicos" },
  { label: "Cível e Empresarial", href: "/areas-de-atuacao" },
  { label: "Equipe", href: "/equipe" },
  { label: "Blog", href: "/blog" },
  { label: "Contato", href: "/contato" },
];

/**
 * 404 global. Usa o chrome do site (mundo cível, principal) para não ficar
 * "solta" em URLs antigas do Wix que escapem dos redirects.
 */
export default function NotFound() {
  return (
    <SiteChrome world="civel">
      <div className="px-5 pb-28 pt-44 lg:px-8 lg:pb-36">
        <div className="mx-auto max-w-[1240px] text-center">
          <h1 className="mx-auto max-w-2xl font-serif text-[clamp(2.5rem,5vw,4rem)] font-medium leading-[1.1] text-ink">
            Esta página não foi encontrada
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ink-soft">
            O endereço pode ter mudado com o novo site. Veja abaixo os caminhos
            mais procurados ou volte para a página inicial.
          </p>
          <div className="mt-9">
            <Button href="/" size="lg">
              Ir para a página inicial
            </Button>
          </div>
          <ul className="mt-10 flex flex-wrap justify-center gap-3">
            {uteis.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-block rounded-sm border border-line bg-paper-light px-6 py-3 font-medium text-ink transition-colors hover:border-accent hover:text-accent-deep"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SiteChrome>
  );
}
