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

    const ktcTeamValue = ktcQBValue + ktcRBValue + ktcWRValue + ktcTEValue;

    const fcQBValue = qbFiltered.reduce((total, player) => {
      const fcValue = typeof player.fc.value === "string" ? parseFloat(player.fc.value) : player.fc.value;
      return total + (isNaN(fcValue) ? 0 : fcValue);
    }, 0);

    const fcRBValue = rbFiltered.reduce((total, player) => {
      const fcValue = typeof player.fc.value === "string" ? parseFloat(player.fc.value) : player.fc.value;
      return total + (isNaN(fcValue) ? 0 : fcValue);
    }, 0);

    const fcWRValue = wrFiltered.reduce((total, player) => {
      const fcValue = typeof player.fc.value === "string" ? parseFloat(player.fc.value) : player.fc.value;
      return total + (isNaN(fcValue) ? 0 : fcValue);
    }, 0);

    const fcTEValue = teFiltered.reduce((total, player) => {
      const fcValue = typeof player.fc.value === "string" ? parseFloat(player.fc.value) : player.fc.value;
      return total + (isNaN(fcValue) ? 0 : fcValue);
    }, 0);
 
    const fcTeamValue = fcQBValue + fcRBValue + fcWRValue + fcTEValue;

    const dpQBValue = qbFiltered.reduce((total, player) => {
      const dpValue = typeof player.dp.value === "string" ? parseFloat(player.dp.value) : player.dp.value;
      return total + (isNaN(dpValue) ? 0 : dpValue);
    }, 0);

    const dpRBValue = rbFiltered.reduce((total, player) => {
      const dpValue = typeof player.dp.value === "string" ? parseFloat(player.dp.value) : player.dp.value;
      return total + (isNaN(dpValue) ? 0 : dpValue);
    }, 0);

    const dpWRValue = wrFiltered.reduce((total, player) => {
      const dpValue = typeof player.dp.value === "string" ? parseFloat(player.dp.value) : player.dp.value;
      return total + (isNaN(dpValue) ? 0 : dpValue);
    }, 0);

    const dpTEValue = teFiltered.reduce((total, player) => {
      const dpValue = typeof player.dp.value === "string" ? parseFloat(player.dp.value) : player.dp.value;
      return total + (isNaN(dpValue) ? 0 : dpValue);
    }, 0);

    const dpTeamValue = dpQBValue + dpRBValue + dpWRValue + dpTEValue;

    const sfQBValue = qbFiltered.reduce((total, player) => {
      const sfValue = typeof player.sf.value === "string" ? parseFloat(player.sf.value) : player.sf.value;
      return total + (isNaN(sfValue) ? 0 : sfValue);
    }, 0);

    const sfRBValue = rbFiltered.reduce((total, player) => {
      const sfValue = typeof player.sf.value === "string" ? parseFloat(player.sf.value) : player.sf.value;
      return total + (isNaN(sfValue) ? 0 : sfValue);
    }, 0);

    const sfWRValue = wrFiltered.reduce((total, player) => {
      const sfValue = typeof player.sf.value === "string" ? parseFloat(player.sf.value) : player.sf.value;
      return total + (isNaN(sfValue) ? 0 : sfValue);
    }, 0);

    const sfTEValue = teFiltered.reduce((total, player) => {
      const sfValue = typeof player.sf.value === "string" ? parseFloat(player.sf.value) : player.sf.value;
      return total + (isNaN(sfValue) ? 0 : sfValue);
    }, 0);

    const sfTeamValue = sfQBValue + sfRBValue + sfWRValue + sfTEValue;

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
      dp: {
        team: dpTeamValue,
        qb: dpQBValue,
        rb: dpRBValue,
        wr: dpWRValue,
        te: dpTEValue,
      },
      fc: {
        team: fcTeamValue,
        qb: fcQBValue,
        rb: fcRBValue,
        wr: fcWRValue,
        te: fcTEValue,
      },
      sf: {
        team: sfTeamValue,
        qb: sfQBValue,
        rb: sfRBValue,
        wr: sfWRValue,
        te: sfTEValue,
      },
    };
  });

  return uploadPlayersToRosters;

};