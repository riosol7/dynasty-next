import * as Interfaces from "@/interfaces";
import { roundToHundredth } from ".";

export const findMatchupDateByPoints = (legacyLeague: Interfaces.League[], score1: number, score2: number): {matchup: Interfaces.Match[], season: string, week: number} => {
    const foundSeason = legacyLeague.map(league => league.matchups.map((matchup, week) => {
        return {
            matchup: matchup.filter(team => team.points === score1 || team.points === score2),
            season: league.season,
            week: week + 1,
        };
    })).flat().filter(league => league.matchup.length > 0)[0] || {matchup: [], season: "", week: 0};
    return foundSeason;
};

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

export const getLegacyMatchup = (legacyLeague: Interfaces.League[]): Interfaces.Match[][] => {
    return legacyLeague.map(league => getMatchups(league.matchups).flat())
    .flat().sort((a, b) => {
        const aTeam1Score = a[0].points;
        const aTeam2Score = a[1].points;
        const aTotalScore = aTeam1Score + aTeam2Score;
        const bTeam1Score = b[0].points;
        const bTeam2Score = b[1].points;
        const bTotalScore = bTeam1Score + bTeam2Score;  
        return bTotalScore - aTotalScore;
    });
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

export const sortMatchupsByHighestScore = (matchups: Interfaces.Match[][]) => {
    return matchups?.slice().sort((a: any, b: any) => {
        const aTeam1 = a && a[0];
        const aTeam2 = a && a[1];

        const aTeam1Score = aTeam1?.points;
        const aTeam2Score = aTeam2?.points;
        const aTotalPtsScored = roundToHundredth(aTeam1Score + aTeam2Score);

        const bTeam1 = b && b[0];
        const bTeam2 = b && b[1];

        const bTeam1Score = bTeam1?.points;
        const bTeam2Score = bTeam2?.points;
        const bTotalPtsScored = roundToHundredth(bTeam1Score + bTeam2Score);
        return bTotalPtsScored - aTotalPtsScored;
    })?.map((matchup: Interfaces.Match[]) => matchup?.slice().sort((a, b) => b.points - a.points));
};