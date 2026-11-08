import type { Reading } from "../../../model/model"

export function DashboardHeader({ readings }: { readings: Reading[] }) {
    return (
        <header className="hero">
            <div>
                <div className="hero__eyebrow">
                    <span className="hero__brand-icon">↗</span> POWER CONTRACT EXPLORER
                </div>
                <h1>Make every kilowatt count.</h1>
                <p>
                    Explore your energy usage, compare costs, and find the contract that works for
                    you.
                </p>
            </div>
            <div className="hero__period">
                <span className="hero__period-dot" /> {readings[0].start.format("D MMM")} –{" "}
                {readings[readings.length - 1].end.format("D MMM")}
            </div>
        </header>
    )
}
