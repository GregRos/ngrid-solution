export function Stat({ label, value, detail }: { label: string; value: string; detail?: string }) {
    return (
        <div className="stat">
            <div className="stat__label">{label}</div>
            <div className="stat__value">{value}</div>
            {detail && <div className="stat__detail">{detail}</div>}
        </div>
    )
}
