import Link from "next/link";
import { listDays, getDay, fmtDay } from "@/lib/data";
export const revalidate = 3600;
export const metadata = { title: "Arquivo diário", alternates: { canonical: "/arquivo" } };
export default function Arquivo() {
  return (<><h1 className="text-3xl font-bold mb-6">Arquivo</h1>
    <ul className="space-y-2">{listDays().map((d) => <li key={d}><Link className="hover:text-emerald-400 capitalize" href={`/dia/${d}`}>{fmtDay(d)}</Link> <span className="text-white/50 text-sm">— {getDay(d)?.counts.total ?? 0} MCPs</span></li>)}</ul></>);
}
