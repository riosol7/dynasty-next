"use client";
import styles from "./Market.module.css";
import React from "react";
import PositionMarket from "./PositionMarket";
import WaiverActivity from "./WaiverActivity";
import { useLeagueContext, usePlayerContext } from "@/context";
import { processWaiverBids } from "@/utils";
import { Icon } from "@iconify-icon/react";

export default function MarketWidget() {
    const { legacyLeague, loadLegacyLeague } = useLeagueContext();
    const { players, loadPlayers } = usePlayerContext();

    const waiverBids = processWaiverBids(legacyLeague, players);

    return (
        <div className="my-5">
            <div className="flex items-center justify-between py-2">
                <div className="flex items-center">
                    <Icon icon="ant-design:stock-outlined"  style={{color:"#a9dfd8", fontSize:"1.1rem"}} />
                    <p className="font-bold mx-1">Market</p>
                </div>
                <Icon className={styles.arrow} icon="material-symbols:arrow-right-alt-rounded" style={{ fontSize: "1.5rem", color: "#cbcbcb" }} />
            </div>
            <PositionMarket waiverBids={waiverBids}/>
            <WaiverActivity
                // asc={asc}
                // currentPage={currentPage}
                // findLogo={findLogo}
                // handleOwner={handleOwner}
                // handlePosition={handlePosition}
                // handleShowPage={handleShowPage}
                // handleSort={handleSort}
                // league={league}
                // nextPage={nextPage}
                // owner={owner}
                // pageNumbers={pageNumbers}
                // paginate={paginate}
                // position={position}
                // prevPage={prevPage}
                // records={records}
                // recordsPerPage={recordsPerPage}
                // setAsc={setAsc}
                // sort={sort}
                // waiverBidsFiltered={waiverBidsFiltered}
            />
        </div>
    )
}
