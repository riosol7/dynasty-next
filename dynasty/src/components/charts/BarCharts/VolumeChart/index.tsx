"use client";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import * as Interfaces from "@/interfaces";
import { countRepeatedValues } from "@/utils";

export default function VolumeChart({ height, width, waivers }: Interfaces.TrendChartProps) {
    const repeatedValues = countRepeatedValues(waivers?.map(waiver => waiver.settings.waiver_bid));
    const series = [{ 
        name: `${waivers && waivers[0]?.waiver_player.position}`,
        data: Object.values(repeatedValues)
    }];

    const options = {
        chart: {
            sparkline: {
                enabled: true
            },
            dataLabels: {
                enabled: true,
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
                width: 3
            },
            colors: ["#a9dfd8"],
            markers: {
            size: 0
            },
            grid: {
            padding: {
                top: 0,
                bottom: 0,
                left: 0
            }
            },
            plotOptions: {
                bar: {
                    columnWidth: "45%",
                    distributed: true,
                },
            },
            tooltip: {
                theme:'dark',
            x: {
                show: false
            },
            xaxis: {
                categories: Object.keys(repeatedValues),
                labels: {
                    style: {
                        fontSize: "10px",
                        colors: "white",
                    },
                },
            },
        }
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