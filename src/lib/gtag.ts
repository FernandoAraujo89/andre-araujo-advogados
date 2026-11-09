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

/** Tempo máximo de espera pelo envio antes de seguir com `onSent`. */
const SEND_TIMEOUT_MS = 1500;

/**
 * Dispara uma conversão do Google Ads pelo rótulo (ver src/data/google-ads.ts).
 *
 * `onSent` roda quando o Google confirma o envio, para quem vai sair da
 * página logo depois (o formulário das landing pages abre o WhatsApp): sair
 * antes poderia perder a conversão. Se o gtag.js não carregar (bloqueador de
 * anúncios, `next dev`), `onSent` roda mesmo assim depois de 1,5 s, uma vez só.
 */
export function trackConversion(label: string, onSent?: () => void): void {
  if (typeof window === "undefined") return;
  init();
  const sendTo = `${GOOGLE_ADS_ID}/${label}`;
  if (!onSent) {
    gtag("event", "conversion", { send_to: sendTo });
    return;
  }
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    onSent();
  };
  gtag("event", "conversion", {
    send_to: sendTo,
    event_callback: finish,
    event_timeout: SEND_TIMEOUT_MS,
  });
  window.setTimeout(finish, SEND_TIMEOUT_MS + 200);
}
