export type Source = "registry" | "github" | "npm";
export type McpItem = {
  name: string;
  description: string;
  url: string;
  source: Source;
  sources?: Source[];
  category: string;
  date: string; // ISO
};
export type DayFile = { date: string; generatedAt: string; counts: Record<string, number>; items: McpItem[] };
