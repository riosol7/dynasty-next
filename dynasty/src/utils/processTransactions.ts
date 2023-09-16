import * as Interfaces from "../interfaces";

export const processWaiverBids = (legacyLeague: Interfaces.League[], players: Interfaces.Player[]) => {
    const waivers = legacyLeague.map((league: Interfaces.League) => league.transactions.filter(transaction => 
        transaction.settings?.waiver_bid !== null && transaction.settings?.waiver_bid > 0 && transaction.status === "complete" && transaction.type === "waiver")
        .map((transaction: Interfaces.Transaction) => {
            const creator = league.users.find(user => user.user_id === transaction.creator);
            const foundPlayers = players.find(player => player.player_id === Object.keys(transaction.adds)[0]); // Only adds for waiver pickups

            return {...transaction, creator: creator?.display_name || "", players: foundPlayers || Interfaces.initialPlayer};
        }).filter(transaction => transaction.players?.position !== "DEF" && transaction.players?.position !== "K")
    ).flat();

    const qbWaivers = waivers.filter(waiver => waiver.players?.position === "QB"); 
    const rbWaivers = waivers.filter(waiver => waiver.players?.position === "RB"); 
    const wrWaivers = waivers.filter(waiver => waiver.players?.position === "WR"); 
    const teWaivers = waivers.filter(waiver => waiver.players?.position === "TE"); 

    return {
        all: waivers,
        qb: qbWaivers,
        rb: rbWaivers,
        wr: wrWaivers,
        te: teWaivers,
    };
};