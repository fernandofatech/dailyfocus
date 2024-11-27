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
  title: "DailyFocus - Gerencie Tarefas de Forma Eficiente",
  description:
    "Organize suas tarefas diárias com o DailyFocus. Ferramenta de produtividade com foco em gestão de tempo, metas e relatórios para melhorar seu desempenho.",
  keywords:
    "gestão de tarefas, produtividade, DailyFocus, organização, meta diária, tempo gasto",
  openGraph: {
    title: "DailyFocus - Gerencie Tarefas de Forma Eficiente",
    description:
      "Organize suas tarefas diárias com o DailyFocus. Ferramenta de produtividade com foco em gestão de tempo, metas e relatórios para melhorar seu desempenho.",
    url: "https://seu-dominio.com",
    siteName: "DailyFocus",
    images: [
      {
        url: "/meta-image.png",
        width: 1200,
        height: 630,
        alt: "DailyFocus Preview",
      },
    ],
    locale: "pt-BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DailyFocus - Gerencie Tarefas de Forma Eficiente",
    description:
      "Organize suas tarefas diárias com o DailyFocus. Ferramenta de produtividade com foco em gestão de tempo, metas e relatórios para melhorar seu desempenho.",
    images: ["/meta-image.png"],
  },
};

// Layout padrão
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-800`}
      >
        {children}
      </body>
    </html>
  );
}
