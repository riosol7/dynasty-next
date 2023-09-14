import * as Interfaces from "../interfaces";

export const processRosters = (league: Interfaces.League, players: Interfaces.Player[]): Interfaces.Roster[] => {
  const rosters = league.rosters;
  const users = league.users;

  const uploadPlayersToRosters = rosters.map(roster => {
    const foundOwner = users.find(user => user.user_id === roster.owner_id);
    const playerIDs = roster.players;

    const foundPlayers = playerIDs.map((playerID) => {
      const player = players.find(player => player.player_id === playerID);
        if (player) {
            return player;
        } else {
            // Handle the case where a player with the ID is not found
            return null;
        }
    }).filter(player => player !== null) as Interfaces.Player[];    
    
    const qbFiltered = foundPlayers.filter(player => player.position === "QB");
    const rbFiltered = foundPlayers.filter(player => player.position === "RB");
    const wrFiltered = foundPlayers.filter(player => player.position === "WR");
    const teFiltered = foundPlayers.filter(player => player.position === "TE");

    const ktcQBValue = qbFiltered.reduce((total, player) => {
      const ktcValue = typeof player.ktc.value === "string" ? parseFloat(player.ktc.value) : player.ktc.value;
      return total + (isNaN(ktcValue) ? 0 : ktcValue);
    }, 0);

    const ktcRBValue = rbFiltered.reduce((total, player) => {
      const ktcValue = typeof player.ktc.value === "string" ? parseFloat(player.ktc.value) : player.ktc.value;
      return total + (isNaN(ktcValue) ? 0 : ktcValue);
    }, 0);

    const ktcWRValue = wrFiltered.reduce((total, player) => {
      const ktcValue = typeof player.ktc.value === "string" ? parseFloat(player.ktc.value) : player.ktc.value;
      return total + (isNaN(ktcValue) ? 0 : ktcValue);
    }, 0);

    const ktcTEValue = teFiltered.reduce((total, player) => {
      const ktcValue = typeof player.ktc.value === "string" ? parseFloat(player.ktc.value) : player.ktc.value;
      return total + (isNaN(ktcValue) ? 0 : ktcValue);
    }, 0);

    // const rbFiltered = foundPlayers.filter(player => player.position === "RB").sort((a, b) => {
    //     return (isNaN(b.value) ? 0 : parseInt(b.value)) - (isNaN(a.value) ? 0 : parseInt(a.value));
    // });
    // const rbTotal = rbFiltered.reduce((total, player) => {
    //   return total + (isNaN(player.value) ? 0 : parseInt(player.value));
    // }, 0);

    // const wrFiltered = foundPlayers.filter(player => player.position === "WR").sort((a, b) => {
    //   return (isNaN(b.value) ? 0 : parseInt(b.value)) - (isNaN(a.value) ? 0 : parseInt(a.value));
    // });
    // const wrTotal = wrFiltered.reduce((total, player) => {
    //   return total + (isNaN(player.value) ? 0 : parseInt(player.value));
    // }, 0);

    // const teFiltered = foundPlayers.filter(player => player.position === "TE").sort((a, b) => {
    //   return (isNaN(b.value) ? 0 : parseInt(b.value)) - (isNaN(a.value) ? 0 : parseInt(a.value));
    // });
    // const teTotal = teFiltered.reduce((total, player) => {
    //   return total + (isNaN(player.value) ? 0 : parseInt(player.value));
    // }, 0);
  
    const ktcTeamValue = ktcQBValue + ktcRBValue + ktcWRValue + ktcTEValue;
    return {
      ...roster,
      players: foundPlayers,
      owner: foundOwner,
      ktc: {
        team: ktcTeamValue,
        qb: ktcQBValue,
        rb: ktcRBValue,
        wr: ktcWRValue,
        te: ktcTEValue,
      },
    };
  })
  return uploadPlayersToRosters;
}

// return {
//   totalRoster: uploadPlayersToRosters.sort((a,b) => { if (a.settings.wins === b.settings.wins) { return (b.settings.fpts) - (a.settings.fpts);} else { return b.settings.wins - a.settings.wins;}}).map((team, i) => ({...team, rank:i+1})),
//   teamRank: uploadPlayersToRosters.sort((a, b) => parseFloat(b.kct.teamTotal) - parseFloat(a.kct.teamTotal)).map((roster, idx) => { return { kct: roster.kct, rank: idx + 1, roster_id: roster.roster_id } }),
//   qbRank: uploadPlayersToRosters.sort((a, b) => parseFloat(b.kct.qb.total) - parseFloat(a.kct.qb.total)).map((roster, idx) => { return { kct: roster.kct, rank: idx + 1, roster_id: roster.roster_id } }),
//   rbRank: uploadPlayersToRosters.sort((a, b) => parseFloat(b.kct.rb.total) - parseFloat(a.kct.rb.total)).map((roster, idx) => { return { kct: roster.kct, rank: idx + 1, roster_id: roster.roster_id } }),
//   wrRank: uploadPlayersToRosters.sort((a, b) => parseFloat(b.kct.wr.total) - parseFloat(a.kct.wr.total)).map((roster, idx) => { return { kct: roster.kct, rank: idx + 1, roster_id: roster.roster_id } }),
//   teRank: uploadPlayersToRosters.sort((a, b) => parseFloat(b.kct.te.total) - parseFloat(a.kct.te.total)).map((roster, idx) => { return { kct: roster.kct, rank: idx + 1, roster_id: roster.roster_id } }),
// }
