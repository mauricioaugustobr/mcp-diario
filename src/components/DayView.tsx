import DayList from "./DayList";
import { fmtDay } from "@/lib/data";
import type { DayFile } from "@/lib/types";
export default function DayView({ day, title }: { day: DayFile; title: string }) {
  const c = day.counts;
  const stat = (l: string, v?: number) => <div className="rounded-xl bg-white/5 p-3"><div className="text-2xl font-bold">{v ?? 0}</div><div className="text-xs text-white/60">{l}</div></div>;
  return (<>
    <h1 className="text-3xl sm:text-4xl font-bold">{title}</h1>
    <p className="text-white/60 mt-2 capitalize">{fmtDay(day.date)}</p>
    <p className="text-white/70 mt-3 max-w-2xl">Servidores MCP (Model Context Protocol) publicados ou atualizados no MCP Registry oficial, repositórios novos no GitHub e pacotes no npm — atualizado todo dia.</p>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">{stat("Total (sem duplicados)", c.total)}{stat("MCP Registry", c.registry)}{stat("GitHub", c.github)}{stat("npm", c.npm)}</div>
    <DayList day={day} />
  </>);
}
