import * as Interfaces from "@/interfaces";

export const allUsers = (legacyLeague: Interfaces.League[]): Interfaces.Owner[] => {
    const users = legacyLeague.map(league => league.users).flat();

    const uniqueUsers = users.reduce((acc: { [key: string]: Interfaces.Owner }, user) => {
        if (!acc[user.user_id]) {
            acc[user.user_id] = user;
        }
        return acc;
    }, {});

    return Object.values(uniqueUsers);
};

