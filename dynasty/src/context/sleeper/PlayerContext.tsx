"use client";
import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { SERVER_URL } from "@/constants";
import * as Interfaces from "../../interfaces";

const defaultPlayers: Interfaces.Player[] = [];

const PlayerContext = createContext<Interfaces.PlayerContextType | undefined>(undefined);

export const usePlayerContext = () => {
    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error("usePlayerContext must be used within a PlayerProvider");
    }
    return context;
};

export const PlayerProvider = ({ children }: Interfaces.ChildrenProps) => {
    const [players, setPlayers] = useState<Interfaces.Player[]>(defaultPlayers);
    const [loadPlayers, setLoadPlayers] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const call = await fetch(`${SERVER_URL}players`);
                const parsedData = await call.json();
                setPlayers(parsedData);
                setLoadPlayers(false);
                console.log("fetchPlayers:", parsedData);
            } catch (err) {
                console.log(err);
            }
        })();
    }, []);

    const contextValue: Interfaces.PlayerContextType = { players, loadPlayers };

    return (
        <PlayerContext.Provider value={contextValue}>{children}</PlayerContext.Provider>
    );
};
