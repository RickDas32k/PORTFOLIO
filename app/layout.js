import { Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
const sans = Sora({ subsets: ["latin"], variable: "--sans", weight: ["300", "400", "600", "700", "800"] });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--mono" });
export const metadata = {
  title: "Rick Das | AI & Tech Enthusiast, App & Web Developer",
  description: "Building digital experiences, intelligent applications, and technology-driven solutions.",
};
export const viewport = { width: "device-width", initialScale: 1, themeColor: "#050506" };
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning><body suppressHydrationWarning className={`${sans.variable} ${mono.variable}`}>{children}</body></html>
  );
}
