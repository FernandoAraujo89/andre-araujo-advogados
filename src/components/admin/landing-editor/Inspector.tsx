"use client";

import { useRef, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, Trash2, Upload, X } from "lucide-react";
import { resolveMembers } from "@/components/landing/LandingPageView";
import {
  sectionHints,
  sectionLabels,
  type LpButton,
  type LpImage,
  type LpLink,
  type LpSection,
} from "@/data/landing";
import { categories, type Post } from "@/data/posts";
import type { TeamMember } from "@/data/team";
import { useEditor } from "./EditorContext";
import { getIn, listOps } from "./state";

/**
 * Painel lateral do editor: mostra as opções do que está selecionado. Sem
 * seleção, mostra os dados da página (nome no menu, endereço, WhatsApp,
 * Google) e o sumário das seções.
 */

const field =
  "w-full rounded-md border border-line bg-white px-3 py-2.5 text-[0.9375rem] text-ink focus:border-blue-500 focus:outline-none";
const label = "mb-1.5 block text-sm font-medium text-ink";
const hint = "mt-1 text-[0.8125rem] leading-snug text-ink-soft";

function Field({
  title,
  value,
  onChange,
  max,
  help,
  rows,
  placeholder,
  prefix,
}: {
  title: string;
  value: string;
  onChange: (v: string) => void;
  max?: number;
  help?: string;
  rows?: number;
  placeholder?: string;
  prefix?: string;
}) {
  return (
    <div>
      <label className={label}>
        {title}
        {max !== undefined && (
          <span className="ml-1.5 font-normal text-ink-soft">
            {value.length}/{max}
          </span>
        )}
        {rows ? (
          <textarea
            value={value}
            rows={rows}
            maxLength={max}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className={`${field} mt-1.5 font-normal`}
          />
        ) : (
          <span className="mt-1.5 flex items-center">
            {prefix && (
              <span className="rounded-l-md border border-r-0 border-line bg-paper px-2 py-2.5 text-[0.8125rem] font-normal text-ink-soft">
                {prefix}
              </span>
            )}
            <input
              value={value}
              maxLength={max}
              placeholder={placeholder}
              onChange={(e) => onChange(e.target.value)}
              className={`${field} font-normal ${prefix ? "rounded-l-none" : ""}`}
            />
          </span>
        )}
      </label>
      {help && <p className={hint}>{help}</p>}
    </div>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4 border-t border-line px-5 py-5 first:border-t-0">
      <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft">{title}</h3>
      {children}
    </section>
  );
}

function PagePanel({ storageEnabled }: { storageEnabled: boolean }) {
  const { page, set, apply, select } = useEditor();
  return (
    <>
      {!storageEnabled && (
        <p className="mx-5 mt-5 rounded-md border border-wine/30 bg-wine-mist px-4 py-3 text-sm text-wine-deep">
          O banco de dados não está configurado neste ambiente: dá para editar e ver a página, mas
          salvar vai falhar.
        </p>
      )}
      <Group title="Publicação">
        <div className="grid grid-cols-2 gap-2">
          {(["rascunho", "publicada"] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => set(["status"], st)}
              className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                page.status === st
                  ? "border-blue-500 bg-blue-50 text-blue-800"
                  : "border-line bg-white text-ink-soft hover:border-ink/30"
              }`}
            >
              {st === "rascunho" ? "Rascunho" : "Publicada"}
            </button>
          ))}
        </div>
        <p className={hint}>
          Publicada, a página entra no menu de áreas, no índice de áreas e no rodapé. O rascunho só
          aparece na pré-visualização do painel.
        </p>
      </Group>
      <Group title="Identificação">
        <Field
          title="Nome no menu"
          value={page.name}
          max={60}
          onChange={(v) => set(["name"], v)}
          placeholder="Ex.: Férias-prêmio de aposentados"
        />
        <Field
          title="Frase do card"
          value={page.tagline}
          max={200}
          rows={3}
          onChange={(v) => set(["tagline"], v)}
          help="Aparece no card da página no índice de áreas de atuação."
        />
        <Field
          title="Endereço"
          prefix="/areas-de-atuacao/"
          value={page.slug}
          max={80}
          onChange={(v) => set(["slug"], v)}
          help="Vazio usa o nome. Letras minúsculas e hífens."
        />
      </Group>
      <Group title="WhatsApp">
        <Field
          title="Mensagem inicial"
          value={page.whatsappMessage}
          max={300}
          rows={3}
          onChange={(v) => set(["whatsappMessage"], v)}
          help="Texto que já vem escrito quando o visitante toca num botão de WhatsApp desta página."
        />
      </Group>
      <Group title="Google e compartilhamento">
        <Field
          title="Título da aba e do Google"
          value={page.seo.title}
          max={70}
          onChange={(v) => set(["seo", "title"], v)}
          help="Vazio usa o nome do menu. Até 60 caracteres é o ideal."
        />
        <Field
          title="Descrição"
          value={page.seo.description}
          max={160}
          rows={3}
          onChange={(v) => set(["seo", "description"], v)}
          help="Vazio usa a frase do card. Entre 120 e 160 caracteres é o ideal."
        />
        <Field
          title="Imagem de compartilhamento (opcional)"
          value={page.seo.image ?? ""}
          max={500}
          onChange={(v) => set(["seo", "image"], v || undefined)}
          placeholder="https://..."
          help="Vazio usa a imagem do topo."
        />
      </Group>
      <Group title="Seções">
        <ol className="space-y-1.5">
          {page.sections.map((s, i) => (
            <li
              key={s.id}
              className="flex items-center gap-1 rounded-md border border-line bg-white py-1 pl-3 pr-1"
            >
              <button
                type="button"
                onClick={() => select({ kind: "section", index: i })}
                className={`min-w-0 flex-1 truncate text-left text-sm ${
                  s.hidden ? "text-ink-soft line-through" : "text-ink"
                }`}
              >
                {sectionLabels[s.type]}
              </button>
              <IconBtn
                label="Subir"
                disabled={i === 0}
                onClick={() => apply((p) => listOps.move(p, ["sections"], i, i - 1))}
              >
                <ArrowUp />
              </IconBtn>
              <IconBtn
                label="Descer"
                disabled={i === page.sections.length - 1}
                onClick={() => apply((p) => listOps.move(p, ["sections"], i, i + 1))}
              >
                <ArrowDown />
              </IconBtn>
              <IconBtn
                label={s.hidden ? "Mostrar no site" : "Ocultar no site"}
                onClick={() => set(["sections", i, "hidden"], !s.hidden)}
              >
                {s.hidden ? <EyeOff /> : <Eye />}
              </IconBtn>
            </li>
          ))}
        </ol>
        <p className={hint}>
          Para acrescentar uma seção, passe o mouse entre duas seções da página e clique em
          “Adicionar seção”.
        </p>
      </Group>
    </>
  );
}

function IconBtn({
  label: title,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onClick={onClick}
      className="grid size-7 place-items-center rounded-sm text-ink-soft transition-colors hover:bg-paper hover:text-ink disabled:opacity-30 [&_svg]:size-4"
    >
      {children}
    </button>
  );
}

function ImagePanel({ path, extraHint }: { path: (string | number)[]; extraHint?: string }) {
  const { page, set, upload, notify } = useEditor();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const value = (getIn(page, path) as LpImage | undefined) ?? { src: "", alt: "" };
  const isHero = path[0] === "hero";

  async function onFile(file: File) {
    setBusy(true);
    try {
      const url = await upload(file);
      set(path, { src: url, alt: value.alt });
      notify("Imagem enviada.");
    } catch (err) {
      notify(err instanceof Error ? err.message : "Falha no upload.", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Group title="Imagem">
        <div className="overflow-hidden rounded-md border border-line bg-[repeating-conic-gradient(#efebe3_0%_25%,#fff_0%_50%)_0_0/16px_16px]">
          {value.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value.src} alt="" className="max-h-60 w-full object-contain" />
          ) : (
            <p className="px-4 py-10 text-center text-sm text-ink-soft">Nenhuma imagem</p>
          )}
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={() => input.current?.click()}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-paper-light transition-colors hover:bg-accent-surface-deep disabled:opacity-60"
        >
          <Upload aria-hidden className="size-4" />
          {busy ? "Enviando..." : "Enviar imagem do computador"}
        </button>
        <input
          ref={input}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
            e.target.value = "";
          }}
        />
        <p className={hint}>
          Também dá para arrastar o arquivo direto sobre a imagem na página. JPG, PNG, WebP ou AVIF;
          o painel reduz e otimiza para a web.
          {extraHint ? ` ${extraHint}` : ""}
        </p>
        <Field
          title="…ou endereço da imagem"
          value={value.src}
          onChange={(v) => set(path, { src: v.trim(), alt: value.alt })}
          placeholder="https://..."
        />
        <Field
          title="Descrição da imagem"
          value={value.alt}
          max={200}
          rows={2}
          onChange={(v) => set(path, { src: value.src, alt: v })}
          help="Descreva o que aparece na foto. É lido por quem usa leitor de tela e ajuda no Google."
        />
      </Group>
      {isHero && (
        <Group title="Ornamento">
          <label className="flex items-center gap-3 text-[0.9375rem] text-ink">
            <input
              type="checkbox"
              checked={page.hero.ornament}
              onChange={(e) => set(["hero", "ornament"], e.target.checked)}
              className="size-4 accent-blue-600"
            />
            Mostrar os louros dourados atrás da imagem
          </label>
        </Group>
      )}
    </>
  );
}

function ButtonPanel({ path }: { path: (string | number)[] }) {
  const { page, set } = useEditor();
  const value = getIn(page, path) as LpButton;
  const tipo = value.link.tipo;
  const hasContato = page.sections.some((s) => s.type === "contato" && !s.hidden);
  const setLink = (link: LpLink) => set([...path, "link"], link);

  const options: { tipo: LpLink["tipo"]; title: string; desc: string }[] = [
    { tipo: "whatsapp", title: "WhatsApp", desc: "Abre a conversa com a mensagem da página" },
    { tipo: "contato", title: "Formulário da página", desc: "Rola até o formulário de contato" },
    { tipo: "url", title: "Outro endereço", desc: "Página do site, link externo, telefone" },
  ];

  return (
    <Group title="Botão">
      <Field
        title="Texto"
        value={value.label}
        max={40}
        onChange={(v) => set([...path, "label"], v)}
      />
      <fieldset>
        <legend className={label}>Ao clicar</legend>
        <div className="space-y-2">
          {options.map((o) => (
            <label
              key={o.tipo}
              className={`flex cursor-pointer gap-3 rounded-md border px-3 py-2.5 transition-colors ${
                tipo === o.tipo ? "border-blue-500 bg-blue-50" : "border-line bg-white"
              }`}
            >
              <input
                type="radio"
                name="link-tipo"
                checked={tipo === o.tipo}
                onChange={() =>
                  setLink(o.tipo === "url" ? { tipo: "url", href: "" } : { tipo: o.tipo })
                }
                className="mt-1 accent-blue-600"
              />
              <span>
                <span className="block text-sm font-medium text-ink">{o.title}</span>
                <span className="block text-[0.8125rem] text-ink-soft">{o.desc}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      {value.link.tipo === "url" && (
        <Field
          title="Endereço"
          value={value.link.href}
          max={500}
          onChange={(v) => setLink({ tipo: "url", href: v.trim() })}
          placeholder="/contato ou https://..."
          help="Endereços do próprio site começam com /. Links externos abrem em outra aba."
        />
      )}
      {tipo === "contato" && !hasContato && (
        <p className="rounded-md border border-wine/30 bg-wine-mist px-3 py-2 text-[0.8125rem] text-wine-deep">
          Esta página não tem a seção “Formulário de contato” visível. Acrescente a seção ou escolha
          outro destino.
        </p>
      )}
    </Group>
  );
}

function SectionPanel({
  index,
  team,
  posts,
}: {
  index: number;
  team: TeamMember[];
  posts: Post[];
}) {
  const { page, set, apply, select } = useEditor();
  const section = page.sections[index] as LpSection | undefined;
  if (!section) return null;

  return (
    <>
      <Group title={sectionLabels[section.type]}>
        <p className="text-sm text-ink-soft">{sectionHints[section.type]}.</p>
        <p className="text-sm text-ink-soft">
          Clique nos textos da página para editar. Imagens e botões abrem as opções aqui.
        </p>
      </Group>

      {section.type === "equipe" && (
        <Group title="Quem aparece">
          <p className={hint}>
            Sem ninguém marcado, aparecem o sócio fundador e os advogados com foto (
            {resolveMembers([], team)
              .map((m) => m.name.split(" ")[0])
              .join(", ")}
            ).
          </p>
          <ul className="max-h-80 space-y-1 overflow-y-auto">
            {team.map((m) => {
              const checked = section.members.includes(m.slug);
              return (
                <li key={m.slug}>
                  <label className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 hover:bg-paper">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        const next = checked
                          ? section.members.filter((s) => s !== m.slug)
                          : team
                              .map((t) => t.slug)
                              .filter((s) => s === m.slug || section.members.includes(s));
                        set(["sections", index, "members"], next);
                      }}
                      className="size-4 accent-blue-600"
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-sm text-ink">{m.name}</span>
                      <span className="block truncate text-[0.8125rem] text-ink-soft">
                        {[m.role, m.oab].filter(Boolean).join(", ")}
                        {!m.photo && " · sem foto"}
                      </span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </Group>
      )}

      {section.type === "blog" && (
        <Group title="Quais posts">
          <label className={label}>
            Categoria
            <select
              value={section.category}
              onChange={(e) => set(["sections", index, "category"], e.target.value)}
              className={`${field} mt-1.5 font-normal`}
            >
              <option value="">Todas (os mais recentes)</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c} ({posts.filter((p) => p.category === c).length})
                </option>
              ))}
            </select>
          </label>
          <p className={hint}>Mostra os 3 posts mais recentes. Os posts são editados em Posts.</p>
        </Group>
      )}

      <Group title="Seção">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => set(["sections", index, "hidden"], !section.hidden)}
            className="flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm text-ink transition-colors hover:border-ink/30"
          >
            {section.hidden ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
            {section.hidden ? "Mostrar no site" : "Ocultar no site"}
          </button>
          <button
            type="button"
            onClick={() => {
              if (!window.confirm(`Excluir a seção "${sectionLabels[section.type]}"?`)) return;
              select({ kind: "page" });
              apply((p) => listOps.remove(p, ["sections"], index));
            }}
            className="flex items-center gap-2 rounded-md border border-wine/30 bg-white px-3 py-2 text-sm text-wine-deep transition-colors hover:bg-wine-mist"
          >
            <Trash2 className="size-4" />
            Excluir seção
          </button>
        </div>
      </Group>
    </>
  );
}

export default function Inspector({
  team,
  posts,
  storageEnabled,
}: {
  team: TeamMember[];
  posts: Post[];
  storageEnabled: boolean;
}) {
  const { selection, select } = useEditor();
  const titles = {
    page: "Página",
    image: "Imagem",
    button: "Botão",
    section: "Seção",
  } as const;

  return (
    <aside
      aria-label="Opções do elemento selecionado"
      className="flex w-[22rem] shrink-0 flex-col border-l border-line bg-paper-light"
    >
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-line px-5">
        <h2 className="text-[0.9375rem] font-medium text-ink">{titles[selection.kind]}</h2>
        {selection.kind !== "page" && (
          <button
            type="button"
            onClick={() => select({ kind: "page" })}
            className="flex items-center gap-1 text-sm text-ink-soft hover:text-ink"
          >
            <X aria-hidden className="size-4" />
            Fechar
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        {selection.kind === "page" && <PagePanel storageEnabled={storageEnabled} />}
        {selection.kind === "image" && (
          <ImagePanel key={selection.path.join(".")} path={selection.path} extraHint={selection.hint} />
        )}
        {selection.kind === "button" && <ButtonPanel path={selection.path} />}
        {selection.kind === "section" && (
          <SectionPanel index={selection.index} team={team} posts={posts} />
        )}
      </div>
    </aside>
  );
}
