import DayView from "@/components/DayView";
import { getDay, listDays } from "@/lib/data";
export const revalidate = 3600;
export default function Home() {
  const d = listDays()[0]; const day = d ? getDay(d) : null;
  if (!day) return <p>Nenhum dado ainda. Rode <code>npm run fetch</code>.</p>;
  return <DayView day={day} title="Novos MCPs de hoje" />;
}
