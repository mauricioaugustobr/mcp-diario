import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import type { DayFile } from "./types";
const DIR = path.join(process.cwd(), "data");
export const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://mcpdodia.com.br";
export function listDays(): string[] {
  if (!existsSync(DIR)) return [];
  return readdirSync(DIR).filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f)).map((f) => f.slice(0, 10)).sort().reverse();
}
export function getDay(d: string): DayFile | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return null;
  const f = path.join(DIR, `${d}.json`);
  return existsSync(f) ? JSON.parse(readFileSync(f, "utf8")) : null;
}
export function fmtDay(d: string) {
  return new Date(`${d}T12:00:00-03:00`).toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric", timeZone: "America/Sao_Paulo" });
}
