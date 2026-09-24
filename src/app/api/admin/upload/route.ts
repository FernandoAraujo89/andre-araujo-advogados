import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { isAdmin } from "@/lib/admin-guard";
import { slugify } from "@/data/posts";
import { imageStorageEnabled, optimizeImage, saveImage } from "@/lib/imagens";

// Teto prático: as funções da Vercel recusam requisições acima de 4,5 MB.
// Os editores já reduzem a foto no navegador antes de enviar
// (src/lib/imagem-cliente.ts), então na prática chega bem menos que isso.
const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

// Pasta de destino no Blob (e prefixo do id no banco). Lista fechada: o
// caminho vem do cliente e não pode virar um prefixo qualquer.
const PASTAS: Record<string, string> = {
  blog: "blog/images",
  equipe: "equipe/fotos",
};

/**
 * Upload de imagem do painel (capa de post, foto da equipe, imagens das
 * landing pages). A imagem é otimizada aqui (orientação, 1600px, WebP) e vai
 * para o Vercel Blob; se o Blob não responder (cota do plano estourada), vai
 * para o banco e é servida por /imagens/<id>. Devolve `{ url }` nos dois casos.
 */
export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (!blobToken && !imageStorageEnabled()) {
    return NextResponse.json(
      {
        error:
          "Sem onde guardar imagens: conecte o Neon ao projeto no Vercel (Storage → Connect Project) ou ative o Blob, ou cole a URL de uma imagem no campo abaixo.",
      },
      { status: 500 }
    );
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json(
      { error: "Formato não suportado. Use JPG, PNG, WebP ou AVIF." },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Imagem muito grande (máximo 4 MB)." },
      { status: 400 }
    );
  }

  const pastaKey = String(form?.get("pasta") ?? "blog");
  const pasta = PASTAS[pastaKey] ?? PASTAS.blog;
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "imagem";
  const image = await optimizeImage(Buffer.from(await file.arrayBuffer()), file.type);

  // 1. Blob, quando configurado e dentro da cota.
  if (blobToken) {
    try {
      const blob = await put(`${pasta}/${base}-${Date.now()}.${image.ext}`, image.bytes, {
        access: "public",
        contentType: image.mime,
        addRandomSuffix: false,
        allowOverwrite: true,
      });
      return NextResponse.json({ url: blob.url });
    } catch (err) {
      const detail = err instanceof Error ? err.message : "Falha no upload.";
      if (!imageStorageEnabled()) {
        return NextResponse.json({ error: detail }, { status: 500 });
      }
      console.warn(`Blob indisponível (${detail}); guardando a imagem no banco.`);
    }
  }

  // 2. Banco (Neon), servido por /imagens/<id>.
  try {
    const prefixo = pastaKey in PASTAS ? pastaKey : "blog";
    const { url } = await saveImage(`${prefixo}-${base}`, image);
    return NextResponse.json({ url });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Falha no upload." },
      { status: 500 }
    );
  }
}
