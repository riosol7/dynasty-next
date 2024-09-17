import * as Interfaces from "@/interfaces";

const validPositions: Interfaces.Player['position'][] = ["QB", "RB", "WR", "TE", "K", "DEF"];

function extractNumbersFromString(inputString: string): string {
    const numericPart = inputString.match(/\d+/);
    return numericPart ? numericPart[0] : "";
};

export const processPlayers = (
    players: Interfaces.Player[], 
    ktc: Interfaces.PlayerMarket[], 
    fc: Interfaces.FantasyCalcPlayer[], 
    dp: Interfaces.DynastyProcessPlayer[], 
    fp: Interfaces.FantasyProPlayer[],
) => {
    const unemployedPlayers = players.filter((player: Interfaces.Player) => validPositions.includes(player.position) && player.team === null);
    const employedPlayers   = players.filter((player: Interfaces.Player) => validPositions.includes(player.position) && player.team !== null);
    
    const updatedEmployedPlayers = employedPlayers.map((player: Interfaces.Player) => {
        const ktcPlayer = ktc.find((ktcPlayer: Interfaces.PlayerMarket) => ktcPlayer.player === player.full_name);
        const fcPlayer  = fc.find((fcPlayer: Interfaces.FantasyCalcPlayer) => fcPlayer.name === player.full_name);
        const fpPlayer  = fp.find((fpPlayer: Interfaces.FantasyProPlayer) => fpPlayer.player_name === player.full_name || fpPlayer.player_short_name === `${player.first_name[0]}. ${player.last_name}`);
        const dpPlayer  = dp.find((dpPlayer: Interfaces.DynastyProcessPlayer) => dpPlayer.player === player.full_name || dpPlayer.fp_id === fpPlayer?.fantasypros_id);
        
        // Initialize properties
        player.ktc         = player.ktc || {};
        player.fc          = player.fc || {};
        player.dp          = player.dp || {};
        player.fantasy_pro = player.fantasy_pro || {};

        if (ktcPlayer && player.ktc) {
            player.age              = ktcPlayer.age || player.age;
            player.ktc.rank         = ktcPlayer.rank || player.ktc.rank;
            player.ktc.positionRank = extractNumbersFromString(ktcPlayer.position) || player.ktc.positionRank;
            player.ktc.value        = ktcPlayer.value || player.ktc.value;
            player.ktc.tier         = ktcPlayer.tier || player.ktc.tier;
            player.ktc.trend        = ktcPlayer.trend || player.ktc.trend;
            player.ktc.path         = ktcPlayer.path || player.ktc.path;
        };
        if (fcPlayer && player.fc) {
            player.fantasy_calc_id = fcPlayer.fantasycalcId || player.fantasy_calc_id;
            player.mfl_id          = fcPlayer.mflId || player.mfl_id;
            player.fc.rank         = fcPlayer.overallRank || player.fc.rank;
            player.fc.positionRank = fcPlayer.positionRank || player.fc.positionRank;
            player.fc.value        = fcPlayer.value || player.fc.value;
            player.fc.trend        = fcPlayer.trend30day || player.fc.trend;
        };
        if (dpPlayer && player.dp) {
            // player.dp.ecr_1qb = dpPlayer.ecr_1qb || player.dp.ecr_1qb;
            player.dp.rank         = dpPlayer.ecr_2qb || player.dp.rank;
            player.dp.positionRank = dpPlayer.ecr_pos || player.dp.positionRank;
            // player.dp.value_1qb = dpPlayer.value_1qb || player.dp.value_1qb;
            player.dp.value        = dpPlayer.value_2qb || player.dp.value;
        };
        if (fpPlayer && player.fantasy_pro) {
            player.fantasy_pro.fantasypros_id     = fpPlayer.fantasypros_id || player.fantasy_pro.fantasypros_id;
            player.fantasy_pro.rank               = fpPlayer.rank || player.fantasy_pro.rank;
            player.fantasy_pro.ecr                = fpPlayer.ecr || player.fantasy_pro.ecr;
            player.fantasy_pro.sd                 = fpPlayer.sd || player.fantasy_pro.sd;
            player.fantasy_pro.best               = fpPlayer.best || player.fantasy_pro.best
            player.fantasy_pro.worst              = fpPlayer.worst ||  player.fantasy_pro.worst;
            player.fantasy_pro.player_page_url    = fpPlayer.player_page_url || player.fantasy_pro.player_page_url;
            player.fantasy_pro.player_image_url   = fpPlayer.player_image_url || player.fantasy_pro.player_image_url;
            player.fantasy_pro.player_bye_week    = fpPlayer.player_bye_week || player.fantasy_pro.player_bye_week;
            player.fantasy_pro.player_owned_avg   = fpPlayer.player_owned_avg || player.fantasy_pro.player_owned_avg;
            player.fantasy_pro.player_owned_espn  = fpPlayer.player_owned_espn || player.fantasy_pro.player_owned_espn;
            player.fantasy_pro.player_owned_yahoo = fpPlayer.player_owned_yahoo || player.fantasy_pro.player_owned_yahoo;
            player.fantasy_pro.player_opponent    = fpPlayer.player_opponent || player.fantasy_pro.player_opponent;
            player.fantasy_pro.player_opponent_id = fpPlayer.player_opponent_id || player.fantasy_pro.player_opponent_id;
            player.fantasy_pro.player_ecr_delta   = fpPlayer.player_ecr_delta || player.fantasy_pro.player_ecr_delta;
            player.fantasy_pro.pos_rank           = fpPlayer.pos_rank || player.fantasy_pro.pos_rank;
            player.fantasy_pro.start_sit_grade    = fpPlayer.start_sit_grade || player.fantasy_pro.start_sit_grade;
            player.fantasy_pro.r2p_pts            = fpPlayer.r2p_pts || player.fantasy_pro.r2p_pts;
        };

        return player;
    });

    // Combine employed and unemployed players arrays
    const updatedPlayers = updatedEmployedPlayers.concat(unemployedPlayers);

    return updatedPlayers;
};