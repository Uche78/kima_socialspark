import type { Metadata } from "next";
import { Inter, Montserrat, Playfair_Display } from "next/font/google";
import { ConsentBanner } from "@/components/ConsentBanner";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { MetaPixel } from "@/components/MetaPixel";
import { COMPANY, SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";
import "./globals.css";

const sans = Inter({ variable: "--font-sans", subsets: ["latin"] });
// Playfair stays for the logo and the post designs (slides); UI headings use Montserrat.
const display = Playfair_Display({ variable: "--font-display", subsets: ["latin"] });
const heading = Montserrat({ variable: "--font-heading", subsets: ["latin"], weight: ["500", "600"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "real estate social media posts",
    "realtor Instagram posts",
    "listing post generator",
    "Just Listed post",
    "real estate marketing Canada",
    "Québec French real estate posts",
    "AI real estate captions",
  ],
  authors: [{ name: COMPANY.name, url: COMPANY.url }],
  creator: COMPANY.name,
  publisher: COMPANY.name,
  category: "business",
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: SITE_NAME, locale: "en_CA", url: "/", title: SITE_TITLE, description: SITE_DESCRIPTION },
  twitter: { card: "summary_large_image", title: SITE_TITLE, description: SITE_DESCRIPTION },
  // Search engine ownership checks (Bing Webmaster Tools).
  verification: { other: { "msvalidate.01": "903CBEB5EE3EC52D8A94F0C0E41ABB8D" } },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-CA" className={`${sans.variable} ${display.variable} ${heading.variable}`}>
      <body className="min-h-screen antialiased">
        <Header />
        <main className="w-full pb-24 pt-6">{children}</main>
        <Footer />
        <ConsentBanner />
        <MetaPixel />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
