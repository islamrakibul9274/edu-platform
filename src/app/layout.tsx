import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Education Platform | Learn Full-Stack & AI",
  description: "Master modern engineering with our interactive courses.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  // Fetch the user's session securely on the server!
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-50 text-slate-900`} suppressHydrationWarning>
        
        <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <Link href="/" className="font-extrabold text-2xl tracking-tight text-blue-600">
              EduPlatform.
            </Link>
            
            <div className="flex items-center gap-6">
              <Link href="/courses" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                Courses
              </Link>
              <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                Dashboard
              </Link>
              
              {/* Conditional Rendering based on Authentication */}
              {session ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-slate-700">
                    Hi, {session.user?.name?.split(' ')[0]} 👋
                  </span>
                  <LogoutButton />
                </div>
              ) : (
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href="/login">Sign In</Link>
                </Button>
              )}
            </div>

          </div>
        </nav>

        {children}

      </body>
    </html>
  );
}