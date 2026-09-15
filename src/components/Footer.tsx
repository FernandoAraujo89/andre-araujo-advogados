import Link from "next/link";
import Image from "next/image";
import { site, navMain, navSecondary } from "@/data/site";
import type { AreaDeAtuacao } from "@/data/atuacao";
import SocialLinks from "@/components/SocialLinks";

export default function Footer({ areas }: { areas: AreaDeAtuacao[] }) {
  // Quebra o e-mail só após o "@" (via <wbr>), evitando cortes no meio
  // do domínio na coluna estreita do rodapé.
  const [emailLocal, emailDomain] = site.email.split("@");

  return (
    <footer className="bg-ink px-5 text-paper/80 md:px-10 xl:px-16">
      <div className="mx-auto max-w-[1240px] py-20 lg:py-32">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_1fr_1fr] xl:gap-16">
          <div>
            <Image
              src="/logo-horizontal.png"
              alt="André Araújo Advogados"
              width={1311}
              height={636}
              className="h-16 w-auto"
            />
            <p className="mt-4 max-w-xs text-[0.9375rem] leading-relaxed">
              Advocacia para pessoas, empresas e servidores públicos, com
              atendimento presencial ou remoto em todo o Brasil.
            </p>
            <SocialLinks className="mt-6" />
          </div>

          <nav aria-label="Navegação do rodapé">
            <h2 className="text-[0.9375rem] font-medium text-gold">Navegação</h2>
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

          <nav aria-label="Áreas de atuação">
            <h2 className="text-[0.9375rem] font-medium text-gold">Áreas de Atuação</h2>
            <ul className="mt-5 space-y-3 text-[0.9375rem]">
              {areas.map((a) => (
                <li key={a.href}>
                  <Link href={a.href} className="transition-colors hover:text-paper-light">
                    {a.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-[0.9375rem] font-medium text-gold">Contato</h2>
            <ul className="mt-5 space-y-4 text-[0.9375rem]">
              <li>
                <a href={site.phoneHref} className="transition-colors hover:text-paper-light">
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={site.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-paper-light"
                >
                  WhatsApp {site.whatsapp}
                </a>
              </li>
              <li>
                <a
                  href={site.emailHref}
                  className="break-words transition-colors hover:text-paper-light"
                >
                  {emailLocal}@<wbr />
                  {emailDomain}
                </a>
              </li>
              <li>
                <Link href="/contato" className="transition-colors hover:text-paper-light">
                  Endereço e mapa da sede
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-paper/15 pt-8 text-base text-paper/60 md:flex-row md:items-center md:justify-between lg:mt-24">
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
