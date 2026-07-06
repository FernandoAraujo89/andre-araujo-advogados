import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Button from "@/components/Button";

const uteis = [
  { label: "Áreas de Atuação", href: "/areas-de-atuacao" },
  { label: "Equipe", href: "/equipe" },
  { label: "Blog", href: "/blog" },
  { label: "Contato", href: "/contato" },
];

export default function NotFound() {
  return (
    <div className="px-5 pb-24 pt-40 lg:px-8 lg:pb-32">
      <div className="mx-auto max-w-[1240px] text-center">
        <p className="eyebrow mb-4">Erro 404</p>
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
                className="inline-flex items-center gap-2 rounded-full border border-line bg-paper-light px-6 py-3 font-medium text-ink transition-colors hover:border-brass hover:text-brass-deep"
              >
                {item.label}
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
