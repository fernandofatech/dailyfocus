import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Fontes locais
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Metadados para SEO
export const metadata: Metadata = {
  title: "DailyFocus - Organize suas tarefas",
  description:
    "Organize suas tarefas diárias com o DailyFocus. Ferramenta de produtividade com foco em gestão de tempo, metas e relatórios.",
  metadataBase: new URL("https://dailyfocus.yourdomain.com"), // Atualize com o domínio do seu site
  openGraph: {
    title: "DailyFocus - Organize suas tarefas",
    description:
      "Ferramenta de produtividade com foco em organização de tarefas e gestão de tempo.",
    url: "https://dailyfocus.yourdomain.com",
    siteName: "DailyFocus",
    images: [
      {
        url: "/meta-image.png",
        width: 1200,
        height: 630,
        alt: "DailyFocus",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DailyFocus - Organize suas tarefas com eficiência",
    description:
      "DailyFocus ajuda você a organizar tarefas, gerenciar metas e melhorar sua produtividade.",
    images: ["/meta-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-800`}
      >
        {children}
      </body>
    </html>
  );
}
