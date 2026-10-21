import type { McpItem, Source, DayFile } from "./types";

const UA = { "User-Agent": "mcp-diario/0.1 (+https://github.com)" };

const CATS: [string, RegExp][] = [
  ["Banco de dados", /\b(sql|postgres|mysql|mongo|database|db|supabase|redis|sqlite|clickhouse|bigquery)\b/i],
  ["Dev & Código", /\b(github|gitlab|git|code|coding|ide|lint|debug|docker|kubernetes|k8s|ci|terminal|shell|devops)\b/i],
  ["Busca & Web", /\b(search|scrap|crawl|browser|web|fetch|playwright|puppeteer|seo)\b/i],
  ["IA & LLM", /\b(llm|openai|claude|gemini|agent|rag|embedding|vector|ai|memory|prompt)\b/i],
  ["Finanças & Cripto", /\b(finance|stock|trading|crypto|blockchain|wallet|payment|stripe|bank|defi|solana|ethereum)\b/i],
  ["Produtividade", /\b(notion|slack|calendar|email|gmail|todo|task|jira|trello|docs|sheets|office|obsidian)\b/i],
  ["Marketing & Social", /\b(marketing|ads|social|twitter|instagram|linkedin|youtube|tiktok|crm|analytics)\b/i],
  ["Dados & Arquivos", /\b(file|pdf|csv|excel|data|storage|s3|drive)\b/i],
  ["Design & Mídia", /\b(figma|design|image|video|audio|music|media|3d|canva)\b/i],
  ["Cloud & Infra", /\b(aws|azure|gcp|cloud|vercel|cloudflare|server|monitor|observability|log)\b/i],
];
export function guessCategory(t: string) {
  for (const [c, r] of CATS) if (r.test(t)) return c;
  return "Outros";
}

async function j(url: string, headers: Record<string, string> = {}) {
  const r = await fetch(url, { headers: { ...UA, Accept: "application/json", ...headers } });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.json();
}

/** Day window in America/Sao_Paulo (UTC-3) */
export function windowFor(day: string) {
  const start = new Date(`${day}T00:00:00-03:00`);
  const end = new Date(start.getTime() + 864e5);
  return { start, end };
}
export function todaySP() {
  return new Date(Date.now() - 3 * 3600e3).toISOString().slice(0, 10);
}
const inWin = (d: string, s: Date, e: Date) => { const t = new Date(d).getTime(); return t >= s.getTime() && t < e.getTime(); };

async function fromRegistry(s: Date, e: Date): Promise<McpItem[]> {
  const out = new Map<string, McpItem>();
  let cursor = ""; let pages = 0;
  do {
    const u = new URL("https://registry.modelcontextprotocol.io/v0/servers");
    u.searchParams.set("limit", "100");
    u.searchParams.set("updated_since", s.toISOString());
    if (cursor) u.searchParams.set("cursor", cursor);
    const d = await j(u.toString());
    for (const x of d.servers ?? []) {
      const sv = x.server; const m = x._meta?.["io.modelcontextprotocol.registry/official"] ?? {};
      const pub = m.publishedAt;
      if (!pub || !inWin(pub, s, e)) continue;
      // keep only first publication of a name today (new or new version)
      if (out.has(sv.name)) continue;
      const url = sv.websiteUrl || sv.repository?.url || sv.remotes?.[0]?.url ||
        `https://registry.modelcontextprotocol.io/v0/servers?search=${encodeURIComponent(sv.name)}`;
      out.set(sv.name, { name: sv.title || sv.name, description: sv.description || "", url, source: "registry",
        category: guessCategory(`${sv.name} ${sv.description}`), date: pub });
    }
    cursor = d.metadata?.nextCursor || ""; pages++;
  } while (cursor && pages < 50);
  return [...out.values()];
}

async function fromGithub(s: Date, e: Date): Promise<McpItem[]> {
  const h: Record<string, string> = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const since = new Date(s.getTime() - 3 * 3600e3).toISOString().slice(0, 10);
  const out: McpItem[] = []; const seen = new Set<string>();
  for (const q of [`topic:mcp-server created:>=${since}`, `topic:mcp created:>=${since}`]) {
    for (let p = 1; p <= 3; p++) {
      let d; try { d = await j(`https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=100&page=${p}`, h); } catch (err) { console.warn("github:", (err as Error).message); break; }
      for (const r of d.items ?? []) {
        if (seen.has(r.full_name) || !inWin(r.created_at, s, e) || r.fork) continue;
        seen.add(r.full_name);
        out.push({ name: r.full_name, description: r.description || "", url: r.html_url, source: "github",
          category: guessCategory(`${r.full_name} ${r.description} ${(r.topics || []).join(" ")}`), date: r.created_at });
      }
      if ((d.items ?? []).length < 100) break;
    }
  }
  return out;
}

async function fromNpm(s: Date, e: Date): Promise<McpItem[]> {
  const out = new Map<string, McpItem>();
  for (const text of ["keywords:mcp-server", "keywords:mcp", "keywords:modelcontextprotocol"]) {
    for (let from = 0; from < 1000; from += 250) {
      let d; try { d = await j(`https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(text)}&size=250&from=${from}&quality=0&popularity=0&maintenance=0`); } catch (err) { console.warn("npm:", (err as Error).message); break; }
      const objs = d.objects ?? [];
      for (const o of objs) {
        const p = o.package; if (out.has(p.name)) continue;
        if (!p.date || !inWin(p.date, s, e)) continue;
        out.set(p.name, { name: p.name, description: p.description || "", url: p.links?.npm || `https://www.npmjs.com/package/${p.name}`,
          source: "npm", category: guessCategory(`${p.name} ${p.description} ${(p.keywords || []).join(" ")}`), date: p.date });
      }
      if (objs.length < 250) break;
    }
  }
  return [...out.values()];
}

const key = (i: McpItem) => i.url.toLowerCase().replace(/^https?:\/\/(www\.)?/, "").replace(/(\.git|\/)$/, "");

export async function collect(day: string): Promise<DayFile> {
  const { start, end } = windowFor(day);
  const res = await Promise.allSettled([fromRegistry(start, end), fromGithub(start, end), fromNpm(start, end)]);
  const names: Source[] = ["registry", "github", "npm"];
  const counts: Record<string, number> = {};
  const merged = new Map<string, McpItem>();
  res.forEach((r, i) => {
    if (r.status === "rejected") { console.warn(names[i], r.reason); counts[names[i]] = 0; return; }
    counts[names[i]] = r.value.length;
    for (const it of r.value) {
      const k = key(it); const prev = merged.get(k);
      if (prev) prev.sources = [...new Set([...(prev.sources ?? [prev.source]), it.source])];
      else merged.set(k, { ...it, sources: [it.source] });
    }
  });
  const items = [...merged.values()].sort((a, b) => b.date.localeCompare(a.date));
  counts.total = items.length;
  return { date: day, generatedAt: new Date().toISOString(), counts, items };
}
