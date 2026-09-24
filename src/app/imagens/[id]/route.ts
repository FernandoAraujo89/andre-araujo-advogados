import { NextResponse } from "next/server";
import { getImage } from "@/lib/imagens";

type Ctx = { params: Promise<{ id: string }> };

/**
 * Serve as imagens guardadas no banco (ver src/lib/imagens.ts). O id nunca
 * muda de conteúdo, então o cache é de um ano, no navegador e na borda da
 * Vercel; o next/image busca daqui uma vez por tamanho e guarda o resultado.
 */
export async function GET(_request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const image = await getImage(id);
  if (!image) {
    return new NextResponse("Imagem não encontrada.", { status: 404 });
  }
  return new NextResponse(new Uint8Array(image.bytes), {
    headers: {
      "Content-Type": image.mime,
      "Content-Length": String(image.bytes.length),
      "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
    },
  });
}
