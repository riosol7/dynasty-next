import { useEffect, useState } from 'react';
import styles from "./SideNavBar.module.css";
import * as Interfaces from "@/interfaces";
import { Icon } from '@iconify-icon/react';
import { useLeagueContext } from '@/context';
import { allUsers } from '@/utils';
import { SLEEPER_AVATAR_BASE_URL } from '@/constants';

export default function SideNavBar({ isSidebarOpen }: Interfaces.SideNavBarProps) {
    const { legacyLeague } = useLeagueContext();
    const [currentPath, setCurrentPath] = useState('/');
    const leagueID: string = legacyLeague[0].league_id;
    const users: Interfaces.Owner[] = allUsers(legacyLeague);
    const activeUsers: Interfaces.Owner[] = users?.filter(user => user.league_id === leagueID);
    const inactiveUsers: Interfaces.Owner[] = users?.filter(user => user.league_id !== leagueID);

    useEffect(() => {
        setCurrentPath(window.location.pathname);
    }, []);

    const dashboardActive = currentPath === "/";
    const marketActive = currentPath === "/market";
    const matchupsActive = currentPath === "/matchups";
    const playersActive = currentPath === "/players";
    const teamsActive = currentPath === "/teams";

    return (
        <nav className={styles.sideBar} style={{ width: isSidebarOpen ? "220px": "0px" }}>
            {isSidebarOpen ?
            <a href={`/`} className={`flex items-center ${styles.hover}`} style={{ paddingBlock: "5px", marginBlock:"10px", marginInline:"10px" }}>
                {dashboardActive ? <div id={styles.activeIcon}></div> : null}
                <Icon className={`mr-2 ml-4 ${styles.iconSize}`} icon="bxs:dashboard" style={{color: dashboardActive ? "white" : "#7f7f7f"}}/>
                <p className="text-xs" style={{ color: dashboardActive ? "white" : "#7f7f7f" }}>Dashboard</p>
            </a>
            :
            <div className={`${styles.navItem} ${styles.hover}`}>
                {dashboardActive ? <div id={styles.activeIcon}></div> : null}
                <div>
                    <a href={`/`} className="flex items-center justify-center">
                        <Icon className={styles.iconSize} icon="bxs:dashboard" 
                            style={{ color: dashboardActive ? "white" : "#7f7f7f"
                        }}/>
                    </a>
                    <p className={styles.navTitle} style={{ color: dashboardActive ? "white" : "#7f7f7f" }}>Dashboard</p>
                </div>
            </div>
            }
            {isSidebarOpen ?
            <a href={`/market`} className={`flex items-center ${styles.hover}`} style={{ paddingBlock: "5px", marginBlock:"10px", marginInline:"10px" }}>
                {marketActive ? <div id={styles.activeIcon}></div> : null}
                <Icon icon="ant-design:stock-outlined" className={`ml-4 mr-2 ${styles.iconSize}`} style={{color: marketActive ? "white" : "#7f7f7f"}}/>
                <p className="text-xs" style={{ color: marketActive ? "white" : "#7f7f7f" }}>Market</p>
            </a>
            :
            <div className={`${styles.navItem} ${styles.hover}`}>
                {marketActive ? <div id={styles.activeIcon}></div> : null}
                <div>
                    <a href={`/market`}  className="flex items-center justify-center">
                        <Icon icon="ant-design:stock-outlined" className={styles.iconSize} style={{color: marketActive ? "white" : "#7f7f7f"}}/>
                    </a>
                    <p className={styles.navTitle} style={{ color: marketActive ? "white" : "#7f7f7f" }}>Market</p>
                </div>
            </div>
            }
            {isSidebarOpen ?
            <a href={`/matchups`} className={`flex items-center ${styles.hover}`} style={{ paddingBlock: "5px", marginBlock:"10px", marginInline:"10px" }}>
                {matchupsActive ? <div id={styles.activeIcon}></div> : null}
                <Icon icon="tabler:vs" className={`ml-4 mr-2 ${styles.iconSize}`} style={{color: matchupsActive ? "white" : "#7f7f7f"}}/>
                <p className="text-xs" style={{ color: matchupsActive ? "white" : "#7f7f7f" }}>Matchups</p>
            </a>
            :
            <div className={`${styles.navItem} ${styles.hover}`}>
                {matchupsActive ? <div id={styles.activeIcon}></div> : null}
                <div>
                    <a href={`/matchups`}  className="flex items-center justify-center"><Icon icon="tabler:vs" className={styles.iconSize} style={{color: matchupsActive ? "white" : "#7f7f7f"}}/></a>
                    <p className={styles.navTitle} style={{ color: matchupsActive ? "white" : "#7f7f7f" }}>Matchups</p>
                </div>
            </div>
            }
            {isSidebarOpen ?
            <a href={`/players`} className={`flex items-center ${styles.hover}`} style={{ paddingBlock: "5px", marginBlock:"10px", marginInline:"10px" }}>
                {playersActive ? <div id={styles.activeIcon}></div> : null}
                <Icon icon="game-icons:american-football-player" className={`ml-4 mr-2 ${styles.iconSize}`} style={{color: playersActive ? "white" : "#7f7f7f"}}/>
                <p className="text-xs" style={{ color: playersActive ? "white" : "#7f7f7f" }}>Players</p>
            </a>
            :
            <div className={`${styles.navItem} ${styles.hover}`}>
                {playersActive ? <div id={styles.activeIcon}></div> : null}
                <div>
                    <a href={`/players`}  className="flex items-center justify-center"><Icon icon="game-icons:american-football-player" className={styles.iconSize} style={{color: playersActive ? "white" : "#7f7f7f"}}/></a>
                    <p className={styles.navTitle} style={{ color: playersActive ? "white" : "#7f7f7f" }}>Players</p>
                </div>
            </div>
            }
            {isSidebarOpen ? 
            <div className="mx-3 p-4 border-t-2 border-[#0f0f0f]">
                <p className="font-bold">Teams</p>
                <div className="pt-3 flex items-center text-[lightgray]">
                    <Icon icon="icon-park-outline:dot" className={styles.dot} style={{ color: "rgb(80,204,147)" }}/>
                    <p className="text-xs text-[lightgray]">{activeUsers?.length} Active</p>
                </div>
                {activeUsers.map((user, i) => 
                    <a key={i} className={`text-xs my-3 p-1 flex items-center ${styles.hover}`} href={`/teams/${user.display_name}`} style={{ borderRadius: "12px 0% 0% 12px"}}>
                        <div className={`mr-3 ${styles.avatar}`} style={{ backgroundImage:`url(${SLEEPER_AVATAR_BASE_URL}${user.avatar})` }}></div>
                        <p>{user.display_name}</p>
                    </a>
                )}
                <div className="pt-2 flex items-center text-[lightgray]">
                    <Icon icon="icon-park-outline:dot" className={styles.dot} style={{ color: "#f5286ce1" }}/>
                    <p className="text-xs text-[lightgray]">{inactiveUsers?.length} Inactive</p>
                </div>
                {inactiveUsers.map((user, i) => 
                    <div key={i} className={`text-xs my-3 p-1 flex items-center ${styles.hover}`} style={{ borderRadius: "12px 0% 0% 12px"}}>
                        <div className={`mr-3 ${styles.avatar}`} style={{ backgroundImage:`url(${SLEEPER_AVATAR_BASE_URL}${user.avatar})` }}></div>
                        <p>{user.display_name}</p>
                    </div>
                )}
            </div>
            : 
            <div className={`${styles.navItem} ${styles.hover}`}>
                {teamsActive ? <div id={styles.activeIcon}></div> : null}
                <div>
                    <a href={`/teams`}  className="flex items-center justify-center"><Icon icon="fluent:people-team-24-filled" className={styles.iconSize} style={{color: teamsActive ? "white" : "#7f7f7f"}}/></a>
                    <p className={styles.navTitle} style={{ color: teamsActive ? "white" : "#7f7f7f" }}>Teams</p>
                </div>
            </div>}
        </nav>
    );
};
