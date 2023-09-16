import React from "react";
// import { toDateTime } from "../../utils";
import { Icon } from "@iconify-icon/react";

const SELECT_TAG = "border-none bg-transparent text-gray-600 text-xs font-bold";
const SHOW_TAG_M = "border-b-0 bg-transparent text-gray-400 text-xs py-3";

// function TableHeaderCell({ label, sortKey, sort, asc, setAsc, handleSort }) {
//     const isSorting = sort === sortKey;

//     const handleClick = () => {
//         if (isSorting) {
//         setAsc(!asc);
//         } else {
//         handleSort(sortKey);
//         }
//     };

//     const icon = asc ? "bi:caret-up-fill" : "bi:caret-down-fill";

//     return (
//         <th>
//         {isSorting ? (
//             <div className="flex items-center" onClick={handleClick}>
//             <p className="m-0 text-gray-600">{label}</p>
//             <Icon icon={icon} style={{ color: "#a9dfd8" }} />
//             </div>
//         ) : (
//             <p className="m-0 text-gray-600 cursor-pointer" onClick={handleClick}>
//             {label}
//             </p>
//         )}
//         </th>
//     );
// }

export default function WaiverActivity({
//   asc,
//   currentPage,
//   findLogo,
//   handleOwner,
//   handlePosition,
//   handleShowPage,
//   handleSort,
//   league,
//   nextPage,
//   owner,
//   pageNumbers,
//   paginate,
//   position,
//   prevPage,
//   records,
//   recordsPerPage,
//   setAsc,
//   sort,
//   waiverBidsFiltered,
}) {
  const playerBaseURL = process.env.REACT_APP_SLEEPER_PLAYER_THUMBS_BASE_URL;

  return (
    <div className="pt-4">
        {/* <div className="flex items-center justify-between pb-1">
            <div className="flex items-center rounded-lg">
                <div className="" onClick={() => prevPage()}>
                    <Icon
                    icon="material-symbols:chevron-left-rounded"
                    style={{
                        fontSize: "1.5em",
                        color: currentPage === 1 ? "#232227" : "#a9dfd8",
                    }}
                    />
                </div>
            <div className="mx-2 flex items-center text-sm">
                <select className="font-bold bg-transparent text-white border-none" onChange={paginate} value={currentPage}>
                {pageNumbers.map((n, i) => (
                    <option key={i} value={n}>
                    {n}
                    </option>
                ))}
                </select>
            </div>
            <div className="" onClick={() => nextPage()}>
                <Icon
                icon="material-symbols:chevron-right-rounded"
                style={{
                    fontSize: "1.5em",
                    color:
                    waiverBidsFiltered?.length > recordsPerPage
                        ? "#a9dfd8"
                        : "#232227",
                }}
                />
            </div>
            </div>
            <div className="flex items-center">
            <div className={`flex items-center ${SHOW_TAG_M}`}>
                <p className="m-0">Show</p>
                <select
                onChange={handleShowPage}
                value={recordsPerPage}
                className={SELECT_TAG}
                >
                <option value={5}>5</option>
                {waiverBidsFiltered?.length > 5 ? <option value={10}>10</option> : <></>}
                {waiverBidsFiltered?.length > 10 ? <option value={15}>15</option> : <></>}
                </select>
            </div>
            </div>
        </div>
        <div className="">
            <table className="table-auto">
                <thead>
                    <tr className="py-2 text-xs text-gray-600">
                    <TableHeaderCell
                        label="PLAYER"
                        sortKey="PLAYER"
                        sort={sort}
                        asc={asc}
                        setAsc={setAsc}
                        handleSort={handleSort}
                    />
                    <TableHeaderCell
                        label="AGE"
                        sortKey="AGE"
                        sort={sort}
                        asc={asc}
                        setAsc={setAsc}
                        handleSort={handleSort}
                    />
                    <th>
                        <select
                        className={SELECT_TAG}
                        onChange={handlePosition}
                        value={position}
                        >
                        <option value={"POSITION"}>POSITION</option>
                        <option value={"QB"}>QB</option>
                        <option value={"RB"}>RB</option>
                        <option value={"WR"}>WR</option>
                        <option value={"TE"}>TE</option>
                        </select>
                    </th>
                    <th>
                        <select
                        className={SELECT_TAG}
                        onChange={handleOwner}
                        value={owner}
                        >
                        <option value={"OWNER"}>OWNER</option>
                        {league?.owners?.map((o, i) => (
                            <option key={i} value={o.display_name}>
                            {o.display_name}
                            </option>
                        ))}
                        </select>
                    </th>
                    <TableHeaderCell
                        label="BID"
                        sortKey="BID"
                        sort={sort}
                        asc={asc}
                        setAsc={setAsc}
                        handleSort={handleSort}
                    />
                    <TableHeaderCell
                        label="DATE"
                        sortKey="DATE"
                        sort={sort}
                        asc={asc}
                        setAsc={setAsc}
                        handleSort={handleSort}
                    />
                    </tr>
                </thead>
                <tbody>
                    {records?.map((r, i) => (
                    <tr key={i} className="py-2 text-sm text-white">
                        <td className="flex items-top">
                            <div
                                className="smallHeadShot"
                                style={{
                                borderRadius: "5%",
                                width: "40px",
                                height: "55px",
                                backgroundImage: `url(${playerBaseURL}${r.player?.player_id}.jpg)`,
                                }}
                            >
                                {findLogo(r.player?.team).l !== "" ? (
                                <div className="displayOwnerLogoSM">
                                    <img
                                    style={{ width: "2.8em", left: "15px" }}
                                    alt=""
                                    src={findLogo(r.player?.team).l}
                                    />
                                </div>
                                ) : (
                                <></>
                                )}
                            </div>
                            <div className="mx-2 pl-1">
                                <p className="m-0 text-gray-600">
                                {r.player?.first_name} {r.player?.last_name}
                                </p>
                                <p className="m-0 font-bold text-xs text-gray-400">
                                {r.player?.years_exp === 0 ? "ROOKIE" : `EXP ${r.player?.years_exp}`}
                                </p>
                            </div>
                        </td>
                        <td className={`text-gray-600 ${sort === "AGE" ? "text-green-400" : ""}`}>{r.player?.age}</td>
                        <td className={`text-gray-600 ${sort === "POSITION" ? "text-green-400" : ""}`}>{r.player?.position}</td>
                        <td className={`text-gray-600 ${sort === "OWNER" ? "text-green-400" : ""}`}>{r.creator}</td>
                        <td className={`text-gray-600 ${sort === "BID" ? "text-green-400" : ""}`}>${r.settings.waiver_bid}</td>
                        <td className="text-gray-600">
                            <p className={`m-0 ${sort === "DATE" ? "text-green-400" : ""}`}>
                                {toDateTime(r.created)}
                            </p>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div> */}
    </div>
  );
}

