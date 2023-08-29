"use client";
import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import * as Interfaces from "../../interfaces";

const defaultFantasyCalc: Interfaces.PlayerMarket[] = [];

const FantasyCalcContext = createContext<Interfaces.FantasyCalcContextType | undefined>(undefined);

export const useFantasyCalcContext = () => {
    const context = useContext(FantasyCalcContext);
    if (!context) {
        throw new Error("useFantasyCalcContext must be used within a FantasyCalcProvider");
    }
    return context;
};

export const FantasyCalcProvider = ({ children }: Interfaces.ChildrenProps) => {
    const [fc, setFC] = useState<Interfaces.PlayerMarket[]>(defaultFantasyCalc);
    const [loadFC, setLoadFC] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const call = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}scripts/fantasy_calc`);
                const parsedData = await call.json();
                setFC(parsedData);
                setLoadFC(false);
                console.log("fetchFantasyCalc:", parsedData);
            } catch (err) {
                console.log(err);
            }
        })();
    }, []);

    const contextValue: Interfaces.FantasyCalcContextType = { fc, loadFC };

    return (
        <FantasyCalcContext.Provider value={contextValue}>{children}</FantasyCalcContext.Provider>
    );
};
