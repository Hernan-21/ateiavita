import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/lib/context";
import { auth } from "@/auth";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "ANNA",
  description: "Plataforma de aprendizaje de idioma ruso para latinoamericanos. Aprende de manera fácil y divertida.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const userId = session?.user?.email ?? undefined; // Use email as stable ID if ID is not available

  return (
    <html lang="en">
      <body
        className={`${openSans.variable} antialiased`}
      >
        <UserProvider userId={userId}>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
