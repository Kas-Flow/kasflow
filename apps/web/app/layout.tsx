import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RpcProvider } from "@/lib/kaspa/rpc";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
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
