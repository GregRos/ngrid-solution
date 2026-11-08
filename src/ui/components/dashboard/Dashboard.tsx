import { useMemo, useState } from "react"
import { toHourlyReadings, type Rates, type Reading } from "../../../model/model"
import { computeStats, findOptimalContract } from "../../../compute"
import { ContractControl } from "./ContractControl"
import { DashboardHeader } from "./DashboardHeader"
import { RateSettings } from "../rate-settings/RateSettings"
import { CostChart } from "../cost/CostChart"
import { UsageSection } from "../usage/UsageSection"
import "./DashboardHeader.scss"

const initialRates: Rates = { standard: 1, peak: 2, peakStart: 17, peakEnd: 20, fixed: 0.5 }

export function Dashboard({ readings: rawReadings }: { readings: Reading[] }) {
    const [rates, setRates] = useState(initialRates)
    const [contract, setContract] = useState(0)
    const readings = useMemo(() => toHourlyReadings(rawReadings), [rawReadings])
    const optimum = useMemo(() => findOptimalContract(readings, rates), [readings, rates])
    const result = useMemo(
        () => computeStats(readings, rates, contract),
        [readings, rates, contract]
    )
    const best = useMemo(() => computeStats(readings, rates, optimum), [readings, rates, optimum])

    return (
        <main className="container dashboard">
            <DashboardHeader readings={readings} />
            <RateSettings rates={rates} onChange={setRates} />
            <ContractControl
                readings={readings}
                contract={contract}
                optimum={optimum}
                onChange={setContract}
            />
            <UsageSection readings={readings} result={result} />
            <CostChart rates={rates} readings={readings} result={result} best={best} />
            <footer>
                Built for a clearer view of your energy costs. <span>All amounts in NIS.</span>
            </footer>
        </main>
    )
}
