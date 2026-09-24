import "server-only";
import { dbEnabled, requireDb, sql } from "@/lib/db";

/**
 * Imagens enviadas pelo painel.
 *
 * O destino preferido é o Vercel Blob (URL pública, CDN). Quando ele não
 * responde — a cota mensal do plano Hobby estourou em 23/09/2026 e bloqueou
 * os stores até o ciclo virar — o upload cai aqui: a imagem, já otimizada,
 * vai para a tabela `images` do Neon e é servida por /imagens/<id> com cache
 * de um ano. Os dois formatos de URL convivem nos posts, na equipe e nas
 * landing pages, então nada precisa ser migrado quando o Blob volta.
 */

/** Ids gerados por saveImage: slug + carimbo + sufixo + extensão. */
export const IMAGE_ID = /^[a-z0-9][a-z0-9-]{2,160}\.(webp|jpg|jpeg|png|avif)$/;

export type OptimizedImage = { bytes: Buffer; mime: string; ext: string };

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

/**
 * Deixa a imagem pronta para a web: corrige a orientação (fotos de celular),
 * limita a 1600px no maior lado e grava em WebP. Uma foto de 4 MB vira
 * ~150 KB. Se o sharp não estiver disponível, mantém o arquivo original.
 */
export async function optimizeImage(input: Buffer, mime: string): Promise<OptimizedImage> {
  try {
    const sharp = (await import("sharp")).default;
    const bytes = await sharp(input, { failOn: "none" })
      .rotate()
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
    return { bytes, mime: "image/webp", ext: "webp" };
  } catch (err) {
    console.error("sharp indisponível, guardando a imagem original:", err);
    return { bytes: input, mime, ext: EXT_BY_MIME[mime] ?? "jpg" };
  }
}

/** True quando há banco para guardar imagens. */
export function imageStorageEnabled(): boolean {
  return dbEnabled();
}

/** Grava a imagem no banco e devolve a URL pública dela no site. */
export async function saveImage(
  base: string,
  image: OptimizedImage
): Promise<{ id: string; url: string }> {
  const db = requireDb();
  const id = `${base}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${image.ext}`;
  await db.query(
    "insert into images (id, mime, bytes, size) values ($1, $2, $3, $4)",
    [id, image.mime, image.bytes, image.bytes.length]
  );
  return { id, url: `/imagens/${id}` };
}

/** Lê uma imagem pelo id; null se não existir ou se o id for inválido. */
export async function getImage(id: string): Promise<{ mime: string; bytes: Buffer } | null> {
  if (!dbEnabled() || !IMAGE_ID.test(id)) return null;
  const rows = (await sql().query("select mime, bytes from images where id = $1", [
    id,
  ])) as { mime: string; bytes: Buffer }[];
  return rows[0] ?? null;
}
