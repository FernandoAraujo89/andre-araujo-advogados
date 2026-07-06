import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
} from "./SocialIcons";
import { site, navMain, navSecondary } from "@/data/site";
import { servidorPages } from "@/data/servidores";

const socials = [
  { label: "Facebook", href: site.social.facebook, Icon: FacebookIcon },
  { label: "Instagram", href: site.social.instagram, Icon: InstagramIcon },
  { label: "LinkedIn", href: site.social.linkedin, Icon: LinkedinIcon },
  { label: "YouTube", href: site.social.youtube, Icon: YoutubeIcon },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-paper/80">
      <div className="mx-auto max-w-[1240px] px-5 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            {/* TODO: substituir pelo logotipo real em versão clara */}
            <p className="font-serif text-xl font-semibold text-paper-light">
              André Araújo{" "}
              <span className="font-normal text-brass">Advogados</span>
            </p>
            <p className="mt-4 max-w-xs text-[0.9375rem] leading-relaxed">
              Advocacia em Formiga, MG, com atendimento próximo a empresas e
              famílias de toda a região.
            </p>
            <ul className="mt-6 flex gap-3">
              {socials.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/20 transition-colors hover:border-brass hover:text-brass"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Navegação do rodapé">
            <h2 className="eyebrow">Navegação</h2>
            <ul className="mt-5 space-y-3 text-[0.9375rem]">
              {[...navMain, ...navSecondary].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-brass">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Links para servidores públicos">
            <h2 className="eyebrow">Servidores Públicos</h2>
            <ul className="mt-5 space-y-3 text-[0.9375rem]">
              {servidorPages.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/servidores-publicos/${p.slug}`}
                    className="transition-colors hover:text-brass"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="eyebrow">Contato</h2>
            <ul className="mt-5 space-y-4 text-[0.9375rem]">
              <li className="flex gap-3">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-brass" strokeWidth={1.5} aria-hidden />
                <span>
                  {site.address.street}, {site.address.neighborhood}
                  <br />
                  {site.address.city}, {site.address.state} — CEP {site.address.zip}
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-1 h-4 w-4 shrink-0 text-brass" strokeWidth={1.5} aria-hidden />
                <a href={site.phoneHref} className="transition-colors hover:text-brass">
                  {site.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-1 h-4 w-4 shrink-0 text-brass" strokeWidth={1.5} aria-hidden />
                <a href={site.emailHref} className="break-all transition-colors hover:text-brass">
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
            className="transition-colors hover:text-brass"
          >
            Política de Privacidade
          </Link>
        </div>
      </div>
    </footer>
  );
}
