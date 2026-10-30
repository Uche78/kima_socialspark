// The words around a landing page's copy (form, pricing, Team banner, page labels), in English and Québec
// French. The app itself is English; French persona pages (/for/<slug> with locale "fr") say so in their FAQ.
// Client components import this, so keep it small: no page copy here.

export type Locale = "en" | "fr";

/** French persona page paths, so the header's "Try it for free" can speak French there. Kept in sync by a test. */
export const FRENCH_PERSONA_SLUGS = ["publications-immobilieres-bilingues"];

export function localeOfPath(pathname: string): Locale {
  return FRENCH_PERSONA_SLUGS.some((s) => pathname === `/for/${s}`) ? "fr" : "en";
}

/** "$49.99" → "49,99 $" in French; unchanged in English. */
export function money(amount: string, locale: Locale) {
  if (locale === "en") return amount;
  return `${amount.replace("$", "").replace(".", ",")} $`;
}

const NB = " "; // French spacing before ? ! : ;

export const LANDING_TEXT = {
  en: {
    tryFree: "Try it for free",
    form: {
      label: "Listing link",
      placeholder: "Paste a listing link from a brokerage or agent's website",
      submit: "Get listing",
      busy: "Retrieving listing…",
      busyNote: "Reading the page and collecting photos. This usually takes 15–40 seconds.",
      realtorCa: ["REALTOR.ca doesn't allow automatic retrieval yet.", ", or try the same listing on the brokerage's or agent's website."],
      pasteInstead: "Copy and paste the page instead",
      siteBlocked: "Site blocked? Copy and paste the page",
    },
    pricing: {
      eyebrow: "Pricing",
      heading: (n: number) => `Try ${n} listings free. No credit card.`,
      sub: "Upgrade when you're ready. Every plan includes every feature, for realtors and mortgage brokers. Prices in CAD, plus tax.",
      compare: "Compare plans in detail",
      billing: "Billing",
      monthly: "Monthly",
      yearly: "Yearly",
      twoMonthsFree: "2 months free",
      perMonth: "/month",
      billedYearly: (amount: string) => `Billed ${amount} CAD yearly, plus tax`,
      billedMonthly: "CAD, billed monthly, plus tax",
      mostPopular: "Most popular",
      posts: (n: number) => `${n} posts a month`,
      regens: (n: number) => `${n} regenerations a month`,
      unlimited: "Unlimited edits and publishing",
      bestValue: "Best value per post",
      choose: (name: string) => `Choose ${name}`,
    },
    team: { label: "Team", title: "Brokerage or team?", body: "Seats for every agent, one invoice and a shared brand kit.", cta: "Talk to us" },
    page: {
      trust: (n: number) => [`${n} listings free`, "No credit card", "Nothing posts without your click", "Data stored in Canada"],
      reasons: (n: number) => `${n} reasons`,
      proof: "Proof",
      examples: "Example posts for sample listings, drawn with SocialSpark's real post designs.",
      compared: "Compared",
      offer: "The offer",
      allowance: (name: string, posts: number, regens: number) => `${name}: ${posts} posts and ${regens} regenerations a month`,
      teamAllowance: "Seats for every agent, one invoice and a shared brand kit",
      extras: ["Unlimited edits, downloads and publishing", "Scheduling for Instagram, Facebook and LinkedIn"],
      guarantees: (n: number) => [`Start with ${n} listings free, no credit card`, "Cancel anytime", "Yearly: two months free"],
      planPosts: "posts a month, plus",
      planRegens: "regenerations",
      everyFeature: "Every feature included.",
      seePrice: "See the price",
    },
  },
  fr: {
    tryFree: "Essayer gratuitement",
    form: {
      label: "Lien de l'inscription",
      placeholder: "Collez le lien d'une inscription (site d'agence ou de courtier)",
      submit: "Importer",
      busy: "Importation…",
      busyNote: "Lecture de la page et des photos. Comptez de 15 à 40 secondes.",
      realtorCa: ["REALTOR.ca ne permet pas encore l'importation automatique.", ", ou essayez la même inscription sur le site de l'agence ou du courtier."],
      pasteInstead: "Copiez-collez plutôt la page",
      siteBlocked: `Site bloqué${NB}? Copiez-collez la page`,
    },
    pricing: {
      eyebrow: "Tarifs",
      heading: (n: number) => `Essayez ${n} inscriptions gratuites. Sans carte de crédit.`,
      sub: "Passez à un forfait quand vous êtes prêt. Chaque forfait comprend toutes les fonctions, pour les courtiers immobiliers et hypothécaires. Prix en dollars canadiens, taxes en sus.",
      compare: "Comparer les forfaits en détail (en anglais)",
      billing: "Facturation",
      monthly: "Mensuel",
      yearly: "Annuel",
      twoMonthsFree: "2 mois gratuits",
      perMonth: "/mois",
      billedYearly: (amount: string) => `Facturé ${amount} CA par année, taxes en sus`,
      billedMonthly: "Dollars canadiens, facturé chaque mois, taxes en sus",
      mostPopular: "Le plus populaire",
      posts: (n: number) => `${n} publications par mois`,
      regens: (n: number) => `${n} régénérations par mois`,
      unlimited: "Modifications et publication illimitées",
      bestValue: "Meilleur prix par publication",
      choose: (name: string) => `Choisir ${name}`,
      /** PAID_PLANS[id].forWho in French (English comes from plans.ts). */
      forWho: { starter: "Pour commencer", professional: "Pour un courtier actif", top_producer: "Pour les courtiers à fort volume d'inscriptions" },
    },
    team: { label: "Équipe", title: `Agence ou équipe${NB}?`, body: "Un accès pour chaque courtier, une seule facture et une image de marque commune.", cta: "Parlez-nous" },
    page: {
      trust: (n: number) => [`${n} inscriptions gratuites`, "Sans carte de crédit", "Rien n'est publié sans votre clic", "Données hébergées au Canada"],
      reasons: (n: number) => `${n} raisons`,
      proof: "Preuves",
      examples: "Exemples de publications pour des propriétés fictives, avec les vrais gabarits de SocialSpark.",
      compared: "Comparaison",
      offer: "L'offre",
      allowance: (name: string, posts: number, regens: number) => `${name}${NB}: ${posts} publications et ${regens} régénérations par mois`,
      teamAllowance: "Un accès pour chaque courtier, une seule facture et une image de marque commune",
      extras: ["Modifications, téléchargements et publication illimités", "Planification pour Instagram, Facebook et LinkedIn"],
      guarantees: (n: number) => [`Commencez avec ${n} inscriptions gratuites, sans carte de crédit`, "Annulez en tout temps", `Annuel${NB}: deux mois gratuits`],
      planPosts: "publications par mois, plus",
      planRegens: "régénérations",
      everyFeature: "Toutes les fonctions incluses.",
      seePrice: "Voir le prix",
    },
  },
} as const;
