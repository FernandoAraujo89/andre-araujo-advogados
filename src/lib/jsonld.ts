import { site } from "@/data/site";
import type { AreaFaq } from "@/data/areas";

/**
 * JSON-LD LegalService — usado na home e na página de contato.
 */
export function legalServiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: site.name,
    url: site.url,
    telephone: "+55-37-3322-5265",
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.zip,
      addressCountry: "BR",
    },
    geo: {
      "@type": "GeoCoordinates",
      // Coordenadas aproximadas do centro de Formiga, MG
      // TODO: refinar com a coordenada exata do escritório
      latitude: -20.4645,
      longitude: -45.4265,
    },
    areaServed: "Formiga e região centro-oeste de Minas Gerais",
    sameAs: [
      site.social.facebook,
      site.social.instagram,
      site.social.linkedin,
      site.social.youtube,
    ],
  };
}

/**
 * JSON-LD FAQPage — usado na página de FAQ.
 */
export function faqPageJsonLd(items: AreaFaq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
