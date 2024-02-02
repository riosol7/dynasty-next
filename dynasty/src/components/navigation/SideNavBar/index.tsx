import { useEffect, useState } from 'react';
import styles from "./SideNavBar.module.css";
import * as Interfaces from "@/interfaces";
import { Icon } from '@iconify-icon/react';
import { useLeagueContext } from '@/context';
import { allUsers, getMatchups } from '@/utils';
import { SLEEPER_AVATAR_BASE_URL } from '@/constants';

export default function SideNavBar({ isSidebarOpen }: Interfaces.SideNavBarProps) {
    const { legacyLeague } = useLeagueContext();
    const [currentPath, setCurrentPath] = useState<string>('/');
    
    const currentLeague: Interfaces.League = legacyLeague[0]!;
    const matchups = getMatchups(currentLeague.matchups);
    const currentWeek: number = matchups.map(weeks => weeks.filter((week: Interfaces.Match[]) => week[0].points !== 0))
        .filter(week => week.length > 0).length || 0;
    const leagueID: string = currentLeague?.league_id;
    const users: Interfaces.Owner[] = allUsers(legacyLeague);
    const activeUsers: Interfaces.Owner[] = users?.filter(user => user.league_id === leagueID);
    const inactiveUsers: Interfaces.Owner[] = users?.filter(user => user.league_id !== leagueID);

    useEffect(() => {
        setCurrentPath(window.location.pathname);
    }, []);

    const dashboardActive = currentPath === "/";
    const marketActive = currentPath === "/market";
    const matchupsActive = currentPath.includes("/matchups");
    const playersActive = currentPath === "/players";
    const teamsActive = currentPath === "/teams";

    const navItem = (title: string) => {
        let navItemActive: boolean = false; 
        let iconName: string = "";
        let navLink: string = "";

        switch (title) {
            case "Dashboard":
                navItemActive = dashboardActive;
                iconName = "bxs:dashboard";
                navLink = "/";
                break;

            case "Market":
                navItemActive = marketActive;
                iconName = "ant-design:stock-outlined";
                navLink = "/market";
                break;

            case "Matchups":
                navItemActive = matchupsActive;
                iconName = "tabler:vs";
                navLink = `/matchups?week=${currentWeek}&season=${currentLeague?.season}`;
                break;

            case "Players":
                navItemActive = playersActive;
                iconName = "game-icons:american-football-player";
                navLink = "/players";
                break;

            default:
                break;
        };
        
        return (
            isSidebarOpen ?
                <a href={navLink} className={`${styles.hover} ${styles.navItemOpen}`}>
                    {navItemActive ? <div id={styles.activeIcon}></div> : null}
                    <Icon className={`mr-2 ml-4 ${styles.iconSize}`} icon={iconName} 
                    style={{color: navItemActive ? "white" : "#7f7f7f"}}/>
                    <p className="text-xs" style={{ color: navItemActive ? "white" : "#7f7f7f" }}>{title}</p>
                </a>
            :
                <div className={`${styles.navItem} ${styles.hover}`}>
                    {navItemActive ? <div id={styles.activeIcon}></div> : null}
                    <div>
                        <a href={navLink} className="flex items-center justify-center">
                            <Icon className={styles.iconSize} icon={iconName} 
                                style={{ color: navItemActive ? "white" : "#7f7f7f"
                            }}/>
                        </a>
                        <p className={styles.navTitle} style={{ color: navItemActive ? "white" : "#7f7f7f" }}>{title}</p>
                    </div>
                </div>
        );
    };

    return (
        <nav className={styles.sideBar} style={{ width: isSidebarOpen ? "220px": "0px" }}>
            {navItem("Dashboard")}
            {navItem("Market")}
            {navItem("Matchups")}
            {navItem("Players")}
            {isSidebarOpen ? 
            <div className={styles.navTeamSection}>
                <p className="font-bold">Teams</p>
                <div className="pt-3 flex items-center text-[lightgray]">
                    <Icon icon="icon-park-outline:dot" className={styles.dot} style={{ color: "rgb(80,204,147)" }}/>
                    <p className="text-xs text-[lightgray]">{activeUsers?.length} Active</p>
                </div>
                {activeUsers.map((user, i) => 
                    <a key={i} className={`text-xs my-3 p-1 flex items-center ${styles.hover}`} 
                    href={`/teams/${user.display_name}`} style={{ borderRadius: "12px 0% 0% 12px"}}>
                        <div className={`mr-3 ${styles.avatar}`} style={{ backgroundImage:`url(${SLEEPER_AVATAR_BASE_URL}${user.avatar})` }}></div>
                        <p>{user.display_name}</p>
                    </a>
                )}
                <div className="pt-2 flex items-center text-[lightgray]">
                    <Icon icon="icon-park-outline:dot" className={styles.dot} style={{ color: "#f5286ce1" }}/>
                    <p className="text-xs text-[lightgray]">{inactiveUsers?.length} Inactive</p>
                </div>
                {inactiveUsers.map((user, i) => 
                    <div key={i} className={`text-xs my-3 p-1 flex items-center ${styles.hover}`} 
                    style={{ borderRadius: "12px 0% 0% 12px"}}>
                        <div className={`mr-3 ${styles.avatar}`} style={{ backgroundImage:`url(${SLEEPER_AVATAR_BASE_URL}${user.avatar})` }}></div>
                        <p>{user.display_name}</p>
                    </div>
                )}
            </div>
            : 
            <div className={`${styles.navItem} ${styles.hover}`}>
                {teamsActive ? <div id={styles.activeIcon}></div> : null}
                <div>
                    <a href={`/teams`}  className="flex items-center justify-center">
                        <Icon icon="fluent:people-team-24-filled" className={styles.iconSize} 
                        style={{color: teamsActive ? "white" : "#7f7f7f"}}/>
                    </a>
                    <p className={styles.navTitle} style={{ color: teamsActive ? "white" : "#7f7f7f" }}>Teams</p>
                </div>
            </div>}
        </nav>
    );
};