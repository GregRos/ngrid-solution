import { money } from "../reusable/format"
import type { Rates } from "../../../model/model"
import "./RateSettings.scss"

const time = (hour: number) => `${String(hour).padStart(2, "0")}:00`

function NumberControl({
    label,
    value,
    onChange
}: {
    label: string
    value: number
    onChange: (value: number) => void
}) {
    return (
        <label className="settings__rate">
            <span>{label}</span>
            <div className="input-group">
                <span className="input-group-text">₪</span>
                <input
                    className="form-control"
                    type="number"
                    min="0"
                    step="0.01"
                    value={value}
                    onChange={event => {
                        const next = event.currentTarget.valueAsNumber
                        if (Number.isFinite(next) && next >= 0) onChange(next)
                    }}
                />
                <span className="input-group-text">/ kWh</span>
            </div>
        </label>
    )
}

export function RateSettings({
    rates,
    onChange
}: {
    rates: Rates
    onChange: (rates: Rates) => void
}) {
    return (
        <section className="settings" aria-labelledby="rate-settings-title">
            <div className="settings__heading">
                <h2 id="rate-settings-title">Rate settings</h2>
                <div className="settings__fixed-rate">
                    Contract rate <strong>{money(rates.fixed)} / kWh</strong>
                </div>
            </div>
            <div className="settings__grid">
                <NumberControl
                    label="Standard rate"
                    value={rates.standard}
                    onChange={standard => onChange({ ...rates, standard })}
                />
                <NumberControl
                    label="Peak rate"
                    value={rates.peak}
                    onChange={peak => onChange({ ...rates, peak })}
                />
                <div className="settings__peak">
                    <div className="control-label">
                        <span>Peak hours</span>
                        <strong>
                            {time(rates.peakStart)} – {time(rates.peakEnd)}
                        </strong>
                    </div>
                    <div className="range-pair">
                        <div className="range-pair__track">
                            <div
                                style={{
                                    left: `${(rates.peakStart / 24) * 100}%`,
                                    right: `${((24 - rates.peakEnd) / 24) * 100}%`
                                }}
                            />
                        </div>
                        <input
                            aria-label="Peak start hour"
                            type="range"
                            min="0"
                            max="24"
                            step="1"
                            value={rates.peakStart}
                            onChange={event =>
                                onChange({
                                    ...rates,
                                    peakStart: Math.min(Number(event.target.value), rates.peakEnd)
                                })
                            }
                        />
                        <input
                            aria-label="Peak end hour"
                            type="range"
                            min="0"
                            max="24"
                            step="1"
                            value={rates.peakEnd}
                            onChange={event =>
                                onChange({
                                    ...rates,
                                    peakEnd: Math.max(Number(event.target.value), rates.peakStart)
                                })
                            }
                        />
                    </div>
                    <div className="range-labels">
                        <span>00:00</span>
                        <span>24:00</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
