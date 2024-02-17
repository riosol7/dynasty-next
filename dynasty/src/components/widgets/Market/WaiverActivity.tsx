import React, { useState, useEffect } from "react";
import styles from "./Market.module.css";
import { Icon } from "@iconify-icon/react";
import { useLeagueContext } from "@/context";
import { filteredTransactionsBySeason, getSortedTransactionRecords, handleSort } from "@/utils";
import * as Interfaces from "@/interfaces";
import PlayerRow from "./PlayerRow";
import PlayerHeader from "./PlayerHeader";

export default function WaiverActivity({ waivers, selectSeason }: Interfaces.MarketWidgetProps) {
    const { legacyLeague } = useLeagueContext();
    const [asc, setAsc] = useState(false);
    const [sort, setSort] = useState("DATE");
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(5);
    const [selectOwner, setSelectOwner] = useState("all");
    const [selectPosition, setSelectPosition] = useState("all");
    const positionWaivers = waivers && waivers[selectPosition as keyof typeof waivers];
    const filteredWaivers = filteredTransactionsBySeason(positionWaivers, selectSeason);
    const waiverBidsOwnerFiltered = filteredWaivers.filter(waiver => {
        if (selectOwner !== "all") {
            return waiver.creator === selectOwner;
        } else {
            return [];
        };
    });

    const records = getSortedTransactionRecords(waiverBidsOwnerFiltered!, sort, asc, currentPage, recordsPerPage);

    const handlePosition = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectPosition(e.target.value)
    };

    const handleOwner = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectOwner(e.target.value)
    };

    useEffect(() => {
        if (waiverBidsOwnerFiltered?.length! < recordsPerPage) {
            if (waiverBidsOwnerFiltered?.length! > 10) {
                setRecordsPerPage(15);
                setCurrentPage(1);
            } else if (waiverBidsOwnerFiltered?.length! > 5) {
                setRecordsPerPage(10);
                setCurrentPage(1);
            } else {
                setRecordsPerPage(5);
                setCurrentPage(1);
            }
        };
    }, [recordsPerPage, waiverBidsOwnerFiltered]);

    return (
        <div className={styles.waiverContainer}>
            <PlayerHeader
            asc={asc}
            currentPage={currentPage}
            handleOwner={handleOwner}
            handlePosition={handlePosition}
            plus={false}
            recordsPerPage={recordsPerPage}
            selectOwner={selectOwner}
            selectPosition={selectPosition}
            setAsc={setAsc}
            setCurrentPage={setCurrentPage}
            setRecordsPerPage={setRecordsPerPage}
            setSort={setSort}
            sort={sort}
            waiverBids={waiverBidsOwnerFiltered}/>
            {records?.map((record, i) => 
                <PlayerRow key={i} record={record} sort={sort}/>
            )}
        </div>
    );
};