import Link from "next/link";
import Image from "next/image";
import { site, navMain, navSecondary } from "@/data/site";
import { servidorPages } from "@/data/servidores";
import SocialLinks from "@/components/SocialLinks";

export default function Footer() {
  return (
    <footer className="bg-ink text-paper/80">
      <div className="mx-auto max-w-[1240px] px-5 py-20 lg:px-8 lg:py-24">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image
              src="/logo-horizontal.png"
              alt="André Araújo Advogados"
              width={1311}
              height={636}
              className="h-16 w-auto"
            />
            <p className="mt-4 max-w-xs text-[0.9375rem] leading-relaxed">
              Advocacia em Formiga, MG, com atendimento próximo a empresas e
              famílias de toda a região.
            </p>
            <SocialLinks className="mt-6" />
          </div>

          <nav aria-label="Navegação do rodapé">
            <h2 className="text-[0.8125rem] font-medium text-gold">Navegação</h2>
            <ul className="mt-5 space-y-3 text-[0.9375rem]">
              {[...navMain, ...navSecondary].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-paper-light">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Links para servidores públicos">
            <h2 className="text-[0.8125rem] font-medium text-gold">Direito do Servidor Público</h2>
            <ul className="mt-5 space-y-3 text-[0.9375rem]">
              {servidorPages.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/servidores-publicos/${p.slug}`}
                    className="transition-colors hover:text-paper-light"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-[0.8125rem] font-medium text-gold">Contato</h2>
            <ul className="mt-5 space-y-4 text-[0.9375rem]">
              <li>
                <span>
                  {site.address.street}, {site.address.neighborhood}
                  <br />
                  {site.address.city}, {site.address.state} — CEP {site.address.zip}
                </span>
              </li>
              <li>
                <a href={site.phoneHref} className="transition-colors hover:text-paper-light">
                  {site.phone}
                </a>
              </li>
              <li>
                <a href={site.emailHref} className="break-all transition-colors hover:text-paper-light">
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-paper/15 pt-8 text-sm text-paper/60 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. Todos os direitos
            reservados.
            {/* TODO: incluir o registro da sociedade na OAB/MG quando confirmado */}
          </p>
          <Link
            href="/politica-de-privacidade"
            className="transition-colors hover:text-paper-light"
          >
            Política de Privacidade
          </Link>
        </div>
      </div>
    </footer>
  );
}
