import { ReactNode } from "react";

export interface MatchupsLayoutProps {
    children: ReactNode;
    selectWeek: number;
    setSelectWeek: React.Dispatch<React.SetStateAction<number>>
};

export interface TeamLayoutProps {
    children: ReactNode;
    name: string;
};