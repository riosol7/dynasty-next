import "../styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google"
import { 
  LeagueProvider, 
  MatchProvider, 
  OwnerProvider, 
  RosterProvider, 
  PlayerProvider,
  FantasyCalcProvider,
  KTCProvider,
  SuperFlexProvider,
  DynastyProcessProvider,
  FantasyProProvider,
  FantasyMarketProvider,
} from "@/context";
import { ChildrenProps } from "@/interfaces";
import DashboardLayout from "@/layouts/Dashboard";

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
          <MatchProvider>
            <OwnerProvider>
              <RosterProvider>
                <PlayerProvider>
                  <FantasyCalcProvider>
                    <KTCProvider>
                      <SuperFlexProvider>
                        <DynastyProcessProvider>
                          <FantasyProProvider>
                            <FantasyMarketProvider>
                              <DashboardLayout>{children}</DashboardLayout>
                            </FantasyMarketProvider>
                          </FantasyProProvider>
                        </DynastyProcessProvider>
                      </SuperFlexProvider>
                    </KTCProvider>
                  </FantasyCalcProvider>
                </PlayerProvider>
              </RosterProvider>
            </OwnerProvider>
          </MatchProvider>
        </LeagueProvider>
      </body>
    </html>
  )
}
