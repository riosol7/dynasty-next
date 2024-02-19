"use client";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import * as Interfaces from "@/interfaces";
import { allUsers, findUserByOwnerID, processTransactions } from "@/utils";
import { useLeagueContext } from "@/context";

export default function TransactionPieChart() {
    const { legacyLeague } = useLeagueContext();
    const userList: Interfaces.Owner[] = allUsers(legacyLeague);
    const allTransactions: Interfaces.Transaction[] = processTransactions(legacyLeague);
    
    type TransactionSummary = {
        [creator: string]: number;
    };

    const getTransactionCountByUsername = (transactions: Interfaces.Transaction[]): TransactionSummary => {
        const transactionCount: TransactionSummary = {};
      
        transactions.forEach((transaction) => {
            const { creator } = transaction;
      
            // Check if creator exists in the mapping, if not, initialize it to 0
            if (!transactionCount[creator]) {
                transactionCount[creator] = 0;
            }
        
            // Increment the transaction count for the creator
            transactionCount[creator]++;
        });
      
        // Convert creator IDs to usernames
        const transactionCountByUsername: TransactionSummary = {};
        for (const creatorID in transactionCount) {
            const username:string = findUserByOwnerID(creatorID, userList)?.display_name;
             // Filter out entries with empty usernames
            if (username.trim() !== "") {
                transactionCountByUsername[username] = transactionCount[creatorID];
            }
        };
      
        return transactionCountByUsername;
    };
    const transactionPerCreatorCount = getTransactionCountByUsername(allTransactions);
    const transformedData = Object.entries(transactionPerCreatorCount).map(([username, value]) => ({
        x: username,
        y: value,
      }));
    const series = [{data: transformedData}]
    const options = {
        chart: {
            foreColor: '#000',
            toolbar: {
                show: false
            },
        },
        colors: ["#a9dfd8"],
        legend: {
            show: false,
        },
        plotOptions: {
            treemap: {
                distributed: true,
                enableShades: false,
                colorScale: {
                    ranges: [
                        {
                            from: -6,
                            to: 0,
                            color: "#a9dfd8",
                            foreColor: "#000",
                        },
                        {
                            from: 0.001,
                            to: 6,
                            color: '#52B12C'
                        }
                    ]
                }
            }
        },
        tooltip: {
            theme:"dark"
        }
    }
    return (
        <Chart
            options={options}
            series={series}
            type="donut"
        />
    );
};
