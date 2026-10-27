import { GOOGLE_ADS_ID } from "@/data/google-ads";

/**
 * Fila de comandos do gtag.js (Google Ads).
 *
 * Os comandos entram em `window.dataLayer` como objetos `arguments`,
 * exatamente como faz o trecho oficial da tag; quando o gtag.js carrega, ele
 * processa a fila na ordem. Assim uma conversão disparada antes de o script
 * terminar de carregar não se perde, e no `next dev`, em que o script não é
 * carregado (ver src/components/GoogleAds.tsx), a fila fica inteira em
 * `window.dataLayer`, o que permite conferir os disparos no console.
 *
 * Só roda no navegador.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

type Gtag = (...args: unknown[]) => void;

// O gtag.js reconhece objetos `arguments` (array-like), não arrays: um
// `push(["event", ...])` seria ignorado. Por isso a função não declara
// parâmetros e repassa `arguments` como vier.
const gtag: Gtag = function () {
  // eslint-disable-next-line prefer-rest-params -- o gtag.js exige `arguments`
  (window.dataLayer ??= []).push(arguments);
};

let initialized = false;

/** O `gtag('js')` e o `gtag('config')` da tag oficial, uma vez por carga. */
function init() {
  if (initialized) return;
  initialized = true;
  window.gtag ??= gtag;
  gtag("js", new Date());
  gtag("config", GOOGLE_ADS_ID);
}

/** Dispara uma conversão do Google Ads pelo rótulo (ver src/data/google-ads.ts). */
export function trackConversion(label: string): void {
  if (typeof window === "undefined") return;
  init();
  gtag("event", "conversion", { send_to: `${GOOGLE_ADS_ID}/${label}` });
}
