import * as Interfaces from "@/interfaces";
import * as Constants from "@/constants";

export const processTransactions = (legacyLeague: Interfaces.League[]): Interfaces.Transaction[] => {
    const transactions = legacyLeague.map(league => league.transactions).flat();
    
    return transactions;
};

export const processWaiverBids = (legacyLeague: Interfaces.League[], players: Interfaces.Player[]) => {
    const waiverBids = legacyLeague.map((league: Interfaces.League) => league.transactions
    .filter(transaction => 
        transaction.settings?.waiver_bid !== null && 
        transaction.settings?.waiver_bid > 0 && 
        transaction.status === "complete" && 
        transaction.type === "waiver"
    ).map((transaction: Interfaces.Transaction) => {
        const creator     = league.users.find(user => user.user_id === transaction.creator);
        const foundPlayer = players.find(player => player.player_id === Object.keys(transaction.adds)[0]); // Only adds for waiver pickups

        return {
            ...transaction, 
            creator: creator?.display_name || "", waiver_player: foundPlayer || Constants.initPlayer
        };
    })).flat();

    const qbWaivers  = [...waiverBids].filter((bid) => bid.waiver_player?.position === "QB");
    const rbWaivers  = [...waiverBids].filter((bid) => bid.waiver_player?.position === "RB");
    const wrWaivers  = [...waiverBids].filter((bid) => bid.waiver_player?.position === "WR");
    const teWaivers  = [...waiverBids].filter((bid) => bid.waiver_player?.position === "TE");
    const kWaivers   = [...waiverBids].filter((bid) => bid.waiver_player?.position === "K");
    const defWaivers = [...waiverBids].filter((bid) => bid.waiver_player?.position === "DEF");

    return {
        all: waiverBids,
        QB:  qbWaivers,
        RB:  rbWaivers,
        WR:  wrWaivers,
        TE:  teWaivers,
        K:   kWaivers,
        DEF: defWaivers,
    };
};
  