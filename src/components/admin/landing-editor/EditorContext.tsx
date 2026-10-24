"use client";

import { createContext, useContext } from "react";
import type { LpPath } from "@/components/landing/kit";
import type { LandingPageInput } from "@/data/landing";
import type { Selection } from "./state";

export type EditorApi = {
  page: LandingPageInput;
  selection: Selection;
  select: (selection: Selection) => void;
  /** Grava um valor no caminho (entra no histórico de desfazer) */
  set: (path: LpPath, value: unknown) => void;
  /** Aplica uma transformação na página inteira (entra no histórico) */
  apply: (fn: (page: LandingPageInput) => LandingPageInput) => void;
  /** Envia uma imagem ao armazenamento do painel e devolve a URL */
  upload: (file: File) => Promise<string>;
  notify: (message: string, tone?: "ok" | "error") => void;
};

export const EditorContext = createContext<EditorApi | null>(null);

export function useEditor(): EditorApi {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor fora do editor de landing pages");
  return ctx;
}
