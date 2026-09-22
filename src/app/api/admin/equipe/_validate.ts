import { revalidatePath } from "next/cache";
import { areas } from "@/data/areas";
import type { TeamMemberInput } from "@/data/team";

/**
 * Valida e normaliza o integrante enviado pelo editor do painel. Devolve
 * erro legível — a mensagem vai direto para a tela de quem está editando.
 */

const MAX_AREAS = 6;
const AREA_SLUGS = new Set(areas.map((a) => a.slug));

type Ok = { ok: true; value: TeamMemberInput };
type Fail = { ok: false; error: string };

const str = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export function parseTeamInput(raw: unknown): Ok | Fail {
  if (typeof raw !== "object" || raw === null) {
    return { ok: false, error: "Dados inválidos." };
  }
  const b = raw as Record<string, unknown>;

  const name = str(b.name, 120);
  const role = str(b.role, 80);
  const setor = str(b.setor, 60);
  const ramal = str(b.ramal, 10);
  const photo = str(b.photo, 500);
  const oab = str(b.oab, 40);
  const bio = str(b.bio, 4000);
  const slug = str(b.slug, 120);
  const hasProfile = b.hasProfile === true;

  if (name.length < 3) return { ok: false, error: "Informe o nome completo." };
  if (!role) return { ok: false, error: "Informe o cargo (ex.: Advogada, Estagiária)." };
  if (ramal && !/^\d{1,10}$/.test(ramal)) {
    return { ok: false, error: "O ramal deve conter só números." };
  }
  if (photo && !/^https?:\/\//.test(photo) && !photo.startsWith("/")) {
    return {
      ok: false,
      error: "A foto precisa ser um endereço começando com / ou https://.",
    };
  }
  // Sem bio a página de perfil fica vazia — melhor barrar aqui do que publicar.
  if (hasProfile && bio.length < 40) {
    return {
      ok: false,
      error:
        "Para ter página própria é preciso escrever a minibiografia (pelo menos algumas linhas).",
    };
  }

  const areasRaw = Array.isArray(b.areas) ? b.areas : [];
  const areaSlugs = [
    ...new Set(
      areasRaw
        .map((a) => str(a, 80))
        .filter((a) => AREA_SLUGS.has(a))
        .slice(0, MAX_AREAS)
    ),
  ];

  return {
    ok: true,
    value: {
      ...(slug ? { slug } : {}),
      name,
      role,
      ...(setor ? { setor } : {}),
      ...(ramal ? { ramal } : {}),
      ...(photo ? { photo } : {}),
      ...(oab ? { oab } : {}),
      ...(bio ? { bio } : {}),
      ...(areaSlugs.length > 0 ? { areas: areaSlugs } : {}),
      ...(hasProfile ? { hasProfile: true } : {}),
    },
  };
}

/** Lista de slugs enviada pela reordenação. */
export function parseOrder(raw: unknown): { ok: true; value: string[] } | Fail {
  if (typeof raw !== "object" || raw === null) {
    return { ok: false, error: "Dados inválidos." };
  }
  const slugs = (raw as Record<string, unknown>).slugs;
  if (!Array.isArray(slugs) || slugs.length === 0) {
    return { ok: false, error: "Nenhuma ordem recebida." };
  }
  return {
    ok: true,
    value: [...new Set(slugs.map((s) => str(s, 120)).filter(Boolean))],
  };
}

/**
 * A equipe aparece na página /equipe, nas páginas de perfil, no bloco "sobre"
 * da home e das landing pages, e no sitemap.
 */
export function revalidateEquipe(slugs: string[] = []) {
  revalidatePath("/");
  revalidatePath("/equipe");
  revalidatePath("/sitemap.xml");
  for (const slug of slugs) {
    if (slug) revalidatePath(`/equipe/${slug}`);
  }
}
