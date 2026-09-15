import Link from "next/link";
import SiteChrome from "@/components/SiteChrome";
import Button from "@/components/Button";
import { navMain } from "@/data/site";

/**
 * 404 global. Usa o chrome do site para não ficar "solta" em URLs antigas do
 * Wix que escapem dos redirects.
 */
export default function NotFound() {
  return (
    <SiteChrome>
      <div className="px-5 pb-28 pt-44 md:px-10 xl:px-16 lg:pb-48 lg:pt-56">
        <div className="mx-auto max-w-[1240px] text-center">
          <h1 className="text-balance mx-auto max-w-4xl text-display text-ink">
            Esta página <em>não foi encontrada</em>
          </h1>
          <p className="mx-auto mt-8 max-w-xl text-lg text-ink-soft">
            O endereço pode ter mudado com o novo site. Veja abaixo os caminhos
            mais procurados ou volte para a página inicial.
          </p>
          <div className="mt-12">
            <Button href="/" size="lg">
              Ir para a página inicial
            </Button>
          </div>
          <ul className="mt-12 flex flex-wrap justify-center gap-3">
            {navMain.map((item) => (
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
