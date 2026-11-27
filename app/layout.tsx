import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Afinidad Electoral — Compara programas",
  description: "Cuestionario neutral de afinidad con programas electorales al Congreso de los Diputados.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
