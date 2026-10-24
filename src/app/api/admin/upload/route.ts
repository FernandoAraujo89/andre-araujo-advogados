import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-guard";
import { slugify } from "@/data/posts";
import { imageStorageEnabled, optimizeImage, saveImage } from "@/lib/imagens";

// Teto prático: as funções da Vercel recusam requisições acima de 4,5 MB.
// Os editores já reduzem a foto no navegador antes de enviar
// (src/lib/imagem-cliente.ts), então na prática chega bem menos que isso.
const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

// Prefixo do id da imagem no banco, por origem. Lista fechada: o valor vem
// do cliente e não pode virar um prefixo qualquer.
const PASTAS = ["blog", "equipe", "landing"] as const;

/**
 * Upload de imagem do painel (capa de post, foto da equipe, imagens das
 * landing pages). A imagem é otimizada aqui (orientação, 1600px, WebP), vai
 * para a tabela `images` do Neon e é servida por /imagens/<id>. Devolve
 * `{ url }`.
 */
export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  if (!imageStorageEnabled()) {
    return NextResponse.json(
      {
        error:
          "Sem onde guardar imagens: o banco de dados não está configurado. No Vercel, conecte o Neon ao projeto (Storage → Connect Project), ou cole a URL de uma imagem no campo de endereço.",
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

  const pastaRaw = String(form?.get("pasta") ?? "blog");
  const pasta = (PASTAS as readonly string[]).includes(pastaRaw) ? pastaRaw : "blog";
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "imagem";

  try {
    const image = await optimizeImage(Buffer.from(await file.arrayBuffer()), file.type);
    const { url } = await saveImage(`${pasta}-${base}`, image);
    return NextResponse.json({ url });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Falha no upload." },
      { status: 500 }
    );
  }
}
