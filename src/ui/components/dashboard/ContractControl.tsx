import { intervalHours, type Reading } from "../../../model/model"
import { kW } from "../reusable/format"
import "./ContractControl.scss"

interface ContractControlProps {
    readings: Reading[]
    contract: number
    optimum: number
    onChange: (contract: number) => void
}

export function ContractControl({ readings, contract, optimum, onChange }: ContractControlProps) {
    const maxUsage = readings.reduce(
        (maximum, reading) => Math.max(maximum, reading.usage / intervalHours(reading)),
        0
    )
    const sliderMax = Math.max(1, Math.ceil(maxUsage), contract)

    return (
        <section className="panel panel--contract contract">
            <div className="section-heading">
                <div>
                    <span className="section-heading__number">01</span>
                    <h2>Choose your contract</h2>
                    <p>See how a fixed amount changes your energy costs.</p>
                </div>
                <button
                    className="btn btn-primary contract__optimize"
                    onClick={() => onChange(optimum)}
                >
                    ✦ &nbsp; Use optimal amount
                </button>
            </div>
            <div className="contract__controls">
                <div className="contract__range">
                    <div className="control-label">
                        <span>Contract amount</span>
                        <strong>{kW(contract)}</strong>
                    </div>
                    <input
                        className="form-range"
                        aria-label="Contract amount slider"
                        type="range"
                        min="0"
                        max={sliderMax}
                        step="1"
                        value={contract}
                        onChange={event => onChange(Number(event.target.value))}
                    />
                    <div className="range-labels">
                        <span>0 kW</span>
                        <span>{kW(sliderMax)}</span>
                    </div>
                </div>
                <label className="contract__amount">
                    Amount
                    <div className="input-group">
                        <input
                            className="form-control"
                            type="number"
                            min="0"
                            step="any"
                            value={contract}
                            onChange={event => {
                                const next = event.currentTarget.valueAsNumber
                                if (Number.isFinite(next) && next >= 0) onChange(next)
                            }}
                        />
                        <span className="input-group-text">kW</span>
                    </div>
                </label>
            </div>
            <div className="contract__optimal-note">
                ✦ Optimal amount at these rates: <strong>{kW(optimum)}</strong>
            </div>
        </section>
    )
}
