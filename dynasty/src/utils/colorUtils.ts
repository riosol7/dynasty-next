export const primeIndicator = (age: number, position: string): string => {
    if (((position === "QB" || position === "TE") && age < 25) || ((position === "RB" || position === "WR") && age < 24)) {
        return "#42f3e9";
    } else if (((position === "WR" || position === "TE") && age < 28) || (position === "QB" && age < 30) || (position === "RB" && age < 27)) {
        return "#3cf20a";
    } else if ((position === "QB" && age < 33) || (position === "RB" && age < 27) || (position === "WR" && age < 29) || (position === "TE" && age < 30)) {
        return "#f2c306";
    } else if ((position === "QB" && age < 35) || (position === "RB" && age < 28) || (position === "WR" && age < 30) || (position === "TE" && age < 31)) {
        return "#f26307";
    } else if ((position === "QB" && age < 55) || (position === "RB" && age < 35) || (position === "WR" && age < 35) || (position === "TE" && age < 37)) {
        return "#e9230b";
    } else {
        return "";
    };
};