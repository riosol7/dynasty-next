"use client";
import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import * as Interfaces from "../../interfaces";

const defaultKTC: Interfaces.PlayerMarket[] = [];

const KTCContext = createContext<Interfaces.KTCContextType | undefined>(undefined);

export const useKTCContext = () => {
    const context = useContext(KTCContext);
    if (!context) {
        throw new Error("useKTCContext must be used within a KTCProvider");
    }
    return context;
};

export const KTCProvider = ({ children }: Interfaces.ChildrenProps) => {
    const [ktc, setKTC] = useState<Interfaces.PlayerMarket[]>(defaultKTC);
    const [loadKTC, setLoadKTC] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const call = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}players/ktc`);
                const parsedData = await call.json();
                setKTC(parsedData);
                setLoadKTC(false);
                console.log("fetchKTC:", parsedData);
            } catch (err) {
                console.log(err);
            }
        })();
    }, []);

    const contextValue: Interfaces.KTCContextType = { ktc, loadKTC };

    return (
        <KTCContext.Provider value={contextValue}>{children}</KTCContext.Provider>
    );
};
