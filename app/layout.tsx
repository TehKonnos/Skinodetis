import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Noto_Sans_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { readPlays } from "./lib/plays-store";
import { taxonomy, getValuesForDimension } from "./data/plays";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin", "greek"],
});

const notoMono = Noto_Sans_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "greek"],
});

export const metadata: Metadata = {
  title: "Σκηνοδέτης — Παιδικά Θεατρικά Έργα",
  description:
    "Ανακαλύψτε μαγευτικά θεατρικά έργα για παιδιά. Μαγικές ιστορίες που ζωντανεύουν στη σκηνή για νεαρό κοινό.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Το μενού "Κατηγορίες" υπολογίζεται από τα ζωντανά δεδομένα (server) και
  // περνά ως prop στο (client) Navbar, ώστε να αντικατοπτρίζει τα τρέχοντα έργα.
  const plays = await readPlays();
  const categoryMenu = taxonomy.map((dim) => ({
    param: dim.param,
    label: dim.label,
    values: getValuesForDimension(plays, dim),
  }));

  return (
    <html
      lang="el"
      className={`${inter.variable} ${notoMono.variable} h-full antialiased`}
    >
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PVB4RM3F');`}
        </Script>
        {/* End Google Tag Manager */}
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PVB4RM3F"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <Navbar categoryMenu={categoryMenu} />
        {children}
      </body>
    </html>
  );
}
