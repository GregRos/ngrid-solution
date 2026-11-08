import { useEffect, useState } from "react"
import { fetchReadings } from "../../api/readings"
import type { Reading } from "../../model/model"
import { Dashboard } from "./dashboard/Dashboard"

export function App() {
    const [readings, setReadings] = useState<Reading[] | null>(null)
    useEffect(() => {
        fetchReadings().then(setReadings)
    }, [])
    if (!readings)
        return (
            <div className="container py-5" role="status">
                Loading consumption data…
            </div>
        )
    return <Dashboard readings={readings} />
}
