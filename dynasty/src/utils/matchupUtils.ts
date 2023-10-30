import * as Interfaces from "@/interfaces";

export const getMatchups = (matchups: Interfaces.Match[][], rID?: number) => {
    if (rID) {
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
    } else {
        return matchups?.map(week => week.reduce((acc, team) => {
            acc[team.matchup_id] = acc[team.matchup_id] || [];
            acc[team.matchup_id].push(team);
            return acc;
        }, Object.create(null))).map(match => Object.entries(match).map(game => game[1]).filter((game: any) => game.length === 2)).filter(arr => arr.length !== 0);
    };
};

export const findRecord = (rID: number, matches: Interfaces.Match[][], week: number) => {
    let wins: number = 0;
    let losses: number = 0;
    let record: string = "0-0";

    matches?.filter((_, idx) => idx <= week).forEach((team) => {
        if (team[0].matchup_id === null || (team[0].points === 0 && team[1].points === 0)){
            return record;
        
        } else if (team[0].roster_id === rID) {
            wins ++;
            record = wins.toLocaleString() + " - " + losses.toLocaleString();
            return record;
        }
            losses ++;
            record = wins.toLocaleString() + " - " + losses.toLocaleString();
            return record;
    });

    return {
        record: record,
        wins: wins,
        losses: losses
    };
};