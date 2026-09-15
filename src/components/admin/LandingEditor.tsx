"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { slugify } from "@/data/posts";
import {
  emptyLandingPage,
  newSection,
  sectionLabels,
  type LandingPage,
  type LandingPageInput,
  type LpImage,
  type LpSection,
  type LpSectionType,
} from "@/data/landing";

type Props = {
  mode: "create" | "edit";
  initial?: LandingPage;
};

const field =
  "w-full rounded-md border border-line bg-paper px-4 py-3 text-ink focus:border-wine focus:outline-none";
const labelCls = "mb-2 block text-base font-medium text-ink";
const hintCls = "mt-1 text-sm text-ink-soft";
const smallBtn =
  "rounded-sm border border-ink/20 px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:border-wine disabled:opacity-40";

/** Envia a imagem pela mesma rota do blog e devolve a URL pública. */
async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.url) throw new Error(data.error || "Falha no upload da imagem.");
  return data.url as string;
}

function Field({
  label,
  value,
  onChange,
  hint,
  max,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  max?: number;
  placeholder?: string;
}) {
  return (
    <div>
      <label className={labelCls}>
        {label}
        {max !== undefined && (
          <span className="ml-2 font-normal text-ink-soft">
            {value.length}/{max}
          </span>
        )}
      </label>
      <input
        value={value}
        maxLength={max}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={field}
      />
      {hint && <p className={hintCls}>{hint}</p>}
    </div>
  );
}

function Area({
  label,
  value,
  onChange,
  rows = 4,
  hint,
  max,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  hint?: string;
  max?: number;
  placeholder?: string;
}) {
  return (
    <div>
      <label className={labelCls}>
        {label}
        {max !== undefined && (
          <span className="ml-2 font-normal text-ink-soft">
            {value.length}/{max}
          </span>
        )}
      </label>
      <textarea
        value={value}
        rows={rows}
        maxLength={max}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={field}
      />
      {hint && <p className={hintCls}>{hint}</p>}
    </div>
  );
}

/** Imagem: upload pelo painel ou URL, com a descrição para acessibilidade. */
function ImageField({
  label,
  value,
  onChange,
  onError,
  hint,
}: {
  label: string;
  value?: LpImage;
  onChange: (v: LpImage | undefined) => void;
  onError: (msg: string) => void;
  hint?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function onFile(file: File) {
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange({ src: url, alt: value?.alt ?? "" });
    } catch (err) {
      onError(err instanceof Error ? err.message : "Falha no upload.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="rounded-md border border-line p-4">
      <p className="text-base font-medium text-ink">{label}</p>
      {hint && <p className={hintCls}>{hint}</p>}
      {value?.src && (
        <div className="mt-3 overflow-hidden rounded-md border border-line">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value.src} alt={value.alt || ""} className="max-h-56 w-full object-cover" />
        </div>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={uploading}
          className={smallBtn}
        >
          {uploading ? "Enviando..." : value?.src ? "Trocar imagem" : "Enviar imagem"}
        </button>
        {value?.src && (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="text-sm font-medium text-wine-deep hover:text-wine"
          >
            Remover
          </button>
        )}
        <input
          ref={input}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
            e.target.value = "";
          }}
        />
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <input
          value={value?.src ?? ""}
          placeholder="…ou cole a URL de uma imagem"
          onChange={(e) =>
            onChange(e.target.value ? { src: e.target.value, alt: value?.alt ?? "" } : undefined)
          }
          className={field}
        />
        <input
          value={value?.alt ?? ""}
          placeholder="Descrição da imagem (acessibilidade)"
          disabled={!value?.src}
          onChange={(e) => onChange({ src: value?.src ?? "", alt: e.target.value })}
          className={field}
        />
      </div>
    </div>
  );
}

/** Lista de pares (título + texto, ou pergunta + resposta). */
function PairsEditor<A extends string, B extends string>({
  items,
  keys,
  labels,
  onChange,
  max = 12,
}: {
  items: Array<Record<A | B, string>>;
  keys: [A, B];
  labels: [string, string];
  onChange: (items: Array<Record<A | B, string>>) => void;
  max?: number;
}) {
  const [ka, kb] = keys;
  const set = (i: number, k: A | B, v: string) => {
    const next = items.map((it, j) => (j === i ? { ...it, [k]: v } : it));
    onChange(next);
  };
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div key={i} className="rounded-md border border-line bg-paper-light p-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-ink-soft">Item {i + 1}</span>
            <div className="flex gap-2">
              <button type="button" className={smallBtn} disabled={i === 0}
                onClick={() => { const n = [...items]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; onChange(n); }}>
                ↑
              </button>
              <button type="button" className={smallBtn} disabled={i === items.length - 1}
                onClick={() => { const n = [...items]; [n[i + 1], n[i]] = [n[i], n[i + 1]]; onChange(n); }}>
                ↓
              </button>
              <button type="button" className="text-sm font-medium text-wine-deep hover:text-wine"
                onClick={() => onChange(items.filter((_, j) => j !== i))}>
                Remover
              </button>
            </div>
          </div>
          <input
            value={it[ka]}
            placeholder={labels[0]}
            maxLength={200}
            onChange={(e) => set(i, ka, e.target.value)}
            className={`${field} mt-2`}
          />
          <textarea
            value={it[kb]}
            placeholder={labels[1]}
            rows={2}
            maxLength={2000}
            onChange={(e) => set(i, kb, e.target.value)}
            className={`${field} mt-2`}
          />
        </div>
      ))}
      {items.length < max && (
        <button
          type="button"
          className={smallBtn}
          onClick={() => onChange([...items, { [ka]: "", [kb]: "" } as Record<A | B, string>])}
        >
          + Adicionar item
        </button>
      )}
    </div>
  );
}

function SectionFields({
  section,
  onChange,
  onError,
}: {
  section: LpSection;
  onChange: (s: LpSection) => void;
  onError: (msg: string) => void;
}) {
  switch (section.type) {
    case "texto":
      return (
        <div className="space-y-4">
          <Field label="Título" value={section.title} onChange={(v) => onChange({ ...section, title: v })} max={200} />
          <Area
            label="Texto"
            value={section.text}
            rows={8}
            max={6000}
            onChange={(v) => onChange({ ...section, text: v })}
            hint="Parágrafos separados por linha em branco. Aceita **negrito**, listas com - e [links](https://…)."
          />
          <ImageField
            label="Imagem ao lado (opcional)"
            value={section.image}
            onChange={(v) => onChange({ ...section, image: v })}
            onError={onError}
          />
        </div>
      );
    case "lista":
      return (
        <div className="space-y-4">
          <Field label="Título" value={section.title} onChange={(v) => onChange({ ...section, title: v })} max={200} />
          <Area label="Introdução (opcional)" value={section.intro ?? ""} rows={2} max={1000}
            onChange={(v) => onChange({ ...section, intro: v || undefined })} />
          <Area
            label="Itens"
            value={section.items.join("\n")}
            rows={6}
            onChange={(v) => onChange({ ...section, items: v.split("\n") })}
            hint="Um item por linha. Aparecem como cartões com um sinal de confirmação."
          />
        </div>
      );
    case "passos":
    case "cards":
      return (
        <div className="space-y-4">
          <Field label="Título" value={section.title} onChange={(v) => onChange({ ...section, title: v })} max={200} />
          <Area label="Introdução (opcional)" value={section.intro ?? ""} rows={2} max={1000}
            onChange={(v) => onChange({ ...section, intro: v || undefined })} />
          <PairsEditor
            items={section.items}
            keys={["title", "text"]}
            labels={["Título do item", "Texto do item"]}
            onChange={(items) => onChange({ ...section, items })}
          />
        </div>
      );
    case "sobre":
      return (
        <div className="space-y-4">
          <Field label="Título" value={section.title} onChange={(v) => onChange({ ...section, title: v })} max={200} />
          <Area label="Texto" value={section.text} rows={6} max={4000}
            onChange={(v) => onChange({ ...section, text: v })}
            hint="Formação, experiência na área e como o atendimento acontece. Aceita Markdown simples." />
          <ImageField
            label="Foto (opcional)"
            value={section.image}
            onChange={(v) => onChange({ ...section, image: v })}
            onError={onError}
            hint="Sem foto, a página usa o retrato do André."
          />
        </div>
      );
    case "avaliacoes":
      return (
        <p className="text-base text-ink-soft">
          Mostra a nota e as avaliações do Google já usadas na home (editáveis em src/data/reviews.ts).
        </p>
      );
    case "faq":
      return (
        <div className="space-y-4">
          <Field label="Título" value={section.title} onChange={(v) => onChange({ ...section, title: v })} max={200} />
          <PairsEditor
            items={section.items}
            keys={["question", "answer"]}
            labels={["Pergunta", "Resposta"]}
            onChange={(items) => onChange({ ...section, items })}
          />
        </div>
      );
    case "cta":
      return (
        <div className="space-y-4">
          <Field label="Título" value={section.title} onChange={(v) => onChange({ ...section, title: v })} max={200} />
          <Area label="Texto (opcional)" value={section.text} rows={2} max={1000}
            onChange={(v) => onChange({ ...section, text: v })} />
          <p className={hintCls}>Faixa escura com o botão do WhatsApp, usando a mesma mensagem inicial do topo.</p>
        </div>
      );
  }
}

export default function LandingEditor({ mode, initial }: Props) {
  const router = useRouter();
  const [page, setPage] = useState<LandingPageInput>(() =>
    initial ? { ...initial } : emptyLandingPage()
  );
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [addType, setAddType] = useState<LpSectionType>("texto");

  const patch = (p: Partial<LandingPageInput>) => setPage((cur) => ({ ...cur, ...p }));
  const hero = (p: Partial<LandingPageInput["hero"]>) =>
    setPage((cur) => ({ ...cur, hero: { ...cur.hero, ...p } }));
  const seo = (p: Partial<LandingPageInput["seo"]>) =>
    setPage((cur) => ({ ...cur, seo: { ...cur.seo, ...p } }));
  const fechamento = (p: Partial<LandingPageInput["fechamento"]>) =>
    setPage((cur) => ({ ...cur, fechamento: { ...cur.fechamento, ...p } }));

  function onName(value: string) {
    patch({ name: value, ...(slugTouched ? {} : { slug: slugify(value) }) });
  }

  function setSection(id: string, next: LpSection) {
    setPage((cur) => ({ ...cur, sections: cur.sections.map((s) => (s.id === id ? next : s)) }));
  }
  function moveSection(id: string, dir: -1 | 1) {
    setPage((cur) => {
      const i = cur.sections.findIndex((s) => s.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= cur.sections.length) return cur;
      const next = [...cur.sections];
      [next[i], next[j]] = [next[j], next[i]];
      return { ...cur, sections: next };
    });
  }
  function removeSection(id: string) {
    setPage((cur) => ({ ...cur, sections: cur.sections.filter((s) => s.id !== id) }));
  }
  function addSection() {
    setPage((cur) => ({ ...cur, sections: [...cur.sections, newSection(addType)] }));
  }

  async function save(status: LandingPageInput["status"]) {
    setError("");
    setSaving(true);
    const payload: LandingPageInput = { ...page, status };
    try {
      const url = mode === "create" ? "/api/admin/landing" : `/api/admin/landing/${initial!.slug}`;
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        router.push("/admin/landing");
        router.refresh();
        return;
      }
      setError(data.error || "Não foi possível salvar.");
    } catch {
      setError("Erro de conexão ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); save(page.status); }} className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-medium text-ink">
            {mode === "create" ? "Nova landing page" : "Editar landing page"}
          </h1>
          <p className="mt-1 text-base text-ink-soft">
            Endereço: /areas-de-atuacao/{page.slug || "…"}
            {mode === "edit" && initial && (
              <>
                {" · "}
                <a
                  href={`/admin/preview/${initial.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-wine-deep hover:text-wine"
                >
                  Pré-visualizar (o que está salvo) ↗
                </a>
              </>
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/landing"
            className="rounded-sm border border-ink/20 px-5 py-3 font-medium text-ink transition-colors hover:border-wine"
          >
            Cancelar
          </Link>
          <button
            type="button"
            disabled={saving}
            onClick={() => save("rascunho")}
            className="rounded-sm border border-wine px-5 py-3 font-medium text-wine-deep transition-colors hover:bg-wine-mist disabled:opacity-60"
          >
            Salvar rascunho
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => save("publicada")}
            className="rounded-sm bg-wine px-6 py-3 font-medium text-paper-light transition-colors hover:bg-wine-deep disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Salvar e publicar"}
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="rounded-md border border-wine/30 bg-wine-mist px-4 py-3 text-base text-wine-deep">
          {error}
        </p>
      )}

      <p className="rounded-md border border-line bg-paper-light px-4 py-3 text-sm text-ink-soft">
        Publicidade na advocacia (Provimento 205/2021 da OAB): informe e oriente, sem promessa de
        resultado, sem preços e sem comparação com outros escritórios. Títulos curtos e um único
        pedido de ação por página convertem melhor em tráfego pago.
      </p>

      {/* Identificação */}
      <fieldset className="space-y-4 rounded-md border border-line p-5">
        <legend className="px-2 text-base font-medium text-ink">Identificação</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome no menu" value={page.name} onChange={onName} max={60}
            hint="Curto: é o rótulo em Áreas de Atuação e o assunto do formulário." />
          <div>
            <label className={labelCls}>Endereço (slug)</label>
            <input
              value={page.slug}
              onChange={(e) => { setSlugTouched(true); patch({ slug: e.target.value }); }}
              className={field}
            />
            <p className={hintCls}>Só letras, números e hífens. Se já existir, o painel acrescenta um número.</p>
          </div>
        </div>
        <Area label="Frase do card" value={page.tagline} rows={2} max={200}
          onChange={(v) => patch({ tagline: v })}
          hint="Aparece no índice de áreas, abaixo do nome." />
      </fieldset>

      {/* Hero */}
      <fieldset className="space-y-4 rounded-md border border-line p-5">
        <legend className="px-2 text-base font-medium text-ink">Topo da página</legend>
        <Field label="Sobretítulo (opcional)" value={page.hero.eyebrow ?? ""} max={80}
          onChange={(v) => hero({ eyebrow: v || undefined })} placeholder="Ex.: Direito do Servidor Público" />
        <Field label="Título principal" value={page.hero.title} max={160}
          onChange={(v) => hero({ title: v })} hint="O problema ou o direito, em uma frase." />
        <Area label="Subtítulo" value={page.hero.subtitle} rows={3} max={400}
          onChange={(v) => hero({ subtitle: v })} hint="Para quem é e o que a pessoa ganha ao falar com o escritório." />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Texto do botão" value={page.hero.ctaLabel} max={40}
            onChange={(v) => hero({ ctaLabel: v })} />
          <Field label="Mensagem inicial do WhatsApp" value={page.hero.whatsappMessage} max={300}
            onChange={(v) => hero({ whatsappMessage: v })}
            hint="Já vem escrita quando o visitante abre o WhatsApp; ajuda a identificar a campanha." />
        </div>
        <Field label="Vídeo do YouTube (opcional)" value={page.hero.videoUrl ?? ""} max={300}
          onChange={(v) => hero({ videoUrl: v || undefined })}
          placeholder="https://www.youtube.com/watch?v=…"
          hint="Um vídeo curto do advogado explicando o tema converte bem. Se houver vídeo, a imagem não é usada." />
        <ImageField
          label="Imagem do topo (opcional)"
          value={page.hero.image}
          onChange={(v) => hero({ image: v })}
          onError={setError}
          hint="Formato paisagem (4:3). Foto real do escritório ou do advogado."
        />
      </fieldset>

      {/* Seções */}
      <fieldset className="space-y-4 rounded-md border border-line p-5">
        <legend className="px-2 text-base font-medium text-ink">Seções</legend>
        <p className="text-sm text-ink-soft">
          Na ordem em que aparecem na página, entre o topo e o fechamento. Use as setas para reordenar.
        </p>
        {page.sections.map((s, i) => (
          <div key={s.id} className="rounded-md border border-line p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="font-medium text-ink">
                <span className="mr-2 font-serif text-sm italic text-wine">{String(i + 1).padStart(2, "0")}</span>
                {sectionLabels[s.type]}
              </p>
              <div className="flex items-center gap-2">
                <button type="button" className={smallBtn} disabled={i === 0} onClick={() => moveSection(s.id, -1)} aria-label="Mover para cima">↑</button>
                <button type="button" className={smallBtn} disabled={i === page.sections.length - 1} onClick={() => moveSection(s.id, 1)} aria-label="Mover para baixo">↓</button>
                <button type="button" className="text-sm font-medium text-wine-deep hover:text-wine" onClick={() => removeSection(s.id)}>
                  Remover
                </button>
              </div>
            </div>
            <SectionFields section={s} onChange={(next) => setSection(s.id, next)} onError={setError} />
          </div>
        ))}
        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4">
          <select value={addType} onChange={(e) => setAddType(e.target.value as LpSectionType)} className={`${field} sm:w-72`}>
            {(Object.keys(sectionLabels) as LpSectionType[]).map((t) => (
              <option key={t} value={t}>{sectionLabels[t]}</option>
            ))}
          </select>
          <button type="button" onClick={addSection} disabled={page.sections.length >= 20} className={smallBtn}>
            + Adicionar seção
          </button>
        </div>
      </fieldset>

      {/* Fechamento */}
      <fieldset className="space-y-4 rounded-md border border-line p-5">
        <legend className="px-2 text-base font-medium text-ink">Fechamento</legend>
        <Field label="Título" value={page.fechamento.title} max={160}
          onChange={(v) => fechamento({ title: v })} />
        <Area label="Texto" value={page.fechamento.text} rows={2} max={600}
          onChange={(v) => fechamento({ text: v })} />
        <label className="flex items-center gap-3 text-base text-ink">
          <input
            type="checkbox"
            checked={page.fechamento.formulario}
            onChange={(e) => fechamento({ formulario: e.target.checked })}
            className="h-4 w-4"
          />
          Mostrar o formulário de contato com o assunto já marcado com o nome desta página
        </label>
      </fieldset>

      {/* SEO */}
      <fieldset className="space-y-4 rounded-md border border-line p-5">
        <legend className="px-2 text-base font-medium text-ink">Google e compartilhamento</legend>
        <Field label="Título da aba/Google" value={page.seo.title} max={70}
          onChange={(v) => seo({ title: v })} hint="Vazio usa o nome do menu. Até 60 caracteres é o ideal." />
        <Area label="Descrição para o Google" value={page.seo.description} rows={2} max={160}
          onChange={(v) => seo({ description: v })} hint="Vazio usa a frase do card. Até 155 caracteres." />
        <ImageField
          label="Imagem de compartilhamento (opcional)"
          value={page.seo.image ? { src: page.seo.image, alt: "" } : undefined}
          onChange={(v) => seo({ image: v?.src || undefined })}
          onError={setError}
          hint="Aparece ao compartilhar o link no WhatsApp e nas redes. Vazio usa a imagem do topo."
        />
      </fieldset>
    </form>
  );
}
