import type { Metadata } from "next";
import { Archivo, Young_Serif } from "next/font/google";
import { SiteFooter, SiteHeader } from "@/docs/design/components";
import { formatTime, hours } from "@/lib/hours";
import { reserveTable } from "./actions";
import { ChatWidget } from "./ChatWidget";
import "./globals.css";

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo" });
const youngSerif = Young_Serif({ subsets: ["latin"], weight: "400", variable: "--font-young-serif" });

export const metadata: Metadata = {
  title: { default: "Brew & Co · Coffee on the corner in Brooklyn", template: "%s · Brew & Co" },
  description:
    "A neighbourhood coffee shop in Brooklyn for specialty coffee, fresh pastries and light lunches. Open mic Fridays, coffee tastings on Saturdays.",
};

const footerHours = [
  ...hours.map((h) => ({ days: h.days, time: `${formatTime(h.open)}–${formatTime(h.close)}` })),
  { days: "Sun", time: "Closed" },
];
const reserveNote = `${footerHours.map((h) => `${h.days} ${h.time}`).join(", ")}. Last booking an hour before close.`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${archivo.variable} ${youngSerif.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SiteHeader reserveAction={reserveTable} reserveNote={reserveNote} />
        <main className="flex-1">{children}</main>
        <SiteFooter address={["214 Lorimer Street", "Brooklyn, NY 11211"]} hours={footerHours} />
        <ChatWidget />
      </body>
    </html>
  );
}
