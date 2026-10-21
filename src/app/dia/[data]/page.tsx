import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DayView from "@/components/DayView";
import { getDay, listDays, fmtDay } from "@/lib/data";
export const revalidate = 3600;
export function generateStaticParams() { return listDays().map((data) => ({ data })); }
type P = { params: Promise<{ data: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { data } = await params; const d = getDay(data);
  return { title: `MCPs lançados em ${data}`, description: `${d?.counts.total ?? 0} servidores MCP novos em ${fmtDay(data)}.`, alternates: { canonical: `/dia/${data}` } };
}
export default async function Page({ params }: P) {
  const { data } = await params; const day = getDay(data); if (!day) notFound();
  return <DayView day={day} title={`MCPs de ${data.split("-").reverse().join("/")}`} />;
}
