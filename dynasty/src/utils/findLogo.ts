import { LOGOS } from "../constants";
import * as Interfaces from "../interfaces";

const noLogo: Interfaces.Logo = {
    bgColor: "linear-gradient(27deg, rgba(165,172,175,1) 0%, rgba(15,15,15,1) 100%)",
    bgColor2: "",
    bgColor3: "",
    color: "",
    l: "FA",
};

export const findLogo = (team: string): Interfaces.Logo => {
    const foundLogo = LOGOS.find((logo) => logo.hasOwnProperty(team));
    if (foundLogo) {
        return foundLogo[team];
    }
    return noLogo;
};