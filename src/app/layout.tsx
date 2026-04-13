import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Rate Guide — Know Your Rate",
  description: "A transparent rate calculator for creative freelancers. Stop undercharging.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
