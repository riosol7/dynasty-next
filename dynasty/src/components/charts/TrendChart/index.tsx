'use client'
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import * as Interfaces from "@/interfaces";

export default function TrendChart({ waivers }: Interfaces.WaiverProps) {
  const series = [{ 
    name: `${waivers[0]?.waiver_player.position}`,
    data: waivers.sort((a, b) => a.created - b.created).map(waiver => waiver.settings.waiver_bid)
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
      curve: `smooth`,
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
        show: false
      },
    }
  };
  return (
    <Chart
      options={options}
      series={series}
      type='line'
      height={50}
      width={250}
    />
  );
};