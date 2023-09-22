import * as Interfaces from "../interfaces";

export const getMatchups = (rID: number, matchups: Interfaces.Match[][] | undefined) => {
    return matchups?.map(week => week.reduce((acc, team) => {
        acc[team.matchup_id] = acc[team.matchup_id] || [];
        acc[team.matchup_id].push(team);
        return acc;
    }, Object.create(null))).map(match => Object.entries(match).map(game => game[1])).map(matchup => matchup.reduce((acc, teams:any) => {
        if (teams.filter((team: Interfaces.Match) => team.roster_id === rID).length > 0) {
            return teams;
        };
        return acc;
    })).map((match: any) => match.sort((a:any, b:any) => b.points - a.points)).filter(game => game.length === 2);
};