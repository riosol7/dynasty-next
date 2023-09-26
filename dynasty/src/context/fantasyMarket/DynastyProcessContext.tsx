"use client";
import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { SERVER_URL } from "@/constants";
import * as Interfaces from "@/interfaces";

const defaultDynastyProcess: Interfaces.DynastyProcessPlayer[] = [];

const DynastyProcessContext = createContext<Interfaces.DynastyProcessContextType | undefined>(undefined);

export const useDynastyProcessContext = () => {
    const context = useContext(DynastyProcessContext);
    if (!context) {
        throw new Error("useDynastyProcessContext must be used within a DynastyProcessProvider");
    }
    return context;
};

export const DynastyProcessProvider = ({ children }: Interfaces.ChildrenProps) => {
    const [dp, setDP] = useState<Interfaces.DynastyProcessPlayer[]>(defaultDynastyProcess);
    const [loadDP, setLoadDP] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const call = await fetch(`${SERVER_URL}players/dynastyProcess`);
                const parsedData = await call.json();
                setDP(parsedData);
                setLoadDP(false);
                console.log("fetchDynastyProcess:", parsedData);
            } catch (err) {
                console.log(err);
            }
        })();
    }, []);


    const contextValue: Interfaces.DynastyProcessContextType = { dp, loadDP };

    return (
        <DynastyProcessContext.Provider value={contextValue}>{children}</DynastyProcessContext.Provider>
    );
};