"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Copy,
  Eye,
  EyeOff,
  ImageIcon,
  ImagePlus,
  Link2,
  Plus,
  Settings2,
  Trash2,
} from "lucide-react";
import { buttonClass } from "@/components/Button";
import {
  LpPicture,
  type AddSlotProps,
  type ButtonSlotProps,
  type ImageSlotProps,
  type ItemSlotProps,
  type LandingKit,
  type SectionSlotProps,
  type TextSlotProps,
} from "@/components/landing/kit";
import {
  LP_LIMITS,
  newSection,
  newSectionId,
  sectionHints,
  sectionLabels,
  type LpSectionType,
} from "@/data/landing";
import { useEditor } from "./EditorContext";
import { listOps, samePath, setIn } from "./state";

/**
 * Kit editável do editor visual: as mesmas peças do site (kit.tsx), mas cada
 * texto vira editável no lugar, cada imagem e botão abre as opções no painel
 * lateral, e listas e seções ganham controles para mover, duplicar, ocultar
 * e excluir.
 */

const SECTION_TYPES = Object.keys(sectionLabels) as LpSectionType[];

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Botão pequeno das barras de ferramentas. */
function ToolBtn({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="grid size-8 place-items-center rounded-sm text-paper-light transition-colors hover:bg-paper-light/15 disabled:pointer-events-none disabled:opacity-30 [&_svg]:size-4"
    >
      {children}
    </button>
  );
}

/** Texto editável no lugar (contentEditable só com texto puro). */
function EditText({
  path,
  value,
  as: Tag = "span",
  className = "",
  multiline,
  placeholder,
}: TextSlotProps) {
  const { set } = useEditor();
  const ref = useRef<HTMLElement>(null);
  const focused = useRef(false);
  // O conteúdo inicial entra uma vez (e no HTML do servidor); depois o DOM é
  // do navegador e só o efeito abaixo o reescreve. Se o React reconciliasse
  // o texto a cada render, a digitação duplicaria caracteres.
  const [initial] = useState(() => escapeHtml(value));

  // Sincroniza o DOM com o valor quando ele muda por fora (desfazer, modelo)
  // e nunca durante a digitação, para o cursor não pular.
  useEffect(() => {
    const el = ref.current;
    if (el && !focused.current && el.innerText !== value) el.innerText = value;
  }, [value]);

  function commit(el: HTMLElement) {
    let text = el.innerText.replace(/ /g, " ");
    text = multiline
      ? text.replace(/\n{3,}/g, "\n\n").trim()
      : text.replace(/\s*\n\s*/g, " ").trim();
    if (!text) el.innerHTML = "";
    if (text !== value) set(path, text);
  }

  return (
    <Tag
      ref={ref}
      contentEditable="plaintext-only"
      spellCheck
      data-placeholder={placeholder ?? "Clique para escrever"}
      className={`${className} lp-editable ${multiline ? "whitespace-pre-line" : ""}`}
      onFocus={() => {
        focused.current = true;
      }}
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        focused.current = false;
        commit(e.currentTarget);
      }}
      onInput={(e: React.FormEvent<HTMLElement>) => {
        const el = e.currentTarget;
        if (!el.innerText.trim() && el.innerHTML !== "") el.innerHTML = "";
      }}
      onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === "Enter" && !multiline) {
          e.preventDefault();
          e.currentTarget.blur();
        } else if (e.key === "Escape") {
          e.currentTarget.innerText = value;
          e.currentTarget.blur();
        }
      }}
      onPaste={(e: React.ClipboardEvent<HTMLElement>) => {
        e.preventDefault();
        let text = e.clipboardData.getData("text/plain");
        if (!multiline) text = text.replace(/\s*\n\s*/g, " ");
        document.execCommand("insertText", false, text);
      }}
      onClick={(e: React.MouseEvent) => {
        // Não navega (texto dentro de link) nem seleciona a seção
        e.preventDefault();
        e.stopPropagation();
      }}
      dangerouslySetInnerHTML={{ __html: initial }}
    />
  );
}

/** Imagem: clique abre as opções no painel; arrastar um arquivo troca direto. */
function EditImg({ path, value, className, sizes, preload, hint }: ImageSlotProps) {
  const { select, selection, upload, set, notify } = useEditor();
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);
  const selected = selection.kind === "image" && samePath(selection.path, path);

  async function onDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const url = await upload(file);
      set(path, { src: url, alt: value.alt });
      select({ kind: "image", path, hint });
    } catch (err) {
      notify(err instanceof Error ? err.message : "Falha no upload.", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <LpPicture value={value} className={className} sizes={sizes} preload={preload} />
      {!value.src && (
        <span className="absolute inset-0 grid place-items-center bg-paper/85 text-sm font-medium text-ink-soft">
          <span className="flex flex-col items-center gap-2">
            <ImagePlus aria-hidden className="size-7" />
            Adicionar imagem
          </span>
        </span>
      )}
      <button
        type="button"
        aria-label="Editar imagem"
        onClick={(e) => {
          e.stopPropagation();
          select({ kind: "image", path, hint });
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
        className={`group/img absolute inset-0 cursor-pointer outline-offset-[-3px] transition-colors ${
          selected
            ? "outline outline-[3px] outline-blue-500"
            : "hover:outline hover:outline-2 hover:outline-blue-500/80"
        } ${over ? "bg-blue-500/25" : ""}`}
      >
        <span
          className={`absolute left-3 top-3 items-center gap-1.5 rounded-sm bg-ink/85 px-2.5 py-1.5 text-xs font-medium text-paper-light ${
            busy || selected ? "flex" : "hidden group-hover/img:flex"
          }`}
        >
          <ImageIcon aria-hidden className="size-3.5" />
          {busy ? "Enviando..." : over ? "Solte para trocar" : "Trocar imagem"}
        </span>
      </button>
    </>
  );
}

/** Botão: o texto edita no lugar; o link fica no painel lateral. */
function EditBtn({ path, value, variant, size = "lg", className = "" }: ButtonSlotProps) {
  const { select, selection } = useEditor();
  const selected = selection.kind === "button" && samePath(selection.path, path);
  return (
    <span
      role="button"
      tabIndex={0}
      onClickCapture={() => select({ kind: "button", path })}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.target === e.currentTarget) select({ kind: "button", path });
      }}
      className={`${buttonClass(variant, size, className)} cursor-pointer hover:scale-100 ${
        selected
          ? "ring-[3px] ring-blue-500 ring-offset-2 ring-offset-transparent"
          : "hover:ring-2 hover:ring-blue-500/80 hover:ring-offset-2"
      }`}
    >
      <EditText path={[...path, "label"]} value={value.label} placeholder="Texto do botão" />
      <Link2 aria-hidden className="size-4 opacity-50" />
    </span>
  );
}

/** Item de lista com a barra de mover, duplicar e remover. */
function EditItem({ list, index, count, as: Tag = "div", className = "", children }: ItemSlotProps) {
  const { apply, select } = useEditor();
  return (
    <Tag className={`${className} group/item relative`}>
      {children}
      <div className="absolute right-2 top-2 z-20 flex items-center gap-0.5 rounded-md bg-ink/90 p-0.5 opacity-0 shadow-lg transition-opacity focus-within:opacity-100 group-hover/item:opacity-100">
        <ToolBtn
          label="Mover para antes"
          disabled={index === 0}
          onClick={() => apply((p) => listOps.move(p, list, index, index - 1))}
        >
          <ChevronLeft />
        </ToolBtn>
        <ToolBtn
          label="Mover para depois"
          disabled={index === count - 1}
          onClick={() => apply((p) => listOps.move(p, list, index, index + 1))}
        >
          <ChevronRight />
        </ToolBtn>
        <ToolBtn
          label="Duplicar"
          disabled={count >= LP_LIMITS.items}
          onClick={() => apply((p) => listOps.duplicate(p, list, index))}
        >
          <Copy />
        </ToolBtn>
        <ToolBtn
          label="Remover"
          onClick={() => {
            if (!window.confirm("Remover este item?")) return;
            select({ kind: "page" });
            apply((p) => listOps.remove(p, list, index));
          }}
        >
          <Trash2 />
        </ToolBtn>
      </div>
    </Tag>
  );
}

function EditAdd({ list, count, make, label, className = "" }: AddSlotProps) {
  const { apply } = useEditor();
  const full = count >= LP_LIMITS.items;
  return (
    <button
      type="button"
      disabled={full}
      onClick={(e) => {
        e.stopPropagation();
        apply((p) => listOps.insert(p, list, count, make()));
      }}
      className={`inline-flex items-center justify-center gap-2 rounded-md border-2 border-dashed border-blue-500/50 bg-paper-light/60 px-5 py-3 text-sm font-medium text-blue-700 transition-colors hover:border-blue-500 hover:bg-blue-50 disabled:opacity-40 ${className}`}
    >
      <Plus aria-hidden className="size-4" />
      {full ? `Limite de ${LP_LIMITS.items} itens` : label}
    </button>
  );
}

/** "+ Adicionar seção" entre as seções, com o menu dos tipos. */
export function InsertSection({ at, className = "" }: { at: number; className?: string }) {
  const { page, apply, select } = useEditor();
  const [open, setOpen] = useState(false);
  const full = page.sections.length >= LP_LIMITS.sections;
  if (full) return null;
  return (
    <div className={`relative z-40 flex justify-center ${className}`}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className={`flex items-center gap-1.5 rounded-full bg-blue-600 px-3.5 py-1.5 text-xs font-medium text-white shadow-lg transition-opacity hover:bg-blue-700 ${
          open ? "opacity-100" : "opacity-0 focus:opacity-100 group-hover/insert:opacity-100"
        }`}
      >
        <Plus aria-hidden className="size-3.5" />
        Adicionar seção
      </button>
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-full mt-2 w-80 overflow-hidden rounded-md border border-line bg-paper-light text-left shadow-2xl"
        >
          <ul className="max-h-[22rem] overflow-y-auto py-1">
            {SECTION_TYPES.map((type) => (
              <li key={type}>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    apply((p) => listOps.insert(p, ["sections"], at, newSection(type)));
                    select({ kind: "section", index: at });
                  }}
                  className="block w-full px-4 py-2.5 text-left transition-colors hover:bg-paper"
                >
                  <span className="block text-[0.9375rem] font-medium text-ink">
                    {sectionLabels[type]}
                  </span>
                  <span className="block text-sm text-ink-soft">{sectionHints[type]}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/** Seção com contorno, barra de ferramentas e o ponto de inserção abaixo. */
function EditSection({ index, section, children }: SectionSlotProps) {
  const { page, apply, select, selection } = useEditor();
  const count = page.sections.length;
  const selected = selection.kind === "section" && selection.index === index;

  return (
    <div
      className="group/section relative"
      onClick={() => select({ kind: "section", index })}
    >
      {index === 0 && (
        <div className="group/insert absolute inset-x-0 top-0 z-40 h-8 -translate-y-1/2">
          <InsertSection at={0} className="h-full items-center" />
        </div>
      )}
      <div className={section.hidden ? "opacity-40 saturate-50" : undefined}>{children}</div>
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 z-30 ${
          selected
            ? "ring-[3px] ring-inset ring-blue-500"
            : "group-hover/section:ring-2 group-hover/section:ring-inset group-hover/section:ring-blue-500/50"
        }`}
      />
      <div
        onClick={(e) => e.stopPropagation()}
        className={`absolute left-1/2 top-3 z-40 flex -translate-x-1/2 items-center gap-0.5 rounded-md bg-ink p-1 text-paper-light shadow-xl transition-opacity ${
          selected ? "opacity-100" : "opacity-0 group-hover/section:opacity-100"
        }`}
      >
        <span className="whitespace-nowrap px-2 text-xs font-medium">
          {sectionLabels[section.type]}
          {section.hidden && " · oculta no site"}
        </span>
        <ToolBtn
          label="Subir seção"
          disabled={index === 0}
          onClick={() => {
            apply((p) => listOps.move(p, ["sections"], index, index - 1));
            select({ kind: "section", index: index - 1 });
          }}
        >
          <ArrowUp />
        </ToolBtn>
        <ToolBtn
          label="Descer seção"
          disabled={index === count - 1}
          onClick={() => {
            apply((p) => listOps.move(p, ["sections"], index, index + 1));
            select({ kind: "section", index: index + 1 });
          }}
        >
          <ArrowDown />
        </ToolBtn>
        <ToolBtn
          label={section.hidden ? "Mostrar no site" : "Ocultar no site"}
          onClick={() => apply((p) => setIn(p, ["sections", index, "hidden"], !section.hidden))}
        >
          {section.hidden ? <Eye /> : <EyeOff />}
        </ToolBtn>
        <ToolBtn
          label="Duplicar seção"
          disabled={count >= LP_LIMITS.sections}
          onClick={() =>
            apply((p) =>
              listOps.insert(p, ["sections"], index + 1, {
                ...structuredClone(section),
                id: newSectionId(),
              })
            )
          }
        >
          <Copy />
        </ToolBtn>
        <ToolBtn label="Opções da seção" onClick={() => select({ kind: "section", index })}>
          <Settings2 />
        </ToolBtn>
        <ToolBtn
          label="Excluir seção"
          onClick={() => {
            if (!window.confirm(`Excluir a seção "${sectionLabels[section.type]}"?`)) return;
            select({ kind: "page" });
            apply((p) => listOps.remove(p, ["sections"], index));
          }}
        >
          <Trash2 />
        </ToolBtn>
      </div>
      <div className="group/insert absolute inset-x-0 bottom-0 z-40 h-8 translate-y-1/2">
        <InsertSection at={index + 1} className="h-full items-center" />
      </div>
    </div>
  );
}

export const editKit: LandingKit = {
  editing: true,
  Text: EditText,
  Img: EditImg,
  Btn: EditBtn,
  Item: EditItem,
  Add: EditAdd,
  Section: EditSection,
};
