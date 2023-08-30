export const isOdd = (num: number): boolean => {
    return num % 2 ! == 0;
}

export const lineupEfficiency = (pf: number, maxPF: number): number => {
    return roundToHundredth((pf / maxPF) * 100); 
};

export const roundToHundredth = (value: number): number => {
    return Number(value.toFixed(2));
};

export const winPCT = (wins: number, losses: number): number => {
    return roundToHundredth((wins / (wins + losses)) * 100);
};