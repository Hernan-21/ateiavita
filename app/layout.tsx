import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/lib/context";
import { auth } from "@/auth";
import { WelcomeModal } from "@/components/WelcomeModal";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
      >
        <UserProvider userId={userId}>
          {children}
          <WelcomeModal isNewUser={!!session?.user?.isNewUser} />
        </UserProvider>
      </body>
    </html>
  );
}
