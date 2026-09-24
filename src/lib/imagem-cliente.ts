/**
 * Reduz a foto no navegador antes do upload: foto de celular tem 3 a 8 MB, e
 * as funções da Vercel recusam requisições acima de 4,5 MB. Limita a 1600px
 * no maior lado (o site nunca exibe mais que isso) e recomprime em JPEG, ou
 * PNG quando a original é PNG (preserva transparência de logotipos). Se
 * qualquer etapa falhar, devolve o arquivo original e o servidor tenta.
 */
export async function prepararImagem(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;
  const MAX_LADO = 1600;
  const LEVE = 1.5 * 1024 * 1024;
  try {
    // from-image aplica a orientação do EXIF (fotos tiradas na vertical).
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const escala = Math.min(1, MAX_LADO / Math.max(bitmap.width, bitmap.height));
    if (escala === 1 && file.size <= LEVE) {
      bitmap.close();
      return file;
    }
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * escala);
    canvas.height = Math.round(bitmap.height * escala);
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const tipo = file.type === "image/png" ? "image/png" : "image/jpeg";
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, tipo, 0.86)
    );
    if (!blob || blob.size >= file.size) return file;
    const nome = file.name.replace(/\.[^.]+$/, "") + (tipo === "image/png" ? ".png" : ".jpg");
    return new File([blob], nome, { type: tipo });
  } catch {
    return file;
  }
}
