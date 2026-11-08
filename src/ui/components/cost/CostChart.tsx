import type { EChartsOption } from "echarts"
import { useMemo } from "react"
import type { Reading, Rates, Stats } from "../../../model/model"
import { money } from "../reusable/format"
import { Stat } from "../reusable/Stat"
import { Chart } from "../chart/Chart"
import { chartBase, chartLabels } from "../chart/chartOptions"
import "./CostChart.scss"

interface CostChartProps {
    readings: Reading[]
    rates: Rates
    result: Stats
    best: Stats
}

export function CostChart({ readings, rates, result, best }: CostChartProps) {
    const savings = result.without - result.total
    const additionalSavings = Math.max(0, result.total - best.total)
    const costChart = useMemo<EChartsOption>(() => {
        const labels = chartLabels(readings)
        const area = (name: string, values: number[], color: string) => ({
            name,
            type: "line" as const,
            data: values,
            showSymbol: false,
            itemStyle: { color },
            lineStyle: { color, width: 2 },
            areaStyle: { color, opacity: 0.7 }
        })

        return {
            ...chartBase(labels),
            series: [
                area(
                    "Without contract",
                    result.costs.map(cost => cost.without),
                    "#f51c2e"
                ),
                area(
                    "With contract",
                    result.costs.map(cost => cost.total),
                    "#02e8c2"
                )
            ]
        }
    }, [readings, result])
    return (
        <section className="panel panel--chart cost-chart">
            <div className="section-heading">
                <div>
                    <span className="section-heading__number">03</span>
                    <h2>Accumulated cost</h2>
                    <p>Compare total spending over the month, with and without a contract.</p>
                </div>
                <div className="section-heading__unit">ACCUMULATED COST · ₪</div>
            </div>
            <div className="legend">
                <span>
                    <i className="legend__dot legend__dot--red" /> Without contract
                </span>
                <span>
                    <i className="legend__dot legend__dot--green" /> With contract
                </span>
            </div>
            <Chart
                option={costChart}
                label="Accumulated cost with and without a contract, showing fixed contract charges and metered costs. Use the chart zoom slider to inspect a time period."
            />

            <div
                className={`cost-chart__savings ${
                    savings >= 0 ? "cost-chart__savings--positive" : "cost-chart__savings--negative"
                }`}
            >
                <div className="cost-chart__savings-label">Saved over metered usage</div>
                <div className="cost-chart__savings-value">{money(savings)}</div>
                {additionalSavings > 0 && (
                    <div className="cost-chart__savings-detail">
                        With an optimal contract, you could save {money(additionalSavings)} more!
                    </div>
                )}
            </div>
            <div className="stats-grid stats-grid--four">
                <Stat label="Without contract" value={money(result.without)} />
                <Stat
                    label="With contract"
                    value={money(result.total)}
                    detail={`${money(result.fixed)} fixed + ${money(result.metered)} metered`}
                />
                <Stat
                    label="Fixed contract charge"
                    value={money(result.fixed)}
                    detail={`${money(rates.fixed)} / kWh for all hours`}
                />
                <Stat
                    label="Cost above optimal"
                    value={money(Math.max(0, result.total - best.total))}
                    detail={`Optimal total ${money(best.total)}`}
                />
            </div>
        </section>
    )
}
