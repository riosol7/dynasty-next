import React, { createContext, useContext, useState } from 'react';
import { Dispatch, SetStateAction } from 'react';
import * as Interfaces from "../../interfaces";

type FantasyMarketContextType = {
    fantasyMarket: string;
    setFantasyMarket: Dispatch<SetStateAction<string>>;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  };
  
const FantasyMarketContext = createContext<FantasyMarketContextType | undefined>(undefined);  

export const useFantasyMarket = () => {
  return useContext(FantasyMarketContext);
};

export const FantasyMarketProvider = ({ children }: Interfaces.ChildrenProps) => {
  const [fantasyMarket, setFantasyMarket] = useState<string>("ktc");

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFantasyMarket(event.target.value);
  };

  return (
    <FantasyMarketContext.Provider value={{ fantasyMarket, setFantasyMarket, onChange }}>
      {children}
    </FantasyMarketContext.Provider>
  );
};
