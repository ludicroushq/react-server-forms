import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Suspense } from "react";
import { RootProvider } from "fumadocs-ui/provider";

export const metadata: Metadata = {
  title: "React Server Forms",
  description: "React Server Forms is a library for building forms in React.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <Suspense>
          <Providers>
            <RootProvider theme={{ enabled: false }}>{children}</RootProvider>
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
