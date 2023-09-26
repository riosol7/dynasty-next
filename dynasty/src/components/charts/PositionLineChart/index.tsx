import dynamic from "next/dynamic";

// const Chart = dynamic(
//   () => import("react-apexcharts"),
//   { ssr: false }
// )
import * as Interfaces from "@/interfaces";

export default function PositionLineChart({ waivers }: Interfaces.WaiverProps) {

    const series = [{ data: waivers.map(waiver => waiver.settings.waiver_bid)} ];
    const options = {
        chart: {
          type: 'line',
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
            curve: 'smooth',
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
        //   y: {
        //     title: {
        //       formatter: function formatter(val) {
        //         return '';
        //       }
        //     }
        //   }
        }
      }
    return (
        <div style={{width:"80%"}}>
            {/* <Chart
                options={options}
                series={series}
                type='line'
                height={50}
            /> */}
        </div>
    )
};