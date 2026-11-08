const formatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 })

export function formatNumber(value: number): string {
    return formatter.format(value)
}

export function money(value: number): string {
    return `₪${formatNumber(value)}`
}

export function unit(value: number, label: string): string {
    return `${formatNumber(value)} ${label}`
}

export function hours(value: number): string {
    return unit(value, "hrs")
}

export function kWh(value: number): string {
    return unit(value, "kWh")
}

export function kW(value: number): string {
    return unit(value, "kW")
}
