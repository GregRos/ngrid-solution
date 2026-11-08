import type { EChartsOption } from "echarts"
import { formatNumber } from "../reusable/format"
import type { Reading } from "../../../model/model"

export function chartLabels(readings: Reading[]): string[] {
    const last = readings[readings.length - 1]
    return [
        ...readings.map(reading => reading.start.format("D MMM, HH:mm")),
        last.end.format("D MMM, HH:mm")
    ]
}

export function chartBase(labels: string[]): EChartsOption {
    return {
        animation: false,
        color: ["#3867e8", "#f09842", "#139b85", "#ebaa4c", "#e77778"],
        grid: { left: 68, right: 24, top: 28, bottom: 86 },
        tooltip: {
            trigger: "axis",
            confine: true,
            axisPointer: { type: "cross" },
            valueFormatter: value =>
                typeof value === "number" ? formatNumber(value) : String(value)
        },
        xAxis: {
            type: "category",
            data: labels,
            boundaryGap: false,
            axisLabel: { color: "#78849a", hideOverlap: true },
            axisLine: { lineStyle: { color: "#d9e0eb" } }
        },
        yAxis: {
            type: "value",
            axisLabel: { color: "#78849a", formatter: value => formatNumber(value) },
            axisPointer: {
                label: { formatter: params => formatNumber(Number(params.value)) }
            },
            splitLine: { lineStyle: { color: "#edf0f5" } }
        },
        dataZoom: [
            { type: "inside", xAxisIndex: 0 },
            { type: "slider", xAxisIndex: 0, bottom: 16, height: 24 }
        ]
    }
}
