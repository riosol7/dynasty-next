"use client";
import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import * as Interfaces from "../../interfaces";

const defaultOwners: Interfaces.Owner[] = [];

const OwnerContext = createContext<Interfaces.OwnerContextType | undefined>(undefined);

export const useOwnerContext = () => {
    const context = useContext(OwnerContext);
    if (!context) {
        throw new Error("useOwnerContext must be used within a OwnerProvider");
    }
    return context;
};

export const OwnerProvider = ({ children }: Interfaces.ChildrenProps) => {
    const [owners, setOwners] = useState<Interfaces.Owner[]>(defaultOwners);
    const [loadOwners, setLoadOwners] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const call = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}owners`);
                const parsedData = await call.json();
                setOwners(parsedData);
                setLoadOwners(false);
                console.log("fetchOwners:", parsedData);
            } catch (err) {
                console.log(err);
            }
        })();
    }, []);

    const contextValue: Interfaces.OwnerContextType = { owners, loadOwners };

    return (
        <OwnerContext.Provider value={contextValue}>{children}</OwnerContext.Provider>
    );
};
