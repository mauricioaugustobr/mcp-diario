import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { SITE } from "@/lib/data";
export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "MCP do Dia — novos servidores MCP todos os dias", template: "%s | MCP do Dia" },
  description: "Lista diária e gratuita, em português, dos servidores MCP (Model Context Protocol) lançados hoje no MCP Registry, GitHub e npm.",
  keywords: ["MCP", "Model Context Protocol", "servidores MCP", "MCP server", "Claude", "agentes de IA"],
  openGraph: { type: "website", locale: "pt_BR", siteName: "MCP do Dia", images: ["/opengraph-image"] },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR"><body className="min-h-screen antialiased">
      <header className="border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg"><span className="text-emerald-400">MCP</span> do Dia</Link>
          <nav className="text-sm text-white/70 flex gap-4"><Link href="/">Hoje</Link><Link href="/arquivo">Arquivo</Link></nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      <footer className="border-t border-white/10 mt-12">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-white/60 flex flex-col sm:flex-row gap-2 justify-between">
          <span>MCP do Dia — novos servidores MCP todos os dias</span>
          <span>Fontes: MCP Registry · GitHub · npm · Código MIT</span>
        </div>
      </footer>
    </body></html>
  );
}
