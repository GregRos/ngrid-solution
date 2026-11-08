import type { Reading } from "../../../model/model"
import type { Stats } from "../../../model/model"
import { hours, kWh } from "../reusable/format"
import { Stat } from "../reusable/Stat"
import { UsageChart } from "./UsageChart"

export function UsageSection({ readings, result }: { readings: Reading[]; result: Stats }) {
    return (
        <section className="panel panel--chart">
            <div className="section-heading">
                <div>
                    <span className="section-heading__number">02</span>
                    <h2>Accumulated usage &amp; contract</h2>
                    <p>Compare total energy used with contract capacity over time.</p>
                </div>
                <div className="section-heading__unit">ACCUMULATED ENERGY · kWh</div>
            </div>
            <div className="legend">
                <span>
                    <i className="legend__dot legend__dot--blue" /> Energy used
                </span>
                <span>
                    <i className="legend__line legend__line--orange" /> Contract capacity
                </span>
            </div>
            <UsageChart readings={readings} result={result} />
            <p className="panel__note">
                Contract capacity is the total energy purchased over elapsed hours. Unused capacity
                cannot be carried forward to cover usage in another hour.
            </p>
            <div className="stats-grid stats-grid--three">
                <Stat label="Total hours" value={hours(result.hours)} />
                <Stat label="Total energy usage" value={kWh(result.energy)} />
                <Stat
                    label="Usage covered by contract"
                    value={kWh(result.coveredEnergy)}
                    detail="Actual usage within the contract"
                />
            </div>
        </section>
    )
}
