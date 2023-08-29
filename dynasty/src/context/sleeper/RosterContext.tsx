"use client";
import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import * as Interfaces from "../../interfaces";

const defaultRosters: Interfaces.Roster[] = [];

const RosterContext = createContext<Interfaces.RosterContextType | undefined>(undefined);

export const useRosterContext = () => {
    const context = useContext(RosterContext);
    if (!context) {
        throw new Error("useRosterContext must be used within a RosterProvider");
    }
    return context;
};

export const RosterProvider = ({ children }: Interfaces.ChildrenProps) => {
    const [rosters, setRosters] = useState<Interfaces.Roster[]>(defaultRosters);
    const [loadRosters, setLoadRosters] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const call = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}owners/rosters`);
                const parsedData = await call.json();
                setRosters(parsedData);
                setLoadRosters(false);
                console.log("fetchRosters:", parsedData);
            } catch (err) {
                console.log(err);
            }
        })();
    }, []);

    const contextValue: Interfaces.RosterContextType = { rosters, loadRosters };

    return (
        <RosterContext.Provider value={contextValue}>{children}</RosterContext.Provider>
    );
};
