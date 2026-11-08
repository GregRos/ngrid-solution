import type { EChartsOption } from "echarts"
import { useMemo } from "react"
import type { Reading } from "../../../model/model"
import type { Stats } from "../../../model/model"
import { Chart } from "../chart/Chart"
import { chartBase, chartLabels } from "../chart/chartOptions"

export function UsageChart({ readings, result }: { readings: Reading[]; result: Stats }) {
    const usageChart = useMemo<EChartsOption>(() => {
        const labels = chartLabels(readings)
        return {
            ...chartBase(labels),
            series: [
                {
                    name: "Accumulated usage (kWh)",
                    type: "line",
                    data: result.usage.map(point => point.energy),
                    showSymbol: false,
                    lineStyle: { width: 1.5 }
                },
                {
                    name: "Accumulated contract capacity (kWh)",
                    type: "line",
                    data: result.usage.map(point => point.capacity),
                    showSymbol: false,
                    lineStyle: { width: 2, type: "dashed" }
                }
            ]
        }
    }, [readings, result])

    return (
        <Chart
            option={usageChart}
            label="Accumulated energy usage and contract capacity over time in kilowatt-hours. Use the chart zoom slider to inspect a time period."
        />
    )
}
