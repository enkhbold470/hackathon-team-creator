import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hackathon Team Creator",
  description: "Create a team for your hackathon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} subpixel-antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          value={{
            light: "light",
            dark: "dark",
          }}
        >
          {children}
          <Toaster position="top-center" visibleToasts={1} duration={3000} />
        </ThemeProvider>
      </body>
    </html>
  );
}
