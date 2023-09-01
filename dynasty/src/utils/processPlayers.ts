import * as Interfaces from "../interfaces";

const validPositions: Interfaces.Player['position'][] = ["QB", "RB", "WR", "TE"];

function extractNumbersFromString(inputString: string): string {
    const numericPart = inputString.match(/\d+/);
    return numericPart ? numericPart[0] : "";
}

export const processPlayers = (players: Interfaces.Player[], ktc: Interfaces.PlayerMarket[], superFlex: Interfaces.PlayerMarket[], fc: Interfaces.PlayerMarket[]) => {
    const unemployedPlayers = players.filter((player: Interfaces.Player) => !validPositions.includes(player.position) && player.team === null && player.depth_chart_order === null);
    const employedPlayers = players.filter((player: Interfaces.Player) => validPositions.includes(player.position) && player.team !== null && player.depth_chart_order !== null);

    const updatedEmployedPlayers = employedPlayers.map((player: Interfaces.Player) => {
        const ktcPlayer = ktc.find((ktcPlayer: Interfaces.PlayerMarket) => ktcPlayer.player === player.full_name);
        const superFlexPlayer = superFlex.find((superFlexPlayer: Interfaces.PlayerMarket) => superFlexPlayer.player === player.full_name);
        const fcPlayer = fc.find((fcPlayer: Interfaces.PlayerMarket) => fcPlayer.player === player.full_name);
        // Initialize properties
        player.ktc = player.ktc || {};
        player.superFlex = player.superFlex || {};
        player.fc = player.fc || {};

        if (ktcPlayer && player.ktc) {
            player.age = ktcPlayer.age || player.age;
            player.ktc.rank = ktcPlayer.rank || player.ktc.rank;
            player.ktc.positionRank = extractNumbersFromString(ktcPlayer.position) || player.ktc.positionRank;
            player.ktc.value = ktcPlayer.value || player.ktc.value;
            player.ktc.tier = ktcPlayer.tier || player.ktc.tier;
            player.ktc.trend = ktcPlayer.trend || player.ktc.trend;
            player.ktc.path = ktcPlayer.path || player.ktc.path;
        };
        if (superFlexPlayer && player.superFlex) {
            player.superFlex.rank = superFlexPlayer.rank || player.superFlex.rank;
            player.superFlex.positionRank = extractNumbersFromString(superFlexPlayer.positionRank) || player.superFlex.positionRank;
            player.superFlex.value = superFlexPlayer.value || player.superFlex.value;
        };
        if (fcPlayer && player.fc) {
            player.fantasy_calc_id = fcPlayer.fantasycalcId || player.fantasy_calc_id;
            player.mfl_id = fcPlayer.mflId || player.mfl_id;
            player.fc.rank = fcPlayer.rank || player.fc.rank;
            player.fc.positionRank = fcPlayer.positionRank || player.fc.positionRank;
            player.fc.value = fcPlayer.value || player.fc.value;
            player.fc.trend = fcPlayer.trend || player.fc.trend;
        };

        return player;
    });

    // Combine employed and unemployed players arrays
    const updatedPlayers = updatedEmployedPlayers.concat(unemployedPlayers);

    return updatedPlayers;
};