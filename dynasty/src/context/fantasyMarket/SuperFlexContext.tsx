"use client";
import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { SERVER_URL } from "@/constants";
import * as Interfaces from "../../interfaces";

const defaultSuperFlex: Interfaces.PlayerMarket[] = [];

const SuperFlexContext = createContext<Interfaces.SuperFlexContextType | undefined>(undefined);

export const useSuperFlexContext = () => {
    const context = useContext(SuperFlexContext);
    if (!context) {
        throw new Error("useSuperFlexContext must be used within a SuperFlexProvider");
    }
    return context;
};

export const SuperFlexProvider = ({ children }: Interfaces.ChildrenProps) => {
    const [superFlex, setSuperFlex] = useState<Interfaces.PlayerMarket[]>(defaultSuperFlex);
    const [loadSuperFlex, setLoadSuperFlex] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const call = await fetch(`${SERVER_URL}players/superFlex`);
                const parsedData = await call.json();
                setSuperFlex(parsedData);
                setLoadSuperFlex(false);
                console.log("fetchSuperFlex:", parsedData);
            } catch (err) {
                console.log(err);
            }
        })();
    }, []);


    const contextValue: Interfaces.SuperFlexContextType = { superFlex, loadSuperFlex };

    return (
        <SuperFlexContext.Provider value={contextValue}>{children}</SuperFlexContext.Provider>
    );
};