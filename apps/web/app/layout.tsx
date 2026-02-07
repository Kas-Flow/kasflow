import type { Metadata } from "next";
import { Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { RpcProvider } from "@/lib/kaspa/rpc";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "KasFlow - Instant Kaspa Payments",
  description: "Accept Kaspa payments with real-time confirmations in milliseconds. Create payment links, showcase Kaspa's speed.",
  keywords: ["kaspa", "payment", "cryptocurrency", "instant", "passkey", "wallet"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <RpcProvider>
            {children}
            <Toaster />
          </RpcProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
