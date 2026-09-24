"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { slugify } from "@/data/posts";
import { SETORES, initialsOf, type TeamMember } from "@/data/team";
import { areas } from "@/data/areas";
import { prepararImagem } from "@/lib/imagem-cliente";

type Props = {
  mode: "create" | "edit";
  initial?: TeamMember;
  /** Setores já usados pela equipe, para o datalist (inclui os criados à mão) */
  setoresEmUso?: string[];
};

const field =
  "w-full rounded-md border border-line bg-paper px-4 py-3 text-ink focus:border-wine focus:outline-none";
const labelCls = "mb-2 block text-base font-medium text-ink";

export default function TeamEditor({ mode, initial, setoresEmUso = [] }: Props) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [role, setRole] = useState(initial?.role ?? "");
  const [setor, setSetor] = useState(initial?.setor ?? "");
  const [ramal, setRamal] = useState(initial?.ramal ?? "");
  const [photo, setPhoto] = useState(initial?.photo ?? "");
  const [oab, setOab] = useState(initial?.oab ?? "");
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [memberAreas, setMemberAreas] = useState<string[]>(initial?.areas ?? []);
  const [hasProfile, setHasProfile] = useState(initial?.hasProfile ?? false);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const setorOptions = [...new Set([...SETORES, ...setoresEmUso])];

  function onName(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function toggleArea(areaSlug: string) {
    setMemberAreas((current) =>
      current.includes(areaSlug)
        ? current.filter((a) => a !== areaSlug)
        : [...current, areaSlug]
    );
  }

  async function onUpload(file: File) {
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", await prepararImagem(file));
      form.append("pasta", "equipe");
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) setPhoto(data.url);
      else setError(data.error || "Falha no upload da foto.");
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
      name,
      slug,
      role,
      setor,
      ramal,
      photo,
      oab,
      bio,
      areas: memberAreas,
      hasProfile,
    };
    try {
      const url =
        mode === "create"
          ? "/api/admin/equipe"
          : `/api/admin/equipe/${initial!.slug}`;
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        router.push("/admin/equipe");
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
        <h1 className="text-3xl tracking-[-0.02em] text-ink">
          {mode === "create" ? "Novo integrante" : "Editar integrante"}
        </h1>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/equipe"
            className="rounded-sm border border-ink/20 px-5 py-3 font-medium text-ink transition-colors hover:border-wine"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="rounded-sm bg-wine px-6 py-3 font-medium text-paper-light transition-colors hover:bg-wine-deep disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-md border border-wine/30 bg-wine-mist px-4 py-3 text-base text-wine-deep"
        >
          {error}
        </p>
      )}

      <div>
        <label htmlFor="name" className={labelCls}>
          Nome completo
        </label>
        <input
          id="name"
          value={name}
          onChange={(e) => onName(e.target.value)}
          className={field}
          required
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="role" className={labelCls}>
            Cargo
          </label>
          <input
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={field}
            placeholder="Advogada, Estagiária, Auxiliar Jurídico…"
            required
          />
        </div>
        <div>
          <label htmlFor="setor" className={labelCls}>
            Setor
          </label>
          <input
            id="setor"
            list="setores"
            value={setor}
            onChange={(e) => setSetor(e.target.value)}
            className={field}
            placeholder="Cível, Escala, Controladoria…"
          />
          <datalist id="setores">
            {setorOptions.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
          <p className="mt-1 text-sm text-ink-soft">
            Agrupa a página pública. Em branco, aparece no fim, sem título de
            grupo.
          </p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="ramal" className={labelCls}>
            Ramal <span className="font-normal text-ink-soft">(interno)</span>
          </label>
          <input
            id="ramal"
            inputMode="numeric"
            value={ramal}
            onChange={(e) => setRamal(e.target.value)}
            className={field}
            placeholder="65"
          />
          <p className="mt-1 text-sm text-ink-soft">
            Só para organização interna. <strong>Nunca aparece no site.</strong>
          </p>
        </div>
        <div>
          <label htmlFor="oab" className={labelCls}>
            OAB <span className="font-normal text-ink-soft">(opcional)</span>
          </label>
          <input
            id="oab"
            value={oab}
            onChange={(e) => setOab(e.target.value)}
            className={field}
            placeholder="OAB/MG 142.853"
          />
          <p className="mt-1 text-sm text-ink-soft">
            Aparece ao lado do cargo, no card e no perfil.
          </p>
        </div>
      </div>

      {/* Foto */}
      <fieldset className="rounded-md border border-line p-5">
        <legend className="px-2 text-base font-medium text-ink">Foto</legend>
        <div className="flex flex-wrap items-start gap-6">
          <div className="h-32 w-32 shrink-0 overflow-hidden rounded-md border border-line bg-paper">
            {photo ? (
              <Image
                src={photo}
                alt=""
                width={128}
                height={128}
                className="h-full w-full object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-serif text-3xl italic text-ink-soft">
                {initialsOf(name) || "?"}
              </div>
            )}
          </div>
          <div className="min-w-60 flex-1 space-y-3">
            <input
              ref={fileInput}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onUpload(f);
              }}
            />
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                disabled={uploading}
                className="rounded-sm border border-ink/20 px-4 py-2 font-medium text-ink transition-colors hover:border-wine disabled:opacity-60"
              >
                {uploading ? "Enviando..." : "Enviar foto"}
              </button>
              {photo && (
                <button
                  type="button"
                  onClick={() => setPhoto("")}
                  className="font-medium text-wine-deep transition-colors hover:text-wine"
                >
                  Remover
                </button>
              )}
            </div>
            <input
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
              className={field}
              placeholder="/equipe/nome.jpg ou https://…"
              aria-label="Endereço da foto"
            />
            <p className="text-sm text-ink-soft">
              Foto quadrada, de preferência 800×800. Sem foto, o site mostra as
              iniciais — não fica quebrado.
            </p>
          </div>
        </div>
      </fieldset>

      {/* Página própria */}
      <fieldset className="rounded-md border border-line p-5">
        <legend className="px-2 text-base font-medium text-ink">
          Página própria
        </legend>
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={hasProfile}
            onChange={(e) => setHasProfile(e.target.checked)}
            className="mt-1.5 h-4 w-4 accent-wine"
          />
          <span className="text-base text-ink">
            Tem perfil em /equipe/{slug || "…"}
            <span className="mt-1 block text-sm text-ink-soft">
              O card na página de equipe vira link. Exige a minibiografia
              preenchida abaixo.
            </span>
          </span>
        </label>

        <div className="mt-5">
          <label htmlFor="bio" className={labelCls}>
            Minibiografia
          </label>
          <textarea
            id="bio"
            rows={6}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className={field}
            placeholder="Formação, pós-graduações, associações e tempo de atuação."
          />
        </div>

        <div className="mt-5">
          <span className={labelCls}>Áreas em que atua</span>
          <div className="flex flex-wrap gap-2">
            {areas.map((a) => {
              const on = memberAreas.includes(a.slug);
              return (
                <button
                  key={a.slug}
                  type="button"
                  onClick={() => toggleArea(a.slug)}
                  aria-pressed={on}
                  className={`rounded-sm border px-4 py-2 text-[0.9375rem] font-medium transition-colors ${
                    on
                      ? "border-wine bg-wine-mist text-wine-deep"
                      : "border-line text-ink-soft hover:border-ink/30"
                  }`}
                >
                  {a.name}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-sm text-ink-soft">
            Viram links para as áreas, na página de perfil.
          </p>
        </div>
      </fieldset>

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
        <p className="mt-1 text-sm text-ink-soft">
          /equipe/{slug || "…"}
          {mode === "edit" &&
            " — mudar o endereço de quem já tem perfil publicado quebra o link antigo."}
        </p>
      </div>
    </form>
  );
}
