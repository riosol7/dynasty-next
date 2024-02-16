"use client";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import * as Interfaces from "@/interfaces";
import { toDateTime } from "@/utils";

export default function TrendChart({ height, width, waivers }: Interfaces.TrendChartProps) {
  const completedWaiverBids: number[] = waivers?.map(waiver => waiver.settings.waiver_bid);
  const waiverDates: string[] = waivers?.map(waiver => toDateTime(waiver.created));
  const series = [{ 
    name: `${waivers && waivers[0]?.waiver_player.position}`,
    data: completedWaiverBids
  }];
  const options = {
    chart: {
      sparkline: {
        enabled: true
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
      curve: "smooth" as "smooth",
      width: 3
    },
    colors:["#a9dfd8"],
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
    tooltip: {
      theme:'dark',
      x: {
        show: true
      },
    },
    xaxis: {
      categories: waiverDates,
    }
  };
  return (
    <Chart
      options={options}
      series={series}
      type='line'
      height={height}
      width={width}
    />
  );
};