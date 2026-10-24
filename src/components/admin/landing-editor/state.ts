import type { LpPath } from "@/components/landing/kit";

/**
 * Alterações imutáveis na página por caminho (ex.: ["sections", 2, "items",
 * 0, "title"]). Cada função devolve uma cópia com só o ramo alterado novo,
 * o que mantém o histórico de desfazer barato.
 */

type Container = Record<string | number, unknown> | unknown[];

export function getIn(obj: unknown, path: LpPath): unknown {
  let cur: unknown = obj;
  for (const key of path) {
    if (cur === null || typeof cur !== "object") return undefined;
    cur = (cur as Container as Record<string | number, unknown>)[key];
  }
  return cur;
}

export function setIn<T>(obj: T, path: LpPath, value: unknown): T {
  if (path.length === 0) return value as T;
  const [key, ...rest] = path;
  const source = (obj ?? (typeof key === "number" ? [] : {})) as Container;
  const copy = (Array.isArray(source) ? [...source] : { ...source }) as Record<
    string | number,
    unknown
  >;
  copy[key] = setIn(copy[key], rest, value);
  return copy as T;
}

export function updateIn<T>(obj: T, path: LpPath, fn: (current: unknown) => unknown): T {
  return setIn(obj, path, fn(getIn(obj, path)));
}

/** Operações de lista no caminho `list`. */
export const listOps = {
  insert<T>(obj: T, list: LpPath, at: number, item: unknown): T {
    return updateIn(obj, list, (cur) => {
      const arr = Array.isArray(cur) ? [...cur] : [];
      arr.splice(at, 0, item);
      return arr;
    });
  },
  remove<T>(obj: T, list: LpPath, at: number): T {
    return updateIn(obj, list, (cur) => {
      const arr = Array.isArray(cur) ? [...cur] : [];
      arr.splice(at, 1);
      return arr;
    });
  },
  move<T>(obj: T, list: LpPath, from: number, to: number): T {
    return updateIn(obj, list, (cur) => {
      const arr = Array.isArray(cur) ? [...cur] : [];
      if (to < 0 || to >= arr.length) return arr;
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
  },
  duplicate<T>(obj: T, list: LpPath, at: number): T {
    return updateIn(obj, list, (cur) => {
      const arr = Array.isArray(cur) ? [...cur] : [];
      arr.splice(at + 1, 0, structuredClone(arr[at]));
      return arr;
    });
  },
};

export const samePath = (a: LpPath, b: LpPath) =>
  a.length === b.length && a.every((k, i) => k === b[i]);

/** O que está selecionado no editor (o painel lateral mostra as opções). */
export type Selection =
  | { kind: "page" }
  | { kind: "image"; path: LpPath; hint?: string }
  | { kind: "button"; path: LpPath }
  | { kind: "section"; index: number };
