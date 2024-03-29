import * as Interfaces from "@/interfaces";

export const isOdd = (num: number): boolean => {
    return num % 2 !== 0;
};

export const lineupEfficiency = (pf: number, maxPF: number): number => {
    return roundToHundredth((pf / maxPF) * 100); 
};

export const roundToHundredth = (value: number): number => {
    if (typeof value === "number" && !isNaN(value)) {
        return Number(value.toFixed(2));
    
    } else return 0;
};

export const winPCT = (wins: number, losses: number): number => {
    return roundToHundredth((wins / (wins + losses)) * 100);
};

export const calculatePercentageChange = (currentValue: number, prevValue: number): number => {
    return roundToHundredth(((currentValue - prevValue) / prevValue) * 100);
};

export const calculatePercentage = (currentValue: number, totalValue: number): number => {
    return roundToHundredth((currentValue/totalValue) * 100);
};

export const calculateAverage = (sum: number, count: number) => {
    return roundToHundredth(sum/count);
};

export const countRepeatedValues = (numbers: number[]): { [key: number]: number } => {
    const counts: { [key: number]: number } = {};

    // Count occurrences of each number
    for (const num of numbers) {
        if (counts[num]) {
            counts[num]++;
        } else {
            counts[num] = 1;
        }
    }

    return counts;
}