"use client";
import { useMemo, useState } from "react";
import type { DayFile } from "@/lib/types";
const SRC: Record<string, string> = { registry: "MCP Registry", github: "GitHub", npm: "npm" };
export default function DayList({ day }: { day: DayFile }) {
  const [q, setQ] = useState(""); const [src, setSrc] = useState(""); const [cat, setCat] = useState(""); const [n, setN] = useState(60);
  const cats = useMemo(() => [...new Set(day.items.map((i) => i.category))].sort(), [day]);
  const list = useMemo(() => day.items.filter((i) =>
    (!src || (i.sources ?? [i.source]).includes(src as never)) &&
    (!cat || i.category === cat) &&
    (!q || `${i.name} ${i.description}`.toLowerCase().includes(q.toLowerCase()))), [day, q, src, cat]);
  const sel = "bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm";
  return (<div>
    <div className="flex flex-col sm:flex-row gap-2 mb-4">
      <input aria-label="Buscar" placeholder="Buscar MCP (ex.: postgres, notion, browser)…" value={q} onChange={(e) => setQ(e.target.value)} className={`${sel} flex-1`} />
      <select aria-label="Fonte" value={src} onChange={(e) => setSrc(e.target.value)} className={sel}>
        <option value="">Todas as fontes</option>{Object.entries(SRC).map(([k, v]) => <option key={k} value={k}>{v} ({day.counts[k] ?? 0})</option>)}
      </select>
      <select aria-label="Categoria" value={cat} onChange={(e) => setCat(e.target.value)} className={sel}>
        <option value="">Todas as categorias</option>{cats.map((c) => <option key={c}>{c}</option>)}
      </select>
    </div>
    <p className="text-sm text-white/50 mb-3">{list.length} resultados</p>
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {list.slice(0, n).map((i) => (
        <li key={i.url + i.name} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:border-emerald-400/50 transition">
          <a href={i.url} target="_blank" rel="noopener nofollow" className="font-semibold break-all hover:text-emerald-400">{i.name}</a>
          <p className="text-sm text-white/70 mt-1 line-clamp-3">{i.description || "Sem descrição."}</p>
          <div className="mt-3 flex flex-wrap gap-1 text-xs">
            {(i.sources ?? [i.source]).map((s) => <span key={s} className="rounded bg-emerald-500/15 text-emerald-300 px-2 py-0.5">{SRC[s]}</span>)}
            <span className="rounded bg-white/10 px-2 py-0.5">{i.category}</span>
          </div>
        </li>))}
    </ul>
    {n < list.length && <button onClick={() => setN(n + 60)} className="mt-6 mx-auto block rounded-lg bg-emerald-500 text-black font-semibold px-5 py-2">Mostrar mais</button>}
  </div>);
}
