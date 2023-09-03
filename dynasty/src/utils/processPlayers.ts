import * as Interfaces from "../interfaces";

const validPositions: Interfaces.Player['position'][] = ["QB", "RB", "WR", "TE"];

function extractNumbersFromString(inputString: string): string {
    const numericPart = inputString.match(/\d+/);
    return numericPart ? numericPart[0] : "";
}

export const processPlayers = (players: Interfaces.Player[], ktc: Interfaces.PlayerMarket[], sf: Interfaces.PlayerMarket[], fc: Interfaces.FantasyCalcPlayer[], dp: Interfaces.DynastyProcessPlayer[], fp: Interfaces.FantasyProPlayer[],) => {
    const unemployedPlayers = players.filter((player: Interfaces.Player) => !validPositions.includes(player.position) && player.team === null && player.depth_chart_order === null);
    const employedPlayers = players.filter((player: Interfaces.Player) => validPositions.includes(player.position) && player.team !== null && player.depth_chart_order !== null);

    const updatedEmployedPlayers = employedPlayers.map((player: Interfaces.Player) => {
        const ktcPlayer = ktc.find((ktcPlayer: Interfaces.PlayerMarket) => ktcPlayer.player === player.full_name);
        const sfPlayer = sf.find((superFlexPlayer: Interfaces.PlayerMarket) => superFlexPlayer.player === player.full_name);
        const fcPlayer = fc.find((fcPlayer: Interfaces.FantasyCalcPlayer) => fcPlayer.name === player.full_name);
        const dpPlayer = dp.find((dpPlayer: Interfaces.DynastyProcessPlayer) => dpPlayer.player === player.full_name);
        const fpPlayer = fp.find((fpPlayer: Interfaces.FantasyProPlayer) => fpPlayer.player_name === player.full_name);

        // Initialize properties
        player.ktc = player.ktc || {};
        player.superFlex = player.superFlex || {};
        player.fantasy_calc = player.fantasy_calc || {};
        player.dynasty_process = player.dynasty_process || {};
        player.fantasy_pro = player.fantasy_pro || {};

        if (ktcPlayer && player.ktc) {
            player.age = ktcPlayer.age || player.age;
            player.ktc.rank = ktcPlayer.rank || player.ktc.rank;
            player.ktc.positionRank = extractNumbersFromString(ktcPlayer.position) || player.ktc.positionRank;
            player.ktc.value = ktcPlayer.value || player.ktc.value;
            player.ktc.tier = ktcPlayer.tier || player.ktc.tier;
            player.ktc.trend = ktcPlayer.trend || player.ktc.trend;
            player.ktc.path = ktcPlayer.path || player.ktc.path;
        };
        if (sfPlayer && player.superFlex) {
            player.superFlex.rank = sfPlayer.rank || player.superFlex.rank;
            player.superFlex.positionRank = extractNumbersFromString(sfPlayer.positionRank) || player.superFlex.positionRank;
            player.superFlex.value = sfPlayer.value || player.superFlex.value;
        };
        if (fcPlayer && player.fantasy_calc) {
            player.fantasy_calc_id = fcPlayer.fantasycalcId || player.fantasy_calc_id;
            player.mfl_id = fcPlayer.mflId || player.mfl_id;
            player.fantasy_calc.rank = fcPlayer.overallRank || player.fantasy_calc.rank;
            player.fantasy_calc.positionRank = fcPlayer.positionRank || player.fantasy_calc.positionRank;
            player.fantasy_calc.value = fcPlayer.value || player.fantasy_calc.value;
            player.fantasy_calc.trend = fcPlayer.trend30day || player.fantasy_calc.trend;
        };
        if (dpPlayer && player.dynasty_process) {
            player.dynasty_process.ecr_1qb = dpPlayer.ecr_1qb || player.dynasty_process.ecr_1qb;
            player.dynasty_process.ecr_2qb = dpPlayer.ecr_2qb || player.dynasty_process.ecr_2qb;
            player.dynasty_process.ecr_pos = dpPlayer.ecr_pos || player.dynasty_process.ecr_pos;
            player.dynasty_process.value_1qb = dpPlayer.value_1qb || player.dynasty_process.value_1qb;
            player.dynasty_process.value_2qb = dpPlayer.value_2qb || player.dynasty_process.value_2qb;
        };
        if (fpPlayer && player.fantasy_pro) {
            player.fantasy_pro.fantasypros_id = fpPlayer.fantasypros_id || player.fantasy_pro.fantasypros_id;
            player.fantasy_pro.rank = fpPlayer.rank || player.fantasy_pro.rank;
            player.fantasy_pro.ecr = fpPlayer.ecr || player.fantasy_pro.ecr;
            player.fantasy_pro.sd = fpPlayer.sd || player.fantasy_pro.sd;
            player.fantasy_pro.best = fpPlayer.best || player.fantasy_pro.best
            player.fantasy_pro.worst = fpPlayer.worst ||  player.fantasy_pro.worst;
            player.fantasy_pro.player_page_url = fpPlayer.player_page_url || player.fantasy_pro.player_page_url;
            player.fantasy_pro.player_image_url = fpPlayer.player_image_url || player.fantasy_pro.player_image_url;
            player.fantasy_pro.player_bye_week = fpPlayer.player_bye_week || player.fantasy_pro.player_bye_week;
            player.fantasy_pro.player_owned_avg = fpPlayer.player_owned_avg || player.fantasy_pro.player_owned_avg;
            player.fantasy_pro.player_owned_espn = fpPlayer.player_owned_espn || player.fantasy_pro.player_owned_espn;
            player.fantasy_pro.player_owned_yahoo = fpPlayer.player_owned_yahoo || player.fantasy_pro.player_owned_yahoo;
            player.fantasy_pro.player_opponent = fpPlayer.player_opponent || player.fantasy_pro.player_opponent;
            player.fantasy_pro.player_opponent_id = fpPlayer.player_opponent_id || player.fantasy_pro.player_opponent_id;
            player.fantasy_pro.player_ecr_delta = fpPlayer.player_ecr_delta || player.fantasy_pro.player_ecr_delta;
            player.fantasy_pro.pos_rank = fpPlayer.pos_rank || player.fantasy_pro.pos_rank;
            player.fantasy_pro.start_sit_grade = fpPlayer.start_sit_grade || player.fantasy_pro.start_sit_grade;
            player.fantasy_pro.r2p_pts = fpPlayer.r2p_pts || player.fantasy_pro.r2p_pts;
        }

        return player;
    });

    // Combine employed and unemployed players arrays
    const updatedPlayers = updatedEmployedPlayers.concat(unemployedPlayers);

    console.log(updatedPlayers)

    return updatedPlayers;
};