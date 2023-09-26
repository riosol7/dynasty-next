import Image from "next/image";
import styles from "../LeagueRankings.module.css";
import { Icon } from "@iconify-icon/react";
import { useLeagueContext } from "@/context";
import { findLeagueBySeason, getMatchups } from "@/utils";
import { SLEEPER_AVATAR_BASE_URL } from "@/constants";
import * as Interfaces from "@/interfaces";

function RosterHUD({roster, type}: Interfaces.RosterHUDProps) {
    const isWinner = type === "w";
    const ownerDisplayName = isWinner ? roster?.owner?.display_name : <s>{roster?.owner?.display_name}</s>;
    return (
        roster !== undefined ?
            <div className="flex items-center">
                <p className="font-bold" style={{color:"#acb6c3", fontSize:"1em"}}>{roster?.settings?.rank}</p>
                <Image width={24} height={24} alt="avatar" src={`${SLEEPER_AVATAR_BASE_URL}${roster?.owner?.avatar}`} className={`mx-2 ${styles.userAvatar}`}/>
                <p className={`font-bold ${isWinner ? "" : " text-truncate"}`}>{ownerDisplayName}</p>
            </div>
        : <p>TBD</p>
    );
};

function QuarterByeWeek({roster, type}: Interfaces.RosterHUDProps) {
    return (
        <div className="my-3" style={{background:"#111111", borderRadius:"4px", width:"250px"}}>
            <p className="py-2 text-center font-bold" style={{background:"#1c1c1c", borderRadius:"4px 4px 0px 0px"}}>{type === "toiletBowl" ? "Bottom 6" : "Quarterfinal"}</p>
            <div className="p-3">
                <div className="flex items-center justify-between">
                    <RosterHUD roster={roster} type={"w"}/>
                    <p style={{fontWeight:"lighter"}}>BYE</p>
                </div>
            </div>
        </div>
    );
};

function PostSeasonMatch({match, matchKey, round, season, sectionTitle}: Interfaces.PostSeasonMatchProps) {
    const { legacyLeague } = useLeagueContext();
    const foundLeague = findLeagueBySeason(season, legacyLeague);
    const rosters = foundLeague.rosters;

    const playoffTitle = round === 1 ? "Quarterfinal" : round === 2 && matchKey === 2 ? "5th Place Match" : round === 2 ? "Semifinal" : round === 3 && matchKey === 1 ?                     
        <p className="flex items-center justify-center">3rd Place Match <Icon icon="noto-v1:3rd-place-medal" style={{fontSize:"1.25em", marginLeft:"4px"}}/></p>
    :
        <p className="flex items-center justify-center">Final <Icon icon="noto-v1:trophy" style={{fontSize:"1.25em", marginLeft:"4px"}}/></p>
    
    const toiletTitle = round === 1 ? "Bottom 6" : round === 2 && matchKey === 2 ? "7th Place Match" : round === 2 ? "Bottom 4" : round === 3 && matchKey === 1 ?                     
        <p>9th Place Match</p>
    :
        <p>Toilet Bowl <Icon icon="noto:toilet" style={{fontSize:"1.25em", marginLeft:"4px"}}/></p>

    function score(rID: number) {
        const byeWeek = sectionTitle === "toiletBowl" ? rosters.reverse()[0].roster_id === rID || rosters.reverse()[1].roster_id === rID : 
        rosters?.filter(roster => roster.settings.division === 2)[0].roster_id === rID || rosters?.filter(roster => roster.settings.division === 1)[0].roster_id === rID ? true : false
        
        const myMatchups = getMatchups(rID, foundLeague.matchups)!;

        if (round === 1) {
            if (Number(season) > 2020) {
                return <p className="font-bold">{myMatchups[14]?.find((team: Interfaces.Roster) => team.roster_id === rID)?.points}</p> 
            } else {
                return <p className="font-bold">{myMatchups[13]?.find((team: Interfaces.Roster) => team.roster_id === rID)?.points}</p>
            };
        } else if (round === 2) {
            if (Number(season) > 2020 && byeWeek) {
                return <p className="font-bold">{myMatchups[14]?.find((team: Interfaces.Roster) => team.roster_id === rID)?.points}</p>
            } else if (Number(season) > 2020) {
                return <p className="font-bold">{myMatchups[15]?.find((team: Interfaces.Roster) => team.roster_id === rID)?.points}</p>
            } else if (Number(season) <= 2020 && byeWeek) {
                return <p className="font-bold">{myMatchups[13]?.find((team: Interfaces.Roster) => team.roster_id === rID)?.points}</p>
            } else {
                return <p className="font-bold">{myMatchups[14]?.find((team: Interfaces.Roster) => team.roster_id === rID)?.points}</p>
            };
        } else if (round === 3) {
            if (Number(season) > 2020 && byeWeek) {
                return <p className="font-bold">{myMatchups[15]?.find((team: Interfaces.Roster) => team.roster_id === rID)?.points}</p>
            } else if (Number(season) > 2020) {
                return <p className="font-bold">{myMatchups[16]?.find((team: Interfaces.Roster) => team.roster_id === rID)?.points}</p>
            } else if (Number(season) <= 2020 && byeWeek) {
                return <p className="font-bold">{myMatchups[14]?.find((team: Interfaces.Roster) => team.roster_id === rID)?.points}</p>
            } else {
                return <p className="font-bold">{myMatchups[15]?.find((team: Interfaces.Roster) => team.roster_id === rID)?.points}</p>
            };
        };
    };

    return (
        <div className="my-3" style={{background:"#111111", borderRadius:"4px", width:"250px"}}>
            <p className="py-2 text-center font-bold" style={{background:"#1c1c1c", borderRadius:"4px 4px 0px 0px"}}>{sectionTitle === "playoffs" ? playoffTitle : toiletTitle}</p>
            <div className="p-3">
                <div className="flex items-center justify-between">
                    <RosterHUD roster={rosters.find(roster => roster.roster_id === match.w)!} type={"w"}/>
                    {score(match.w!)}
                </div>
                <div className="flex items-center justify-between pt-3">
                    <RosterHUD roster={rosters.find(roster => roster.roster_id === match.l)!} type={"l"}/>
                    {score(match.l!)}
                </div>
            </div>
        </div>
    );
};

export default function Bracket({ sectionTitle, season }: Interfaces.BracketProps) {
    const { legacyLeague } = useLeagueContext();

    const matchups = (round: number) => {
        const league = legacyLeague.find(league => league.season === season);
        if (league) {
            const section = league.brackets[sectionTitle as keyof typeof league.brackets];
            if (section) {
                return section.filter((game: Interfaces.BracketMatch) => game.r === round);
            }
        }
        return [];
    };
    
    const findByeWeekTeam = (sectionTitle: string, division: number) => {
        const rosters = findLeagueBySeason(season, legacyLeague).rosters;
        if (sectionTitle === "toiletBowl") {
            if (division === 1) {
                return rosters.reverse()[0]
            } else {
                return rosters.reverse()[1]
            };
        } else if (sectionTitle === "playoffs") {
            return rosters.filter(roster => roster.settings.division === division)[0];  
        };
    };

    return (
        <div className="flex items-center">
            <div>
                <QuarterByeWeek roster={findByeWeekTeam(sectionTitle, 2)!} type={sectionTitle}/>
                {matchups(1).slice().map((match, i) => (
                    <PostSeasonMatch
                        key={i}
                        match={match} 
                        matchKey={i}
                        round={1}
                        season={season}
                        sectionTitle={sectionTitle}
                    />
                ))}
                <QuarterByeWeek roster={findByeWeekTeam(sectionTitle, 1)!} type={sectionTitle}/>
            </div>
            <div className="mx-4">
                {matchups(2).slice().map((match, idx) => (
                    <PostSeasonMatch
                        key={idx}
                        match={match} 
                        matchKey={idx}
                        round={2}
                        season={season}
                        sectionTitle={sectionTitle}
                    />
                ))}
            </div>
            <div>
                {matchups(3).slice().map((match, x) => (
                    <PostSeasonMatch
                        key={x}
                        match={match} 
                        matchKey={x}
                        round={3}
                        season={season}
                        sectionTitle={sectionTitle}
                    />
                ))}
            </div>
        </div>
    );
};