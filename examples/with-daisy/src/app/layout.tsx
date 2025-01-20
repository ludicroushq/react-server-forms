import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "React Server Forms with DaisyUI",
  description: "React Server Forms with DaisyUI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
