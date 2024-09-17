import * as Interfaces from "@/interfaces";
import { getMatchups, winPCT } from "..";

export const getRivalryStats = (rID: number, legacyLeague: Interfaces.League[]) => {
    let myHeadtoHead: ({ wins: number; losses: number; opponentID: any; })[] = [];
    let games: any[] = [];

    const legacyMatchups = legacyLeague?.map(league => getMatchups(league.matchups, rID));

    legacyMatchups?.map(season => season?.map(game => {
        const myMatchupInfo = game?.find((team: Interfaces.Match) => team.roster_id === rID);
        
        let wins     = 0;
        let losses   = 0;
        let opponent = game.find((team: Interfaces.Match) => team.roster_id !== rID);
        
        if (myMatchupInfo?.matchup_id !== undefined) {
            games.push(game);
            if (myMatchupInfo?.points === 0 && opponent.points === 0) {
                wins     = 0;
                losses   = 0;
                opponent = opponent.roster_id;
            }; 
            if (game[0].roster_id === rID){
                wins++;
            } else {
                losses++;
            };
            return {
                wins:       wins,
                losses:     losses,
                opponentID: opponent.roster_id,
            };
        } return null;
    }).filter(result => result?.opponentID !== undefined).forEach(game => {
        let obj = myHeadtoHead?.find(team => team?.opponentID === game?.opponentID) || false;

        if (obj) {
            obj.wins   = obj.wins + (game?.wins || 0);
            obj.losses = obj.losses + (game?.losses || 0);
        
        } else {
            if (game) {
                myHeadtoHead.push(game);
            };
        };
    }));

    return {
        games:   games,
        records: myHeadtoHead
        .sort((a,b) => winPCT(b.wins , b.losses) - winPCT(a.wins , a.losses))
        .map((roster, idx) => ({
            ...roster, 
            rank: idx + 1
        })),
    };
};