import * as Interfaces from "../interfaces";

const validPositions: Interfaces.Player['position'][] = ["QB", "RB", "WR", "TE"];


export const processPlayers = (players:Interfaces.Player[], ktc:Interfaces.PlayerMarket[], superFlex:Interfaces.PlayerMarket[],  fc:Interfaces.PlayerMarket[]) => {
    const filteredPlayers = players.filter((player: Interfaces.Player) => validPositions.includes(player.position) && player.team !== null && player.depth_chart_order !== null); // Removed kickers & unemployed players;
    
    // console.log("filteredPlayers:", filteredPlayers); // total 480 players

    console.log("fc:", fc)
    for (const player of filteredPlayers) {
        const ktcPlayer = ktc.find((ktcPlayer: Interfaces.PlayerMarket) => ktcPlayer.player === player.full_name);
        const superFlexPlayer = superFlex.find((superFlexPlayer: Interfaces.PlayerMarket) => superFlexPlayer.player === player.full_name);
        const fcPlayer = fc.find((fcPlayer: Interfaces.PlayerMarket) => fcPlayer.player === player.full_name);
        // console.log(fcPlayer)

        if (ktcPlayer && superFlexPlayer && fcPlayer) {
            player.age = ktcPlayer.age || player.age;
            player.ktc.rank = ktcPlayer.rank || player.ktc.rank;
            // player.ktc.positionRank = ktcPlayer.position || player.ktc.positionRank;
            // player.ktc.value = ktcPlayer.value || player.ktc.value;
            // player.ktc.tier = ktcPlayer.tier || player.ktc.tier;
            // player.ktc.trend = ktcPlayer.trend || player.ktc.trend;
            // player.ktc.path = ktcPlayer.path || player.ktc.path;

            // player.superFlex.rank = superFlexPlayer.rank || player.superFlex.rank;
            // player.superFlex.positionRank = superFlexPlayer.position || player.superFlex.positionRank;
            // player.superFlex.value = superFlexPlayer.value || player.superFlex.value;

            // player.fantasy_calc_id = fcPlayer.fantasycalcId || player.fantasy_calc_id;
            // player.mfl_id = fcPlayer.mflId || player.mfl_id;
            // player.fc.rank = fcPlayer.rank || player.fc.rank;
            // player.fc.positionRank = fcPlayer.position || player.fc.positionRank;
            // player.fc.value = ktcPlayer.value || player.fc.value;
            // player.fc.trend = ktcPlayer.trend || player.fc.trend;
        }
    }
}