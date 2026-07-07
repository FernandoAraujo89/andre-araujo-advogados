"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { categories, slugify, type Post } from "@/data/posts";
import Markdown from "@/components/Markdown";

type Props = {
  mode: "create" | "edit";
  initial?: Post;
};

const field =
  "w-full rounded-md border border-line bg-paper px-4 py-3 text-ink focus:border-wine focus:outline-none";
const labelCls = "mb-2 block text-base font-medium text-ink";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function PostEditor({ mode, initial }: Props) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [category, setCategory] = useState<string>(
    initial?.category ?? categories[0]
  );
  const [date, setDate] = useState(initial?.date ?? todayISO());
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [body, setBody] = useState(initial?.body ?? "");

  const [imageSrc, setImageSrc] = useState(initial?.image?.src ?? "");
  const [imageAlt, setImageAlt] = useState(initial?.image?.alt ?? "");
  const [imageCredit, setImageCredit] = useState(initial?.image?.credit ?? "");
  const [imageCreditUrl, setImageCreditUrl] = useState(
    initial?.image?.creditUrl ?? ""
  );

  const [preview, setPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function onTitle(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function onUpload(file: File) {
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        setImageSrc(data.url);
      } else {
        setError(data.error || "Falha no upload da imagem.");
      }
    } catch {
      setError("Erro de conexão no upload.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const payload = {
      title,
      slug,
      category,
      date,
      excerpt,
      body,
      image: imageSrc
        ? {
            src: imageSrc,
            alt: imageAlt,
            credit: imageCredit || undefined,
            creditUrl: imageCreditUrl || undefined,
          }
        : null,
    };
    try {
      const url =
        mode === "create"
          ? "/api/admin/posts"
          : `/api/admin/posts/${initial!.slug}`;
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        router.push("/admin");
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-3xl font-medium text-ink">
          {mode === "create" ? "Novo post" : "Editar post"}
        </h1>
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="rounded-sm border border-ink/20 px-5 py-3 font-medium text-ink transition-colors hover:border-wine"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
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

      <div>
        <label htmlFor="title" className={labelCls}>
          Título
        </label>
        <input
          id="title"
          value={title}
          onChange={(e) => onTitle(e.target.value)}
          className={field}
          required
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="slug" className={labelCls}>
            Endereço (slug)
          </label>
          <input
            id="slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            className={field}
          />
          <p className="mt-1 text-sm text-ink-soft">/blog/{slug || "…"}</p>
        </div>
        <div>
          <label htmlFor="date" className={labelCls}>
            Data de publicação
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={field}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="category" className={labelCls}>
          Categoria
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={field}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="excerpt" className={labelCls}>
          Resumo <span className="font-normal text-ink-soft">(aparece nos cards e no Google)</span>
        </label>
        <textarea
          id="excerpt"
          rows={2}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className={field}
          required
        />
      </div>

      {/* Imagem de capa */}
      <fieldset className="rounded-md border border-line p-5">
        <legend className="px-2 text-base font-medium text-ink">
          Imagem de capa
        </legend>
        {imageSrc ? (
          <div className="mb-4 overflow-hidden rounded-md border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt={imageAlt || "Pré-visualização da capa"}
              className="max-h-64 w-full object-cover"
            />
          </div>
        ) : null}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={uploading}
            className="rounded-sm border border-ink/20 px-4 py-2 font-medium text-ink transition-colors hover:border-wine disabled:opacity-60"
          >
            {uploading ? "Enviando..." : "Enviar imagem"}
          </button>
          {imageSrc && (
            <button
              type="button"
              onClick={() => setImageSrc("")}
              className="font-medium text-wine-deep hover:text-wine"
            >
              Remover
            </button>
          )}
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onUpload(f);
              e.target.value = "";
            }}
          />
        </div>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="imageSrc" className="mb-1 block text-sm text-ink-soft">
              …ou cole a URL de uma imagem
            </label>
            <input
              id="imageSrc"
              value={imageSrc}
              onChange={(e) => setImageSrc(e.target.value)}
              placeholder="https://…"
              className={field}
            />
          </div>
          {imageSrc && (
            <>
              <div>
                <label htmlFor="imageAlt" className="mb-1 block text-sm text-ink-soft">
                  Descrição da imagem (acessibilidade)
                </label>
                <input
                  id="imageAlt"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  className={field}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="imageCredit" className="mb-1 block text-sm text-ink-soft">
                    Crédito (opcional)
                  </label>
                  <input
                    id="imageCredit"
                    value={imageCredit}
                    onChange={(e) => setImageCredit(e.target.value)}
                    className={field}
                  />
                </div>
                <div>
                  <label htmlFor="imageCreditUrl" className="mb-1 block text-sm text-ink-soft">
                    Link do crédito (opcional)
                  </label>
                  <input
                    id="imageCreditUrl"
                    value={imageCreditUrl}
                    onChange={(e) => setImageCreditUrl(e.target.value)}
                    className={field}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </fieldset>

      {/* Corpo */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="body" className="text-base font-medium text-ink">
            Conteúdo <span className="font-normal text-ink-soft">(Markdown)</span>
          </label>
          <button
            type="button"
            onClick={() => setPreview((v) => !v)}
            className="text-base font-medium text-wine-deep hover:text-wine"
          >
            {preview ? "Voltar a editar" : "Pré-visualizar"}
          </button>
        </div>
        {preview ? (
          <div className="min-h-64 rounded-md border border-line bg-paper-light p-6">
            {body.trim() ? (
              <Markdown>{body}</Markdown>
            ) : (
              <p className="text-ink-soft">Nada para pré-visualizar ainda.</p>
            )}
          </div>
        ) : (
          <textarea
            id="body"
            rows={18}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className={`${field} font-mono text-[0.95rem] leading-relaxed`}
            placeholder={"Escreva o artigo aqui.\n\n## Um subtítulo\n\nUm parágrafo com **negrito**, *itálico* e [links](https://exemplo.com).\n\n- item de lista\n- outro item"}
            required
          />
        )}
        <p className="mt-2 text-sm text-ink-soft">
          Dica: <code>## Subtítulo</code>, <code>**negrito**</code>,{" "}
          <code>- lista</code>, <code>[texto](link)</code>.
        </p>
      </div>
    </form>
  );
}
