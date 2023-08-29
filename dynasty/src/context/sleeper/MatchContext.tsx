"use client";
import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import * as Interfaces from "../../interfaces";

const defaultMatches: Interfaces.Match[] = [];

const MatchContext = createContext<Interfaces.MatchContextType | undefined>(undefined);

export const useMatchContext = () => {
    const context = useContext(MatchContext);
    if (!context) {
        throw new Error("useMatchContext must be used within a MatchProvider");
    }
    return context;
};

export const MatchProvider = ({ children }: Interfaces.ChildrenProps) => {
    const [matches, setMatches] = useState<Interfaces.Match[]>(defaultMatches);
    const [loadMatches, setLoadMatches] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const call = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}league/matches`);
                const parsedData = await call.json();
                setMatches(parsedData);
                setLoadMatches(false);
                console.log("fetchMatches:", parsedData);
            } catch (err) {
                console.log(err);
            }
        })();
    }, []);

    const contextValue: Interfaces.MatchContextType = { matches, loadMatches };

    return (
        <MatchContext.Provider value={contextValue}>{children}</MatchContext.Provider>
    );
};
