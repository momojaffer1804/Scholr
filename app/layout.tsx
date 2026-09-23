import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppSidebar } from "@/components/AppSidebar";
import { ToastContainer } from "@/components/ToastContainer";
import { getSessionUser } from "@/lib/auth/session";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Scholr — Academic Productivity Workspace",
  description: "Your academic life, in one place.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  return (
    <html lang="en" suppressHydrationWarning className={playfair.variable}>
      <body className="min-h-screen bg-[#fcfbf9] dark:bg-[#121214] text-zinc-900 dark:text-zinc-100 font-sans antialiased selection:bg-purple-200 dark:selection:bg-purple-950">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen flex flex-col md:flex-row">
            <AppSidebar user={user} />
            <main className="flex-1 px-4 py-6 md:px-10 md:py-10 max-w-5xl">
              {children}
            </main>
          </div>
          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  );
}
