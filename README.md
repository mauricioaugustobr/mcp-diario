# MCP do Dia

Site público e gratuito, em português, que lista todo dia os servidores **MCP (Model Context Protocol)** lançados no dia.

## Fontes (nenhuma chave paga)
| Fonte | Como |
|---|---|
| MCP Registry oficial | `GET registry.modelcontextprotocol.io/v0/servers?updated_since=…` filtrando `publishedAt` no dia (inclui versões novas) |
| GitHub | busca `topic:mcp-server` e `topic:mcp` com `created` no dia (sem token; `GITHUB_TOKEN` opcional aumenta o limite) |
| npm | busca `keywords:mcp-server`, `keywords:mcp`, `keywords:modelcontextprotocol` com publicação no dia |

Os itens são deduplicados pela URL e normalizados para `{name, description, url, source, sources, category, date}`. A categoria é um palpite por palavras-chave. O "dia" segue o fuso de São Paulo (UTC-3).

## Rodando
```bash
npm install
npm run fetch            # coleta hoje -> data/AAAA-MM-DD.json
npm run fetch 2026-10-20 # coleta um dia específico
npm run dev              # http://localhost:3000
npm run build && npm start
```

## Páginas
- `/`: o dia mais recente, com busca e filtros por fonte e categoria
- `/dia/AAAA-MM-DD`: arquivo de cada dia
- `/arquivo`: lista de todos os dias
- SEO: metadata, `sitemap.xml`, `robots.txt` e imagem OG (1200×630)

## Deploy no Netlify
1. Netlify → Add new site → Import an existing project → GitHub → `mcp-diario`.
2. Build command: `npm run build` · Publish directory: `.next` (já no `netlify.toml`, com `@netlify/plugin-nextjs`).
3. Variável: `NEXT_PUBLIC_SITE_URL` = URL final do site.

## Atualização diária
**GitHub Action.** O arquivo `.github/workflows/daily.yml` roda às 23h50 (horário de São Paulo), executa `npm run fetch` e commita `data/*.json`. O Netlify faz um novo deploy sozinho a cada commit. É grátis e mantém o histórico no Git.

As páginas usam ISR de 1 hora.

## Variáveis
Veja `.env.example`: `GITHUB_TOKEN` (opcional) e `NEXT_PUBLIC_SITE_URL`.

## Licença
MIT
