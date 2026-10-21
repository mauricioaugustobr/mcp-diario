import { ImageResponse } from "next/og";
export const size = { width: 1200, height: 630 }; export const contentType = "image/png";
export const alt = "MCP do Dia";
export default function OG() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#0b0d12", color: "white" }}>
    <div style={{ fontSize: 96, fontWeight: 800, display: "flex" }}><span style={{ color: "#34d399" }}>MCP</span>&nbsp;do Dia</div>
    <div style={{ fontSize: 40, marginTop: 20, opacity: .8 }}>Novos servidores MCP, todos os dias, em português.</div>
    <div style={{ fontSize: 28, marginTop: 60, opacity: .6 }}>mcpdodia · atualizado diariamente</div></div>, size);
}
