"use client";
import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import * as Interfaces from "../../interfaces";

const defaultFantasyPro: Interfaces.FantasyProPlayer[] = [];

const FantasyProContext = createContext<Interfaces.FantasyProContextType | undefined>(undefined);

export const useFantasyProContext = () => {
    const context = useContext(FantasyProContext);
    if (!context) {
        throw new Error("useFantasyProContext must be used within a FantasyProProvider");
    }
    return context;
};

export const FantasyProProvider = ({ children }: Interfaces.ChildrenProps) => {
    const [fantasyPro, setFantasyPro] = useState<Interfaces.FantasyProPlayer[]>(defaultFantasyPro);
    const [loadFantasyPro, setLoadFantasyPro] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const call = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}players/fantasyPro`);
                const parsedData = await call.json();
                setFantasyPro(parsedData);
                setLoadFantasyPro(false);
                console.log("fetchFantasyPro:", parsedData);
            } catch (err) {
                console.log(err);
            }
        })();
    }, []);


    const contextValue: Interfaces.FantasyProContextType = { fantasyPro, loadFantasyPro };

    return (
        <FantasyProContext.Provider value={contextValue}>{children}</FantasyProContext.Provider>
    );
};