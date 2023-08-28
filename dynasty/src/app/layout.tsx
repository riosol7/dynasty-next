import "../styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google"
import { LeagueProvider } from "@/context/LeagueContext";
import DashboardLayout from "@/layouts/Dashboard";
import { ChildrenProps } from "@/interfaces";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DynastyHub',
  description: 'Generated by create next app',
}

export default function RootLayout({children}: ChildrenProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LeagueProvider>
          <DashboardLayout>{children}</DashboardLayout>
        </LeagueProvider>
      </body>
    </html>
  )
}
