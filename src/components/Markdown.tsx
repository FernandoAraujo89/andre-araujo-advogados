import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renderiza o corpo Markdown de um post com a tipografia editorial do site.
 * Sem HTML bruto (react-markdown ignora tags por padrão) — seguro por design.
 */
export default function Markdown({ children }: { children: string }) {
  return (
    <div className="space-y-5 text-lg leading-relaxed text-ink-soft">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => (
            <h2 className="mt-12 font-serif text-2xl font-medium text-ink lg:text-3xl">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-8 font-serif text-xl font-medium text-ink">
              {children}
            </h3>
          ),
          p: ({ children }) => <p>{children}</p>,
          a: ({ href, children }) => (
            <a
              href={href}
              className="font-medium text-wine underline decoration-wine/40 underline-offset-2 transition-colors hover:text-wine-deep"
              {...(href?.startsWith("http")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-ink">{children}</strong>
          ),
          ul: ({ children }) => (
            <ul className="ml-5 list-disc space-y-2 marker:text-wine">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="ml-5 list-decimal space-y-2 marker:text-ink-soft">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="pl-1">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-wine pl-5 font-serif text-xl italic text-ink">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="border-line" />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
