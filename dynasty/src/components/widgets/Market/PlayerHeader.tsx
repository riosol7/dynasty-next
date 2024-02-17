import React from "react";
import styles from "./Market.module.css";
import * as Interfaces from "@/interfaces";
import { handleSort, nextPage, prevPage } from "@/utils";
import { Icon } from "@iconify-icon/react/dist/iconify.js";
import { useLeagueContext } from "@/context";
import { POSITIONS } from "@/constants";

function TableHeaderCell({ label, sort, asc, setAsc, setSort}: Interfaces.SortProps) {
    const isSorting = sort === label;

    const handleClick = () => {
        if (isSorting) {
            setAsc(!asc);
        } else {
            handleSort(sort, label, asc, setAsc, setSort);
        };
    };

    const icon = asc ? "bi:caret-up-fill" : "bi:caret-down-fill";

    return (
        <div className={`
        ${label === "AGE" || label === "BID" ? "w-1/12" : "w-2/12"} 
        font-bold ${label === "PLAYER" ? "" : "text-center flex justify-center"}`}>
        {isSorting ? (
            <div className="flex items-center" onClick={handleClick}>
                <p className="text-[#7d91a6]">{label}</p>
                <Icon icon={icon} style={{ color: "#a9dfd8" }} />
            </div>
        ) : (
            <p className="text-[#7d91a6] cursor-pointer" onClick={handleClick}>{label}</p>
        )}
        </div>
    );
};
export default function PlayerHeader({
    asc,
    currentPage,
    handleOwner, 
    handlePosition, 
    plus,
    recordsPerPage,
    selectOwner, 
    selectPosition, 
    setAsc,
    setCurrentPage,
    setRecordsPerPage,
    setSort, 
    sort,
    waiverBids}: Interfaces.PlayerHeaderProps) {

    const { legacyLeague } = useLeagueContext();
    const npage = Math.ceil(waiverBids?.length! / recordsPerPage);
    const pageNumbers = Array.from({ length: npage }, (_, i) => i + 1);
    
    const handleShowPage = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const valueAsNumber = +e.target.value;
        setRecordsPerPage(valueAsNumber);
    };
    
    const paginate = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const valueAsNumber = +e.target.value;
        setCurrentPage(valueAsNumber)
    };
    return (
        <div className={styles.waiverHeader}>
            <TableHeaderCell
                label="PLAYER"
                sort={sort}
                asc={asc}
                setAsc={setAsc}
                setSort={setSort}
            />    
            <TableHeaderCell
                label="AGE"
                sort={sort}
                asc={asc}
                setAsc={setAsc}
                setSort={setSort}
            />
            {plus? 
            <p className="w-2/12 text-center">POSITION</p>:
            <div className="w-2/12 text-center">
                <select id={styles.selectTag} onChange={handlePosition} value={selectPosition}>
                    <option value={"all"}>ALL POSITIONS</option>
                    {POSITIONS.map((position, i) => 
                    <option key={i} value={position}>{position}</option>
                    )}
                </select>
            </div>}
            <div className="w-2/12 flex justify-center"> 
                <select id={styles.selectTag} onChange={handleOwner} value={selectOwner}>
                    <option value={"all"}>ALL OWNERS</option>
                    {legacyLeague[0]?.users?.map((user, i) => (
                        <option key={i} value={user.display_name}>{user.display_name}</option>
                    ))}
                </select>
            </div>
            <TableHeaderCell
                label="BID"
                sort={sort}
                asc={asc}
                setAsc={setAsc}
                setSort={setSort}
            />
            <TableHeaderCell
                label="DATE"
                sort={sort}
                asc={asc}
                setAsc={setAsc}
                setSort={setSort}
            />
            <div className={`w-2/12 ${styles.paginationContainer}`}>
                <div className={styles.waiverPagination}>
                    <Icon className={styles.paginateArrows} 
                    onClick={() => prevPage(currentPage, setCurrentPage)} 
                    icon="material-symbols:chevron-left-rounded" 
                    style={{color: currentPage === 1 ? "#232227" : "#a9dfd8"}}/>
                    <div className={styles.showPagesContainer}>
                        <p style={{color:"gray"}}>Show</p>
                        <select className={styles.showPages} onChange={handleShowPage} value={recordsPerPage}>
                            <option value={5}>5</option>
                            {waiverBids?.length! > 5 ? <option value={10}>10</option> : <></>}
                            {waiverBids?.length! > 10 ? <option value={15}>15</option> : <></>}
                        </select>
                        {/* <p style={{color:"gray"}}>out of {waiverBidsOwnerFiltered?.length}</p> */}
                    </div>
                    <p className="mx-2 font-bold" style={{color:"#111227"}}>|</p>
                    <div className="mr-2 flex items-center">
                        <p style={{color:"gray"}}>Page</p>
                        <select id={styles.selectPageNumber} onChange={paginate} value={currentPage}>
                            {pageNumbers.map((number, i) => (
                                <option key={i} value={number}>{number}</option>
                            ))}
                        </select>
                    </div>
                    <Icon className={styles.paginateArrows} 
                    onClick={() => nextPage(currentPage, npage, setCurrentPage)} 
                    icon="material-symbols:chevron-right-rounded" 
                    style={{color: waiverBids?.length! > recordsPerPage ? "#a9dfd8" : "#232227"}}/>
                </div>
            </div>
        </div>
    );
};
