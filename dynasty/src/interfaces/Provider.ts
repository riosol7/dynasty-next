import { ReactNode } from "react";

export interface ChildrenProps {
    children: ReactNode;
};

export interface SeasonProvider {
    children: ReactNode;
    season: string;
};