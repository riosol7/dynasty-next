import { ReactNode } from "react";

export interface TeamParams {
    params: {
        name: string;
    };
};

export interface TeamLayoutParams {
    children: ReactNode;
    params: {
        name: string;
    };
};

export interface TeamParamProps {
    name: string;
};

export interface MatchupsParams {
    params: {
        week: number;
        season: string;
    }
}