"use client";
import React, { createContext, useContext, useState } from "react";
import { Dispatch, SetStateAction } from "react";
import * as Interfaces from "@/interfaces";

type SeasonContextType = {
    selectSeason: string;
    setSelectSeason: Dispatch<SetStateAction<string>>;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};
  
const SeasonContext = createContext<SeasonContextType>({
    selectSeason: "",
    setSelectSeason: () => {},
    onChange: () => {},
});

export const useSeasonContext = () => {
    return useContext(SeasonContext);
};

export const SeasonProvider = ({ children, season }: Interfaces.SeasonProvider) => {
    const [selectSeason, setSelectSeason] = useState<string>(season);

    const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectSeason(event.target.value);
    };

    return (
        <SeasonContext.Provider value={{ selectSeason, setSelectSeason, onChange }}>
        {children}
        </SeasonContext.Provider>
    );
};
