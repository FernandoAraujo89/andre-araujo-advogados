"use client";

import { useState } from "react";
import { areasDeAtuacao } from "@/data/atuacao";

type FormState = "idle" | "sending" | "success" | "error";

type Errors = Partial<
  Record<"nome" | "celular" | "email" | "assunto" | "mensagem", string>
>;

/** Máscara de celular brasileiro: (99) 99999-9999 */
function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/**
 * Envia para a API do site (src/app/api/contato/route.ts), que grava a
 * mensagem no painel /admin e avisa o escritório por e-mail. `site` é o campo
 * oculto anti-spam (fica vazio para pessoas) e `elapsed`, o tempo desde que o
 * formulário apareceu.
 */
async function submitContact(data: {
  nome: string;
  celular: string;
  email: string;
  assunto: string;
  mensagem: string;
  site: string;
  elapsed: number;
}): Promise<void> {
  const res = await fetch("/api/contato", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Falha ao enviar.");
  }
}

const inputCls =
  "w-full rounded-md border border-line bg-paper-light px-5 py-3.5 text-ink placeholder:text-ink-soft/50 focus:border-accent focus:outline-none";

export default function ContactForm() {
  const [nome, setNome] = useState("");
  const [celular, setCelular] = useState("");
  const [email, setEmail] = useState("");
  const [assunto, setAssunto] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [site, setSite] = useState("");
  const [startedAt] = useState(() => Date.now());
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<FormState>("idle");
  const [serverError, setServerError] = useState("");

  function validate(): boolean {
    const next: Errors = {};
    if (nome.trim().length < 3) {
      next.nome = "Informe seu nome completo.";
    }
    const phoneDigits = celular.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      next.celular = "Informe um celular válido com DDD, ex.: (37) 99999-9999.";
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "Informe um e-mail válido ou deixe em branco.";
    }
    if (!assunto) {
      next.assunto = "Escolha o assunto do seu contato.";
    }
    if (mensagem.trim().length < 10) {
      next.mensagem = "Conte um pouco mais sobre o que você precisa.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setState("sending");
    setServerError("");
    try {
      await submitContact({
        nome: nome.trim(),
        celular,
        email: email.trim(),
        assunto,
        mensagem: mensagem.trim(),
        site,
        elapsed: Date.now() - startedAt,
      });
      setState("success");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div
        role="status"
        className="flex flex-col items-start gap-4 rounded-md border border-line bg-paper-light p-8"
      >
        <h3 className="font-serif text-2xl font-medium text-ink">
          Mensagem enviada
        </h3>
        <p className="text-ink-soft">
          Obrigado pelo contato, {nome.trim().split(" ")[0]}. Retornaremos em
          breve pelo número informado. Se preferir agilidade, fale conosco pelo
          WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="nome" className="mb-2 block text-base font-medium text-ink">
          Nome
        </label>
        <input
          id="nome"
          name="nome"
          type="text"
          autoComplete="name"
          placeholder="Seu nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          aria-invalid={!!errors.nome}
          aria-describedby={errors.nome ? "nome-error" : undefined}
          className={inputCls}
        />
        {errors.nome && (
          <p id="nome-error" className="mt-2 text-base text-accent-deep">
            {errors.nome}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="celular" className="mb-2 block text-base font-medium text-ink">
          Celular
        </label>
        <input
          id="celular"
          name="celular"
          type="tel"
          autoComplete="tel"
          inputMode="numeric"
          placeholder="(37) 99999-9999"
          value={celular}
          onChange={(e) => setCelular(maskPhone(e.target.value))}
          aria-invalid={!!errors.celular}
          aria-describedby={errors.celular ? "celular-error" : undefined}
          className={inputCls}
        />
        {errors.celular && (
          <p id="celular-error" className="mt-2 text-base text-accent-deep">
            {errors.celular}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-base font-medium text-ink">
          E-mail <span className="font-normal text-ink-soft">(opcional)</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="voce@exemplo.com.br"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={inputCls}
        />
        {errors.email && (
          <p id="email-error" className="mt-2 text-base text-accent-deep">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="assunto" className="mb-2 block text-base font-medium text-ink">
          Assunto
        </label>
        <select
          id="assunto"
          name="assunto"
          value={assunto}
          onChange={(e) => setAssunto(e.target.value)}
          aria-invalid={!!errors.assunto}
          aria-describedby={errors.assunto ? "assunto-error" : undefined}
          className={inputCls}
        >
          <option value="">Escolha um assunto</option>
          {areasDeAtuacao.map((a) => (
            <option key={a.slug} value={a.name}>
              {a.name}
            </option>
          ))}
          <option value="Outro">Outro assunto</option>
        </select>
        {errors.assunto && (
          <p id="assunto-error" className="mt-2 text-base text-accent-deep">
            {errors.assunto}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="mensagem" className="mb-2 block text-base font-medium text-ink">
          Mensagem
        </label>
        <textarea
          id="mensagem"
          name="mensagem"
          rows={4}
          placeholder="Descreva brevemente sua situação"
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          aria-invalid={!!errors.mensagem}
          aria-describedby={errors.mensagem ? "mensagem-error" : undefined}
          className={inputCls}
        />
        {errors.mensagem && (
          <p id="mensagem-error" className="mt-2 text-base text-accent-deep">
            {errors.mensagem}
          </p>
        )}
      </div>

      {/* Campo oculto anti-spam: pessoas não veem nem preenchem; robôs sim. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="site">Site</label>
        <input
          id="site"
          name="site"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={site}
          onChange={(e) => setSite(e.target.value)}
        />
      </div>

      {state === "error" && (
        <p role="alert" className="text-base text-accent-deep">
          Não foi possível enviar agora
          {serverError ? ` (${serverError})` : ""}. Tente novamente ou fale
          conosco pelo WhatsApp.
        </p>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="inline-flex items-center gap-2 rounded-sm bg-accent-surface px-8 py-4 font-medium text-paper-light transition-all duration-300 hover:scale-[1.02] hover:bg-accent-surface-deep disabled:opacity-60"
      >
        {state === "sending" ? "Enviando..." : "Enviar mensagem"}
      </button>
    </form>
  );
}
