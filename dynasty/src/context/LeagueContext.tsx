"use client";
import { createContext, useContext, useState, useEffect } from "react";
import * as Interfaces from "../interfaces";

const defaultLeague: Interfaces.League = {
    status: "pre_draft",
    season: "",
    total_rosters: "",
    name: "",
    avatar: "",
};

const LeagueContext = createContext<Interfaces.LeagueContextType | undefined>(undefined);

export const useLeagueContext = () => {
    const context = useContext(LeagueContext);
    if (!context) {
        throw new Error("useLeagueContext must be used within a LeagueProvider");
    }
    return context;
};

export const LeagueProvider = ({ children }: Interfaces.ChildrenProps) => {
    const [league, setLeague] = useState<Interfaces.League>(defaultLeague);
    const [loadLeague, setLoadLeague] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const call = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}league`);
                const parsedData = await call.json();
                setLeague(parsedData);
                setLoadLeague(false);
                console.log("fetchLeague:", parsedData);
            } catch (err) {
                console.log(err);
            }
        })();
    }, []);

    const contextValue: Interfaces.LeagueContextType = { league, loadLeague };

    return (
        <LeagueContext.Provider value={contextValue}>{children}</LeagueContext.Provider>
    );
};
