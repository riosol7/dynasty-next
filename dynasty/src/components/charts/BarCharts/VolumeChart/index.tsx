"use client";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import * as Interfaces from "@/interfaces";
import { countRepeatedValues } from "@/utils";

export default function VolumeChart({ height, width, waivers }: Interfaces.TrendChartProps) {
    const repeatedValues = countRepeatedValues(waivers?.map(waiver => waiver.settings.waiver_bid));
    function addDollarSignToElements(arr: string[]): string[] {
        return arr.map(element => `$${element}`);
    }
    const series = [{ 
        name: `Quantity`,
        data: Object.values(repeatedValues)
    }];

    const options = {
        chart: {
            foreColor: "#fff",
            sparkline: {
                enabled: true
            },
            dataLabels: {
                enabled: false,
            },
            dropShadow: {
                enabled: true,
                top: 1,
                left: 1,
                blur: 2,
                opacity: 0.2,
            }
        },
        stroke: {
            width: 1,
        },
        colors: ["#a9dfd8"],
        grid: {
            padding: {
                top: 0,
                bottom: 0,
                left: 0
            }
        },
        plotOptions: {
            bar: {
                columnWidth: "35%",
                distributed: true,
            },
        },
        tooltip: {
            theme:'dark',
        },
        xaxis: {
            categories: addDollarSignToElements(Object.keys(repeatedValues)),
        },
    };
    return (
        <Chart
            options={options}
            series={series}
            type='bar'
            height={height}
            width={width}
        />
    );
};