import React from 'react'
import * as Interfaces from "../../../interfaces";

export default function PositionLineChart({ waivers }: Interfaces.WaiverProps) {

    const series = [{ data: waivers.map(waiver => waiver.settings.waiver_bid)} ];
     
    return (
        <div>index</div>
    )
};