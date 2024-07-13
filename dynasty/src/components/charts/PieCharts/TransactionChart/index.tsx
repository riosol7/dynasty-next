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
  
    const series = Object.values(transactionPerCreatorCount);
    const options = {
        chart: {
            toolbar: {
                show: false
            },
        },
        colors: ["#75b1aa", '#546E7A', '#E91E63'],
        labels: Object.keys(transactionPerCreatorCount),
        legend: {
            show: false,
        },
        plotOptions: {
            pie: {
                customScale: .9,
                donut: {
                    labels: { 
                        show: true,
                        name: {
                            show: true,
                            color: "lightgray",
                        },
                        value: {
                            show: true,
                            color: "white",
                            fontWeight: "bold"

                        },
                        total: {
                            show:true,
                            color: "lightgray",
                            // fontWeight: 400
                        }
                    },
                    size: "77%"
                },
                expandOnClick: true,
            }
        },
        stroke: {
            colors: ["black"]
        },
        tooltip: {
            enabled: false,
            theme:"dark",
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
